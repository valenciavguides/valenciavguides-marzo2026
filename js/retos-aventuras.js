// retos-aventuras.js
// Estructura centralizada de retos para todas las aventuras y todos los idiomas
// Cada aventura contiene un objeto por idioma, que a su vez contiene el array de retos correspondiente

export const RETOS_AVENTURAS = {
    Aventura1: {
        es: [
            // Array de retos Aventura1 ESPAÑOL
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av1-es",
                tipo: "opcion",
                pregunta: "1. ¿Cuántas Aventuras pueden hacerse con Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av1-es",
                tipo: "opcion",
                pregunta: "2. ¿Es buen momento para comenzar su aventura?",
                opciones: ["Sí", "NO"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av1-es",
                tipo: "opcion",
                pregunta: "3. ¿Sabía decirme cómo se llaman estas Torres?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av1-es",
                tipo: "opcion",
                pregunta: "4. ¿En la cumbre de las torres ondea la bandera de Valencia: sus colores se componen de rojo, amarillo y… ?",
                opciones: ["Violeta", "Verde", "Azul"],
                correctas: ["Azul"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av1-es",
                tipo: "texto",
                pregunta: "5. ¿Sabría decirme el nombre de la calle?",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-Av1-es",
                tipo: "opcion",
                pregunta: "6. ¿Qué porta San Lorenzo en la mano?",
                opciones: ["Una Paloma", "Una cuchara", "Una parrilla"],
                correctas: ["Una parrilla"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av1-es",
                tipo: "opcion",
                pregunta: "7. ¿Con qué mano sujeta Neptuno la cornucopia?",
                opciones: ["Izquierda", "Derecha"],
                correctas: ["Derecha"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av1-es",
                tipo: "texto",
                pregunta: "8. ¿Cuántas figuras rodean la fuente?",
                correctas: ["8"]
            },
            {
                reto: 9,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 10,
                id: "R10-Av1-es",
                tipo: "opcion",
                pregunta: "10. ¿Qué figura esculpida puede verse en el marco del cuadro?",
                opciones: ["Un Dragón", "Un Murciélago", "Una Corona"],
                correctas: ["Una Corona"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av1-es",
                tipo: "opcion-multiple",
                pregunta: "11. ¿Qué puede verse dentro?",
                opciones: ["Un Altar", "Una bandera", "Una espada"],
                correctas: ["Un Altar", "Una bandera"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av1-es",
                tipo: "texto",
                pregunta: "12. Sobre ésta hay una placa conmemorativa. ¿En qué año fue expuesta dicha placa?",
                correctas: ["1952"]
            },
            {
                reto: 13,
                id: "R13-Av1-es",
                tipo: "texto",
                pregunta: "13. ¿En qué año se edificó esta finca? ¡Pista! Mire en la parte superior de la fachada.",
                correctas: ["1906"]
            },
            {
                reto: 14,
                id: "R14-Av1-es",
                tipo: "opcion",
                pregunta: "14. ¿Qué puede verse dentro?",
                opciones: ["Una Plaza de Toros", "Unos baños romanos", "Una estación de metro"],
                correctas: ["Unos baños romanos"],
                multiple: false
            },
            {
                reto: 15,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 16,
                id: "R16-Av1-es",
                tipo: "opcion",
                pregunta: "16. ¿Sabría determinar qué geometría tiene?",
                opciones: ["hexagonal", "Octogonal", "Cuadrangular"],
                correctas: ["hexagonal"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av1-es",
                tipo: "texto",
                pregunta: "17. ¿Cuántos Arcos componen la puerta?",
                correctas: ["6"]
            },
            {
                reto: 18,
                id: "R18-Av1-es",
                tipo: "opcion",
                pregunta: "18. ¿Recuerda qué animal corona el escudo municipal?",
                opciones: ["Un Dragón", "Un Murciélago", "Un Caballo"],
                correctas: ["Un Murciélago"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av1-es",
                tipo: "opcion",
                pregunta: "19. ¡Preste atención a la fachada de la primera torre! ¿Qué Fruta Cítrica natural de Valencia decora la fachada?",
                opciones: ["Limones", "Pomelos", "Naranjas"],
                correctas: ["Naranjas"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-03",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-03"
            },
            {
                reto: 21,
                id: "R21-Av1-es",
                tipo: "texto",
                pregunta: "21. ¿Sabría decirme qué comercio alberga dicho edificio?",
                correctas: ["?"]
            },
            {
                reto: 22,
                id: "R22-Av1-es",
                tipo: "opcion-multiple",
                pregunta: "22. Sobre la entrada principal, en un arco de medio punto, figuras alegóricas representan a los cinco continentes. ¿Qué porta la figura central?",
                opciones: ["Una Antorcha", "Una Espada", "Una Corona"],
                correctas: ["Una Antorcha", "Una Espada"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av1-es",
                tipo: "opcion",
                pregunta: "23. ¿Qué porta la figura en la mano?",
                opciones: ["Una balanza", "Un libro", "Una pluma"],
                correctas: ["Una balanza"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av1-es",
                tipo: "texto",
                pregunta: "24. ¿Cuántos pisos tiene el edificio?",
                correctas: ["10"]
            },
            {
                reto: 25,
                id: "R25-Av1-es",
                tipo: "opcion",
                pregunta: "25. Busque la vidriera con los colores de la Señera valenciana en la fachada del edificio. ¿Sabría determinar qué forma tiene?",
                opciones: ["Cuadrangular", "Redonda", "Triangular"],
                correctas: ["Redonda"],
                multiple: false
            },
            {
                reto: 26,
                id: "R26-Av1-es",
                tipo: "opcion-multiple",
                pregunta: "26. ¿Qué sostiene la virgen en su mano?",
                opciones: ["Un Rosario", "Un niño", "Una corona"],
                correctas: ["Un Rosario", "Un niño"],
                multiple: true
            },
            {
                reto: 27,
                id: "R27-Av1-es",
                tipo: "opcion",
                pregunta: "27. ¿Qué le entrega el ángel al niño?",
                opciones: ["Una paloma", "Un orbe", "Alimentos"],
                correctas: ["Un orbe"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 29,
                id: "R29-Av1-es",
                tipo: "opcion-multiple",
                pregunta: "29. El barquero que rema a contracorriente.",
                opciones: ["Un hombre con rostro triste manejando un pequeño bote de madera escapa a contracorriente de un monstruo."],
                correctas: ["Un hombre con rostro triste manejando un pequeño bote de madera escapa a contracorriente de un monstruo."],
                multiple: true
            },
            {
                reto: 30,
                id: "R30-Av1-es",
                tipo: "opcion-multiple",
                pregunta: "30. Un árbol muerto: símbolo del Pecado, se ve entre las dos hojas de la puerta y cumple la función de parteluz.",
                opciones: ["Observe en la copa del árbol como 4 hombres desnudos se azotan entre si."],
                correctas: ["Observe en la copa del árbol como 4 hombres desnudos se azotan entre si."],
                multiple: true
            },
            {
                reto: 31,
                id: "R31-Av1-es",
                tipo: "opcion-multiple",
                pregunta: "31. A la derecha, un ángel que muestra su pene y...",
                opciones: ["se dispone a introducirlo en un jarrón que sostiene con la otra mano. Algo extraño e inusual ¿no le parece?"],
                correctas: ["se dispone a introducirlo en un jarrón que sostiene con la otra mano. Algo extraño e inusual ¿no le parece?"],
                multiple: true
            },
            {
                reto: 32,
                id: "R32-Av1-es",
                tipo: "opcion-multiple",
                pregunta: "32. En el centro El barbudo y el león:",
                opciones: ["Original y contradictoria escena en la cual el manso es precisamente el león y no el anciano barbudo."],
                correctas: ["Original y contradictoria escena en la cual el manso es precisamente el león y no el anciano barbudo."],
                multiple: true
            },
            {
                reto: 33,
                id: "R33-Av1-es",
                tipo: "opcion-multiple",
                pregunta: "33. ¡Aquí va un reto extra! ¡Busque al fornicador de la lonja!",
                opciones: ["En una de sus ventanas, hallará a un hombre tallado, no se le advierte su cabeza, pero sí sus genitales, Y muy claramente."],
                correctas: ["En una de sus ventanas, hallará a un hombre tallado, no se le advierte su cabeza, pero sí sus genitales, Y muy claramente."],
                multiple: true
            },
            {
                reto: 34,
                id: "R34-Av1-es",
                tipo: "opcion",
                pregunta: "34. ¿Qué sujeta la figura con sus manos?",
                opciones: ["Un escudo", "Una concha", "Una jarra", "Una espada"],
                correctas: ["Una concha"],
                multiple: false
            },
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            },
        ],
        en: [
            // Array de retos Aventura1 INGLÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av1-en",
                tipo: "opcion",
                pregunta: "1. How many adventures can be done with Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av1-en",
                tipo: "opcion",
                pregunta: "2. Is it a good time to start your adventure?",
                opciones: ["Yes", "No"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av1-en",
                tipo: "opcion",
                pregunta: "3. Can you tell me the names of these towers?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av1-en",
                tipo: "opcion",
                pregunta: "4. At the top of the towers flies the flag of Valencia: its colors are red, yellow, and…?",
                opciones: ["Violet", "Green", "Blue"],
                correctas: ["Blue"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av1-en",
                tipo: "texto",
                pregunta: "5. Can you tell me the name of the street?",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-Av1-en",
                tipo: "opcion",
                pregunta: "6. What does Saint Lawrence hold in his hand?",
                opciones: ["A Dove", "A Spoon", "A Grill"],
                correctas: ["A Grill"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av1-en",
                tipo: "opcion",
                pregunta: "7. With which hand does Neptune hold the cornucopia?",
                opciones: ["Left", "Right"],
                correctas: ["Right"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av1-en",
                tipo: "texto",
                pregunta: "8. How many figures surround the fountain?",
                correctas: ["8"]
            },
            {
                reto: 9,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 10,
                id: "R10-Av1-en",
                tipo: "opcion",
                pregunta: "10. What sculpted figure can be seen in the frame of the painting?",
                opciones: ["A Dragon", "A Bat", "A Crown"],
                correctas: ["A Crown"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av1-en",
                tipo: "opcion-multiple",
                pregunta: "11. What can be seen inside?",
                opciones: ["An Altar", "A Flag", "A Sword"],
                correctas: ["An Altar", "A Flag"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av1-en",
                tipo: "texto",
                pregunta: "12. On this there is a commemorative plaque. In which year was it placed?",
                correctas: ["1952"]
            },
            {
                reto: 13,
                id: "R13-Av1-en",
                tipo: "texto",
                pregunta: "13. In which year was this building constructed? Hint: look at the top of the facade.",
                correctas: ["1906"]
            },
            {
                reto: 14,
                id: "R14-Av1-en",
                tipo: "opcion",
                pregunta: "14. What can be seen inside?",
                opciones: ["A Bullring", "Roman Baths", "A Metro Station"],
                correctas: ["Roman Baths"],
                multiple: false
            },
            {
                reto: 15,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 16,
                id: "R16-Av1-en",
                tipo: "opcion",
                pregunta: "16. Can you determine its geometry?",
                opciones: ["Hexagonal", "Octagonal", "Quadrangular"],
                correctas: ["Hexagonal"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av1-en",
                tipo: "texto",
                pregunta: "17. How many arches make up the gate?",
                correctas: ["6"]
            },
            {
                reto: 18,
                id: "R18-Av1-en",
                tipo: "opcion",
                pregunta: "18. Do you remember which animal crowns the municipal coat of arms?",
                opciones: ["A Dragon", "A Bat", "A Horse"],
                correctas: ["A Bat"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av1-en",
                tipo: "opcion",
                pregunta: "19. Pay attention to the facade of the first tower! Which citrus fruit native to Valencia decorates it?",
                opciones: ["Lemons", "Grapefruits", "Oranges"],
                correctas: ["Oranges"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-03",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-03"
            },
            {
                reto: 21,
                id: "R21-Av1-en",
                tipo: "texto",
                pregunta: "21. Can you tell me what business is in this building?",
                correctas: ["?"]
            },
            {
                reto: 22,
                id: "R22-Av1-en",
                tipo: "opcion-multiple",
                pregunta: "22. Above the main entrance, in a semicircular arch, allegorical figures represent the five continents. What does the central figure hold?",
                opciones: ["A Torch", "A Sword", "A Crown"],
                correctas: ["A Torch", "A Sword"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av1-en",
                tipo: "opcion",
                pregunta: "23. What does the figure hold in its hand?",
                opciones: ["A Scale", "A Book", "A Feather"],
                correctas: ["A Scale"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av1-en",
                tipo: "texto",
                pregunta: "24. How many floors does the building have?",
                correctas: ["10"]
            },
            {
                reto: 25,
                id: "R25-Av1-en",
                tipo: "opcion",
                pregunta: "25. Look for the stained glass with the colors of the Valencian Senyera on the building facade. Can you determine its shape?",
                opciones: ["Quadrangular", "Roundy", "Triangular"],
                correctas: ["Roundy"],
                multiple: false
            },
            {
                reto: 26,
                id: "R26-Av1-en",
                tipo: "opcion-multiple",
                pregunta: "26. What does the Virgin hold in her hand?",
                opciones: ["A Rosary", "A Child", "A Crown"],
                correctas: ["A Rosary", "A Child"],
                multiple: true
            },
            {
                reto: 27,
                id: "R27-Av1-en",
                tipo: "opcion",
                pregunta: "27. What does the angel give to the child?",
                opciones: ["A Dove", "An Orb", "Food"],
                correctas: ["An Orb"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 29,
                id: "R29-Av1-en",
                tipo: "opcion-multiple",
                pregunta: "29. The ferryman rowing against the current.",
                opciones: ["A man with a sad face steering a small wooden boat escapes against the current from a monster."],
                correctas: ["A man with a sad face steering a small wooden boat escapes against the current from a monster."],
                multiple: true
            },
            {
                reto: 30,
                id: "R30-Av1-en",
                tipo: "opcion-multiple",
                pregunta: "30. A dead tree: symbol of Sin, is seen between the two leaves of the door and acts as a mullion.",
                opciones: ["Notice on the tree's top 4 naked men whipping each other."],
                correctas: ["Notice on the tree's top 4 naked men whipping each other."],
                multiple: true
            },
            {
                reto: 31,
                id: "R31-Av1-en",
                tipo: "opcion-multiple",
                pregunta: "31. On the right, an angel shows his penis and…",
                opciones: ["He is about to place it in a vase held with the other hand. Strange and unusual, isn't it?"],
                correctas: ["He is about to place it in a vase held with the other hand. Strange and unusual, isn't it?"],
                multiple: true
            },
            {
                reto: 32,
                id: "R32-Av1-en",
                tipo: "opcion-multiple",
                pregunta: "32. In the center: The Bearded Man and the Lion:",
                opciones: ["Original and contradictory scene in which the gentle one is precisely the lion and not the bearded old man."],
                correctas: ["Original and contradictory scene in which the gentle one is precisely the lion and not the bearded old man."],
                multiple: true
            },
            {
                reto: 33,
                id: "R33-Av1-en",
                tipo: "opcion-multiple",
                pregunta: "33. Here's an extra challenge! Look for the fornicator in the Silk Exchange!",
                opciones: ["In one of its windows, you will find a carved man; his head is not visible but his genitals are, very clearly."],
                correctas: ["In one of its windows, you will find a carved man; his head is not visible but his genitals are, very clearly."],
                multiple: true
            },
            {
                reto: 34,
                id: "R34-Av1-en",
                tipo: "opcion",
                pregunta: "34. What is the figure holding in its hands?",
                opciones: ["A shield", "A shell", "A jug", "A sword"],
                correctas: ["A shell"],
                multiple: false
            },
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            },
        ],
        fr: [
            // Array de retos Aventura1 FRANCÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av1-fr",
                tipo: "opcion",
                pregunta: "1. Combien d'aventures peut-on faire avec Valencia be Guides ?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av1-fr",
                tipo: "opcion",
                pregunta: "2. Est-ce le bon moment pour commencer votre aventure ?",
                opciones: ["Oui", "Non"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av1-fr",
                tipo: "opcion",
                pregunta: "2. Pouvez-vous me dire comment s'appellent ces tours ?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av1-fr",
                tipo: "opcion",
                pregunta: "3. Au sommet des tours flotte le drapeau de Valence : ses couleurs sont rouge, jaune et… ?",
                opciones: ["Violet", "Vert", "Bleu"],
                correctas: ["Bleu"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av1-fr",
                tipo: "texto",
                pregunta: "4. Pouvez-vous me donner le nom de la rue ?",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-Av1-fr",
                tipo: "opcion",
                pregunta: "5. Que tient Saint Laurent dans sa main ?",
                opciones: ["Une colombe", "Une cuillère", "Une grille"],
                correctas: ["Une grille"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av1-fr",
                tipo: "opcion",
                pregunta: "6. Avec quelle main Neptune tient-il la corne d'abondance ?",
                opciones: ["Gauche", "Droite"],
                correctas: ["Droite"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av1-fr",
                tipo: "texto",
                pregunta: "7. Combien de figures entourent la fontaine ?",
                correctas: ["8"]
            },
            {
                reto: 9,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 10,
                id: "R10-Av1-fr",
                tipo: "opcion",
                pregunta: "9. Quelle figure sculptée peut-on voir dans le cadre du tableau ?",
                opciones: ["Un dragon", "Une chauve-souris", "Une couronne"],
                correctas: ["Une couronne"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av1-fr",
                tipo: "opcion-multiple",
                pregunta: "10. Que peut-on voir à l'intérieur ?",
                opciones: ["Un autel", "Un drapeau", "Une épée"],
                correctas: ["Un autel", "Un drapeau"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av1-fr",
                tipo: "texto",
                pregunta: "11. Sur celui-ci se trouve une plaque commémorative. En quelle année a-t-elle été placée ?",
                correctas: ["1952"]
            },
            {
                reto: 13,
                id: "R13-Av1-fr",
                tipo: "texto",
                pregunta: "12. En quelle année ce bâtiment a-t-il été construit ? Indice : regardez en haut de la façade.",
                correctas: ["1906"]
            },
            {
                reto: 14,
                id: "R14-Av1-fr",
                tipo: "opcion",
                pregunta: "13. Que peut-on voir à l'intérieur ?",
                opciones: ["Une arène", "Des bains romains", "Une station de métro"],
                correctas: ["Des bains romains"],
                multiple: false
            },
            {
                reto: 15,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 16,
                id: "R16-Av1-fr",
                tipo: "opcion",
                pregunta: "15. Pouvez-vous déterminer sa géométrie ?",
                opciones: ["Hexagonal", "Octogonal", "Quadrangulaire"],
                correctas: ["Hexagonal"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av1-fr",
                tipo: "texto",
                pregunta: "16. Combien d'arcs composent la porte ?",
                correctas: ["6"]
            },
            {
                reto: 18,
                id: "R18-Av1-fr",
                tipo: "opcion",
                pregunta: "17. Vous souvenez-vous de quel animal couronne le blason municipal ?",
                opciones: ["Un dragon", "Une chauve-souris", "Un cheval"],
                correctas: ["Une chauve-souris"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av1-fr",
                tipo: "opcion",
                pregunta: "18. Regardez la façade de la première tour ! Quel fruit d'agrumes de Valence la décore ?",
                opciones: ["Citrons", "Pamplemousses", "Oranges"],
                correctas: ["Oranges"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-03",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-03"
            },
            {
                reto: 21,
                id: "R21-Av1-fr",
                tipo: "texto",
                pregunta: "20. Pouvez-vous me dire quelle entreprise occupe ce bâtiment ?",
                correctas: ["?"]
            },
            {
                reto: 22,
                id: "R22-Av1-fr",
                tipo: "opcion-multiple",
                pregunta: "21. Au-dessus de l'entrée principale, dans un arc en plein cintre, des figures allégoriques représentent les cinq continents. Que tient la figure centrale ?",
                opciones: ["Une torche", "Une épée", "Une couronne"],
                correctas: ["Une torche", "Une épée"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av1-fr",
                tipo: "opcion",
                pregunta: "22. Que tient la figure dans sa main ?",
                opciones: ["Une balance", "Un livre", "Une plume"],
                correctas: ["Une balance"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av1-fr",
                tipo: "texto",
                pregunta: "23. Combien d'étages a le bâtiment ?",
                correctas: ["10"]
            },
            {
                reto: 25,
                id: "R25-Av1-fr",
                tipo: "opcion",
                pregunta: "24. Cherchez le vitrail avec les couleurs de la Senyera valencienne sur la façade du bâtiment. Pouvez-vous déterminer sa forme ?",
                opciones: ["Quadrangulaire", "Ronde", "Triangulaire"],
                correctas: ["Ronde"],
                multiple: false
            },
            {
                reto: 26,
                id: "R26-Av1-fr",
                tipo: "opcion-multiple",
                pregunta: "25. Que tient la Vierge dans sa main ?",
                opciones: ["Un chapelet", "Un enfant", "Une couronne"],
                correctas: ["Un chapelet", "Un enfant"],
                multiple: true
            },
            {
                reto: 27,
                id: "R27-Av1-fr",
                tipo: "opcion",
                pregunta: "26. Que donne l'ange à l'enfant ?",
                opciones: ["Une colombe", "Un orbe", "Des aliments"],
                correctas: ["Un orbe"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 29,
                id: "R29-Av1-fr",
                tipo: "opcion-multiple",
                pregunta: "29. Le batelier qui rame à contre-courant.",
                opciones: ["Un homme au visage triste dirige un petit bateau en bois pour échapper à contre-courant à un monstre."],
                correctas: ["Un homme au visage triste dirige un petit bateau en bois pour échapper à contre-courant à un monstre."],
                multiple: true
            },
            {
                reto: 30,
                id: "R30-Av1-fr",
                tipo: "opcion-multiple",
                pregunta: "30. Un arbre mort : symbole du péché, se trouve entre les deux feuilles de la porte et fait office de meneau.",
                opciones: ["Observez au sommet de l'arbre quatre hommes nus qui se flagellent entre eux."],
                correctas: ["Observez au sommet de l'arbre quatre hommes nus qui se flagellent entre eux."],
                multiple: true
            },
            {
                reto: 31,
                id: "R31-Av1-fr",
                tipo: "opcion-multiple",
                pregunta: "31. À droite, un ange montre son pénis et…",
                opciones: ["Il s'apprête à le placer dans un vase qu'il tient de l'autre main. Étrange et inhabituel, n'est-ce pas ?"],
                correctas: ["Il s'apprête à le placer dans un vase qu'il tient de l'autre main. Étrange et inhabituel, n'est-ce pas ?"],
                multiple: true
            },
            {
                reto: 32,
                id: "R32-Av1-fr",
                tipo: "opcion-multiple",
                pregunta: "32. Au centre : L'homme barbu et le lion :",
                opciones: ["Scène originale et contradictoire où le doux est précisément le lion et non le vieil homme barbu."],
                correctas: ["Scène originale et contradictoire où le doux est précisément le lion et non le vieil homme barbu."],
                multiple: true
            },
            {
                reto: 33,
                id: "R33-Av1-fr",
                tipo: "opcion-multiple",
                pregunta: "33. Voici un défi supplémentaire ! Cherchez le fornicateur de la Bourse de la soie !",
                opciones: ["Dans une de ses fenêtres, vous trouverez un homme sculpté ; sa tête n'est pas visible mais ses parties génitales le sont, très clairement."],
                correctas: ["Dans une de ses fenêtres, vous trouverez un homme sculpté ; sa tête n'est pas visible mais ses parties génitales le sont, très clairement."],
                multiple: true
            },
            {
                reto: 34,
                id: "R34-Av1-fr",
                tipo: "opcion",
                pregunta: "34. Que tient la figure dans ses mains ?",
                opciones: ["Un bouclier", "Une coquille", "Une cruche", "Une épée"],
                correctas: ["Une coquille"],
                multiple: false
            },
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            },
        ],
        it: [
            // Array de retos Aventura1 ITALIANO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av1-it",
                tipo: "opcion",
                pregunta: "1. Quante avventure si possono fare con Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av1-it",
                tipo: "opcion",
                pregunta: "2. È un buon momento per iniziare la tua avventura?",
                opciones: ["Sì", "No"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av1-it",
                tipo: "opcion",
                pregunta: "2. Puoi dirmi come si chiamano queste torri?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre di Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av1-it",
                tipo: "opcion",
                pregunta: "3. In cima alle torri sventola la bandiera di Valencia: i suoi colori sono rosso, giallo e…?",
                opciones: ["Viola", "Verde", "Blu"],
                correctas: ["Blu"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av1-it",
                tipo: "texto",
                pregunta: "4. Sai dirmi il nome della via?",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-Av1-it",
                tipo: "opcion",
                pregunta: "5. Cosa tiene San Lorenzo in mano?",
                opciones: ["Un colomba", "Un cucchiaio", "Una griglia"],
                correctas: ["Una griglia"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av1-it",
                tipo: "opcion",
                pregunta: "6. Con quale mano Nettuno tiene la cornucopia?",
                opciones: ["Sinistra", "Destra"],
                correctas: ["Destra"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av1-it",
                tipo: "texto",
                pregunta: "7. Quante figure circondano la fontana?",
                correctas: ["8"]
            },
            {
                reto: 9,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 10,
                id: "R10-Av1-it",
                tipo: "opcion",
                pregunta: "9. Quale figura scolpita si vede nella cornice del quadro?",
                opciones: ["Un drago", "Un pipistrello", "Una corona"],
                correctas: ["Una corona"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av1-it",
                tipo: "opcion-multiple",
                pregunta: "10. Cosa si può vedere all'interno?",
                opciones: ["Un altare", "Una bandiera", "Una spada"],
                correctas: ["Un altare", "Una bandiera"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av1-it",
                tipo: "texto",
                pregunta: "11. Su di essa c'è una targa commemorativa. In che anno è stata esposta?",
                correctas: ["1952"]
            },
            {
                reto: 13,
                id: "R13-Av1-it",
                tipo: "texto",
                pregunta: "12. In che anno è stato costruito questo edificio? Suggerimento: guarda in alto sulla facciata.",
                correctas: ["1906"]
            },
            {
                reto: 14,
                id: "R14-Av1-it",
                tipo: "opcion",
                pregunta: "13. Cosa si può vedere all'interno?",
                opciones: ["Un'arena", "Bagni romani", "Una stazione della metropolitana"],
                correctas: ["Bagni romani"],
                multiple: false
            },
            {
                reto: 15,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 16,
                id: "R16-Av1-it",
                tipo: "opcion",
                pregunta: "15. Sai determinarne la geometria?",
                opciones: ["Esagonale", "Ottagonale", "Quadrangolare"],
                correctas: ["Esagonale"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av1-it",
                tipo: "texto",
                pregunta: "16. Quanti archi compongono la porta?",
                correctas: ["6"]
            },
            {
                reto: 18,
                id: "R18-Av1-it",
                tipo: "opcion",
                pregunta: "17. Ricordi quale animale corona lo stemma comunale?",
                opciones: ["Un drago", "Un pipistrello", "Un cavallo"],
                correctas: ["Un pipistrello"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av1-it",
                tipo: "opcion",
                pregunta: "18. Guarda la facciata della prima torre! Quale agrume di Valencia la decora?",
                opciones: ["Limoni", "Pompelmi", "Arance"],
                correctas: ["Arance"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-03",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-03"
            },
            {
                reto: 21,
                id: "R21-Av1-it",
                tipo: "texto",
                pregunta: "20. Puoi dirmi quale attività si trova in questo edificio?",
                correctas: ["?"]
            },
            {
                reto: 22,
                id: "R22-Av1-it",
                tipo: "opcion-multiple",
                pregunta: "21. Sopra l'ingresso principale, in un arco a tutto sesto, figure allegoriche rappresentano i cinque continenti. Cosa tiene la figura centrale?",
                opciones: ["Una torcia", "Una spada", "Una corona"],
                correctas: ["Una torcia", "Una spada"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av1-it",
                tipo: "opcion",
                pregunta: "22. Cosa tiene la figura nella mano?",
                opciones: ["Una bilancia", "Un libro", "Una piuma"],
                correctas: ["Una bilancia"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av1-it",
                tipo: "texto",
                pregunta: "23. Quanti piani ha l'edificio?",
                correctas: ["10"]
            },
            {
                reto: 25,
                id: "R25-Av1-it",
                tipo: "opcion",
                pregunta: "24. Cerca la vetrata con i colori della Senyera valenciana sulla facciata dell'edificio. Puoi determinarne la forma?",
                opciones: ["Cuadrangular", "Redonda", "Triangular"],
                correctas: ["Redonda"],
                multiple: false
            },
            {
                reto: 26,
                id: "R26-Av1-it",
                tipo: "opcion-multiple",
                pregunta: "25. Cosa tiene la Vergine nella sua mano?",
                opciones: ["Un rosario", "Un bambino", "Una corona"],
                correctas: ["Un rosario", "Un bambino"],
                multiple: true
            },
            {
                reto: 27,
                id: "R27-Av1-it",
                tipo: "opcion",
                pregunta: "26. Cosa dà l'angelo al bambino?",
                opciones: ["Una colomba", "Un orbe", "Cibo"],
                correctas: ["Un orbe"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 29,
                id: "R29-Av1-it",
                tipo: "opcion-multiple",
                pregunta: "29. Il barcaiolo che rema controcorrente.",
                opciones: ["Un uomo con volto triste che manovra una piccola barca di legno fugge controcorrente da un mostro."],
                correctas: ["Un uomo con volto triste che manovra una piccola barca di legno fugge controcorrente da un mostro."],
                multiple: true
            },
            {
                reto: 30,
                id: "R30-Av1-it",
                tipo: "opcion-multiple",
                pregunta: "30. Un albero morto: simbolo del Peccato, si vede tra le due foglie della porta e funge da parteluz.",
                opciones: ["Osserva sulla cima dell'albero come 4 uomini nudi si flagellano tra loro."],
                correctas: ["Osserva sulla cima dell'albero come 4 uomini nudi si flagellano tra loro."],
                multiple: true
            },
            {
                reto: 31,
                id: "R31-Av1-it",
                tipo: "opcion-multiple",
                pregunta: "31. A destra, un angelo mostra il suo pene e...",
                opciones: ["si appresta a introdurlo in un vaso che tiene con l'altra mano. Strano e insolito, non ti sembra?"],
                correctas: ["si appresta a introdurlo in un vaso che tiene con l'altra mano. Strano e insolito, non ti sembra?"],
                multiple: true
            },
            {
                reto: 32,
                id: "R32-Av1-it",
                tipo: "opcion-multiple",
                pregunta: "32. Al centro: L'uomo barbuto e il leone:",
                opciones: ["Scena originale e contraddittoria in cui il mansueto è proprio il leone e non il vecchio uomo barbuto."],
                correctas: ["Scena originale e contraddittoria in cui il mansueto è proprio il leone e non il vecchio uomo barbuto."],
                multiple: true
            },
            {
                reto: 33,
                id: "R33-Av1-it",
                tipo: "opcion-multiple",
                pregunta: "33. Ecco una sfida extra! Cerca il fornicatore della Lonja della Seta!",
                opciones: ["In una delle sue finestre, troverai un uomo scolpito; la sua testa non è visibile ma i suoi genitali lo sono, molto chiaramente."],
                correctas: ["In una delle sue finestre, troverai un uomo scolpito; la sua testa non è visibile ma i suoi genitali lo sono, molto chiaramente."],
                multiple: true
            },
            {
                reto: 34,
                id: "R34-Av1-it",
                tipo: "opcion",
                pregunta: "34. Cosa tiene in mano la figura?",
                opciones: ["Uno scudo", "Una conchiglia", "Una brocca", "Una spada"],
                correctas: ["Una conchiglia"],
                multiple: false
            },
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            },
        ],
        nl: [
            // Array de retos Aventura1 HOLANDÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av1-nl",
                tipo: "opcion",
                pregunta: "1. Hoeveel avonturen kun je doen met València be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av1-nl",
                tipo: "opcion",
                pregunta: "2. Is het een goed moment om je avontuur te beginnen?",
                opciones: ["Ja", "Nee"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av1-nl",
                tipo: "opcion",
                pregunta: "2. Kunt u mij de namen van deze torens vertellen?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av1-nl",
                tipo: "opcion",
                pregunta: "3. Op de top van de torens wappert de vlag van Valencia: de kleuren zijn rood, geel en…?",
                opciones: ["Paars", "Groen", "Blauw"],
                correctas: ["Blauw"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av1-nl",
                tipo: "texto",
                pregunta: "4. Kunt u mij de naam van de straat vertellen?",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-Av1-nl",
                tipo: "opcion",
                pregunta: "5. Wat houdt Sint-Laurens in zijn hand?",
                opciones: ["Een duif", "Een lepel", "Een rooster"],
                correctas: ["Een rooster"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av1-nl",
                tipo: "opcion",
                pregunta: "6. Met welke hand houdt Neptunus de hoorn des overvloeds vast?",
                opciones: ["Links", "Rechts"],
                correctas: ["Rechts"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av1-nl",
                tipo: "texto",
                pregunta: "7. Hoeveel figuren omringen de fontein?",
                correctas: ["8"]
            },
            {
                reto: 9,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 10,
                id: "R10-Av1-nl",
                tipo: "opcion",
                pregunta: "9. Welke gebeeldhouwde figuur is te zien in de lijst van het schilderij?",
                opciones: ["Een draak", "Een vleermuis", "Een kroon"],
                correctas: ["Een kroon"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av1-nl",
                tipo: "opcion-multiple",
                pregunta: "10. Wat is er binnen te zien?",
                opciones: ["Een altaar", "Een vlag", "Een zwaard"],
                correctas: ["Een altaar", "Een vlag"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av1-nl",
                tipo: "texto",
                pregunta: "11. Hierop staat een gedenkplaat. In welk jaar is deze geplaatst?",
                correctas: ["1952"]
            },
            {
                reto: 13,
                id: "R13-Av1-nl",
                tipo: "texto",
                pregunta: "12. In welk jaar is dit gebouw gebouwd? Tip: kijk bovenaan de gevel.",
                correctas: ["1906"]
            },
            {
                reto: 14,
                id: "R14-Av1-nl",
                tipo: "opcion",
                pregunta: "13. Wat is er binnen te zien?",
                opciones: ["Een stierenarena", "Romeinse baden", "Een metrostation"],
                correctas: ["Romeinse baden"],
                multiple: false
            },
            {
                reto: 15,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 16,
                id: "R16-Av1-nl",
                tipo: "opcion",
                pregunta: "15. Kunt u de geometrie bepalen?",
                opciones: ["Zeshoekig", "Achthoekig", "Vierkant"],
                correctas: ["Achthoekig"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av1-nl",
                tipo: "texto",
                pregunta: "16. Hoeveel bogen vormen de poort?",
                correctas: ["6"]
            },
            {
                reto: 18,
                id: "R18-Av1-nl",
                tipo: "opcion",
                pregunta: "17. Herinnert u zich welk dier het gemeentewapen siert?",
                opciones: ["Een draak", "Een vleermuis", "Een paard"],
                correctas: ["Een vleermuis"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av1-nl",
                tipo: "opcion",
                pregunta: "18. Let op de gevel van de eerste toren! Welke citrusvrucht uit Valencia siert de gevel?",
                opciones: ["Citroenen", "Grapefruits", "Sinaasappels"],
                correctas: ["Sinaasappels"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-03",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-03"
            },
            {
                reto: 21,
                id: "R21-Av1-nl",
                tipo: "texto",
                pregunta: "20. Kunt u vertellen welk bedrijf dit gebouw huisvest?",
                correctas: ["?"]
            },
            {
                reto: 22,
                id: "R22-Av1-nl",
                tipo: "opcion-multiple",
                pregunta: "21. Boven de hoofdingang, in een rondboog, vertegenwoordigen allegorische figuren de vijf continenten. Wat houdt de centrale figuur vast?",
                opciones: ["Een fakkel", "Een zwaard", "Een kroon"],
                correctas: ["Een fakkel", "Een zwaard"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av1-nl",
                tipo: "opcion",
                pregunta: "22. Wat houdt de figuur in zijn hand?",
                opciones: ["Een weegschaal", "Een boek", "Een veer"],
                correctas: ["Een weegschaal"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av1-nl",
                tipo: "texto",
                pregunta: "23. Hoeveel verdiepingen heeft het gebouw?",
                correctas: ["10"]
            },
            {
                reto: 25,
                id: "R25-Av1-nl",
                tipo: "opcion",
                pregunta: "24. Zoek het glas-in-lood met de kleuren van de Valenciaanse Senyera op de gevel. Kunt u de vorm bepalen?",
                opciones: ["Vierkant", "Rond", "Driehoekig"],
                correctas: ["Rond"],
                multiple: false
            },
            {
                reto: 26,
                id: "R26-Av1-nl",
                tipo: "opcion-multiple",
                pregunta: "25. Wat houdt de maagd in haar hand?",
                opciones: ["Een rozenkrans", "Een kind", "Een kroon"],
                correctas: ["Een rozenkrans", "Een kind"],
                multiple: true
            },
            {
                reto: 27,
                id: "R27-Av1-nl",
                tipo: "opcion",
                pregunta: "26. Wat geeft de engel aan het kind?",
                opciones: ["Een duif", "Een bol", "Voedsel"],
                correctas: ["Een bol"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 29,
                id: "R29-Av1-nl",
                tipo: "opcion-multiple",
                pregunta: "29. De veerman die tegen de stroom in roeit.",
                opciones: ["Een man met een verdrietig gezin die een klein houten boot bestuurt ontsnapt tegen de stroom van een monster."],
                correctas: ["Een man met een verdrietig gezin die een klein houten boot bestuurt ontsnapt tegen de stroom van een monster."],
                multiple: true
            },
            {
                reto: 30,
                id: "R30-Av1-nl",
                tipo: "opcion-multiple",
                pregunta: "30. Een dode boom: symbool van Zonde, is te zien tussen de twee bladeren van de deur en fungeert als middenstijl.",
                opciones: ["Let op de top van de boom waar 4 naakte mannen elkaar geselen."],
                correctas: ["Let op de top van de boom waar 4 naakte mannen elkaar geselen."],
                multiple: true
            },
            {
                reto: 31,
                id: "R31-Av1-nl",
                tipo: "opcion-multiple",
                pregunta: "31. Rechts, een engel toont zijn penis en...",
                opciones: ["hij staat op het punt het in een vaas te plaatsen dat hij met de andere hand vasthoudt. Vreemd en ongebruikelijk, nietwaar?"],
                correctas: ["hij staat op het punt het in een vaas te plaatsen dat hij met de andere hand vasthoudt. Vreemd en ongebruikelijk, nietwaar?"],
                multiple: true
            },
            {
                reto: 32,
                id: "R32-Av1-nl",
                tipo: "opcion-multiple",
                pregunta: "32. In het midden: De baardige man en de leeuw:",
                opciones: ["Origineel en tegenstrijdig tafereel waarin de zachte precies de leeuw is en niet de baardige oude man."],
                correctas: ["Origineel en tegenstrijdig tafereel waarin de zachte precies de leeuw is en niet de baardige oude man."],
                multiple: true
            },
            {
                reto: 33,
                id: "R33-Av1-nl",
                tipo: "opcion-multiple",
                pregunta: "33. Hier is een extra uitdaging! Zoek de fornicator in de Zijdehal!",
                opciones: ["In een van zijn ramen vindt u een uitgehouwen man; zijn hoofd is niet zichtbaar maar zijn genitaliën zijn, heel duidelijk."],
                correctas: ["In een van zijn ramen vindt u een uitgehouwen man; zijn hoofd is niet zichtbaar maar zijn genitaliën zijn, heel duidelijk."],
                multiple: true
            },
            {
                reto: 34,
                id: "R34-Av1-nl",
                tipo: "opcion",
                pregunta: "34. Wat houdt de figuur in zijn handen?",
                opciones: ["Een schild", "Een schelp", "Een kruik", "Een zwaard"],
                correctas: ["Een schelp"],
                multiple: false
            },
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            },
        ],
        ja: [
            // Array de retos Aventura1 JAPONÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av1-ja",
                tipo: "opcion",
                pregunta: "1. Valencia be Guides ではいくつのアドベンチャーが体験できますか？",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av1-ja",
                tipo: "opcion",
                pregunta: "2. 今は冒険を始めるのに良いタイミングですか？",
                opciones: ["はい", "いいえ"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av1-ja",
                tipo: "opcion",
                pregunta: "2. これらの塔の名前を教えてもらえますか？",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av1-ja",
                tipo: "opcion",
                pregunta: "3. 塔の頂上にはバレンシアの旗がはためいています。色は赤、黄、そして…？",
                opciones: ["紫", "緑", "青"],
                correctas: ["青"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av1-ja",
                tipo: "texto",
                pregunta: "4. この通りの名前を教えてもらえますか？",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-Av1-ja",
                tipo: "opcion",
                pregunta: "5. 聖ロレンスは手に何を持っていますか？",
                opciones: ["ハト", "スプーン", "グリル"],
                correctas: ["グリル"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av1-ja",
                tipo: "opcion",
                pregunta: "6. ネプチューンはどちらの手で角笛を持っていますか？",
                opciones: ["左手", "右手"],
                correctas: ["右手"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av1-ja",
                tipo: "texto",
                pregunta: "7. 噴水の周りにはいくつの像がありますか？",
                correctas: ["8"]
            },
            {
                reto: 9,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 10,
                id: "R10-Av1-ja",
                tipo: "opcion",
                pregunta: "9. 絵の額縁にはどの彫刻が見えますか？",
                opciones: ["ドラゴン", "コウモリ", "王冠"],
                correctas: ["王冠"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av1-ja",
                tipo: "opcion-multiple",
                pregunta: "10. 内部には何が見えますか？",
                opciones: ["祭壇", "旗", "剣"],
                correctas: ["祭壇", "旗"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av1-ja",
                tipo: "texto",
                pregunta: "11. この場所には記念プレートがあります。設置された年はいつですか？",
                correctas: ["1952"]
            },
            {
                reto: 13,
                id: "R13-Av1-ja",
                tipo: "texto",
                pregunta: "12. この建物は何年に建てられましたか？ヒント：ファサードの上部を見てください。",
                correctas: ["1906"]
            },
            {
                reto: 14,
                id: "R14-Av1-ja",
                tipo: "opcion",
                pregunta: "13. 内部には何が見えますか？",
                opciones: ["闘牛場", "ローマ風浴場", "地下鉄駅"],
                correctas: ["ローマ風浴場"],
                multiple: false
            },
            {
                reto: 15,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 16,
                id: "R16-Av1-ja",
                tipo: "opcion",
                pregunta: "15. 形状を判定できますか？",
                opciones: ["「六角形」", "「八角形」", "「四角形」"],
                correctas: ["「六角形」"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av1-ja",
                tipo: "texto",
                pregunta: "16. 門はいくつのアーチで構成されていますか？",
                correctas: ["6"]
            },
            {
                reto: 18,
                id: "R18-Av1-ja",
                tipo: "opcion",
                pregunta: "17. 市章の上にいる動物を覚えていますか？",
                opciones: ["ドラゴン", "コウモリ", "馬"],
                correctas: ["コウモリ"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av1-ja",
                tipo: "opcion",
                pregunta: "18. 第一の塔のファサードに注目！どの柑橘類が装飾されていますか？",
                opciones: ["レモン", "グレープフルーツ", "オレンジ"],
                correctas: ["オレンジ"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-03",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-03"
            },
            {
                reto: 21,
                id: "R21-Av1-ja",
                tipo: "texto",
                pregunta: "20. この建物にはどの商店が入っていますか？",
                correctas: ["?"]
            },
            {
                reto: 22,
                id: "R22-Av1-ja",
                tipo: "opcion-multiple",
                pregunta: "21. 正面入口の上の半円アーチには、5大陸を表す寓意的な像があります。中央の像は何を持っていますか？",
                opciones: ["たいまつ", "剣", "王冠"],
                correctas: ["たいまつ", "剣"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av1-ja",
                tipo: "opcion",
                pregunta: "22. この像は手に何を持っていますか？",
                opciones: ["天秤", "本", "羽ペン"],
                correctas: ["天秤"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av1-ja",
                tipo: "texto",
                pregunta: "22. 建物は何階建てですか？",
                correctas: ["10"]
            },
            {
                reto: 25,
                id: "R25-Av1-ja",
                tipo: "opcion",
                pregunta: "23. ファサードのバレンシアのセニェーラの色のステンドグラスを探してください。形状は何ですか？",
                opciones: ["「四角形」", "「円形」", "「三角形」"],
                correctas: ["「円形」"],
                multiple: false
            },
            {
                reto: 26,
                id: "R26-Av1-ja",
                tipo: "opcion-multiple",
                pregunta: "24. 聖母は手に何を持っていますか？",
                opciones: ["ロザリオ", "子供", "王冠"],
                correctas: ["ロザリオ", "子供"],
                multiple: true
            },
            {
                reto: 27,
                id: "R27-Av1-ja",
                tipo: "opcion",
                pregunta: "26. 天使は子供に何を渡していますか？",
                opciones: ["鳩", "オーブ", "食べ物"],
                correctas: ["オーブ"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 29,
                id: "R29-Av1-ja",
                tipo: "opcion-multiple",
                pregunta: "29. 逆流を漕ぐ船頭。",
                opciones: ["悲しい表情の男が小さな木製の舟を操り、怪物から逃げるように逆流を進んでいる。"],
                correctas: ["悲しい表情の男が小さな木製の舟を操り、怪物から逃げるように逆流を進んでいる。"],
                multiple: true
            },
            {
                reto: 30,
                id: "R30-Av1-ja",
                tipo: "opcion-multiple",
                pregunta: "30. 死んだ木：罪の象徴、門の2枚の扉の間にあり、中央の柱として機能しています。",
                opciones: ["木の頂上で4人の裸の男性がお互いを鞭打つ様子を観察してください。"],
                correctas: ["木の頂上で4人の裸の男性がお互いを鞭打つ様子を観察してください。"],
                multiple: true
            },
            {
                reto: 31,
                id: "R31-Av1-ja",
                tipo: "opcion-multiple",
                pregunta: "31. 右側、天使が陰茎を見せて…",
                opciones: ["もう片方の手で持つ花瓶に挿入しようとしている。不思議で異常ですよね？"],
                correctas: ["もう片方の手で持つ花瓶に挿入しようとしている。不思議で異常ですよね？"],
                multiple: true
            },
            {
                reto: 32,
                id: "R32-Av1-ja",
                tipo: "opcion-multiple",
                pregunta: "32. 中央：ひげの男とライオン：",
                opciones: ["穏やかなのはライオンであり、ひげの老人ではない、という独特で矛盾した場面。"],
                correctas: ["穏やかなのはライオンであり、ひげの老人ではない、という独特で矛盾した場面。"],
                multiple: true
            },
            {
                reto: 33,
                id: "R33-Av1-ja",
                tipo: "opcion-multiple",
                pregunta: "33. ここで追加チャレンジ！絹の取引所の乱交者を探してください！",
                opciones: ["窓の一つに彫刻された男性がいます。頭は見えませんが、性器ははっきり見えます。"],
                correctas: ["窓の一つに彫刻された男性がいます。頭は見えませんが、性器ははっきり見えます。"],
                multiple: true
            },
            {
                reto: 34,
                id: "R34-Av1-ja",
                tipo: "opcion",
                pregunta: "34. この像は手に何を持っていますか？",
                opciones: ["盾", "貝殻", "水差し", "剣"],
                correctas: ["貝殻"],
                multiple: false
            },
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        de: [
            // Array de retos Aventura1 ALEMÁN
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av1-de",
                tipo: "opcion",
                pregunta: "1. Wie viele Abenteuer können mit Valencia be Guides unternommen werden?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av1-de",
                tipo: "opcion",
                pregunta: "2. Ist es ein guter Zeitpunkt, Ihr Abenteuer zu beginnen?",
                opciones: ["Ja", "Nein"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av1-de",
                tipo: "opcion",
                pregunta: "3. Können Sie mir sagen, wie diese Türme heißen?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av1-de",
                tipo: "opcion",
                pregunta: "4. Auf dem Gipfel der Türme weht die Flagge von Valencia: Ihre Farben sind Rot, Gelb und…?",
                opciones: ["Violett", "Grün", "Blau"],
                correctas: ["Blau"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av1-de",
                tipo: "texto",
                pregunta: "5. Können Sie mir den Namen der Straße nennen?",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-Av1-de",
                tipo: "opcion",
                pregunta: "6. Was trägt der heilige Laurentius in seiner Hand?",
                opciones: ["Eine Taube", "Ein Löffel", "Ein Rost"],
                correctas: ["Ein Rost"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av1-de",
                tipo: "opcion",
                pregunta: "7. Mit welcher Hand hält Neptun das Füllhorn?",
                opciones: ["Links", "Rechts"],
                correctas: ["Rechts"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av1-de",
                tipo: "texto",
                pregunta: "8. Wie viele Figuren umgeben den Brunnen?",
                correctas: ["8"]
            },
            {
                reto: 9,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 10,
                id: "R10-Av1-de",
                tipo: "opcion",
                pregunta: "10. Welche skulptierte Figur ist im Rahmen des Gemäldes zu sehen?",
                opciones: ["Ein Drache", "Eine Fledermaus", "Eine Krone"],
                correctas: ["Eine Krone"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av1-de",
                tipo: "opcion-multiple",
                pregunta: "11. Was ist im Inneren zu sehen?",
                opciones: ["Ein Altar", "Eine Flagge", "Ein Schwert"],
                correctas: ["Ein Altar", "Eine Flagge"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av1-de",
                tipo: "texto",
                pregunta: "12. Daran befindet sich eine Gedenktafel. In welchem Jahr wurde sie aufgestellt?",
                correctas: ["1952"]
            },
            {
                reto: 13,
                id: "R13-Av1-de",
                tipo: "texto",
                pregunta: "13. In welchem Jahr wurde dieses Gebäude errichtet? Tipp: Schauen Sie an der Oberseite der Fassade nach.",
                correctas: ["1906"]
            },
            {
                reto: 14,
                id: "R14-Av1-de",
                tipo: "opcion",
                pregunta: "14. Was ist im Inneren zu sehen?",
                opciones: ["Eine Stierkampfarena", "Römische Bäder", "Eine U-Bahn-Station"],
                correctas: ["Römische Bäder"],
                multiple: false
            },
            {
                reto: 15,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 16,
                id: "R16-Av1-de",
                tipo: "opcion",
                pregunta: "16. Können Sie seine Geometrie bestimmen?",
                opciones: ["Hexagonal", "Oktogonal", "Quadrangular"],
                correctas: ["Hexagonal"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av1-de",
                tipo: "texto",
                pregunta: "17. Wie viele Bögen bilden das Tor?",
                correctas: ["6"]
            },
            {
                reto: 18,
                id: "R18-Av1-de",
                tipo: "opcion",
                pregunta: "18. Erinnern Sie sich, welches Tier das Stadtwappen krönt?",
                opciones: ["Ein Drache", "Eine Fledermaus", "Ein Pferd"],
                correctas: ["Eine Fledermaus"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av1-de",
                tipo: "opcion",
                pregunta: "19. Achten Sie auf die Fassade des ersten Turms! Welche Zitrusfrucht aus Valencia schmückt die Fassade?",
                opciones: ["Zitronen", "Grapefruits", "Orangen"],
                correctas: ["Orangen"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-03",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-03"
            },
            {
                reto: 21,
                id: "R21-Av1-de",
                tipo: "texto",
                pregunta: "21. Können Sie mir sagen, welches Gewerbe dieses Gebäude beherbergt?",
                correctas: ["?"]
            },
            {
                reto: 22,
                id: "R22-Av1-de",
                tipo: "opcion-multiple",
                pregunta: "22. Über dem Haupteingang, in einem Rundbogen, repräsentieren allegorische Figuren die fünf Kontinente. Was hält die zentrale Figur?",
                opciones: ["Eine Fackel", "Ein Schwert", "Eine Krone"],
                correctas: ["Eine Fackel", "Ein Schwert"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av1-de",
                tipo: "opcion",
                pregunta: "23. Was hält die Figur in seiner Hand?",
                opciones: ["Eine Waage", "Ein Buch", "Eine Feder"],
                correctas: ["Eine Waage"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av1-de",
                tipo: "texto",
                pregunta: "24. Wie viele Stockwerke hat das Gebäude?",
                correctas: ["10"]
            },
            {
                reto: 25,
                id: "R25-Av1-de",
                tipo: "opcion",
                pregunta: "25. Suchen Sie das Buntglasfenster mit den Farben der valencianischen Senyera an der Fassade. Können Sie seine Form bestimmen?",
                opciones: ["Quadrangular", "Rund", "Dreieckig"],
                correctas: ["Rund"],
                multiple: false
            },
            {
                reto: 26,
                id: "R26-Av1-de",
                tipo: "opcion-multiple",
                pregunta: "26. Was hält die Jungfrau in ihrer Hand?",
                opciones: ["Ein Rosenkranz", "Ein Kind", "Eine Krone"],
                correctas: ["Ein Rosenkranz", "Ein Kind"],
                multiple: true
            },
            {
                reto: 27,
                id: "R27-Av1-de",
                tipo: "opcion",
                pregunta: "27. Was gibt der Engel dem Kind?",
                opciones: ["Eine Taube", "Eine Kugel", "Nahrung"],
                correctas: ["Eine Kugel"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 29,
                id: "R29-Av1-de",
                tipo: "opcion-multiple",
                pregunta: "29. Der Fährmann, der gegen den Strom rudert.",
                opciones: ["Ein Mann mit traurigem Gesicht, der ein kleines Holzboot steuert, entkommt einem Monster gegen den Strom."],
                correctas: ["Ein Mann mit traurigem Gesicht, der ein kleines Holzboot steuert, entkommt einem Monster gegen den Strom."],
                multiple: true
            },
            {
                reto: 30,
                id: "R30-Av1-de",
                tipo: "opcion-multiple",
                pregunta: "30. Ein toter Baum: Symbol der Sünde, ist zwischen den beiden Türflügeln zu sehen und dient als Pfeilerstab.",
                opciones: ["Beobachten Sie an der Baumkrone, wie 4 nackte Männer sich gegenseitig auspeitschen."],
                correctas: ["Beobachten Sie an der Baumkrone, wie 4 nackte Männer sich gegenseitig auspeitschen."],
                multiple: true
            },
            {
                reto: 31,
                id: "R31-Av1-de",
                tipo: "opcion-multiple",
                pregunta: "31. Rechts, ein Engel zeigt seinen Penis und...",
                opciones: ["...er ist dabei, ihn in eine Vase einzuführen, die er mit der anderen Hand hält. Seltsam und ungewöhnlich, finden Sie nicht?"],
                correctas: ["...er ist dabei, ihn in eine Vase einzuführen, die er mit der anderen Hand hält. Seltsam und ungewöhnlich, finden Sie nicht?"],
                multiple: true
            },
            {
                reto: 32,
                id: "R32-Av1-de",
                tipo: "opcion-multiple",
                pregunta: "32. In der Mitte: Der bärtige Mann und der Löwe:",
                opciones: ["Originale und widersprüchliche Szene, in der der sanfte genau der Löwe ist und nicht der bärtige alte Mann."],
                correctas: ["Originale und widersprüchliche Szene, in der der sanfte genau der Löwe ist und nicht der bärtige alte Mann."],
                multiple: true
            },
            {
                reto: 33,
                id: "R33-Av1-de",
                tipo: "opcion-multiple",
                pregunta: "33. Hier eine zusätzliche Herausforderung! Suchen Sie den Fornikator der Seidenbörse!",
                opciones: ["In einem seiner Fenster finden Sie einen gemeißelten Mann; sein Kopf ist nicht sichtbar, aber sein Geschlechtsorgan ist es, sehr deutlich."],
                correctas: ["In einem seiner Fenster finden Sie einen gemeißelten Mann; sein Kopf ist nicht sichtbar, aber sein Geschlechtsorgan ist es, sehr deutlich."],
                multiple: true
            },
            {
                reto: 34,
                id: "R34-Av1-de",
                tipo: "opcion",
                pregunta: "34. Was hält die Figur in ihren Händen?",
                opciones: ["Einen Schild", "Eine Muschel", "Einen Krug", "Ein Schwert"],
                correctas: ["Eine Muschel"],
                multiple: false
            },
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            },
        ],
        zh: [
            // Array de retos Aventura1 CHINO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av1-zh",
                tipo: "opcion",
                pregunta: "1. Valencia be Guides 可以进行多少次冒险？",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av1-zh",
                tipo: "opcion",
                pregunta: "2. 现在是开始冒险的好时机吗？",
                opciones: ["是", "否"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av1-zh",
                tipo: "opcion",
                pregunta: "3. 您知道这些塔楼叫什么名字吗？",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av1-zh",
                tipo: "opcion",
                pregunta: "4. 塔楼顶部飘扬着巴伦西亚的旗帜，颜色由红色、黄色和……组成？",
                opciones: ["紫色", "绿色", "蓝色"],
                correctas: ["蓝色"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av1-zh",
                tipo: "texto",
                pregunta: "5. 您能告诉我这条街道的名字吗？",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-Av1-zh",
                tipo: "opcion",
                pregunta: "6. 圣劳伦斯手中拿着什么？",
                opciones: ["一只鸽子", "一把勺子", "一个烤架"],
                correctas: ["一个烤架"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av1-zh",
                tipo: "opcion",
                pregunta: "7. 海神尼普顿用哪只手拿着丰饶角？",
                opciones: ["左手", "右手"],
                correctas: ["右手"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av1-zh",
                tipo: "texto",
                pregunta: "8. 喷泉周围有多少座雕像？",
                correctas: ["8"]
            },
            {
                reto: 9,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 10,
                id: "R10-Av1-zh",
                tipo: "opcion",
                pregunta: "10. 画框上可以看到什么雕刻图案？",
                opciones: ["一条龙", "一只蝙蝠", "一顶王冠"],
                correctas: ["一顶王冠"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av1-zh",
                tipo: "opcion-multiple",
                pregunta: "11. 内部可以看到什么？",
                opciones: ["一座祭坛", "一面旗帜", "一把剑"],
                correctas: ["一座祭坛", "一面旗帜"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av1-zh",
                tipo: "texto",
                pregunta: "12. 上面有一块纪念牌匾。这块牌匾是哪年放置的？",
                correctas: ["1952"]
            },
            {
                reto: 13,
                id: "R13-Av1-zh",
                tipo: "texto",
                pregunta: "13. 这栋建筑建于哪一年？提示：看建筑外立面的上部。",
                correctas: ["1906"]
            },
            {
                reto: 14,
                id: "R14-Av1-zh",
                tipo: "opcion",
                pregunta: "14. 内部可以看到什么？",
                opciones: ["一个斗牛场", "罗马浴场", "一个地铁站"],
                correctas: ["罗马浴场"],
                multiple: false
            },
            {
                reto: 15,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 16,
                id: "R16-Av1-zh",
                tipo: "opcion",
                pregunta: "16. 您能判断它的几何形状吗？",
                opciones: ["六边形", "八边形", "四边形"],
                correctas: ["六边形"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av1-zh",
                tipo: "texto",
                pregunta: "17. 这扇门由几个拱形组成？",
                correctas: ["6"]
            },
            {
                reto: 18,
                id: "R18-Av1-zh",
                tipo: "opcion",
                pregunta: "18. 您还记得市徽上是什么动物吗？",
                opciones: ["一条龙", "一只蝙蝠", "一匹马"],
                correctas: ["一只蝙蝠"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av1-zh",
                tipo: "opcion",
                pregunta: "19. 请注意第一座塔楼的外立面！哪种巴伦西亚本地柑橘类水果装饰着外立面？",
                opciones: ["柠檬", "葡萄柚", "橙子"],
                correctas: ["橙子"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-03",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-03"
            },
            {
                reto: 21,
                id: "R21-Av1-zh",
                tipo: "texto",
                pregunta: "21. 您能告诉我这栋建筑里有什么商铺吗？",
                correctas: ["?"]
            },
            {
                reto: 22,
                id: "R22-Av1-zh",
                tipo: "opcion-multiple",
                pregunta: "22. 在主入口上方的半圆拱门中，寓言人物代表五大洲。中央人物拿着什么？",
                opciones: ["一把火炬", "一把剑", "一顶王冠"],
                correctas: ["一把火炬", "一把剑"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av1-zh",
                tipo: "opcion",
                pregunta: "23. 这个人物手中拿着什么？",
                opciones: ["一把天平", "一本书", "一根羽毛"],
                correctas: ["一把天平"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av1-zh",
                tipo: "texto",
                pregunta: "24. 这栋建筑有几层楼？",
                correctas: ["10"]
            },
            {
                reto: 25,
                id: "R25-Av1-zh",
                tipo: "opcion",
                pregunta: "25. 在建筑外立面上寻找带有巴伦西亚旗帜颜色的彩色玻璃窗。您能判断它的形状吗？",
                opciones: ["四边形", "圆形", "三角形"],
                correctas: ["圆形"],
                multiple: false
            },
            {
                reto: 26,
                id: "R26-Av1-zh",
                tipo: "opcion-multiple",
                pregunta: "26. 圣母手中拿着什么？",
                opciones: ["一串玫瑰念珠", "一个孩子", "一顶王冠"],
                correctas: ["一串玫瑰念珠", "一个孩子"],
                multiple: true
            },
            {
                reto: 27,
                id: "R27-Av1-zh",
                tipo: "opcion",
                pregunta: "27. 天使给孩子什么？",
                opciones: ["一只鸽子", "一个宝球", "食物"],
                correctas: ["一个宝球"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 29,
                id: "R29-Av1-zh",
                tipo: "opcion-multiple",
                pregunta: "29. 逆流而上的船夫。",
                opciones: ["一个面带愁容的男人驾驶着一艘小木船，逆流逃离一只怪物。"],
                correctas: ["一个面带愁容的男人驾驶着一艘小木船，逆流逃离一只怪物。"],
                multiple: true
            },
            {
                reto: 30,
                id: "R30-Av1-zh",
                tipo: "opcion-multiple",
                pregunta: "30. 一棵枯树：罪孽的象征，出现在门的两扇叶片之间，充当中柱。",
                opciones: ["观察树顶，4名裸男相互鞭打。"],
                correctas: ["观察树顶，4名裸男相互鞭打。"],
                multiple: true
            },
            {
                reto: 31,
                id: "R31-Av1-zh",
                tipo: "opcion-multiple",
                pregunta: "31. 右侧，一个天使展示着他的阴茎，并……",
                opciones: ["准备将其插入另一只手拿着的花瓶中。奇怪而不寻常，不是吗？"],
                correctas: ["准备将其插入另一只手拿着的花瓶中。奇怪而不寻常，不是吗？"],
                multiple: true
            },
            {
                reto: 32,
                id: "R32-Av1-zh",
                tipo: "opcion-multiple",
                pregunta: "32. 中央：蓄胡子的男人和狮子：",
                opciones: ["原创而矛盾的场景，其中温顺的恰恰是狮子，而不是蓄胡子的老人。"],
                correctas: ["原创而矛盾的场景，其中温顺的恰恰是狮子，而不是蓄胡子的老人。"],
                multiple: true
            },
            {
                reto: 33,
                id: "R33-Av1-zh",
                tipo: "opcion-multiple",
                pregunta: "33. 这是一个额外挑战！寻找丝绸交易所的通奸者！",
                opciones: ["在它的一扇窗户里，您会发现一个雕刻的男人；他的头部不可见，但他的生殖器非常清晰可见。"],
                correctas: ["在它的一扇窗户里，您会发现一个雕刻的男人；他的头部不可见，但他的生殖器非常清晰可见。"],
                multiple: true
            },
            {
                reto: 34,
                id: "R34-Av1-zh",
                tipo: "opcion",
                pregunta: "34. 这个雕像手里拿着什么？",
                opciones: ["盾牌", "贝壳", "水罐", "剑"],
                correctas: ["贝壳"],
                multiple: false
            },
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            },
        ],
        pl: [
            // Array de retos Aventura1 POLACO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av1-pl",
                tipo: "opcion",
                pregunta: "1. Ile przygód można przeżyć z Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av1-pl",
                tipo: "opcion",
                pregunta: "2. Czy to dobry moment, aby rozpocząć przygodę?",
                opciones: ["Tak", "Nie"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av1-pl",
                tipo: "opcion",
                pregunta: "3. Czy może mi Pan/Pani powiedzieć, jak nazywają się te wieże?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av1-pl",
                tipo: "opcion",
                pregunta: "4. Na szczycie wież powiewa flaga Walencji: jej kolory to czerwony, żółty i…?",
                opciones: ["Fioletowy", "Zielony", "Niebieski"],
                correctas: ["Niebieski"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av1-pl",
                tipo: "texto",
                pregunta: "5. Czy może mi Pan/Pani powiedzieć nazwę tej ulicy?",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-Av1-pl",
                tipo: "opcion",
                pregunta: "6. Co trzyma święty Wawrzyniec w swojej ręce?",
                opciones: ["Gołąb", "Łyżka", "Ruszt"],
                correctas: ["Ruszt"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av1-pl",
                tipo: "opcion",
                pregunta: "7. Którą ręką Neptun trzyma róg obfitości?",
                opciones: ["Lewą", "Prawą"],
                correctas: ["Prawą"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av1-pl",
                tipo: "texto",
                pregunta: "8. Ile figur otacza fontannę?",
                correctas: ["8"]
            },
            {
                reto: 9,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 10,
                id: "R10-Av1-pl",
                tipo: "opcion",
                pregunta: "10. Jaką rzeźbioną figurę można zobaczyć w ramie obrazu?",
                opciones: ["Smok", "Nietoperz", "Korona"],
                correctas: ["Korona"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av1-pl",
                tipo: "opcion-multiple",
                pregunta: "11. Co można zobaczyć wewnątrz?",
                opciones: ["Ołtarz", "Flaga", "Miecz"],
                correctas: ["Ołtarz", "Flaga"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av1-pl",
                tipo: "texto",
                pregunta: "12. Na nim znajduje się tablica pamiątkowa. W którym roku została umieszczona?",
                correctas: ["1952"]
            },
            {
                reto: 13,
                id: "R13-Av1-pl",
                tipo: "texto",
                pregunta: "13. W którym roku zbudowano tę kamienicę? Wskazówka: spójrz na górę fasady.",
                correctas: ["1906"]
            },
            {
                reto: 14,
                id: "R14-Av1-pl",
                tipo: "opcion",
                pregunta: "14. Co można zobaczyć wewnątrz?",
                opciones: ["Arena do walk byków", "Łaźnie rzymskie", "Stacja metra"],
                correctas: ["Łaźnie rzymskie"],
                multiple: false
            },
            {
                reto: 15,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 16,
                id: "R16-Av1-pl",
                tipo: "opcion",
                pregunta: "16. Czy potrafi Pan/Pani określić jego geometrię?",
                opciones: ["Sześciokąt", "Ośmiokąt", "Czworokąt"],
                correctas: ["Sześciokąt"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av1-pl",
                tipo: "texto",
                pregunta: "17. Ile łuków tworzy bramę?",
                correctas: ["6"]
            },
            {
                reto: 18,
                id: "R18-Av1-pl",
                tipo: "opcion",
                pregunta: "18. Czy pamięta Pan/Pani, jakie zwierzę wieńczy herb miejski?",
                opciones: ["Smok", "Nietoperz", "Koń"],
                correctas: ["Nietoperz"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av1-pl",
                tipo: "opcion",
                pregunta: "19. Proszę zwrócić uwagę na fasadę pierwszej wieży! Jaki owoc cytrusowy z Walencji zdobi fasadę?",
                opciones: ["Cytryny", "Grejpfruty", "Pomarańcze"],
                correctas: ["Pomarańcze"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-03",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-03"
            },
            {
                reto: 21,
                id: "R21-Av1-pl",
                tipo: "texto",
                pregunta: "21. Czy może mi Pan/Pani powiedzieć, jaki rodzaj działalności mieści ten budynek?",
                correctas: ["?"]
            },
            {
                reto: 22,
                id: "R22-Av1-pl",
                tipo: "opcion-multiple",
                pregunta: "22. Nad głównym wejściem, w półokrągłym łuku, alegoryczne figury reprezentują pięć kontynentów. Co trzyma centralna figura?",
                opciones: ["Pochodnia", "Miecz", "Korona"],
                correctas: ["Pochodnia", "Miecz"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av1-pl",
                tipo: "opcion",
                pregunta: "23. Co trzyma figura w swojej ręce?",
                opciones: ["Waga", "Książka", "Pióro"],
                correctas: ["Waga"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av1-pl",
                tipo: "texto",
                pregunta: "24. Ile pięter ma budynek?",
                correctas: ["10"]
            },
            {
                reto: 25,
                id: "R25-Av1-pl",
                tipo: "opcion",
                pregunta: "25. Poszukaj witrażu w kolorach walencjańskiej Senyery na fasadzie budynku. Czy potrafi Pan/Pani określić jego kształt?",
                opciones: ["Czworokąt", "Okrągły", "Trójkąt"],
                correctas: ["Okrągły"],
                multiple: false
            },
            {
                reto: 26,
                id: "R26-Av1-pl",
                tipo: "opcion-multiple",
                pregunta: "26. Co trzyma Dziewica w swojej ręce?",
                opciones: ["Różaniec", "Dziecko", "Korona"],
                correctas: ["Różaniec", "Dziecko"],
                multiple: true
            },
            {
                reto: 27,
                id: "R27-Av1-pl",
                tipo: "opcion",
                pregunta: "27. Co anioł daje dziecku?",
                opciones: ["Gołąb", "Kula", "Jedzenie"],
                correctas: ["Kula"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 29,
                id: "R29-Av1-pl",
                tipo: "opcion-multiple",
                pregunta: "29. Przewoźnik wiosłujący pod prąd.",
                opciones: ["Smutny mężczyzna kierujący małą drewnianą łódką ucieka pod prąd przed potworem."],
                correctas: ["Smutny mężczyzna kierujący małą drewnianą łódką ucieka pod prąd przed potworem."],
                multiple: true
            },
            {
                reto: 30,
                id: "R30-Av1-pl",
                tipo: "opcion-multiple",
                pregunta: "30. Martwe drzewo: symbol Grzechu, widać je między dwoma skrzydłami drzwi, pełni funkcję słupka.",
                opciones: ["Obserwuj wierzchołek drzewa, gdzie 4 nagich mężczyzn biczuje się nawzajem."],
                correctas: ["Obserwuj wierzchołek drzewa, gdzie 4 nagich mężczyzn biczuje się nawzajem."],
                multiple: true
            },
            {
                reto: 31,
                id: "R31-Av1-pl",
                tipo: "opcion-multiple",
                pregunta: "31. Po prawej, anioł pokazuje swój penis i...",
                opciones: ["...zamierza włożyć go do wazonu, który trzyma w drugiej ręce. Dziwne i niezwykłe, prawda?"],
                correctas: ["...zamierza włożyć go do wazonu, który trzyma w drugiej ręce. Dziwne i niezwykłe, prawda?"],
                multiple: true
            },
            {
                reto: 32,
                id: "R32-Av1-pl",
                tipo: "opcion-multiple",
                pregunta: "32. W centrum: Brodaty mężczyzna i lew:",
                opciones: ["Oryginalna i sprzeczna scena, w której łagodnym jest właśnie lew, a nie brodaty starzec."],
                correctas: ["Oryginalna i sprzeczna scena, w której łagodnym jest właśnie lew, a nie brodaty starzec."],
                multiple: true
            },
            {
                reto: 33,
                id: "R33-Av1-pl",
                tipo: "opcion-multiple",
                pregunta: "33. Oto dodatkowe wyzwanie! Znajdź lubieżnika z Giełdy Jedwabiu!",
                opciones: ["W jednym z jej okien znajdziesz wykutego mężczyznę; jego głowy nie widać, ale genitalia są bardzo wyraźnie widoczne."],
                correctas: ["W jednym z jej okien znajdziesz wykutego mężczyznę; jego głowy nie widać, ale genitalia są bardzo wyraźnie widoczne."],
                multiple: true
            },
            {
                reto: 34,
                id: "R34-Av1-pl",
                tipo: "opcion",
                pregunta: "34. Co postać trzyma w rękach?",
                opciones: ["Tarczę", "Muszlę", "Dzban", "Miecz"],
                correctas: ["Muszlę"],
                multiple: false
            },
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            },
        ],
        pt: [
            // Array de retos Aventura1 PORTUGUÊS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av1-pt",
                tipo: "opcion",
                pregunta: "1. Quantas aventuras podem ser feitas com Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av1-pt",
                tipo: "opcion",
                pregunta: "2. É um bom momento para começar a sua aventura?",
                opciones: ["Sim", "Não"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av1-pt",
                tipo: "opcion",
                pregunta: "3. Pode dizer-me como se chamam estas torres?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av1-pt",
                tipo: "opcion",
                pregunta: "4. No topo das torres tremula a bandeira de Valência: as suas cores são vermelho, amarelo e…?",
                opciones: ["Violeta", "Verde", "Azul"],
                correctas: ["Azul"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av1-pt",
                tipo: "texto",
                pregunta: "5. Pode dizer-me o nome da rua?",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-Av1-pt",
                tipo: "opcion",
                pregunta: "6. O que tem São Lourenço na mão?",
                opciones: ["Uma pomba", "Uma colher", "Uma grelha"],
                correctas: ["Uma grelha"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av1-pt",
                tipo: "opcion",
                pregunta: "7. Com que mão Neptuno segura a cornucópia?",
                opciones: ["Esquerda", "Direita"],
                correctas: ["Direita"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av1-pt",
                tipo: "texto",
                pregunta: "8. Quantas figuras rodeiam a fonte?",
                correctas: ["8"]
            },
            {
                reto: 9,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 10,
                id: "R10-Av1-pt",
                tipo: "opcion",
                pregunta: "10. Que figura esculpida se pode ver na moldura do quadro?",
                opciones: ["Um dragão", "Um morcego", "Uma coroa"],
                correctas: ["Uma coroa"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av1-pt",
                tipo: "opcion-multiple",
                pregunta: "11. O que se pode ver no interior?",
                opciones: ["Um altar", "Uma bandeira", "Uma espada"],
                correctas: ["Um altar", "Uma bandeira"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av1-pt",
                tipo: "texto",
                pregunta: "12. Há uma placa comemorativa neste local. Em que ano foi colocada?",
                correctas: ["1952"]
            },
            {
                reto: 13,
                id: "R13-Av1-pt",
                tipo: "texto",
                pregunta: "13. Em que ano foi construído este edifício? Dica: olhe para a parte superior da fachada.",
                correctas: ["1906"]
            },
            {
                reto: 14,
                id: "R14-Av1-pt",
                tipo: "opcion",
                pregunta: "14. O que se pode ver no interior?",
                opciones: ["Uma praça de touros", "Banhos romanos", "Uma estação de metro"],
                correctas: ["Banhos romanos"],
                multiple: false
            },
            {
                reto: 15,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 16,
                id: "R16-Av1-pt",
                tipo: "opcion",
                pregunta: "16. Consegue determinar a sua geometria?",
                opciones: ["Hexagonal", "Octogonal", "Quadrangular"],
                correctas: ["Hexagonal"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av1-pt",
                tipo: "texto",
                pregunta: "17. Quantos arcos compõem o portal?",
                correctas: ["6"]
            },
            {
                reto: 18,
                id: "R18-Av1-pt",
                tipo: "opcion",
                pregunta: "18. Recorda que animal coroa o brasão municipal?",
                opciones: ["Um dragão", "Um morcego", "Um cavalo"],
                correctas: ["Um morcego"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av1-pt",
                tipo: "opcion",
                pregunta: "19. Preste atenção à fachada da primeira torre! Que fruto cítrico natural de Valência decora a fachada?",
                opciones: ["Limões", "Toranjas", "Laranjas"],
                correctas: ["Laranjas"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-03",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-03"
            },
            {
                reto: 21,
                id: "R21-Av1-pt",
                tipo: "texto",
                pregunta: "21. Pode dizer-me que comércio alberga este edifício?",
                correctas: ["?"]
            },
            {
                reto: 22,
                id: "R22-Av1-pt",
                tipo: "opcion-multiple",
                pregunta: "22. Sobre a entrada principal, num arco de volta perfeita, figuras alegóricas representam os cinco continentes. O que segura a figura central?",
                opciones: ["Uma tocha", "Uma espada", "Uma coroa"],
                correctas: ["Uma tocha", "Uma espada"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av1-pt",
                tipo: "opcion",
                pregunta: "23. O que segura a figura na mão?",
                opciones: ["Uma balança", "Um livro", "Uma pena"],
                correctas: ["Uma balança"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av1-pt",
                tipo: "texto",
                pregunta: "24. Quantos andares tem o edifício?",
                correctas: ["10"]
            },
            {
                reto: 25,
                id: "R25-Av1-pt",
                tipo: "opcion",
                pregunta: "25. Procure o vitral com as cores da Senyera valenciana na fachada do edifício. Consegue determinar a sua forma?",
                opciones: ["Quadrangular", "Redonda", "Triangular"],
                correctas: ["Redonda"],
                multiple: false
            },
            {
                reto: 26,
                id: "R26-Av1-pt",
                tipo: "opcion-multiple",
                pregunta: "26. O que segura a Virgem na sua mão?",
                opciones: ["Um rosário", "Uma criança", "Uma coroa"],
                correctas: ["Um rosário", "Uma criança"],
                multiple: true
            },
            {
                reto: 27,
                id: "R27-Av1-pt",
                tipo: "opcion",
                pregunta: "27. O que dá o anjo à criança?",
                opciones: ["Uma pomba", "Um orbe", "Alimentos"],
                correctas: ["Um orbe"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 29,
                id: "R29-Av1-pt",
                tipo: "opcion-multiple",
                pregunta: "29. O barqueiro que rema contra a corrente.",
                opciones: ["Um homem com rosto triste a conduzir um pequeno barco de madeira foge contra a corrente de um monstro."],
                correctas: ["Um homem com rosto triste a conduzir um pequeno barco de madeira foge contra a corrente de um monstro."],
                multiple: true
            },
            {
                reto: 30,
                id: "R30-Av1-pt",
                tipo: "opcion-multiple",
                pregunta: "30. Uma árvore morta: símbolo do Pecado, vê-se entre as duas folhas da porta e cumpre a função de parteluz.",
                opciones: ["Observe no topo da árvore como 4 homens nus se açoitam entre si."],
                correctas: ["Observe no topo da árvore como 4 homens nus se açoitam entre si."],
                multiple: true
            },
            {
                reto: 31,
                id: "R31-Av1-pt",
                tipo: "opcion-multiple",
                pregunta: "31. À direita, um anjo mostra o seu pénis e...",
                opciones: ["...prepara-se para o introduzir num vaso que segura com a outra mão. Estranho e incomum, não lhe parece?"],
                correctas: ["...prepara-se para o introduzir num vaso que segura com a outra mão. Estranho e incomum, não lhe parece?"],
                multiple: true
            },
            {
                reto: 32,
                id: "R32-Av1-pt",
                tipo: "opcion-multiple",
                pregunta: "32. No centro: O homem barbudo e o leão:",
                opciones: ["Cena original e contraditória na qual o manso é precisamente o leão e não o velho barbudo."],
                correctas: ["Cena original e contraditória na qual o manso é precisamente o leão e não o velho barbudo."],
                multiple: true
            },
            {
                reto: 33,
                id: "R33-Av1-pt",
                tipo: "opcion-multiple",
                pregunta: "33. Aqui vai um desafio extra! Procure o fornicador da Lonja da Seda!",
                opciones: ["Numa das suas janelas, encontrará um homem esculpido; a sua cabeça não é visível mas os seus genitais estão, muito claramente."],
                correctas: ["Numa das suas janelas, encontrará um homem esculpido; a sua cabeça não é visível mas os seus genitais estão, muito claramente."],
                multiple: true
            },
            {
                reto: 34,
                id: "R34-Av1-pt",
                tipo: "opcion",
                pregunta: "34. O que a figura segura nas mãos?",
                opciones: ["Um escudo", "Uma concha", "Um jarro", "Uma espada"],
                correctas: ["Uma concha"],
                multiple: false
            },
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            },
        ],
        ru: [
            // Array de retos Aventura1 RUSO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av1-ru",
                tipo: "opcion",
                pregunta: "1. Сколько приключений можно совершить с Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av1-ru",
                tipo: "opcion",
                pregunta: "2. Сейчас хороший момент для начала приключения?",
                opciones: ["Да", "Нет"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av1-ru",
                tipo: "opcion",
                pregunta: "3. Вы можете назвать мне, как называются эти башни?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av1-ru",
                tipo: "opcion",
                pregunta: "4. На вершине башен развевается флаг Валенсии: его цвета — красный, жёлтый и…?",
                opciones: ["Фиолетовый", "Зелёный", "Синий"],
                correctas: ["Синий"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av1-ru",
                tipo: "texto",
                pregunta: "5. Вы можете назвать мне название этой улицы?",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-Av1-ru",
                tipo: "opcion",
                pregunta: "6. Что держит святой Лаврентий в руке?",
                opciones: ["Голубь", "Ложка", "Решётка"],
                correctas: ["Решётка"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av1-ru",
                tipo: "opcion",
                pregunta: "7. Какой рукой Нептун держит рог изобилия?",
                opciones: ["Левой", "Правой"],
                correctas: ["Правой"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av1-ru",
                tipo: "texto",
                pregunta: "8. Сколько фигур окружают фонтан?",
                correctas: ["8"]
            },
            {
                reto: 9,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 10,
                id: "R10-Av1-ru",
                tipo: "opcion",
                pregunta: "10. Какую скульптурную фигуру можно увидеть в раме картины?",
                opciones: ["Дракон", "Летучая мышь", "Корона"],
                correctas: ["Корона"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av1-ru",
                tipo: "opcion-multiple",
                pregunta: "11. Что можно увидеть внутри?",
                opciones: ["Алтарь", "Флаг", "Меч"],
                correctas: ["Алтарь", "Флаг"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av1-ru",
                tipo: "texto",
                pregunta: "12. На нём есть памятная табличка. В каком году она была установлена?",
                correctas: ["1952"]
            },
            {
                reto: 13,
                id: "R13-Av1-ru",
                tipo: "texto",
                pregunta: "13. В каком году было построено это здание? Подсказка: посмотрите на верхнюю часть фасада.",
                correctas: ["1906"]
            },
            {
                reto: 14,
                id: "R14-Av1-ru",
                tipo: "opcion",
                pregunta: "14. Что можно увидеть внутри?",
                opciones: ["Арена для боя быков", "Римские бани", "Станция метро"],
                correctas: ["Римские бани"],
                multiple: false
            },
            {
                reto: 15,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 16,
                id: "R16-Av1-ru",
                tipo: "opcion",
                pregunta: "16. Можете ли вы определить его геометрическую форму?",
                opciones: ["Шестиугольная", "Восьмиугольная", "Четырёхугольная"],
                correctas: ["Шестиугольная"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av1-ru",
                tipo: "texto",
                pregunta: "17. Из скольких арок состоят ворота?",
                correctas: ["6"]
            },
            {
                reto: 18,
                id: "R18-Av1-ru",
                tipo: "opcion",
                pregunta: "18. Помните ли вы, какое животное венчает городской герб?",
                opciones: ["Дракон", "Летучая мышь", "Конь"],
                correctas: ["Летучая мышь"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av1-ru",
                tipo: "opcion",
                pregunta: "19. Обратите внимание на фасад первой башни! Какой цитрусовый плод, родом из Валенсии, украшает фасад?",
                opciones: ["Лимоны", "Грейпфруты", "Апельсины"],
                correctas: ["Апельсины"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-03",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-03"
            },
            {
                reto: 21,
                id: "R21-Av1-ru",
                tipo: "texto",
                pregunta: "21. Вы можете сказать мне, какое заведение находится в этом здании?",
                correctas: ["?"]
            },
            {
                reto: 22,
                id: "R22-Av1-ru",
                tipo: "opcion-multiple",
                pregunta: "22. Над главным входом, в полуциркульной арке, аллегорические фигуры представляют пять континентов. Что держит центральная фигура?",
                opciones: ["Факел", "Меч", "Корона"],
                correctas: ["Факел", "Меч"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av1-ru",
                tipo: "opcion",
                pregunta: "23. Что держит фигура в своей руке?",
                opciones: ["Весы", "Книга", "Перо"],
                correctas: ["Весы"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av1-ru",
                tipo: "texto",
                pregunta: "24. Сколько этажей в здании?",
                correctas: ["10"]
            },
            {
                reto: 25,
                id: "R25-Av1-ru",
                tipo: "opcion",
                pregunta: "25. Найдите витраж с цветами валенсийской Сеньеры на фасаде здания. Можете ли вы определить его форму?",
                opciones: ["Четырёхугольная", "Круглая", "Треугольная"],
                correctas: ["Круглая"],
                multiple: false
            },
            {
                reto: 26,
                id: "R26-Av1-ru",
                tipo: "opcion-multiple",
                pregunta: "26. Что держит Дева Мария в своей руке?",
                opciones: ["Чётки", "Ребёнок", "Корона"],
                correctas: ["Чётки", "Ребёнок"],
                multiple: true
            },
            {
                reto: 27,
                id: "R27-Av1-ru",
                tipo: "opcion",
                pregunta: "27. Что даёт ангел ребёнку?",
                opciones: ["Голубь", "Держава", "Еда"],
                correctas: ["Держава"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 29,
                id: "R29-Av1-ru",
                tipo: "opcion-multiple",
                pregunta: "29. Лодочник, гребущий против течения.",
                opciones: ["Грустный мужчина, управляющий маленькой деревянной лодкой, спасается от монстра, плывя против течения."],
                correctas: ["Грустный мужчина, управляющий маленькой деревянной лодкой, спасается от монстра, плывя против течения."],
                multiple: true
            },
            {
                reto: 30,
                id: "R30-Av1-ru",
                tipo: "opcion-multiple",
                pregunta: "30. Мёртвое дерево: символ Греха, видно между двумя створками двери и служит средником.",
                opciones: ["Посмотрите на вершину дерева, где 4 обнажённых мужчины хлещут друг друга."],
                correctas: ["Посмотрите на вершину дерева, где 4 обнажённых мужчины хлещут друг друга."],
                multiple: true
            },
            {
                reto: 31,
                id: "R31-Av1-ru",
                tipo: "opcion-multiple",
                pregunta: "31. Справа, ангел демонстрирует свой пенис и...",
                opciones: ["...собирается ввести его в вазу, которую держит другой рукой. Странно и необычно, не правда ли?"],
                correctas: ["...собирается ввести его в вазу, которую держит другой рукой. Странно и необычно, не правда ли?"],
                multiple: true
            },
            {
                reto: 32,
                id: "R32-Av1-ru",
                tipo: "opcion-multiple",
                pregunta: "32. В центре: Бородатый мужчина и лев:",
                opciones: ["Оригинальная и противоречивая сцена, в которой кротким оказывается именно лев, а не бородатый старец."],
                correctas: ["Оригинальная и противоречивая сцена, в которой кротким оказывается именно лев, а не бородатый старец."],
                multiple: true
            },
            {
                reto: 33,
                id: "R33-Av1-ru",
                tipo: "opcion-multiple",
                pregunta: "33. Вот дополнительное испытание! Найдите блудника Шёлковой биржи!",
                opciones: ["В одном из её окон вы найдёте высеченного мужчину; его голова не видна, но гениталии видны очень отчётливо."],
                correctas: ["В одном из её окон вы найдёте высеченного мужчину; его голова не видна, но гениталии видны очень отчётливо."],
                multiple: true
            },
            {
                reto: 34,
                id: "R34-Av1-ru",
                tipo: "opcion",
                pregunta: "34. Что держит фигура в руках?",
                opciones: ["Щит", "Раковину", "Кувшин", "Меч"],
                correctas: ["Раковину"],
                multiple: false
            },
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            },
        ],
        uk: [
            // Array de retos Aventura1 UCRANIANO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av1-uk",
                tipo: "opcion",
                pregunta: "1. Скільки пригод можна здійснити з Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av1-uk",
                tipo: "opcion",
                pregunta: "2. Чи зараз гарний момент для початку пригоди?",
                opciones: ["Так", "Ні"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av1-uk",
                tipo: "opcion",
                pregunta: "3. Чи можете ви сказати мені, як називаються ці вежі?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av1-uk",
                tipo: "opcion",
                pregunta: "4. На вершині веж майорить прапор Валенсії: його кольори — червоний, жовтий і…?",
                opciones: ["Фіолетовий", "Зелений", "Синій"],
                correctas: ["Синій"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av1-uk",
                tipo: "texto",
                pregunta: "5. Чи можете ви назвати мені назву цієї вулиці?",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-Av1-uk",
                tipo: "opcion",
                pregunta: "6. Що тримає святий Лаврентій у руці?",
                opciones: ["Голуб", "Ложка", "Решітка"],
                correctas: ["Решітка"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av1-uk",
                tipo: "opcion",
                pregunta: "7. Якою рукою Нептун тримає ріг достатку?",
                opciones: ["Лівою", "Правою"],
                correctas: ["Правою"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av1-uk",
                tipo: "texto",
                pregunta: "8. Скільки фігур оточує фонтан?",
                correctas: ["8"]
            },
            {
                reto: 9,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 10,
                id: "R10-Av1-uk",
                tipo: "opcion",
                pregunta: "10. Яку скульптурну фігуру можна побачити в рамі картини?",
                opciones: ["Дракон", "Кажан", "Корона"],
                correctas: ["Корона"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av1-uk",
                tipo: "opcion-multiple",
                pregunta: "11. Що можна побачити всередині?",
                opciones: ["Вівтар", "Прапор", "Меч"],
                correctas: ["Вівтар", "Прапор"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av1-uk",
                tipo: "texto",
                pregunta: "12. На ньому є меморіальна табличка. В якому році вона була встановлена?",
                correctas: ["1952"]
            },
            {
                reto: 13,
                id: "R13-Av1-uk",
                tipo: "texto",
                pregunta: "13. В якому році було збудовано цю будівлю? Підказка: подивіться на верхню частину фасаду.",
                correctas: ["1906"]
            },
            {
                reto: 14,
                id: "R14-Av1-uk",
                tipo: "opcion",
                pregunta: "14. Що можна побачити всередині?",
                opciones: ["Арена для кориди", "Римські лазні", "Станція метро"],
                correctas: ["Римські лазні"],
                multiple: false
            },
            {
                reto: 15,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 16,
                id: "R16-Av1-uk",
                tipo: "opcion",
                pregunta: "16. Чи можете ви визначити його геометричну форму?",
                opciones: ["Шестикутна", "Восьмикутна", "Чотирикутна"],
                correctas: ["Шестикутна"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av1-uk",
                tipo: "texto",
                pregunta: "17. Зі скількох арок складаються ворота?",
                correctas: ["6"]
            },
            {
                reto: 18,
                id: "R18-Av1-uk",
                tipo: "opcion",
                pregunta: "18. Чи пам'ятаєте ви, яка тварина прикрашає міський герб?",
                opciones: ["Дракон", "Кажан", "Кінь"],
                correctas: ["Кажан"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av1-uk",
                tipo: "opcion",
                pregunta: "19. Зверніть увагу на фасад першої вежі! Який цитрусовий плід, родом з Валенсії, прикрашає фасад?",
                opciones: ["Лимони", "Грейпфрути", "Апельсини"],
                correctas: ["Апельсини"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-03",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-03"
            },
            {
                reto: 21,
                id: "R21-Av1-uk",
                tipo: "texto",
                pregunta: "21. Чи можете ви сказати мені, яке підприємство знаходиться в цій будівлі?",
                correctas: ["?"]
            },
            {
                reto: 22,
                id: "R22-Av1-uk",
                tipo: "opcion-multiple",
                pregunta: "22. Над головним входом, у напівкруглій арці, алегоричні фігури представляють п'ять континентів. Що тримає центральна фігура?",
                opciones: ["Смолоскип", "Меч", "Корона"],
                correctas: ["Смолоскип", "Меч"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av1-uk",
                tipo: "opcion",
                pregunta: "23. Що тримає фігура в своїй руці?",
                opciones: ["Терези", "Книга", "Перо"],
                correctas: ["Терези"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av1-uk",
                tipo: "texto",
                pregunta: "24. Скільки поверхів у будівлі?",
                correctas: ["10"]
            },
            {
                reto: 25,
                id: "R25-Av1-uk",
                tipo: "opcion",
                pregunta: "25. Знайдіть вітраж з кольорами валенсійської Сеньєри на фасаді будівлі. Чи можете ви визначити його форму?",
                opciones: ["Чотирикутна", "Кругла", "Трикутна"],
                correctas: ["Кругла"],
                multiple: false
            },
            {
                reto: 26,
                id: "R26-Av1-uk",
                tipo: "opcion-multiple",
                pregunta: "26. Що тримає Діва Марія у своїй руці?",
                opciones: ["Вервиця", "Дитина", "Корона"],
                correctas: ["Вервиця", "Дитина"],
                multiple: true
            },
            {
                reto: 27,
                id: "R27-Av1-uk",
                tipo: "opcion",
                pregunta: "27. Що дає ангел дитині?",
                opciones: ["Голуб", "Держава", "Їжа"],
                correctas: ["Держава"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 29,
                id: "R29-Av1-uk",
                tipo: "opcion-multiple",
                pregunta: "29. Поромник, що гребе проти течії.",
                opciones: ["Сумний чоловік, який керує невеликим дерев'яним човном, тікає від монстра проти течії."],
                correctas: ["Сумний чоловік, який керує невеликим дерев'яним човном, тікає від монстра проти течії."],
                multiple: true
            },
            {
                reto: 30,
                id: "R30-Av1-uk",
                tipo: "opcion-multiple",
                pregunta: "30. Мертве дерево: символ Гріха, видно між двома стулками дверей і виконує функцію центрального стовпа.",
                opciones: ["Подивіться на вершину дерева, де 4 оголених чоловіки шмагають один одного."],
                correctas: ["Подивіться на вершину дерева, де 4 оголених чоловіки шмагають один одного."],
                multiple: true
            },
            {
                reto: 31,
                id: "R31-Av1-uk",
                tipo: "opcion-multiple",
                pregunta: "31. Праворуч, ангел демонструє свій статевий орган і...",
                opciones: ["...збирається ввести його у вазу, яку тримає іншою рукою. Дивно і незвично, правда?"],
                correctas: ["...збирається ввести його у вазу, яку тримає іншою рукою. Дивно і незвично, правда?"],
                multiple: true
            },
            {
                reto: 32,
                id: "R32-Av1-uk",
                tipo: "opcion-multiple",
                pregunta: "32. У центрі: Бородатий чоловік і лев:",
                opciones: ["Оригінальна і суперечлива сцена, в якій лагідним є саме лев, а не бородатий старий."],
                correctas: ["Оригінальна і суперечлива сцена, в якій лагідним є саме лев, а не бородатий старий."],
                multiple: true
            },
            {
                reto: 33,
                id: "R33-Av1-uk",
                tipo: "opcion-multiple",
                pregunta: "33. Ось додатковий виклик! Знайдіть блудника Шовкової біржі!",
                opciones: ["В одному з її вікон ви знайдете висіченого чоловіка; його голова не видно, але геніталії дуже чітко видно."],
                correctas: ["В одному з її вікон ви знайдете висіченого чоловіка; його голова не видно, але геніталії дуже чітко видно."],
                multiple: true
            },
            {
                reto: 34,
                id: "R34-Av1-uk",
                tipo: "opcion",
                pregunta: "34. Що тримає фігура в руках?",
                opciones: ["Щит", "Мушлю", "Глечик", "Меч"],
                correctas: ["Мушлю"],
                multiple: false
            },
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            },
        ]
    },
    Aventura2: {
        es: [
            // Array de retos Aventura2 ESPAÑOL
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av2-es",
                tipo: "opcion",
                pregunta: "1. ¿Cuántas Aventuras pueden hacerse con Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av2-es",
                tipo: "opcion",
                pregunta: "2. ¿Es buen momento para comenzar su aventura?",
                opciones: ["Sí", "NO"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av2-es",
                tipo: "opcion",
                pregunta: "3. ¿Sabía decirme cómo se llaman estas Torres?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av2-es",
                tipo: "opcion",
                pregunta: "4. ¿En la cumbre de las torres ondea la bandera de Valencia: sus colores se componen de rojo, amarillo y… ?",
                opciones: ["Violeta", "Verde", "Azul"],
                correctas: ["Azul"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av2-es",
                tipo: "opcion",
                pregunta: "5. ¿Cuál de las dos torres creen que es la más nueva la de la plaza o ésta que tiene delante ahora?",
                opciones: ["La más cercana", "La más alejada"],
                correctas: ["La más alejada"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 7,
                id: "R7-Av2-es",
                tipo: "opcion-multiple",
                pregunta: "7. ¿Qué puede verse en este panel cerámico? ¿Son calaveras? ¿Es una cruz? ¿hay también una paloma?",
                opciones: ["Calaveras", "Palomas", "Cruz"],
                correctas: ["Calaveras", "Cruz"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av2-es",
                tipo: "opcion",
                pregunta: "8. ¿Cuántas campanas alberga esta torre? ",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-es",
                tipo: "opcion",
                pregunta: "9. ¿Por qué se pusieron tan altos estos picaportes?",
                opciones: ["Para personas altas", "Para llamar estando encima del caballo", "Para no ser molestados a la hora de la siesta"],
                correctas: ["Para llamar estando encima del caballo"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-es",
                tipo: "opcion",
                pregunta: "10. ¿Qué sujeta la figura con sus manos? ",
                opciones: ["Un escudo", "Una concha", "Una jarra", "Una espada"],
                correctas: ["Una concha"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-es",
                tipo: "opcion",
                pregunta: "11. ¿Qué dirección toma la senda establecida?",
                opciones: ["Norte", "Sur", "Este", "Oeste"],
                correctas: ["Norte"],
                multiple: false
            },
            {
                reto: 12,
                id: "R12-Av2-es",
                tipo: "opcion",
                pregunta: "12. ¿Cuántas Puertas tenía la antigua muralla árabe de Balansiya?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 13,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 14,
                id: "R14-Av2-es",
                tipo: "opcion",
                pregunta: "14. ¿Con qué mano sujeta Neptuno la cornucopia de la abundancia?",
                opciones: ["Izquierda", "Derecha"],
                correctas: ["Derecha"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av2-es",
                tipo: "texto",
                pregunta: "15. ¿Cuántas figuras rodean la fuente?",
                correctas: ["8"]
            },
            {
                reto: 16,
                id: "R16-Av2-es",
                tipo: "opcion",
                pregunta: "16. ¿Sabría determinar qué geometría tiene el Cimborrio de la Catedral de Valencia? ",
                opciones: ["Hexagonal", "Octogonal", "Cuadradrangular"],
                correctas: ["Octogonal"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-es",
                tipo: "opcion",
                pregunta: "17. ¿Sabría determinar qué geometría tiene la Torre del Miguelete de Valencia? ",
                opciones: ["Hexagonal", "Octogonal", "Cuadradrangular"],
                correctas: ["Octogonal"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av2-es",
                tipo: "texto",
                pregunta: "18. ¿Cuantas ventanas puede ver?",
                correctas: ["?"]
            },
            {
                reto: 19,
                id: "R19-Av2-es",
                tipo: "opcion-multiple",
                pregunta: "19. ¿Qué se puede ver a más de 35 metros de altura en lo alto de la portada barroca?",
                opciones: ["Una esfera", "Un murciélago", "Una cruz", "Un caballo"],
                correctas: ["Una esfera", "Una cruz"],
                multiple: true
            },
            {
                reto: 20,
                id: "R20-Av2-es",
                tipo: "opcion",
                pregunta: "20. ¿Que hay en lo más alto de la torre de la torre barroca de Santa Catalina?",
                opciones: ["Una cruz", "El sol", "Una paloma"],
                correctas: ["Una cruz"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av2-es",
                tipo: "texto",
                pregunta: "21. ¿De qué color son las tejas de la cúpula de la Torre barroca Santa Catalina?",
                correctas: ["azules"]
            },
            {
                reto: 22,
                id: "R22-Av2-es",
                tipo: "opcion-multiple",
                pregunta: "22. tres arcos ciegos. Dos de ellos son lisos el tercero se dejó sin enlucir.<br>¿Qué puede verse en ese arco sin enlucir?",
                opciones: ["Un rostro", "Un torso", "Una gárgola"],
                correctas: ["Un rostro", "Un torso"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av2-es",
                tipo: "texto",
                pregunta: "23. ¿Cuánto mide la entrada del edificio estrecho?",
                correctas: ["1,35 metros"]
            },
            {
                reto: 24,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 25,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        en: [
            // Array de retos Aventura2 INGLÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av2-en",
                tipo: "opcion",
                pregunta: "1. How many adventures can be done with Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av2-en",
                tipo: "opcion",
                pregunta: "2. Is it a good time to start your adventure?",
                opciones: ["Yes", "No"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av2-en",
                tipo: "opcion",
                pregunta: "Which of the two towers do you think is newer, the one in the square or the one in front of you now?",
                opciones: ["The closest", "The farthest"],
                correctas: ["The farthest"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av2-en",
                tipo: "opcion",
                pregunta: "4. At the top of the towers flies the flag of Valencia: its colors are red, yellow, and…?",
                opciones: ["Violet", "Green", "Blue"],
                correctas: ["Blue"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av2-en",
                tipo: "opcion",
                pregunta: "3. Can you tell me the names of these towers?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 7,
                id: "R7-Av2-en",
                tipo: "opcion-multiple",
                pregunta: "What can be seen on this ceramic panel? Are they skulls? Is it a cross? Is there also a dove?",
                opciones: ["Skulls", "Doves", "Cross"],
                correctas: ["Skulls", "Cross"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av2-en",
                tipo: "opcion",
                pregunta: "How many bells does this tower have? ",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-en",
                tipo: "opcion",
                pregunta: "Why were these door knockers placed so high?",
                opciones: ["For tall people", "To knock while on horseback", "To avoid being disturbed during siesta"],
                correctas: ["To knock while on horseback"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-en",
                tipo: "opcion",
                pregunta: "What is the figure holding in its hands? ",
                opciones: ["A shield", "A shell", "A jug", "A sword"],
                correctas: ["A shell"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-en",
                tipo: "opcion",
                pregunta: "Which direction does the established path take?",
                opciones: ["North", "South", "East", "West"],
                correctas: ["North"],
                multiple: false
            },
            {
                reto: 12,
                id: "R12-Av2-en",
                tipo: "opcion",
                pregunta: "How many gates did the old Arab wall of Balansiya have?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 13,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 14,
                id: "R14-Av2-en",
                tipo: "opcion",
                pregunta: "With which hand does Neptune hold the cornucopia of abundance?",
                opciones: ["Left", "Right"],
                correctas: ["Right"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av2-en",
                tipo: "texto",
                pregunta: "How many figures surround the fountain?",
                correctas: ["8"]
            },
            {
                reto: 16,
                id: "R16-Av2-en",
                tipo: "opcion",
                pregunta: "Can you determine the geometry of the dome of Valencia Cathedral? ",
                opciones: ["Hexagonal", "Octagonal", "Quadrangular"],
                correctas: ["Octagonal"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-en",
                tipo: "opcion",
                pregunta: "Can you determine the geometry of the Miguelete Tower of Valencia? ",
                opciones: ["Hexagonal", "Octagonal", "Quadrangular"],
                correctas: ["Octagonal"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av2-en",
                tipo: "texto",
                pregunta: "How many windows can you see?",
                correctas: ["?"]
            },
            {
                reto: 19,
                id: "R19-Av2-en",
                tipo: "opcion-multiple",
                pregunta: "What can be seen more than 35 meters high at the top of the baroque façade?",
                opciones: ["A sphere", "A bat", "A cross", "A horse"],
                correctas: ["A sphere", "A cross"],
                multiple: true
            },
            {
                reto: 20,
                id: "R20-Av2-en",
                tipo: "opcion",
                pregunta: "What is at the very top of the baroque tower of Santa Catalina?",
                opciones: ["A cross", "The sun", "A dove"],
                correctas: ["A cross"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av2-en",
                tipo: "texto",
                pregunta: "What color are the tiles of the dome of the baroque tower of Santa Catalina?",
                correctas: ["azules"]
            },
            {
                reto: 22,
                id: "R22-Av2-en",
                tipo: "opcion-multiple",
                pregunta: "Three blind arches. Two of them are smooth, the third was left unplastered.<br>What can be seen in that unplastered arch?",
                opciones: ["A face", "A torso", "A gargoyle"],
                correctas: ["A face", "A torso"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av2-en",
                tipo: "texto",
                pregunta: "How wide is the entrance of the narrow building?",
                correctas: ["1,35 metros"]
            },
            {
                reto: 24,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 25,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        fr: [
            // Array de retos Aventura2 FRANCÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av2-fr",
                tipo: "opcion",
                pregunta: "1. Combien d'aventures peut-on faire avec Valencia be Guides ?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av2-fr",
                tipo: "opcion",
                pregunta: "2. Est-ce le bon moment pour commencer votre aventure ?",
                opciones: ["Oui", "Non"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av2-fr",
                tipo: "opcion",
                pregunta: "3. Pouvez-vous me dire comment s'appellent ces tours ?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av2-fr",
                tipo: "opcion",
                pregunta: "4. Au sommet des tours flotte le drapeau de Valence : ses couleurs sont rouge, jaune et… ?",
                opciones: ["Violet", "Vert", "Bleu"],
                correctas: ["Bleu"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av2-fr",
                tipo: "opcion",
                pregunta: "Laquelle des deux tours pensez-vous être la plus récente, celle de la place ou celle que vous avez devant vous maintenant ?",
                opciones: ["La plus proche", "La plus éloignée"],
                correctas: ["La plus éloignée"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 7,
                id: "R7-Av2-fr",
                tipo: "opcion-multiple",
                pregunta: "Que peut-on voir sur ce panneau en céramique ? Sont-ce des crânes ? Est-ce une croix ? Y a-t-il aussi une colombe ?",
                opciones: ["Crânes", "Colombes", "Croix"],
                correctas: ["Crânes", "Croix"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av2-fr",
                tipo: "opcion",
                pregunta: "Combien de cloches cette tour abrite-t-elle ? ",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-fr",
                tipo: "opcion",
                pregunta: "Pourquoi ces heurtoirs ont-ils été placés si haut ?",
                opciones: ["Pour les personnes grandes", "Pour frapper en étant à cheval", "Pour ne pas être dérangé pendant la sieste"],
                correctas: ["Pour frapper en étant à cheval"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-fr",
                tipo: "opcion",
                pregunta: "Que tient la figure dans ses mains ? ",
                opciones: ["Un bouclier", "Une coquille", "Une cruche", "Une épée"],
                correctas: ["Une coquille"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-fr",
                tipo: "opcion",
                pregunta: "Quelle direction prend le chemin établi ?",
                opciones: ["Nord", "Sud", "Est", "Ouest"],
                correctas: ["Nord"],
                multiple: false
            },
            {
                reto: 12,
                id: "R12-Av2-fr",
                tipo: "opcion",
                pregunta: "Combien de portes possédait l’ancienne muraille arabe de Balansiya ?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 13,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 14,
                id: "R14-Av2-fr",
                tipo: "opcion",
                pregunta: "De quelle main Neptune tient-il la corne d’abondance ?",
                opciones: ["Gauche", "Droite"],
                correctas: ["Droite"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av2-fr",
                tipo: "texto",
                pregunta: "Combien de figures entourent la fontaine ?",
                correctas: ["8"]
            },
            {
                reto: 16,
                id: "R16-Av2-fr",
                tipo: "opcion",
                pregunta: "Sauriez-vous déterminer la géométrie du ciborium de la cathédrale de Valence ? ",
                opciones: ["Hexagonal", "Octogonal", "Quadrangulaire"],
                correctas: ["Octogonal"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-fr",
                tipo: "opcion",
                pregunta: "Sauriez-vous déterminer la géométrie de la tour du Miguelete de Valence ? ",
                opciones: ["Hexagonal", "Octogonal", "Quadrangulaire"],
                correctas: ["Octogonal"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av2-fr",
                tipo: "texto",
                pregunta: "Combien de fenêtres pouvez-vous voir ?",
                correctas: ["?"]
            },
            {
                reto: 19,
                id: "R19-Av2-fr",
                tipo: "opcion-multiple",
                pregunta: "Que peut-on voir à plus de 35 mètres de hauteur au sommet de la façade baroque ?",
                opciones: ["Une sphère", "Une chauve-souris", "Une croix", "Un cheval"],
                correctas: ["Une sphère", "Une croix"],
                multiple: true
            },
            {
                reto: 20,
                id: "R20-Av2-fr",
                tipo: "opcion",
                pregunta: "Que trouve-t-on tout en haut de la tour baroque de Santa Catalina ?",
                opciones: ["Une croix", "Le soleil", "Une colombe"],
                correctas: ["Une croix"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av2-fr",
                tipo: "texto",
                pregunta: "De quelle couleur sont les tuiles du dôme de la tour baroque de Santa Catalina ?",
                correctas: ["azules"]
            },
            {
                reto: 22,
                id: "R22-Av2-fr",
                tipo: "opcion-multiple",
                pregunta: "Trois arcs aveugles. Deux d’entre eux sont lisses, le troisième a été laissé sans enduit.<br>Que peut-on voir dans cet arc sans enduit ?",
                opciones: ["Un visage", "Un torse", "Une gargouille"],
                correctas: ["Un visage", "Un torse"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av2-fr",
                tipo: "texto",
                pregunta: "Quelle est la largeur de l’entrée du bâtiment étroit ?",
                correctas: ["1,35 metros"]
            },
            {
                reto: 24,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 25,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        it: [
            // Array de retos Aventura2 ITALIANO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av2-it",
                tipo: "opcion",
                pregunta: "1. Quante avventure si possono fare con Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av2-it",
                tipo: "opcion",
                pregunta: "2. È un buon momento per iniziare la tua avventura?",
                opciones: ["Sì", "No"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av2-it",
                tipo: "opcion",
                pregunta: "3. Puoi dirmi come si chiamano queste torri?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre di Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av2-it",
                tipo: "opcion",
                pregunta: "4. In cima alle torri sventola la bandiera di Valencia: i suoi colori sono rosso, giallo e…?",
                opciones: ["Viola", "Verde", "Blu"],
                correctas: ["Blu"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av2-it",
                tipo: "opcion",
                pregunta: "Quale delle due torri pensate sia più nuova, quella in piazza o quella davanti a voi ora?",
                opciones: ["La più vicina", "La più lontana"],
                correctas: ["La più lontana"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 7,
                id: "R7-Av2-it",
                tipo: "opcion-multiple",
                pregunta: "Cosa si può vedere su questo pannello in ceramica? Sono teschi? È una croce? C’è anche una colomba?",
                opciones: ["Teschi", "Colombe", "Croce"],
                correctas: ["Teschi", "Croce"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av2-it",
                tipo: "opcion",
                pregunta: "Quante campane ospita questa torre? ",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-it",
                tipo: "opcion",
                pregunta: "Perché questi battenti sono stati posti così in alto?",
                opciones: ["Per persone alte", "Per suonare da cavallo", "Per non essere disturbati durante il pisolino"],
                correctas: ["Per suonare da cavallo"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-it",
                tipo: "opcion",
                pregunta: "Cosa tiene la figura tra le mani? ",
                opciones: ["Uno scudo", "Una conchiglia", "Una brocca", "Una spada"],
                correctas: ["Una conchiglia"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-it",
                tipo: "opcion",
                pregunta: "In quale direzione procede il sentiero stabilito?",
                opciones: ["Nord", "Sud", "Est", "Ovest"],
                correctas: ["Nord"],
                multiple: false
            },
            {
                reto: 12,
                id: "R12-Av2-it",
                tipo: "opcion",
                pregunta: "Quante porte aveva l’antica muraglia araba di Balansiya?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 13,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 14,
                id: "R14-Av2-it",
                tipo: "opcion",
                pregunta: "Con quale mano Nettuno tiene la cornucopia dell’abbondanza?",
                opciones: ["Sinistra", "Destra"],
                correctas: ["Destra"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av2-it",
                tipo: "texto",
                pregunta: "Quante figure circondano la fontana?",
                correctas: ["8"]
            },
            {
                reto: 16,
                id: "R16-Av2-it",
                tipo: "opcion",
                pregunta: "Riuscirebbe a determinare la geometria del ciborio della Cattedrale di Valencia? ",
                opciones: ["Esagonale", "Ottagonale", "Quadrangolare"],
                correctas: ["Ottagonale"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-it",
                tipo: "opcion",
                pregunta: "Riuscirebbe a determinare la geometria della Torre del Miguelete di Valencia? ",
                opciones: ["Esagonale", "Ottagonale", "Quadrangolare"],
                correctas: ["Ottagonale"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av2-it",
                tipo: "texto",
                pregunta: "Quante finestre riesci a vedere?",
                correctas: ["?"]
            },
            {
                reto: 19,
                id: "R19-Av2-it",
                tipo: "opcion-multiple",
                pregunta: "Cosa si può vedere a più di 35 metri di altezza in cima alla facciata barocca?",
                opciones: ["Una sfera", "Un pipistrello", "Una croce", "Un cavallo"],
                correctas: ["Una sfera", "Una croce"],
                multiple: true
            },
            {
                reto: 20,
                id: "R20-Av2-it",
                tipo: "opcion",
                pregunta: "Cosa c’è in cima alla torre barocca di Santa Catalina?",
                opciones: ["Una croce", "Il sole", "Una colomba"],
                correctas: ["Una croce"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av2-it",
                tipo: "texto",
                pregunta: "Di che colore sono le tegole della cupola della torre barocca di Santa Catalina?",
                correctas: ["azules"]
            },
            {
                reto: 22,
                id: "R22-Av2-it",
                tipo: "opcion-multiple",
                pregunta: "Tre archi ciechi. Due di essi sono lisci, il terzo è rimasto senza intonaco.<br>Cosa si può vedere in quell’arco non intonacato?",
                opciones: ["Un volto", "Un torso", "Un gargoyle"],
                correctas: ["Un volto", "Un torso"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av2-it",
                tipo: "texto",
                pregunta: "Quanto è larga l’entrata dell’edificio stretto?",
                correctas: ["1,35 metros"]
            },
            {
                reto: 24,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 25,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        nl: [
            // Array de retos Aventura2 HOLANDÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av2-nl",
                tipo: "opcion",
                pregunta: "1. Hoeveel avonturen kun je doen met València be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av2-nl",
                tipo: "opcion",
                pregunta: "2. Is het een goed moment om je avontuur te beginnen?",
                opciones: ["Ja", "Nee"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av2-nl",
                tipo: "opcion",
                pregunta: "3. Kunt u mij de namen van deze torens vertellen?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av2-nl",
                tipo: "opcion",
                pregunta: "4. Op de top van de torens wappert de vlag van Valencia: de kleuren zijn rood, geel en…?",
                opciones: ["Paars", "Groen", "Blauw"],
                correctas: ["Blauw"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av2-nl",
                tipo: "opcion",
                pregunta: "Welke van de twee torens denkt u dat nieuwer is, die op het plein of die nu voor u staat?",
                opciones: ["De dichtstbijzijnde", "De verste"],
                correctas: ["De verste"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 7,
                id: "R7-Av2-nl",
                tipo: "opcion-multiple",
                pregunta: "Wat is er te zien op dit keramische paneel? Zijn het schedels? Is het een kruis? Is er ook een duif?",
                opciones: ["Schedels", "Duiven", "Kruis"],
                correctas: ["Schedels", "Kruis"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av2-nl",
                tipo: "opcion",
                pregunta: "Hoeveel klokken heeft deze toren? ",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-nl",
                tipo: "opcion",
                pregunta: "Waarom zijn deze deurkloppers zo hoog geplaatst?",
                opciones: ["Voor lange mensen", "Om te kloppen te paard", "Om niet gestoord te worden tijdens de siësta"],
                correctas: ["Om te kloppen te paard"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-nl",
                tipo: "opcion",
                pregunta: "Wat houdt het beeld in zijn handen? ",
                opciones: ["Een schild", "Een schelp", "Een kruik", "Een zwaard"],
                correctas: ["Een schelp"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-nl",
                tipo: "opcion",
                pregunta: "Welke richting volgt het aangelegde pad?",
                opciones: ["Noord", "Zuid", "Oost", "West"],
                correctas: ["Noord"],
                multiple: false
            },
            {
                reto: 12,
                id: "R12-Av2-nl",
                tipo: "opcion",
                pregunta: "Hoeveel poorten had de oude Arabische muur van Balansiya?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 13,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 14,
                id: "R14-Av2-nl",
                tipo: "opcion",
                pregunta: "Met welke hand houdt Neptunus de hoorn des overvloeds vast?",
                opciones: ["Links", "Rechts"],
                correctas: ["Rechts"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av2-nl",
                tipo: "texto",
                pregunta: "Hoeveel figuren omringen de fontein?",
                correctas: ["8"]
            },
            {
                reto: 16,
                id: "R16-Av2-nl",
                tipo: "opcion",
                pregunta: "Kunt u de geometrie van het koepeltje van de kathedraal van Valencia bepalen? ",
                opciones: ["Hexagonaal", "Octogonaal", "Vierkant"],
                correctas: ["Octogonaal"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-nl",
                tipo: "opcion",
                pregunta: "Kunt u de geometrie van de Miguelete-toren van Valencia bepalen? ",
                opciones: ["Hexagonaal", "Octogonaal", "Vierkant"],
                correctas: ["Octogonaal"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av2-nl",
                tipo: "texto",
                pregunta: "Hoeveel ramen kunt u zien?",
                correctas: ["?"]
            },
            {
                reto: 19,
                id: "R19-Av2-nl",
                tipo: "opcion-multiple",
                pregunta: "Wat is er meer dan 35 meter hoog te zien bovenaan de barokke gevel?",
                opciones: ["Een bol", "Een vleermuis", "Een kruis", "Een paard"],
                correctas: ["Een bol", "Een kruis"],
                multiple: true
            },
            {
                reto: 20,
                id: "R20-Av2-nl",
                tipo: "opcion",
                pregunta: "Wat bevindt zich bovenaan de barokke toren van Santa Catalina?",
                opciones: ["Een kruis", "De zon", "Een duif"],
                correctas: ["Een kruis"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av2-nl",
                tipo: "texto",
                pregunta: "Welke kleur hebben de tegels van de koepel van de barokke toren van Santa Catalina?",
                correctas: ["azules"]
            },
            {
                reto: 22,
                id: "R22-Av2-nl",
                tipo: "opcion-multiple",
                pregunta: "Drie blinde bogen. Twee zijn glad, de derde is niet gepleisterd gebleven.<br>Wat is er te zien in die niet gepleisterde boog?",
                opciones: ["Een gezicht", "Een torso", "Een waterspuwer"],
                correctas: ["Een gezicht", "Een torso"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av2-nl",
                tipo: "texto",
                pregunta: "Hoe breed is de ingang van het smalle gebouw?",
                correctas: ["1,35 metros"]
            },
            {
                reto: 24,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 25,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        ja: [
            // Array de retos Aventura2 JAPONÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av2-ja",
                tipo: "opcion",
                pregunta: "1. Valencia be Guides ではいくつのアドベンチャーが体験できますか？",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av2-ja",
                tipo: "opcion",
                pregunta: "2. 今は冒険を始めるのに良いタイミングですか？",
                opciones: ["はい", "いいえ"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av2-ja",
                tipo: "opcion",
                pregunta: "3. これらの塔の名前を教えてもらえますか？",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av2-ja",
                tipo: "opcion",
                pregunta: "4. 塔の頂上にはバレンシアの旗がはためいています。色は赤、黄、そして…？",
                opciones: ["紫", "緑", "青"],
                correctas: ["青"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av2-ja",
                tipo: "opcion",
                pregunta: "二つの塔のうち、どちらが新しいと思いますか？広場の塔、それとも今目の前にある塔ですか？",
                opciones: ["一番近い塔", "一番遠い塔"],
                correctas: ["一番遠い塔"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 7,
                id: "R7-Av2-ja",
                tipo: "opcion-multiple",
                pregunta: "この陶器のパネルには何が見えますか？骸骨ですか？十字架ですか？鳩もいますか？",
                opciones: ["骸骨", "鳩", "十字架"],
                correctas: ["骸骨", "十字架"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av2-ja",
                tipo: "opcion",
                pregunta: "この塔にはいくつの鐘がありますか？",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-ja",
                tipo: "opcion",
                pregunta: "なぜこのドアノッカーはこんなに高い位置にあるのですか？",
                opciones: ["背の高い人のため", "馬に乗って鳴らすため", "昼寝の時間に邪魔されないため"],
                correctas: ["馬に乗って鳴らすため"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-ja",
                tipo: "opcion",
                pregunta: "像は何を手に持っていますか？",
                opciones: ["盾", "貝殻", "壺", "剣"],
                correctas: ["貝殻"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-ja",
                tipo: "opcion",
                pregunta: "設けられた道はどの方向に向かっていますか？",
                opciones: ["北", "南", "東", "西"],
                correctas: ["北"],
                multiple: false
            },
            {
                reto: 12,
                id: "R12-Av2-ja",
                tipo: "opcion",
                pregunta: "古代バレンシアのアラブの城壁にはいくつの門がありましたか？",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 13,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 14,
                id: "R14-Av2-ja",
                tipo: "opcion",
                pregunta: "ネプチューンはどちらの手で豊穣の角を持っていますか？",
                opciones: ["左手", "右手"],
                correctas: ["右手"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av2-ja",
                tipo: "texto",
                pregunta: "噴水の周りにはいくつの像がありますか？",
                correctas: ["8"]
            },
            {
                reto: 16,
                id: "R16-Av2-ja",
                tipo: "opcion",
                pregunta: "バレンシア大聖堂のキンボリウムの形状は何ですか？",
                opciones: ["六角形", "八角形", "四角形"],
                correctas: ["八角形"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-ja",
                tipo: "opcion",
                pregunta: "バレンシアのミゲレット塔の形状は何ですか？",
                opciones: ["六角形", "八角形", "四角形"],
                correctas: ["八角形"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av2-ja",
                tipo: "texto",
                pregunta: "いくつの窓が見えますか？",
                correctas: ["?"]
            },
            {
                reto: 19,
                id: "R19-Av2-ja",
                tipo: "opcion-multiple",
                pregunta: "バロック様式の正面の頂上、高さ35メートル以上で何が見えますか？",
                opciones: ["球体", "コウモリ", "十字架", "馬"],
                correctas: ["球体", "十字架"],
                multiple: true
            },
            {
                reto: 20,
                id: "R20-Av2-ja",
                tipo: "opcion",
                pregunta: "サンタカタリナのバロック塔の最上部には何がありますか？",
                opciones: ["十字架", "太陽", "鳩"],
                correctas: ["十字架"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av2-ja",
                tipo: "texto",
                pregunta: "サンタカタリナのバロック塔のドームの瓦の色は何ですか？",
                correctas: ["azules"]
            },
            {
                reto: 22,
                id: "R22-Av2-ja",
                tipo: "opcion-multiple",
                pregunta: "三つの盲アーチがあります。二つは滑らかで、三つ目は漆喰が塗られていません。<br>漆喰が塗られていないアーチには何が見えますか？",
                opciones: ["顔", "胴体", "ガーゴイル"],
                correctas: ["顔", "胴体"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av2-ja",
                tipo: "texto",
                pregunta: "狭い建物の入り口の幅はどれくらいですか？",
                correctas: ["1,35 metros"]
            },
            {
                reto: 24,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 25,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        de: [
            // Array de retos Aventura2 ALEMÁN
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av2-de",
                tipo: "opcion",
                pregunta: "1. Wie viele Abenteuer können mit Valencia be Guides unternommen werden?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av2-de",
                tipo: "opcion",
                pregunta: "2. Ist es ein guter Zeitpunkt, Ihr Abenteuer zu beginnen?",
                opciones: ["Ja", "Nein"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av2-de",
                tipo: "opcion",
                pregunta: "3. Können Sie mir sagen, wie diese Türme heißen?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av2-de",
                tipo: "opcion",
                pregunta: "4. Auf dem Gipfel der Türme weht die Flagge von Valencia: Ihre Farben sind Rot, Gelb und…?",
                opciones: ["Violett", "Grün", "Blau"],
                correctas: ["Blau"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av2-de",
                tipo: "opcion",
                pregunta: "5. Welcher der beiden Türme ist Ihrer Meinung nach neuer, der auf dem Platz oder der vor Ihnen?",
                opciones: ["Der nächste", "Der entfernteste"],
                correctas: ["Der entfernteste"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 7,
                id: "R7-Av2-de",
                tipo: "opcion-multiple",
                pregunta: "7. Was ist auf diesem Keramikpaneel zu sehen? Sind es Schädel? Ist es ein Kreuz? Gibt es auch eine Taube?",
                opciones: ["Schädel", "Tauben", "Kreuz"],
                correctas: ["Schädel", "Kreuz"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av2-de",
                tipo: "opcion",
                pregunta: "8. Wie viele Glocken beherbergt dieser Turm?",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-de",
                tipo: "opcion",
                pregunta: "9. Warum wurden diese Türklopfer so hoch angebracht?",
                opciones: ["Für große Menschen", "Um zu klopfen, wenn man auf dem Pferd sitzt", "Um während der Siesta nicht gestört zu werden"],
                correctas: ["Um zu klopfen, wenn man auf dem Pferd sitzt"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-de",
                tipo: "opcion",
                pregunta: "10. Was hält die Figur in ihren Händen?",
                opciones: ["Ein Schild", "Eine Muschel", "Ein Krug", "Ein Schwert"],
                correctas: ["Eine Muschel"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-de",
                tipo: "opcion",
                pregunta: "11. In welche Richtung verläuft der festgelegte Weg?",
                opciones: ["Norden", "Süden", "Osten", "Westen"],
                correctas: ["Norden"],
                multiple: false
            },
            {
                reto: 12,
                id: "R12-Av2-de",
                tipo: "opcion",
                pregunta: "12. Wie viele Tore hatte die alte arabische Mauer von Balansiya?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 13,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 14,
                id: "R14-Av2-de",
                tipo: "opcion",
                pregunta: "14. Mit welcher Hand hält Neptun das Füllhorn der Fülle?",
                opciones: ["Links", "Rechts"],
                correctas: ["Rechts"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av2-de",
                tipo: "texto",
                pregunta: "15. Wie viele Figuren umgeben den Brunnen?",
                correctas: ["8"]
            },
            {
                reto: 16,
                id: "R16-Av2-de",
                tipo: "opcion",
                pregunta: "16. Können Sie die Geometrie des Cimborios der Kathedrale von Valencia bestimmen?",
                opciones: ["Hexagonal", "Oktagonal", "Viereckig"],
                correctas: ["Oktagonal"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-de",
                tipo: "opcion",
                pregunta: "17. Können Sie die Geometrie des Miguelete-Turms von Valencia bestimmen?",
                opciones: ["Hexagonal", "Oktagonal", "Viereckig"],
                correctas: ["Oktagonal"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av2-de",
                tipo: "texto",
                pregunta: "18. Wie viele Fenster können Sie sehen?",
                correctas: ["?"]
            },
            {
                reto: 19,
                id: "R19-Av2-de",
                tipo: "opcion-multiple",
                pregunta: "19. Was ist mehr als 35 Meter hoch oben an der Barockfassade zu sehen?",
                opciones: ["Eine Kugel", "Eine Fledermaus", "Ein Kreuz", "Ein Pferd"],
                correctas: ["Eine Kugel", "Ein Kreuz"],
                multiple: true
            },
            {
                reto: 20,
                id: "R20-Av2-de",
                tipo: "opcion",
                pregunta: "20. Was befindet sich ganz oben am Barockturm von Santa Catalina?",
                opciones: ["Ein Kreuz", "Die Sonne", "Eine Taube"],
                correctas: ["Ein Kreuz"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av2-de",
                tipo: "texto",
                pregunta: "21. Welche Farbe haben die Dachziegel der Kuppel des Barockturms von Santa Catalina?",
                correctas: ["azules"]
            },
            {
                reto: 22,
                id: "R22-Av2-de",
                tipo: "opcion-multiple",
                pregunta: "22. Drei Blendbögen. Zwei davon sind glatt, der dritte wurde ohne Verputz gelassen.<br>Was ist in diesem unvergipsten Bogen zu sehen?",
                opciones: ["Ein Gesicht", "Ein Torso", "Ein Wasserspeier"],
                correctas: ["Ein Gesicht", "Ein Torso"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av2-de",
                tipo: "texto",
                pregunta: "23. Wie breit ist der Eingang des schmalen Gebäudes?",
                correctas: ["1,35 metros"]
            },
            {
                reto: 24,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 25,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        zh: [
            // Array de retos Aventura2 CHINO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av2-zh",
                tipo: "opcion",
                pregunta: "1. 使用Valencia be Guides可以进行多少次冒险？",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av2-zh",
                tipo: "opcion",
                pregunta: "2. 现在是开始您的冒险的好时机吗？",
                opciones: ["是", "否"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av2-zh",
                tipo: "opcion",
                pregunta: "3. 您能告诉我这些塔叫什么名字吗？",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av2-zh",
                tipo: "opcion",
                pregunta: "4. 塔楼顶部飘扬着巴伦西亚的旗帜，颜色由红色、黄色和……组成？",
                opciones: ["紫色", "绿色", "蓝色"],
                correctas: ["蓝色"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av2-zh",
                tipo: "opcion",
                pregunta: "5. 您认为这两座塔中哪座更新，广场上的那座还是您现在面前的这座？",
                opciones: ["最近的", "最远的"],
                correctas: ["最远的"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 7,
                id: "R7-Av2-zh",
                tipo: "opcion-multiple",
                pregunta: "7. 这块陶瓷板上能看到什么？是骷髅吗？是十字架吗？还有鸽子吗？",
                opciones: ["骷髅", "鸽子", "十字架"],
                correctas: ["骷髅", "十字架"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av2-zh",
                tipo: "opcion",
                pregunta: "8. 这座塔里有多少口钟？",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-zh",
                tipo: "opcion",
                pregunta: "9. 为什么这些门环被放得这么高？",
                opciones: ["为了高个子人", "为了骑马时敲门", "为了不在午睡时间被打扰"],
                correctas: ["为了骑马时敲门"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-zh",
                tipo: "opcion",
                pregunta: "10. 这个雕像的手里拿着什么？",
                opciones: ["盾牌", "贝壳", "水罐", "宝剑"],
                correctas: ["贝壳"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-zh",
                tipo: "opcion",
                pregunta: "11. 既定的道路朝哪个方向走？",
                opciones: ["北", "南", "东", "西"],
                correctas: ["北"],
                multiple: false
            },
            {
                reto: 12,
                id: "R12-Av2-zh",
                tipo: "opcion",
                pregunta: "12. 古代巴伦西亚阿拉伯城墙有几座城门？",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 13,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 14,
                id: "R14-Av2-zh",
                tipo: "opcion",
                pregunta: "14. 海神尼普顿用哪只手拿着丰饶角？",
                opciones: ["左手", "右手"],
                correctas: ["右手"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av2-zh",
                tipo: "texto",
                pregunta: "15. 喷泉周围有多少个雕像？",
                correctas: ["8"]
            },
            {
                reto: 16,
                id: "R16-Av2-zh",
                tipo: "opcion",
                pregunta: "16. 您能确定巴伦西亚大教堂穹顶的几何形状吗？",
                opciones: ["六边形", "八边形", "四边形"],
                correctas: ["八边形"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-zh",
                tipo: "opcion",
                pregunta: "17. 您能确定巴伦西亚米格莱特塔的几何形状吗？",
                opciones: ["六边形", "八边形", "四边形"],
                correctas: ["八边形"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av2-zh",
                tipo: "texto",
                pregunta: "18. 您能看到多少扇窗户？",
                correctas: ["?"]
            },
            {
                reto: 19,
                id: "R19-Av2-zh",
                tipo: "opcion-multiple",
                pregunta: "19. 在巴洛克式正门顶端35米以上能看到什么？",
                opciones: ["一个球体", "一只蝙蝠", "一个十字架", "一匹马"],
                correctas: ["一个球体", "一个十字架"],
                multiple: true
            },
            {
                reto: 20,
                id: "R20-Av2-zh",
                tipo: "opcion",
                pregunta: "20. 圣卡塔利娜巴洛克塔的最顶端有什么？",
                opciones: ["一个十字架", "太阳", "一只鸽子"],
                correctas: ["一个十字架"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av2-zh",
                tipo: "texto",
                pregunta: "21. 圣卡塔利娜巴洛克塔穹顶的瓦片是什么颜色？",
                correctas: ["azules"]
            },
            {
                reto: 22,
                id: "R22-Av2-zh",
                tipo: "opcion-multiple",
                pregunta: "22. 三个盲拱。其中两个是光滑的，第三个未经粉刷。<br>在这个未粉刷的拱门里能看到什么？",
                opciones: ["一张脸", "一个躯干", "一个滴水兽"],
                correctas: ["一张脸", "一个躯干"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av2-zh",
                tipo: "texto",
                pregunta: "23. 这座狭窄建筑入口有多宽？",
                correctas: ["1,35 metros"]
            },
            {
                reto: 24,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 25,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        pl: [
            // Array de retos Aventura2 POLACO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av2-pl",
                tipo: "opcion",
                pregunta: "1. Ile przygód można przeżyć z Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av2-pl",
                tipo: "opcion",
                pregunta: "2. Czy to dobry moment, aby rozpocząć swoją przygodę?",
                opciones: ["Tak", "Nie"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av2-pl",
                tipo: "opcion",
                pregunta: "3. Czy potrafi mi powiedzieć, jak nazywają się te wieże?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av2-pl",
                tipo: "opcion",
                pregunta: "4. Na szczycie wież powiewa flaga Walencji: jej kolory to czerwony, żółty i…?",
                opciones: ["Fioletowy", "Zielony", "Niebieski"],
                correctas: ["Niebieski"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av2-pl",
                tipo: "opcion",
                pregunta: "5. Która z dwóch wież jest według Ciebie nowsza, ta na placu czy ta stojąca przed Tobą teraz?",
                opciones: ["Bliższa", "Dalsza"],
                correctas: ["Dalsza"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 7,
                id: "R7-Av2-pl",
                tipo: "opcion-multiple",
                pregunta: "7. Co można zobaczyć na tym ceramicznym panelu? Czy to czaszki? Czy jest krzyż? Czy jest też gołąb?",
                opciones: ["Czaszki", "Gołębie", "Krzyż"],
                correctas: ["Czaszki", "Krzyż"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av2-pl",
                tipo: "opcion",
                pregunta: "8. Ile dzwonów mieści ta wieża?",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-pl",
                tipo: "opcion",
                pregunta: "9. Dlaczego te kołatki zostały umieszczone tak wysoko?",
                opciones: ["Dla wysokich osób", "Aby pukać siedząc na koniu", "Aby nie być niepokojonym podczas sjesty"],
                correctas: ["Aby pukać siedząc na koniu"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-pl",
                tipo: "opcion",
                pregunta: "10. Co trzyma w rękach ta postać?",
                opciones: ["Tarczę", "Muszlę", "Dzban", "Miecz"],
                correctas: ["Muszlę"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-pl",
                tipo: "opcion",
                pregunta: "11. W jakim kierunku przebiega wyznaczona ścieżka?",
                opciones: ["Północ", "Południe", "Wschód", "Zachód"],
                correctas: ["Północ"],
                multiple: false
            },
            {
                reto: 12,
                id: "R12-Av2-pl",
                tipo: "opcion",
                pregunta: "12. Ile bram miał stary arabski mur Balansiya?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 13,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 14,
                id: "R14-Av2-pl",
                tipo: "opcion",
                pregunta: "14. Którą ręką Neptun trzyma róg obfitości?",
                opciones: ["Lewą", "Prawą"],
                correctas: ["Prawą"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av2-pl",
                tipo: "texto",
                pregunta: "15. Ile postaci otacza fontannę?",
                correctas: ["8"]
            },
            {
                reto: 16,
                id: "R16-Av2-pl",
                tipo: "opcion",
                pregunta: "16. Czy potrafiłbyś określić geometrię cimborio katedry w Walencji?",
                opciones: ["Sześciokątne", "Ośmiokątne", "Czworokątne"],
                correctas: ["Ośmiokątne"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-pl",
                tipo: "opcion",
                pregunta: "17. Czy potrafiłbyś określić geometrię wieży Miguelete w Walencji?",
                opciones: ["Sześciokątne", "Ośmiokątne", "Czworokątne"],
                correctas: ["Ośmiokątne"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av2-pl",
                tipo: "texto",
                pregunta: "18. Ile okien można zobaczyć?",
                correctas: ["?"]
            },
            {
                reto: 19,
                id: "R19-Av2-pl",
                tipo: "opcion-multiple",
                pregunta: "19. Co można zobaczyć ponad 35 metrów w górze na szczycie barokowej fasady?",
                opciones: ["Kula", "Nietoperz", "Krzyż", "Koń"],
                correctas: ["Kula", "Krzyż"],
                multiple: true
            },
            {
                reto: 20,
                id: "R20-Av2-pl",
                tipo: "opcion",
                pregunta: "20. Co znajduje się na samym szczycie barokowej wieży Santa Catalina?",
                opciones: ["Krzyż", "Słońce", "Gołąb"],
                correctas: ["Krzyż"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av2-pl",
                tipo: "texto",
                pregunta: "21. Jakiego koloru są dachówki kopuły barokowej wieży Santa Catalina?",
                correctas: ["azules"]
            },
            {
                reto: 22,
                id: "R22-Av2-pl",
                tipo: "opcion-multiple",
                pregunta: "22. Trzy ślepe łuki. Dwa z nich są gładkie, trzeci pozostał bez tynku.<br>Co można zobaczyć w tym nieobitym łuku?",
                opciones: ["Twarz", "Tors", "Gargulec"],
                correctas: ["Twarz", "Tors"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av2-pl",
                tipo: "texto",
                pregunta: "23. Jak szeroki jest wejście do wąskiego budynku?",
                correctas: ["1,35 metros"]
            },
            {
                reto: 24,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 25,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        pt: [
            // Array de retos Aventura2 PORTUGUÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av2-pt",
                tipo: "opcion",
                pregunta: "1. Quantas aventuras podem ser feitas com Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av2-pt",
                tipo: "opcion",
                pregunta: "2. É um bom momento para começar a sua aventura?",
                opciones: ["Sim", "Não"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av2-pt",
                tipo: "opcion",
                pregunta: "3. Saberia dizer-me como se chamam estas Torres?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av2-pt",
                tipo: "opcion",
                pregunta: "4. No topo das torres tremula a bandeira de Valência: as suas cores são vermelho, amarelo e…?",
                opciones: ["Violeta", "Verde", "Azul"],
                correctas: ["Azul"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av2-pt",
                tipo: "opcion",
                pregunta: "5. Qual das duas torres acha mais recente, a da praça ou a que tem à sua frente agora?",
                opciones: ["A mais próxima", "A mais afastada"],
                correctas: ["A mais afastada"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 7,
                id: "R7-Av2-pt",
                tipo: "opcion-multiple",
                pregunta: "7. O que se pode ver neste painel de cerâmica? São caveiras? É uma cruz? Há também uma pomba?",
                opciones: ["Caveiras", "Pombas", "Cruz"],
                correctas: ["Caveiras", "Cruz"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av2-pt",
                tipo: "opcion",
                pregunta: "8. Quantos sinos tem esta torre?",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-pt",
                tipo: "opcion",
                pregunta: "9. Por que razão estas aldravas foram colocadas tão alto?",
                opciones: ["Para pessoas altas", "Para bater estando a cavalo", "Para não serem incomodados na hora da sesta"],
                correctas: ["Para bater estando a cavalo"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-pt",
                tipo: "opcion",
                pregunta: "10. O que segura a figura nas suas mãos?",
                opciones: ["Um escudo", "Uma concha", "Um jarro", "Uma espada"],
                correctas: ["Uma concha"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-pt",
                tipo: "opcion",
                pregunta: "11. Que direção toma o caminho estabelecido?",
                opciones: ["Norte", "Sul", "Leste", "Oeste"],
                correctas: ["Norte"],
                multiple: false
            },
            {
                reto: 12,
                id: "R12-Av2-pt",
                tipo: "opcion",
                pregunta: "12. Quantas portas tinha a antiga muralha árabe de Balansiya?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 13,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 14,
                id: "R14-Av2-pt",
                tipo: "opcion",
                pregunta: "14. Com que mão Neptuno segura a cornucópia da abundância?",
                opciones: ["Esquerda", "Direita"],
                correctas: ["Direita"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av2-pt",
                tipo: "texto",
                pregunta: "15. Quantas figuras rodeiam a fonte?",
                correctas: ["8"]
            },
            {
                reto: 16,
                id: "R16-Av2-pt",
                tipo: "opcion",
                pregunta: "16. Consegue determinar que geometria tem o Cimbório da Catedral de Valência?",
                opciones: ["Hexagonal", "Octogonal", "Quadrangular"],
                correctas: ["Octogonal"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-pt",
                tipo: "opcion",
                pregunta: "17. Consegue determinar que geometria tem a Torre do Miguelete de Valência?",
                opciones: ["Hexagonal", "Octogonal", "Quadrangular"],
                correctas: ["Octogonal"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av2-pt",
                tipo: "texto",
                pregunta: "18. Quantas janelas consegue ver?",
                correctas: ["?"]
            },
            {
                reto: 19,
                id: "R19-Av2-pt",
                tipo: "opcion-multiple",
                pregunta: "19. O que se pode ver a mais de 35 metros de altura no topo da fachada barroca?",
                opciones: ["Uma esfera", "Um morcego", "Uma cruz", "Um cavalo"],
                correctas: ["Uma esfera", "Uma cruz"],
                multiple: true
            },
            {
                reto: 20,
                id: "R20-Av2-pt",
                tipo: "opcion",
                pregunta: "20. O que há no cimo da torre barroca de Santa Catalina?",
                opciones: ["Uma cruz", "O sol", "Uma pomba"],
                correctas: ["Uma cruz"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av2-pt",
                tipo: "texto",
                pregunta: "21. De que cor são as telhas da cúpula da torre barroca de Santa Catalina?",
                correctas: ["azules"]
            },
            {
                reto: 22,
                id: "R22-Av2-pt",
                tipo: "opcion-multiple",
                pregunta: "22. Três arcos cegos. Dois deles são lisos, o terceiro ficou sem reboco.<br>O que se pode ver nesse arco sem reboco?",
                opciones: ["Um rosto", "Um torso", "Uma gárgula"],
                correctas: ["Um rosto", "Um torso"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av2-pt",
                tipo: "texto",
                pregunta: "23. Qual é a largura da entrada do edifício estreito?",
                correctas: ["1,35 metros"]
            },
            {
                reto: 24,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 25,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        ru: [
            // Array de retos Aventura2 RUSO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av2-ru",
                tipo: "opcion",
                pregunta: "1. Сколько приключений можно совершить с Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av2-ru",
                tipo: "opcion",
                pregunta: "2. Это хорошее время, чтобы начать своё приключение?",
                opciones: ["Да", "Нет"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av2-ru",
                tipo: "opcion",
                pregunta: "3. Вы знаете, как называются эти башни?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av2-ru",
                tipo: "opcion",
                pregunta: "4. На вершине башен развевается флаг Валенсии: его цвета — красный, жёлтый и…?",
                opciones: ["Фиолетовый", "Зелёный", "Синий"],
                correctas: ["Синий"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av2-ru",
                tipo: "opcion",
                pregunta: "5. Как вы думаете, какая из двух башен новее — та, что на площади, или та, что перед вами сейчас?",
                opciones: ["Ближняя", "Дальняя"],
                correctas: ["Дальняя"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 7,
                id: "R7-Av2-ru",
                tipo: "opcion-multiple",
                pregunta: "7. Что можно увидеть на этой керамической панели? Это черепа? Это крест? Есть ли там голубь?",
                opciones: ["Черепа", "Голуби", "Крест"],
                correctas: ["Черепа", "Крест"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av2-ru",
                tipo: "opcion",
                pregunta: "8. Сколько колоколов в этой башне?",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-ru",
                tipo: "opcion",
                pregunta: "9. Почему эти дверные молотки были помещены так высоко?",
                opciones: ["Для высоких людей", "Чтобы стучать, сидя на лошади", "Чтобы не беспокоили во время сиесты"],
                correctas: ["Чтобы стучать, сидя на лошади"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-ru",
                tipo: "opcion",
                pregunta: "10. Что держит в руках эта фигура?",
                opciones: ["Щит", "Раковину", "Кувшин", "Меч"],
                correctas: ["Раковину"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-ru",
                tipo: "opcion",
                pregunta: "11. В каком направлении идёт установленный путь?",
                opciones: ["Север", "Юг", "Восток", "Запад"],
                correctas: ["Север"],
                multiple: false
            },
            {
                reto: 12,
                id: "R12-Av2-ru",
                tipo: "opcion",
                pregunta: "12. Сколько ворот было в старой арабской стене Балансии?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 13,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 14,
                id: "R14-Av2-ru",
                tipo: "opcion",
                pregunta: "14. Какой рукой Нептун держит рог изобилия?",
                opciones: ["Левой", "Правой"],
                correctas: ["Правой"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av2-ru",
                tipo: "texto",
                pregunta: "15. Сколько фигур окружает фонтан?",
                correctas: ["8"]
            },
            {
                reto: 16,
                id: "R16-Av2-ru",
                tipo: "opcion",
                pregunta: "16. Вы могли бы определить геометрическую форму симбория Валенсийского собора?",
                opciones: ["Шестиугольная", "Восьмиугольная", "Четырёхугольная"],
                correctas: ["Восьмиугольная"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-ru",
                tipo: "opcion",
                pregunta: "17. Вы могли бы определить геометрическую форму башни Мигелете в Валенсии?",
                opciones: ["Шестиугольная", "Восьмиугольная", "Четырёхугольная"],
                correctas: ["Восьмиугольная"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av2-ru",
                tipo: "texto",
                pregunta: "18. Сколько окон вы можете увидеть?",
                correctas: ["?"]
            },
            {
                reto: 19,
                id: "R19-Av2-ru",
                tipo: "opcion-multiple",
                pregunta: "19. Что можно увидеть на высоте более 35 метров на вершине барочного фасада?",
                opciones: ["Сфера", "Летучая мышь", "Крест", "Лошадь"],
                correctas: ["Сфера", "Крест"],
                multiple: true
            },
            {
                reto: 20,
                id: "R20-Av2-ru",
                tipo: "opcion",
                pregunta: "20. Что находится на самом верху барочной башни Санта-Каталина?",
                opciones: ["Крест", "Солнце", "Голубь"],
                correctas: ["Крест"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av2-ru",
                tipo: "texto",
                pregunta: "21. Какого цвета черепица купола барочной башни Санта-Каталина?",
                correctas: ["azules"]
            },
            {
                reto: 22,
                id: "R22-Av2-ru",
                tipo: "opcion-multiple",
                pregunta: "22. Три глухих арки. Две из них гладкие, третья осталась без штукатурки.<br>Что можно увидеть в этой неоштукатуренной арке?",
                opciones: ["Лицо", "Торс", "Горгулья"],
                correctas: ["Лицо", "Торс"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av2-ru",
                tipo: "texto",
                pregunta: "23. Какова ширина входа в узкое здание?",
                correctas: ["1,35 metros"]
            },
            {
                reto: 24,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 25,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        uk: [
            // Array de retos Aventura2 UCRANIANO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av2-uk",
                tipo: "opcion",
                pregunta: "1. Скільки пригод можна здійснити з Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av2-uk",
                tipo: "opcion",
                pregunta: "2. Чи зараз вдалий час, щоб розпочати свою пригоду?",
                opciones: ["Так", "Ні"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av2-uk",
                tipo: "opcion",
                pregunta: "3. Ви знаєте, як називаються ці вежі?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av2-uk",
                tipo: "opcion",
                pregunta: "4. На вершині веж майорить прапор Валенсії: його кольори — червоний, жовтий і…?",
                opciones: ["Фіолетовий", "Зелений", "Синій"],
                correctas: ["Синій"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av2-uk",
                tipo: "opcion",
                pregunta: "5. Як ви думаєте, яка з двох веж новіша — та, що на площі, чи та, що перед вами зараз?",
                opciones: ["Найближча", "Найдальша"],
                correctas: ["Найдальша"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 7,
                id: "R7-Av2-uk",
                tipo: "opcion-multiple",
                pregunta: "7. Що можна побачити на цій керамічній панелі? Це черепи? Це хрест? Є також голуб?",
                opciones: ["Черепи", "Голуби", "Хрест"],
                correctas: ["Черепи", "Хрест"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av2-uk",
                tipo: "opcion",
                pregunta: "8. Скільки дзвонів у цій вежі?",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-uk",
                tipo: "opcion",
                pregunta: "9. Чому ці дверні молотки були встановлені так високо?",
                opciones: ["Для високих людей", "Щоб стукати, перебуваючи верхи на коні", "Щоб не турбували під час сієсти"],
                correctas: ["Щоб стукати, перебуваючи верхи на коні"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-uk",
                tipo: "opcion",
                pregunta: "10. Що тримає в руках ця фігура?",
                opciones: ["Щит", "Мушлю", "Глечик", "Меч"],
                correctas: ["Мушлю"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-uk",
                tipo: "opcion",
                pregunta: "11. В якому напрямку проходить встановлений маршрут?",
                opciones: ["Північ", "Південь", "Схід", "Захід"],
                correctas: ["Північ"],
                multiple: false
            },
            {
                reto: 12,
                id: "R12-Av2-uk",
                tipo: "opcion",
                pregunta: "12. Скільки воріт мала стара арабська стіна Балансії?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 13,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 14,
                id: "R14-Av2-uk",
                tipo: "opcion",
                pregunta: "14. Якою рукою Нептун тримає ріг достатку?",
                opciones: ["Лівою", "Правою"],
                correctas: ["Правою"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av2-uk",
                tipo: "texto",
                pregunta: "15. Скільки фігур оточує фонтан?",
                correctas: ["8"]
            },
            {
                reto: 16,
                id: "R16-Av2-uk",
                tipo: "opcion",
                pregunta: "16. Чи могли б ви визначити геометричну форму симборіо Валенсійського собору?",
                opciones: ["Шестикутна", "Восьмикутна", "Чотирикутна"],
                correctas: ["Восьмикутна"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-uk",
                tipo: "opcion",
                pregunta: "17. Чи могли б ви визначити геометричну форму вежі Мігелете у Валенсії?",
                opciones: ["Шестикутна", "Восьмикутна", "Чотирикутна"],
                correctas: ["Восьмикутна"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av2-uk",
                tipo: "texto",
                pregunta: "18. Скільки вікон ви можете побачити?",
                correctas: ["?"]
            },
            {
                reto: 19,
                id: "R19-Av2-uk",
                tipo: "opcion-multiple",
                pregunta: "19. Що можна побачити на висоті понад 35 метрів на вершині барокового фасаду?",
                opciones: ["Сфера", "Кажан", "Хрест", "Кінь"],
                correctas: ["Сфера", "Хрест"],
                multiple: true
            },
            {
                reto: 20,
                id: "R20-Av2-uk",
                tipo: "opcion",
                pregunta: "20. Що знаходиться на самому верху барокової вежі Санта-Каталіна?",
                opciones: ["Хрест", "Сонце", "Голуб"],
                correctas: ["Хрест"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av2-uk",
                tipo: "texto",
                pregunta: "21. Якого кольору черепиця купола барокової вежі Санта-Каталіна?",
                correctas: ["azules"]
            },
            {
                reto: 22,
                id: "R22-Av2-uk",
                tipo: "opcion-multiple",
                pregunta: "22. Три глухі арки. Дві з них гладкі, третя залишилась без штукатурки.<br>Що можна побачити в цій нетинькованій арці?",
                opciones: ["Обличчя", "Торс", "Гаргулья"],
                correctas: ["Обличчя", "Торс"],
                multiple: true
            },
            {
                reto: 23,
                id: "R23-Av2-uk",
                tipo: "texto",
                pregunta: "23. Яка ширина входу вузького будинку?",
                correctas: ["1,35 metros"]
            },
            {
                reto: 24,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 25,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ]
    },
    Aventura3: {
        es: [
            // Array de retos Aventura3 ESPAÑOL
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av3-es",
                tipo: "opcion",
                pregunta: "1. ¿Cuántas Aventuras pueden hacerse con Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av3-es",
                tipo: "opcion",
                pregunta: "2. ¿Es buen momento para comenzar su aventura?",
                opciones: ["Sí", "NO"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av3-es",
                tipo: "opcion",
                pregunta: "Aquí va el primero de sus retos, este es facilito. ¿Sabría decirme cómo se llaman estas Torres? ",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av3-es",
                tipo: "opcion",
                pregunta: "En la cumbre de las torres ondea la bandera de Valencia: sus colores se componen de rojo, amarillo y...?",
                opciones: ["Violeta", "verde", "Azul"],
                correctas: ["Azul"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av3-es",
                tipo: "texto",
                pregunta: "¿sabría decirme el nombre de este antiguo río?",
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av3-es",
                tipo: "opcion",
                pregunta: "¿Sabría decirme cómo se llaman éstas fiestas populares de Valencia?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av3-es",
                tipo: "opcion",
                pregunta: "La naturaleza ha esculpido el escudo de Valencia. ¿Qué puede verse arriba?",
                opciones: ["Un escudo", "Un murciélago", "Un dragón"],
                correctas: ["Un murciélago"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av3-es",
                tipo: "texto",
                pregunta: "¿Sabría adivinar cuántos peldaños tiene?",
                correctas: ["16"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av3-es",
                tipo: "opcion",
                pregunta: "¿Qué tipo de árboles puede tocar ahora mismo?",
                opciones: ["Olivos","Naranjos", "Palmeras"],
                correctas: ["Palmeras"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av3-es",
                tipo: "texto",
                pregunta: "¿Sabría decirme el precio para acceder a esta atracción?",
                correctas: ["gratis"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
            {
                reto: 13,
                id: "R13-Av3-es",
                tipo: "opcion",
                pregunta: "¿De cuántos monumentos se compone la Ciudad de las Artes y de las Ciencias?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av3-es",
                tipo: "opcion",
                pregunta: "¿De qué está hecha la Orxata? ",
                opciones: ["Chufa", "Cebada", "Arroz"],
                correctas: ["Chufa"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av3-es",
                tipo: "opcion",
                pregunta: "¿Qué rodea la base del puente? ",
                opciones: ["Agua", "Hierba", "Patos"],
                correctas: ["Agua"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av3-es",
                tipo: "opcion",
                pregunta: "¿Recuerda qué animal corona el escudo de Valencia? ",
                opciones: ["Murciélago", "Dragón", "León"],
                correctas: ["Murciélago"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av3-es",
                tipo: "texto",
                pregunta: "En esta fachada hay un reloj ¿Qué hora marca? ",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av3-es",
                tipo: "opcion",
                pregunta: "¿Qué sujeta la figura con su mano?",
                opciones: ["Arpa", "Escudo","Jarra","Espada"],
                correctas: ["Escudo"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av3-es",
                tipo: "texto",
                pregunta: "¿Cuántos Arcos componen la puerta?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av3-es",
                tipo: "opcion",
                pregunta: "¿Qué figura esculpida puede verse en el marco del cuadro?",
                opciones: ["Murciélago", "Dragón","Corona"],
                correctas: ["Corona"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av3-es",
                tipo: "opcion-multiple",
                pregunta: "¿Qué puede verse dentro?",
                opciones: ["Altar", "Bandera", "Espada"],
                correctas: ["Altar", "Bandera"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av3-es",
                tipo: "texto",
                pregunta: "Sobre ésta puerta hay una placa conmemorativa. ¿En qué año fue expuesta dicha placa?",
                correctas: ["1952"],
                multiple: false
            },
             {
                reto: 23,
                id: "R23-Av3-es",
                tipo: "texto",
                pregunta: "¿En qué año se edificó esta finca? ¡Pista! Mire en la parte superior de la fachada",
                correctas: ["1906"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av3-es",
                tipo: "opcion",
                pregunta: "¡En las inmediaciones se ha abierto un portal del tiempo! ¿Qué se puede ver a través?",
                opciones: ["Plaza de Toros", "Baños Romanos", "Estación de Metro"],
                correctas: ["Baños Romanos"],
                multiple: false
            },
            {
                reto: 25,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 26,
                id: "R26-Av3-es",
                tipo: "opcion",
                pregunta: "¿Con qué mano sujeta Neptuno la cornucopia?",
                opciones: ["Izquierda", "Derecha"],
                correctas: ["Derecha"],
                multiple: false
            },
            {
                reto: 27,
                id: "R27-Av3-es",
                tipo: "texto",
                pregunta: "¿Cuántas figuras rodean la fuente",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        en: [
            // Array de retos Aventura3 INGLÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av3-en",
                tipo: "opcion",
                pregunta: "1. How many adventures can be done with Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av3-en",
                tipo: "opcion",
                pregunta: "2. Is it a good time to start your adventure?",
                opciones: ["Yes", "No"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av3-en",
                tipo: "opcion",
                pregunta: "Here is your first challenge, an easy one. Can you tell me the name of these Towers?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av3-en",
                tipo: "opcion",
                pregunta: "At the top of the towers, the flag of Valencia flies: its colors are red, yellow and...?",
                opciones: ["Violet", "Green", "Blue"],
                correctas: ["Blue"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av3-en",
                tipo: "texto",
                pregunta: "Can you tell me the name of this ancient river?",
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av3-en",
                tipo: "opcion",
                pregunta: "Can you tell me the name of these popular festivals in Valencia?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av3-en",
                tipo: "opcion",
                pregunta: "Nature has sculpted the coat of arms of Valencia. What can you see at the top?",
                opciones: ["A shield", "A bat", "A dragon"],
                correctas: ["A bat"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av3-en",
                tipo: "texto",
                pregunta: "Can you guess how many steps it has?",
                correctas: ["16"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av3-en",
                tipo: "opcion",
                pregunta: "What type of trees can you touch right now?",
                opciones: ["Olive trees", "Orange trees", "Palm trees"],
                correctas: ["Palm trees"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av3-en",
                tipo: "texto",
                pregunta: "Can you tell me the price to access this attraction?",
                correctas: ["gratis"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
            {
                reto: 13,
                id: "R13-Av3-en",
                tipo: "opcion",
                pregunta: "How many monuments make up the City of Arts and Sciences?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av3-en",
                tipo: "opcion",
                pregunta: "What is Orxata made of?",
                opciones: ["Chufa", "Barley", "Rice"],
                correctas: ["Chufa"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av3-en",
                tipo: "opcion",
                pregunta: "What surrounds the base of the bridge?",
                opciones: ["Water", "Grass", "Ducks"],
                correctas: ["Water"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av3-en",
                tipo: "opcion",
                pregunta: "Do you remember which animal crowns the coat of arms of Valencia?",
                opciones: ["Bat", "Dragon", "Lion"],
                correctas: ["Bat"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av3-en",
                tipo: "texto",
                pregunta: "On this façade there is a clock. What time does it show?",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av3-en",
                tipo: "opcion",
                pregunta: "What does the figure hold in its hand?",
                opciones: ["Harp", "Shield", "Jug", "Sword"],
                correctas: ["Shield"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av3-en",
                tipo: "texto",
                pregunta: "How many arches make up the doorway?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av3-en",
                tipo: "opcion",
                pregunta: "What sculpted figure can be seen in the picture frame?",
                opciones: ["Bat", "Dragon", "Crown"],
                correctas: ["Crown"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av3-en",
                tipo: "opcion-multiple",
                pregunta: "What can be seen inside?",
                opciones: ["Altar", "Flag", "Sword"],
                correctas: ["Altar", "Flag"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av3-en",
                tipo: "texto",
                pregunta: "Above this door there is a commemorative plaque. What year was this plaque displayed?",
                correctas: ["1952"],
                multiple: false
            },
            {
                reto: 23,
                id: "R23-Av3-en",
                tipo: "texto",
                pregunta: "What year was this building built? Hint: Look at the top of the façade",
                correctas: ["1906"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av3-en",
                tipo: "opcion",
                pregunta: "Nearby, a time portal has opened! What can be seen through it?",
                opciones: ["Bullring", "Roman Baths", "Metro Station"],
                correctas: ["Roman Baths"],
                multiple: false
            },
            {
                reto: 25,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 26,
                id: "R26-Av3-en",
                tipo: "opcion",
                pregunta: "With which hand does Neptune hold the cornucopia?",
                opciones: ["Left", "Right"],
                correctas: ["Right"],
                multiple: false
            },
            {
                reto: 27,
                id: "R27-Av3-en",
                tipo: "texto",
                pregunta: "How many figures surround the fountain?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        fr: [
            // Array de retos Aventura3 FRANCÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av3-fr",
                tipo: "opcion",
                pregunta: "1. Combien d'aventures peut-on faire avec Valencia be Guides ?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av3-fr",
                tipo: "opcion",
                pregunta: "2. Est-ce le bon moment pour commencer votre aventure ?",
                opciones: ["Oui", "Non"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av3-fr",
                tipo: "opcion",
                pregunta: "Voici votre premier défi, facile. Pouvez-vous me dire comment s'appellent ces Tours ?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av3-fr",
                tipo: "opcion",
                pregunta: "Au sommet des tours flotte le drapeau de Valence : ses couleurs sont le rouge, le jaune et... ?",
                opciones: ["Violet", "Vert", "Bleu"],
                correctas: ["Bleu"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av3-fr",
                tipo: "texto",
                pregunta: "Pouvez-vous me dire le nom de cet ancien fleuve ?",
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av3-fr",
                tipo: "opcion",
                pregunta: "Pouvez-vous me dire comment s'appellent ces fêtes populaires de Valence ?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av3-fr",
                tipo: "opcion",
                pregunta: "La nature a sculpté le blason de Valence. Que peut-on voir en haut ?",
                opciones: ["Un bouclier", "Une chauve-souris", "Un dragon"],
                correctas: ["Une chauve-souris"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av3-fr",
                tipo: "texto",
                pregunta: "Pouvez-vous deviner combien de marches il comporte ?",
                correctas: ["16"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av3-fr",
                tipo: "opcion",
                pregunta: "Quel type d'arbres pouvez-vous toucher en ce moment ?",
                opciones: ["Oliviers", "Orangers", "Palmiers"],
                correctas: ["Palmiers"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av3-fr",
                tipo: "texto",
                pregunta: "Pouvez-vous me dire le prix pour accéder à cette attraction ?",
                correctas: ["gratis"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
            {
                reto: 13,
                id: "R13-Av3-fr",
                tipo: "opcion",
                pregunta: "De combien de monuments se compose la Cité des Arts et des Sciences ?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av3-fr",
                tipo: "opcion",
                pregunta: "De quoi est faite l'Orxata ?",
                opciones: ["Chufa", "Orge", "Riz"],
                correctas: ["Chufa"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av3-fr",
                tipo: "opcion",
                pregunta: "Qu'est-ce qui entoure la base du pont ?",
                opciones: ["Eau", "Herbe", "Canards"],
                correctas: ["Eau"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av3-fr",
                tipo: "opcion",
                pregunta: "Vous souvenez-vous quel animal couronne le blason de Valence ?",
                opciones: ["Chauve-souris", "Dragon", "Lion"],
                correctas: ["Chauve-souris"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av3-fr",
                tipo: "texto",
                pregunta: "Sur cette façade il y a une horloge. Quelle heure indique-t-elle ?",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av3-fr",
                tipo: "opcion",
                pregunta: "Que tient la figure dans sa main ?",
                opciones: ["Harpe", "Bouclier", "Cruche", "Épée"],
                correctas: ["Bouclier"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av3-fr",
                tipo: "texto",
                pregunta: "Combien d'arcs composent la porte ?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av3-fr",
                tipo: "opcion",
                pregunta: "Quelle figure sculptée peut-on voir dans le cadre du tableau ?",
                opciones: ["Chauve-souris", "Dragon", "Couronne"],
                correctas: ["Couronne"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av3-fr",
                tipo: "opcion-multiple",
                pregunta: "Que peut-on voir à l'intérieur ?",
                opciones: ["Autel", "Drapeau", "Épée"],
                correctas: ["Autel", "Drapeau"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av3-fr",
                tipo: "texto",
                pregunta: "Au-dessus de cette porte se trouve une plaque commémorative. En quelle année cette plaque a-t-elle été exposée ?",
                correctas: ["1952"],
                multiple: false
            },
            {
                reto: 23,
                id: "R23-Av3-fr",
                tipo: "texto",
                pregunta: "En quelle année cet immeuble a-t-il été construit ? Indice : regardez en haut de la façade",
                correctas: ["1906"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av3-fr",
                tipo: "opcion",
                pregunta: "À proximité, un portail temporel s'est ouvert ! Que peut-on voir à travers ?",
                opciones: ["Arènes", "Thermes Romains", "Station de Métro"],
                correctas: ["Thermes Romains"],
                multiple: false
            },
            {
                reto: 25,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 26,
                id: "R26-Av3-fr",
                tipo: "opcion",
                pregunta: "De quelle main Neptune tient-il la corne d'abondance ?",
                opciones: ["Gauche", "Droite"],
                correctas: ["Droite"],
                multiple: false
            },
            {
                reto: 27,
                id: "R27-Av3-fr",
                tipo: "texto",
                pregunta: "Combien de figures entourent la fontaine ?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        it: [
            // Array de retos Aventura3 ITALIANO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av3-it",
                tipo: "opcion",
                pregunta: "1. Quante avventure si possono fare con Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av3-it",
                tipo: "opcion",
                pregunta: "2. È un buon momento per iniziare la tua avventura?",
                opciones: ["Sì", "No"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av3-it",
                tipo: "opcion",
                pregunta: "Ecco la tua prima sfida, facile. Sapresti dirmi come si chiamano queste Torri?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av3-it",
                tipo: "opcion",
                pregunta: "In cima alle torri sventola la bandiera di Valencia: i suoi colori sono rosso, giallo e...?",
                opciones: ["Viola", "Verde", "Azzurro"],
                correctas: ["Azzurro"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av3-it",
                tipo: "texto",
                pregunta: "Sapresti dirmi il nome di questo antico fiume?",
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av3-it",
                tipo: "opcion",
                pregunta: "Sapresti dirmi come si chiamano queste feste popolari di Valencia?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av3-it",
                tipo: "opcion",
                pregunta: "La natura ha scolpito lo stemma di Valencia. Cosa si può vedere in alto?",
                opciones: ["Uno scudo", "Un pipistrello", "Un drago"],
                correctas: ["Un pipistrello"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av3-it",
                tipo: "texto",
                pregunta: "Sapresti indovinare quanti gradini ha?",
                correctas: ["16"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av3-it",
                tipo: "opcion",
                pregunta: "Che tipo di alberi puoi toccare adesso?",
                opciones: ["Olivi", "Aranci", "Palme"],
                correctas: ["Palme"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av3-it",
                tipo: "texto",
                pregunta: "Sapresti dirmi il prezzo per accedere a questa attrazione?",
                correctas: ["gratis"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
            {
                reto: 13,
                id: "R13-Av3-it",
                tipo: "opcion",
                pregunta: "Di quanti monumenti è composta la Città delle Arti e delle Scienze?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av3-it",
                tipo: "opcion",
                pregunta: "Di cosa è fatta l'Orxata?",
                opciones: ["Chufa", "Orzo", "Riso"],
                correctas: ["Chufa"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av3-it",
                tipo: "opcion",
                pregunta: "Cosa circonda la base del ponte?",
                opciones: ["Acqua", "Erba", "Anatre"],
                correctas: ["Acqua"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av3-it",
                tipo: "opcion",
                pregunta: "Ti ricordi quale animale corona lo stemma di Valencia?",
                opciones: ["Pipistrello", "Drago", "Leone"],
                correctas: ["Pipistrello"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av3-it",
                tipo: "texto",
                pregunta: "Su questa facciata c'è un orologio. Che ora segna?",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av3-it",
                tipo: "opcion",
                pregunta: "Cosa tiene la figura nella sua mano?",
                opciones: ["Arpa", "Scudo", "Brocca", "Spada"],
                correctas: ["Scudo"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av3-it",
                tipo: "texto",
                pregunta: "Quanti archi compongono la porta?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av3-it",
                tipo: "opcion",
                pregunta: "Quale figura scolpita si può vedere nella cornice del quadro?",
                opciones: ["Pipistrello", "Drago", "Corona"],
                correctas: ["Corona"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av3-it",
                tipo: "opcion-multiple",
                pregunta: "Cosa si può vedere all'interno?",
                opciones: ["Altare", "Bandiera", "Spada"],
                correctas: ["Altare", "Bandiera"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av3-it",
                tipo: "texto",
                pregunta: "Sopra questa porta c'è una targa commemorativa. In che anno è stata esposta questa targa?",
                correctas: ["1952"],
                multiple: false
            },
            {
                reto: 23,
                id: "R23-Av3-it",
                tipo: "texto",
                pregunta: "In che anno è stato costruito questo edificio? Suggerimento: guarda in cima alla facciata",
                correctas: ["1906"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av3-it",
                tipo: "opcion",
                pregunta: "Nelle vicinanze si è aperto un portale del tempo! Cosa si può vedere attraverso?",
                opciones: ["Arena per le corride", "Terme Romane", "Stazione della Metro"],
                correctas: ["Terme Romane"],
                multiple: false
            },
            {
                reto: 25,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 26,
                id: "R26-Av3-it",
                tipo: "opcion",
                pregunta: "Con quale mano Nettuno tiene la cornucopia?",
                opciones: ["Sinistra", "Destra"],
                correctas: ["Destra"],
                multiple: false
            },
            {
                reto: 27,
                id: "R27-Av3-it",
                tipo: "texto",
                pregunta: "Quante figure circondano la fontana?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        nl: [
            // Array de retos Aventura3 HOLANDÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av3-nl",
                tipo: "opcion",
                pregunta: "1. Hoeveel avonturen kun je doen met València be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av3-nl",
                tipo: "opcion",
                pregunta: "2. Is het een goed moment om je avontuur te beginnen?",
                opciones: ["Ja", "Nee"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av3-nl",
                tipo: "opcion",
                pregunta: "Hier is uw eerste uitdaging, een gemakkelijke. Kunt u mij de naam van deze Torens vertellen?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av3-nl",
                tipo: "opcion",
                pregunta: "Op de top van de torens wappert de vlag van Valencia: haar kleuren zijn rood, geel en...?",
                opciones: ["Paars", "Groen", "Blauw"],
                correctas: ["Blauw"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av3-nl",
                tipo: "texto",
                pregunta: "Kunt u mij de naam van deze oude rivier vertellen?",
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av3-nl",
                tipo: "opcion",
                pregunta: "Kunt u mij de naam van deze populaire feesten in Valencia vertellen?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av3-nl",
                tipo: "opcion",
                pregunta: "De natuur heeft het wapen van Valencia gebeeldhouwd. Wat is er bovenaan te zien?",
                opciones: ["Een schild", "Een vleermuis", "Een draak"],
                correctas: ["Een vleermuis"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av3-nl",
                tipo: "texto",
                pregunta: "Kunt u raden hoeveel treden het heeft?",
                correctas: ["16"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av3-nl",
                tipo: "opcion",
                pregunta: "Wat voor soort bomen kunt u nu aanraken?",
                opciones: ["Olijfbomen", "Sinaasappelbomen", "Palmbomen"],
                correctas: ["Palmbomen"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av3-nl",
                tipo: "texto",
                pregunta: "Kunt u mij de prijs vertellen om toegang te krijgen tot deze attractie?",
                correctas: ["gratis"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
            {
                reto: 13,
                id: "R13-Av3-nl",
                tipo: "opcion",
                pregunta: "Uit hoeveel monumenten bestaat de Stad van Kunsten en Wetenschappen?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av3-nl",
                tipo: "opcion",
                pregunta: "Waarvan is Orxata gemaakt?",
                opciones: ["Chufa", "Gerst", "Rijst"],
                correctas: ["Chufa"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av3-nl",
                tipo: "opcion",
                pregunta: "Wat omringt de basis van de brug?",
                opciones: ["Water", "Gras", "Eenden"],
                correctas: ["Water"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av3-nl",
                tipo: "opcion",
                pregunta: "Herinnert u zich welk dier het wapen van Valencia kroont?",
                opciones: ["Vleermuis", "Draak", "Leeuw"],
                correctas: ["Vleermuis"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av3-nl",
                tipo: "texto",
                pregunta: "Op deze gevel hangt een klok. Hoe laat is het?",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av3-nl",
                tipo: "opcion",
                pregunta: "Wat houdt de figuur in zijn hand?",
                opciones: ["Harp", "Schild", "Kruik", "Zwaard"],
                correctas: ["Schild"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av3-nl",
                tipo: "texto",
                pregunta: "Hoeveel bogen vormen de deuropening?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av3-nl",
                tipo: "opcion",
                pregunta: "Welke gebeeldhouwde figuur is te zien in het schilderijkader?",
                opciones: ["Vleermuis", "Draak", "Kroon"],
                correctas: ["Kroon"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av3-nl",
                tipo: "opcion-multiple",
                pregunta: "Wat is er van binnen te zien?",
                opciones: ["Altaar", "Vlag", "Zwaard"],
                correctas: ["Altaar", "Vlag"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av3-nl",
                tipo: "texto",
                pregunta: "Boven deze deur hangt een gedenkplaat. In welk jaar werd deze plaat onthuld?",
                correctas: ["1952"],
                multiple: false
            },
            {
                reto: 23,
                id: "R23-Av3-nl",
                tipo: "texto",
                pregunta: "In welk jaar werd dit gebouw gebouwd? Hint: kijk naar de bovenkant van de gevel",
                correctas: ["1906"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av3-nl",
                tipo: "opcion",
                pregunta: "In de buurt is een tijdportaal geopend! Wat is er doorheen te zien?",
                opciones: ["Stierengevechtarena", "Romeinse Baden", "Metrostation"],
                correctas: ["Romeinse Baden"],
                multiple: false
            },
            {
                reto: 25,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 26,
                id: "R26-Av3-nl",
                tipo: "opcion",
                pregunta: "Met welke hand houdt Neptunus de hoorn des overvloeds vast?",
                opciones: ["Links", "Rechts"],
                correctas: ["Rechts"],
                multiple: false
            },
            {
                reto: 27,
                id: "R27-Av3-nl",
                tipo: "texto",
                pregunta: "Hoeveel figuren omringen de fontein?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        ja: [
            // Array de retos Aventura3 JAPONÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av3-ja",
                tipo: "opcion",
                pregunta: "1. Valencia be Guides ではいくつのアドベンチャーが体験できますか？",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av3-ja",
                tipo: "opcion",
                pregunta: "2. 今は冒険を始めるのに良いタイミングですか？",
                opciones: ["はい", "いいえ"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av3-ja",
                tipo: "opcion",
                pregunta: "最初の挑戦です、簡単なものです。この塔の名前を教えてもらえますか？",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av3-ja",
                tipo: "opcion",
                pregunta: "塔の頂上にはバレンシアの旗が翻っています：その色は赤、黄色、そして...？",
                opciones: ["紫", "緑", "青"],
                correctas: ["青"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av3-ja",
                tipo: "texto",
                pregunta: "この古い川の名前を教えてもらえますか？",
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av3-ja",
                tipo: "opcion",
                pregunta: "バレンシアのこの人気祭りの名前を教えてもらえますか？",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av3-ja",
                tipo: "opcion",
                pregunta: "自然がバレンシアの紋章を彫刻しました。上に何が見えますか？",
                opciones: ["盾", "コウモリ", "ドラゴン"],
                correctas: ["コウモリ"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av3-ja",
                tipo: "texto",
                pregunta: "何段あるか当てられますか？",
                correctas: ["16"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av3-ja",
                tipo: "opcion",
                pregunta: "今触れることができる木は何の種類ですか？",
                opciones: ["オリーブの木", "オレンジの木", "ヤシの木"],
                correctas: ["ヤシの木"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av3-ja",
                tipo: "texto",
                pregunta: "このアトラクションに入場する料金を教えてもらえますか？",
                correctas: ["gratis"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
            {
                reto: 13,
                id: "R13-Av3-ja",
                tipo: "opcion",
                pregunta: "芸術科学都市はいくつのモニュメントで構成されていますか？",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av3-ja",
                tipo: "opcion",
                pregunta: "Orxataは何から作られていますか？",
                opciones: ["Chufa", "大麦", "米"],
                correctas: ["Chufa"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av3-ja",
                tipo: "opcion",
                pregunta: "橋の基部を囲んでいるのは何ですか？",
                opciones: ["水", "草", "アヒル"],
                correctas: ["水"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av3-ja",
                tipo: "opcion",
                pregunta: "バレンシアの紋章を飾る動物を覚えていますか？",
                opciones: ["コウモリ", "ドラゴン", "ライオン"],
                correctas: ["コウモリ"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av3-ja",
                tipo: "texto",
                pregunta: "この外壁には時計があります。何時を指していますか？",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av3-ja",
                tipo: "opcion",
                pregunta: "像は手に何を持っていますか？",
                opciones: ["ハープ", "盾", "水差し", "剣"],
                correctas: ["盾"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av3-ja",
                tipo: "texto",
                pregunta: "門はいくつのアーチで構成されていますか？",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av3-ja",
                tipo: "opcion",
                pregunta: "額縁にはどんな彫刻された図が見えますか？",
                opciones: ["コウモリ", "ドラゴン", "王冠"],
                correctas: ["王冠"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av3-ja",
                tipo: "opcion-multiple",
                pregunta: "中に何が見えますか？",
                opciones: ["祭壇", "旗", "剣"],
                correctas: ["祭壇", "旗"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av3-ja",
                tipo: "texto",
                pregunta: "この扉の上には記念プレートがあります。このプレートはいつ展示されましたか？",
                correctas: ["1952"],
                multiple: false
            },
            {
                reto: 23,
                id: "R23-Av3-ja",
                tipo: "texto",
                pregunta: "この建物はいつ建てられましたか？ヒント：ファサードの上部をご覧ください",
                correctas: ["1906"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av3-ja",
                tipo: "opcion",
                pregunta: "近くに時間のポータルが開きました！その向こうには何が見えますか？",
                opciones: ["闘牛場", "ローマ式浴場", "地下鉄の駅"],
                correctas: ["ローマ式浴場"],
                multiple: false
            },
            {
                reto: 25,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 26,
                id: "R26-Av3-ja",
                tipo: "opcion",
                pregunta: "ネプチューンはどちらの手で豊穣の角を持っていますか？",
                opciones: ["左手", "右手"],
                correctas: ["右手"],
                multiple: false
            },
            {
                reto: 27,
                id: "R27-Av3-ja",
                tipo: "texto",
                pregunta: "噴水の周りにはいくつの像がありますか？",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        de: [
            // Array de retos Aventura3 ALEMÁN
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av3-de",
                tipo: "opcion",
                pregunta: "1. Wie viele Abenteuer können mit Valencia be Guides unternommen werden?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av3-de",
                tipo: "opcion",
                pregunta: "2. Ist es ein guter Zeitpunkt, Ihr Abenteuer zu beginnen?",
                opciones: ["Ja", "Nein"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av3-de",
                tipo: "opcion",
                pregunta: "Hier ist Ihre erste Herausforderung, eine leichte. Können Sie mir sagen, wie diese Türme heißen?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av3-de",
                tipo: "opcion",
                pregunta: "Auf dem Gipfel der Türme weht die Flagge von Valencia: ihre Farben sind Rot, Gelb und...?",
                opciones: ["Violett", "Grün", "Blau"],
                correctas: ["Blau"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av3-de",
                tipo: "texto",
                pregunta: "Können Sie mir den Namen dieses alten Flusses nennen?",
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av3-de",
                tipo: "opcion",
                pregunta: "Können Sie mir sagen, wie diese beliebten Feste in Valencia heißen?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av3-de",
                tipo: "opcion",
                pregunta: "Die Natur hat das Wappen von Valencia geformt. Was ist oben zu sehen?",
                opciones: ["Ein Schild", "Eine Fledermaus", "Ein Drache"],
                correctas: ["Eine Fledermaus"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av3-de",
                tipo: "texto",
                pregunta: "Können Sie erraten, wie viele Stufen es hat?",
                correctas: ["16"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av3-de",
                tipo: "opcion",
                pregunta: "Was für Bäume können Sie gerade anfassen?",
                opciones: ["Olivenbäume", "Orangenbäume", "Palmen"],
                correctas: ["Palmen"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av3-de",
                tipo: "texto",
                pregunta: "Können Sie mir den Preis für den Zugang zu dieser Attraktion nennen?",
                correctas: ["gratis"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
            {
                reto: 13,
                id: "R13-Av3-de",
                tipo: "opcion",
                pregunta: "Aus wie vielen Monumenten besteht die Stadt der Künste und Wissenschaften?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av3-de",
                tipo: "opcion",
                pregunta: "Woraus wird Orxata gemacht?",
                opciones: ["Chufa", "Gerste", "Reis"],
                correctas: ["Chufa"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av3-de",
                tipo: "opcion",
                pregunta: "Was umgibt die Basis der Brücke?",
                opciones: ["Wasser", "Gras", "Enten"],
                correctas: ["Wasser"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av3-de",
                tipo: "opcion",
                pregunta: "Erinnern Sie sich, welches Tier das Wappen von Valencia krönt?",
                opciones: ["Fledermaus", "Drache", "Löwe"],
                correctas: ["Fledermaus"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av3-de",
                tipo: "texto",
                pregunta: "An dieser Fassade befindet sich eine Uhr. Welche Zeit zeigt sie?",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av3-de",
                tipo: "opcion",
                pregunta: "Was hält die Figur in ihrer Hand?",
                opciones: ["Harfe", "Schild", "Krug", "Schwert"],
                correctas: ["Schild"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av3-de",
                tipo: "texto",
                pregunta: "Aus wie vielen Bögen besteht das Tor?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av3-de",
                tipo: "opcion",
                pregunta: "Welche gemeißelte Figur ist im Bilderrahmen zu sehen?",
                opciones: ["Fledermaus", "Drache", "Krone"],
                correctas: ["Krone"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av3-de",
                tipo: "opcion-multiple",
                pregunta: "Was ist drinnen zu sehen?",
                opciones: ["Altar", "Fahne", "Schwert"],
                correctas: ["Altar", "Fahne"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av3-de",
                tipo: "texto",
                pregunta: "Über dieser Tür befindet sich eine Gedenktafel. In welchem Jahr wurde diese Tafel ausgestellt?",
                correctas: ["1952"],
                multiple: false
            },
            {
                reto: 23,
                id: "R23-Av3-de",
                tipo: "texto",
                pregunta: "In welchem Jahr wurde dieses Gebäude errichtet? Hinweis: Schauen Sie oben an der Fassade",
                correctas: ["1906"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av3-de",
                tipo: "opcion",
                pregunta: "In der Nähe hat sich ein Zeitportal geöffnet! Was ist hindurchzusehen?",
                opciones: ["Stierkampfarena", "Römische Thermen", "U-Bahn-Station"],
                correctas: ["Römische Thermen"],
                multiple: false
            },
            {
                reto: 25,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 26,
                id: "R26-Av3-de",
                tipo: "opcion",
                pregunta: "Mit welcher Hand hält Neptun das Füllhorn?",
                opciones: ["Links", "Rechts"],
                correctas: ["Rechts"],
                multiple: false
            },
            {
                reto: 27,
                id: "R27-Av3-de",
                tipo: "texto",
                pregunta: "Wie viele Figuren umgeben den Brunnen?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        zh: [
            // Array de retos Aventura3 CHINO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av3-zh",
                tipo: "opcion",
                pregunta: "1. 使用Valencia be Guides可以进行多少次冒险？",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av3-zh",
                tipo: "opcion",
                pregunta: "2. 现在是开始您的冒险的好时机吗？",
                opciones: ["是", "否"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av3-zh",
                tipo: "opcion",
                pregunta: "这是您的第一个挑战，很容易。您能告诉我这些塔叫什么名字吗？",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av3-zh",
                tipo: "opcion",
                pregunta: "塔顶飘扬着巴伦西亚的旗帜：其颜色由红色、黄色和...组成？",
                opciones: ["紫色", "绿色", "蓝色"],
                correctas: ["蓝色"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av3-zh",
                tipo: "texto",
                pregunta: "您能告诉我这条古老河流的名字吗？",
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av3-zh",
                tipo: "opcion",
                pregunta: "您能告诉我巴伦西亚这些流行节日的名字吗？",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av3-zh",
                tipo: "opcion",
                pregunta: "大自然雕刻了巴伦西亚的盾形纹章。顶部能看到什么？",
                opciones: ["盾牌", "蝙蝠", "龙"],
                correctas: ["蝙蝠"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av3-zh",
                tipo: "texto",
                pregunta: "您能猜出它有多少个台阶吗？",
                correctas: ["16"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av3-zh",
                tipo: "opcion",
                pregunta: "您现在能摸到的是什么类型的树？",
                opciones: ["橄榄树", "橙树", "棕榈树"],
                correctas: ["棕榈树"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av3-zh",
                tipo: "texto",
                pregunta: "您能告诉我进入这个景点的价格吗？",
                correctas: ["gratis"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
            {
                reto: 13,
                id: "R13-Av3-zh",
                tipo: "opcion",
                pregunta: "艺术与科学城由多少个建筑组成？",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av3-zh",
                tipo: "opcion",
                pregunta: "Orxata是用什么做的？",
                opciones: ["Chufa", "大麦", "大米"],
                correctas: ["Chufa"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av3-zh",
                tipo: "opcion",
                pregunta: "什么环绕着桥的底部？",
                opciones: ["水", "草", "鸭子"],
                correctas: ["水"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av3-zh",
                tipo: "opcion",
                pregunta: "您还记得什么动物装饰着巴伦西亚的盾形纹章吗？",
                opciones: ["蝙蝠", "龙", "狮子"],
                correctas: ["蝙蝠"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av3-zh",
                tipo: "texto",
                pregunta: "这个外立面上有一个时钟。它显示几点？",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av3-zh",
                tipo: "opcion",
                pregunta: "这个雕像手里拿着什么？",
                opciones: ["竖琴", "盾牌", "水罐", "宝剑"],
                correctas: ["盾牌"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av3-zh",
                tipo: "texto",
                pregunta: "门由几个拱门组成？",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av3-zh",
                tipo: "opcion",
                pregunta: "画框里能看到什么雕刻的图案？",
                opciones: ["蝙蝠", "龙", "王冠"],
                correctas: ["王冠"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av3-zh",
                tipo: "opcion-multiple",
                pregunta: "里面能看到什么？",
                opciones: ["祭坛", "旗帜", "宝剑"],
                correctas: ["祭坛", "旗帜"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av3-zh",
                tipo: "texto",
                pregunta: "这扇门上方有一块纪念牌匾。这块牌匾是哪年展出的？",
                correctas: ["1952"],
                multiple: false
            },
            {
                reto: 23,
                id: "R23-Av3-zh",
                tipo: "texto",
                pregunta: "这栋建筑是哪年建造的？提示：请看立面的上部",
                correctas: ["1906"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av3-zh",
                tipo: "opcion",
                pregunta: "附近开启了一个时间之门！透过它能看到什么？",
                opciones: ["斗牛场", "罗马浴场", "地铁站"],
                correctas: ["罗马浴场"],
                multiple: false
            },
            {
                reto: 25,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 26,
                id: "R26-Av3-zh",
                tipo: "opcion",
                pregunta: "海神尼普顿用哪只手拿着丰饶角？",
                opciones: ["左手", "右手"],
                correctas: ["右手"],
                multiple: false
            },
            {
                reto: 27,
                id: "R27-Av3-zh",
                tipo: "texto",
                pregunta: "喷泉周围有多少个雕像？",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        pl: [
            // Array de retos Aventura3 POLACO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av3-pl",
                tipo: "opcion",
                pregunta: "1. Ile przygód można przeżyć z Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av3-pl",
                tipo: "opcion",
                pregunta: "2. Czy to dobry moment, aby rozpocząć swoją przygodę?",
                opciones: ["Tak", "Nie"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av3-pl",
                tipo: "opcion",
                pregunta: "Oto Twoje pierwsze wyzwanie, łatwe. Czy potrafi mi powiedzieć, jak nazywają się te Wieże?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av3-pl",
                tipo: "opcion",
                pregunta: "Na szczycie wież powiewa flaga Walencji: jej kolory to czerwony, żółty i...?",
                opciones: ["Fioletowy", "Zielony", "Niebieski"],
                correctas: ["Niebieski"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av3-pl",
                tipo: "texto",
                pregunta: "Czy potrafi mi powiedzieć nazwę tej starej rzeki?",
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av3-pl",
                tipo: "opcion",
                pregunta: "Czy potrafi mi powiedzieć, jak nazywają się te popularne święta w Walencji?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av3-pl",
                tipo: "opcion",
                pregunta: "Natura wyrzeźbiła herb Walencji. Co widać na górze?",
                opciones: ["Tarcza", "Nietoperz", "Smok"],
                correctas: ["Nietoperz"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av3-pl",
                tipo: "texto",
                pregunta: "Czy potrafisz zgadnąć, ile ma stopni?",
                correctas: ["16"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av3-pl",
                tipo: "opcion",
                pregunta: "Jakie drzewa możesz teraz dotknąć?",
                opciones: ["Drzewa oliwne", "Drzewa pomarańczowe", "Palmy"],
                correctas: ["Palmy"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av3-pl",
                tipo: "texto",
                pregunta: "Czy potrafi mi powiedzieć cenę wejścia do tej atrakcji?",
                correctas: ["gratis"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
            {
                reto: 13,
                id: "R13-Av3-pl",
                tipo: "opcion",
                pregunta: "Z ilu monumentów składa się Miasto Sztuki i Nauki?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av3-pl",
                tipo: "opcion",
                pregunta: "Z czego jest zrobiona Orxata?",
                opciones: ["Chufa", "Jęczmień", "Ryż"],
                correctas: ["Chufa"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av3-pl",
                tipo: "opcion",
                pregunta: "Co otacza podstawę mostu?",
                opciones: ["Woda", "Trawa", "Kaczki"],
                correctas: ["Woda"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av3-pl",
                tipo: "opcion",
                pregunta: "Czy pamiętasz, jakie zwierzę wieńczy herb Walencji?",
                opciones: ["Nietoperz", "Smok", "Lew"],
                correctas: ["Nietoperz"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av3-pl",
                tipo: "texto",
                pregunta: "Na tej fasadzie jest zegar. Którą godzinę pokazuje?",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av3-pl",
                tipo: "opcion",
                pregunta: "Co trzyma figura w swojej dłoni?",
                opciones: ["Harfa", "Tarcza", "Dzban", "Miecz"],
                correctas: ["Tarcza"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av3-pl",
                tipo: "texto",
                pregunta: "Z ilu łuków składa się brama?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av3-pl",
                tipo: "opcion",
                pregunta: "Jaką wyrzeźbioną figurę widać w ramie obrazu?",
                opciones: ["Nietoperz", "Smok", "Korona"],
                correctas: ["Korona"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av3-pl",
                tipo: "opcion-multiple",
                pregunta: "Co można zobaczyć w środku?",
                opciones: ["Ołtarz", "Flaga", "Miecz"],
                correctas: ["Ołtarz", "Flaga"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av3-pl",
                tipo: "texto",
                pregunta: "Nad tymi drzwiami znajduje się tablica pamiątkowa. W którym roku ta tablica została odsłonięta?",
                correctas: ["1952"],
                multiple: false
            },
            {
                reto: 23,
                id: "R23-Av3-pl",
                tipo: "texto",
                pregunta: "W którym roku wybudowano ten budynek? Wskazówka: spójrz na górę fasady",
                correctas: ["1906"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av3-pl",
                tipo: "opcion",
                pregunta: "W pobliżu otworzył się portal czasu! Co można przez niego zobaczyć?",
                opciones: ["Arena walk byków", "Łaźnie Rzymskie", "Stacja metra"],
                correctas: ["Łaźnie Rzymskie"],
                multiple: false
            },
            {
                reto: 25,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 26,
                id: "R26-Av3-pl",
                tipo: "opcion",
                pregunta: "Którą ręką Neptun trzyma róg obfitości?",
                opciones: ["Lewą", "Prawą"],
                correctas: ["Prawą"],
                multiple: false
            },
            {
                reto: 27,
                id: "R27-Av3-pl",
                tipo: "texto",
                pregunta: "Ile postaci otacza fontannę?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        pt: [
            // Array de retos Aventura3 PORTUGUÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av3-pt",
                tipo: "opcion",
                pregunta: "1. Quantas aventuras podem ser feitas com Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av3-pt",
                tipo: "opcion",
                pregunta: "2. É um bom momento para começar a sua aventura?",
                opciones: ["Sim", "Não"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av3-pt",
                tipo: "opcion",
                pregunta: "Aqui está o seu primeiro desafio, fácil. Saberia dizer-me como se chamam estas Torres?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av3-pt",
                tipo: "opcion",
                pregunta: "No cimo das torres flutua a bandeira de Valência: as suas cores são vermelho, amarelo e...?",
                opciones: ["Violeta", "Verde", "Azul"],
                correctas: ["Azul"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av3-pt",
                tipo: "texto",
                pregunta: "Saberia dizer-me o nome deste antigo rio?",
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av3-pt",
                tipo: "opcion",
                pregunta: "Saberia dizer-me como se chamam estas festas populares de Valência?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av3-pt",
                tipo: "opcion",
                pregunta: "A natureza esculpiu o brasão de Valência. O que se pode ver em cima?",
                opciones: ["Um escudo", "Um morcego", "Um dragão"],
                correctas: ["Um morcego"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av3-pt",
                tipo: "texto",
                pregunta: "Consegue adivinhar quantos degraus tem?",
                correctas: ["16"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av3-pt",
                tipo: "opcion",
                pregunta: "Que tipo de árvores pode tocar agora mesmo?",
                opciones: ["Oliveiras", "Laranjeiras", "Palmeiras"],
                correctas: ["Palmeiras"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av3-pt",
                tipo: "texto",
                pregunta: "Saberia dizer-me o preço para aceder a esta atração?",
                correctas: ["gratis"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
            {
                reto: 13,
                id: "R13-Av3-pt",
                tipo: "opcion",
                pregunta: "De quantos monumentos se compõe a Cidade das Artes e das Ciências?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av3-pt",
                tipo: "opcion",
                pregunta: "Do que é feita a Orxata?",
                opciones: ["Chufa", "Cevada", "Arroz"],
                correctas: ["Chufa"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av3-pt",
                tipo: "opcion",
                pregunta: "O que rodeia a base da ponte?",
                opciones: ["Água", "Erva", "Patos"],
                correctas: ["Água"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av3-pt",
                tipo: "opcion",
                pregunta: "Recorda-se que animal coroa o brasão de Valência?",
                opciones: ["Morcego", "Dragão", "Leão"],
                correctas: ["Morcego"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av3-pt",
                tipo: "texto",
                pregunta: "Nesta fachada há um relógio. Que horas marca?",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av3-pt",
                tipo: "opcion",
                pregunta: "O que segura a figura na sua mão?",
                opciones: ["Harpa", "Escudo", "Jarro", "Espada"],
                correctas: ["Escudo"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av3-pt",
                tipo: "texto",
                pregunta: "Quantos arcos compõem a porta?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av3-pt",
                tipo: "opcion",
                pregunta: "Que figura esculpida se pode ver na moldura do quadro?",
                opciones: ["Morcego", "Dragão", "Coroa"],
                correctas: ["Coroa"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av3-pt",
                tipo: "opcion-multiple",
                pregunta: "O que se pode ver lá dentro?",
                opciones: ["Altar", "Bandeira", "Espada"],
                correctas: ["Altar", "Bandeira"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av3-pt",
                tipo: "texto",
                pregunta: "Acima desta porta há uma placa comemorativa. Em que ano foi exposta esta placa?",
                correctas: ["1952"],
                multiple: false
            },
            {
                reto: 23,
                id: "R23-Av3-pt",
                tipo: "texto",
                pregunta: "Em que ano foi construído este edifício? Pista: olhe para a parte superior da fachada",
                correctas: ["1906"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av3-pt",
                tipo: "opcion",
                pregunta: "Nas proximidades abriu-se um portal do tempo! O que se pode ver através?",
                opciones: ["Praça de Touros", "Banhos Romanos", "Estação de Metro"],
                correctas: ["Banhos Romanos"],
                multiple: false
            },
            {
                reto: 25,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 26,
                id: "R26-Av3-pt",
                tipo: "opcion",
                pregunta: "Com que mão Neptuno segura a cornucópia?",
                opciones: ["Esquerda", "Direita"],
                correctas: ["Direita"],
                multiple: false
            },
            {
                reto: 27,
                id: "R27-Av3-pt",
                tipo: "texto",
                pregunta: "Quantas figuras rodeiam a fonte?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        ru: [
            // Array de retos Aventura3 RUSO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av3-ru",
                tipo: "opcion",
                pregunta: "1. Сколько приключений можно совершить с Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av3-ru",
                tipo: "opcion",
                pregunta: "2. Это хорошее время, чтобы начать своё приключение?",
                opciones: ["Да", "Нет"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av3-ru",
                tipo: "opcion",
                pregunta: "Вот ваше первое испытание, лёгкое. Вы знаете, как называются эти Башни?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av3-ru",
                tipo: "opcion",
                pregunta: "На вершине башен развевается флаг Валенсии: его цвета — красный, жёлтый и...?",
                opciones: ["Фиолетовый", "Зелёный", "Синий"],
                correctas: ["Синий"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av3-ru",
                tipo: "texto",
                pregunta: "Вы знаете, как называется эта старая река?",
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av3-ru",
                tipo: "opcion",
                pregunta: "Вы знаете, как называются эти популярные праздники в Валенсии?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av3-ru",
                tipo: "opcion",
                pregunta: "Природа выточила герб Валенсии. Что можно увидеть наверху?",
                opciones: ["Щит", "Летучая мышь", "Дракон"],
                correctas: ["Летучая мышь"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av3-ru",
                tipo: "texto",
                pregunta: "Вы можете угадать, сколько здесь ступеней?",
                correctas: ["16"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av3-ru",
                tipo: "opcion",
                pregunta: "Какие деревья вы можете потрогать прямо сейчас?",
                opciones: ["Оливковые деревья", "Апельсиновые деревья", "Пальмы"],
                correctas: ["Пальмы"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av3-ru",
                tipo: "texto",
                pregunta: "Вы знаете, сколько стоит вход в эту достопримечательность?",
                correctas: ["gratis"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
            {
                reto: 13,
                id: "R13-Av3-ru",
                tipo: "opcion",
                pregunta: "Из скольких монументов состоит Город искусств и наук?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av3-ru",
                tipo: "opcion",
                pregunta: "Из чего сделана Orxata?",
                opciones: ["Chufa", "Ячмень", "Рис"],
                correctas: ["Chufa"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av3-ru",
                tipo: "opcion",
                pregunta: "Что окружает основание моста?",
                opciones: ["Вода", "Трава", "Утки"],
                correctas: ["Вода"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av3-ru",
                tipo: "opcion",
                pregunta: "Вы помните, какое животное венчает герб Валенсии?",
                opciones: ["Летучая мышь", "Дракон", "Лев"],
                correctas: ["Летучая мышь"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av3-ru",
                tipo: "texto",
                pregunta: "На этом фасаде есть часы. Который час они показывают?",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av3-ru",
                tipo: "opcion",
                pregunta: "Что держит фигура в своей руке?",
                opciones: ["Арфа", "Щит", "Кувшин", "Меч"],
                correctas: ["Щит"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av3-ru",
                tipo: "texto",
                pregunta: "Из скольких арок состоят ворота?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av3-ru",
                tipo: "opcion",
                pregunta: "Какая скульптурная фигура видна в раме картины?",
                opciones: ["Летучая мышь", "Дракон", "Корона"],
                correctas: ["Корона"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av3-ru",
                tipo: "opcion-multiple",
                pregunta: "Что можно увидеть внутри?",
                opciones: ["Алтарь", "Флаг", "Меч"],
                correctas: ["Алтарь", "Флаг"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av3-ru",
                tipo: "texto",
                pregunta: "Над этой дверью находится памятная доска. В каком году была установлена эта доска?",
                correctas: ["1952"],
                multiple: false
            },
            {
                reto: 23,
                id: "R23-Av3-ru",
                tipo: "texto",
                pregunta: "В каком году было построено это здание? Подсказка: посмотрите на верхнюю часть фасада",
                correctas: ["1906"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av3-ru",
                tipo: "opcion",
                pregunta: "Поблизости открылся портал времени! Что можно увидеть сквозь него?",
                opciones: ["Арена для боя быков", "Римские термы", "Станция метро"],
                correctas: ["Римские термы"],
                multiple: false
            },
            {
                reto: 25,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 26,
                id: "R26-Av3-ru",
                tipo: "opcion",
                pregunta: "Какой рукой Нептун держит рог изобилия?",
                opciones: ["Левой", "Правой"],
                correctas: ["Правой"],
                multiple: false
            },
            {
                reto: 27,
                id: "R27-Av3-ru",
                tipo: "texto",
                pregunta: "Сколько фигур окружает фонтан?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        uk: [
            // Array de retos Aventura3 UCRANIANO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av3-uk",
                tipo: "opcion",
                pregunta: "1. Скільки пригод можна здійснити з Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av3-uk",
                tipo: "opcion",
                pregunta: "2. Чи зараз вдалий час, щоб розпочати свою пригоду?",
                opciones: ["Так", "Ні"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av3-uk",
                tipo: "opcion",
                pregunta: "Ось ваше перше випробування, легке. Ви знаєте, як називаються ці Вежі?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av3-uk",
                tipo: "opcion",
                pregunta: "На вершині веж майорить прапор Валенсії: його кольори — червоний, жовтий і...?",
                opciones: ["Фіолетовий", "Зелений", "Синій"],
                correctas: ["Синій"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av3-uk",
                tipo: "texto",
                pregunta: "Ви знаєте, як називається ця стара річка?",
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av3-uk",
                tipo: "opcion",
                pregunta: "Ви знаєте, як називаються ці популярні свята у Валенсії?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av3-uk",
                tipo: "opcion",
                pregunta: "Природа вирізьбила герб Валенсії. Що можна побачити вгорі?",
                opciones: ["Щит", "Кажан", "Дракон"],
                correctas: ["Кажан"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av3-uk",
                tipo: "texto",
                pregunta: "Чи можете ви вгадати, скільки тут сходинок?",
                correctas: ["16"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av3-uk",
                tipo: "opcion",
                pregunta: "Які дерева ви можете торкнутися прямо зараз?",
                opciones: ["Оливкові дерева", "Апельсинові дерева", "Пальми"],
                correctas: ["Пальми"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av3-uk",
                tipo: "texto",
                pregunta: "Ви знаєте, скільки коштує вхід до цієї пам'ятки?",
                correctas: ["gratis"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
            {
                reto: 13,
                id: "R13-Av3-uk",
                tipo: "opcion",
                pregunta: "З скількох монументів складається Місто мистецтв і наук?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av3-uk",
                tipo: "opcion",
                pregunta: "З чого зроблена Orxata?",
                opciones: ["Chufa", "Ячмінь", "Рис"],
                correctas: ["Chufa"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av3-uk",
                tipo: "opcion",
                pregunta: "Що оточує підніжжя мосту?",
                opciones: ["Вода", "Трава", "Качки"],
                correctas: ["Вода"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av3-uk",
                tipo: "opcion",
                pregunta: "Ви пам'ятаєте, яка тварина прикрашає герб Валенсії?",
                opciones: ["Кажан", "Дракон", "Лев"],
                correctas: ["Кажан"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av3-uk",
                tipo: "texto",
                pregunta: "На цьому фасаді є годинник. Котра година на ньому?",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av3-uk",
                tipo: "opcion",
                pregunta: "Що тримає фігура у своїй руці?",
                opciones: ["Арфа", "Щит", "Глечик", "Меч"],
                correctas: ["Щит"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av3-uk",
                tipo: "texto",
                pregunta: "З скількох арок складаються ворота?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av3-uk",
                tipo: "opcion",
                pregunta: "Яка скульптурна фігура видна в рамці картини?",
                opciones: ["Кажан", "Дракон", "Корона"],
                correctas: ["Корона"],
                multiple: false
            },
            {
                reto: 21,
                id: "R21-Av3-uk",
                tipo: "opcion-multiple",
                pregunta: "Що можна побачити всередині?",
                opciones: ["Вівтар", "Прапор", "Меч"],
                correctas: ["Вівтар", "Прапор"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av3-uk",
                tipo: "texto",
                pregunta: "Над цими дверима є меморіальна дошка. В якому році ця дошка була встановлена?",
                correctas: ["1952"],
                multiple: false
            },
            {
                reto: 23,
                id: "R23-Av3-uk",
                tipo: "texto",
                pregunta: "В якому році було збудовано цю будівлю? Підказка: подивіться на верхню частину фасаду",
                correctas: ["1906"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av3-uk",
                tipo: "opcion",
                pregunta: "Поблизу відкрився портал часу! Що можна побачити крізь нього?",
                opciones: ["Арена для бою биків", "Римські терми", "Станція метро"],
                correctas: ["Римські терми"],
                multiple: false
            },
            {
                reto: 25,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 26,
                id: "R26-Av3-uk",
                tipo: "opcion",
                pregunta: "Якою рукою Нептун тримає ріг достатку?",
                opciones: ["Лівою", "Правою"],
                correctas: ["Правою"],
                multiple: false
            },
            {
                reto: 27,
                id: "R27-Av3-uk",
                tipo: "texto",
                pregunta: "Скільки фігур оточує фонтан?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 28,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ]
    },
    Aventura4: {
        es: [
            // Array de retos Aventura4 ESPANOL
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av4-es",
                tipo: "opcion",
                pregunta: "1. Cuantas Aventuras pueden hacerse con Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av4-es",
                tipo: "opcion",
                pregunta: "2. Es buen momento para comenzar su aventura?",
                opciones: ["Si", "NO"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av4-es",
                tipo: "opcion",
                pregunta: "3. ¿Sabía decirme cómo se llaman estas Torres?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
            {
                reto: 5,
                id: "R5-Av4-es",
                tipo: "opcion",
                pregunta: "Encima del dintel de la puerta resalta el escudo de la Orden del Carmen.",
                opciones: ["Una Corona", "Una Cruz", "Una Estrella"],
                correctas: ["Una Corona"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-Av4-es",
                tipo: "opcion",
                pregunta: "¿Qué porta la Virgen en brazos?",
                opciones: ["Un Corazón", "Una Paloma", "Niño Jesús"],
                correctas: ["Niño Jesús"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av4-es",
                tipo: "opcion-multiple",
                pregunta: "¿Qué porta Santa Teresa en sus manos?",
                opciones: ["Una pluma", "Una espada", "Un libro", "Una jarra"],
                correctas: ["Una pluma", "Un libro"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av4-es",
                tipo: "texto",
                pregunta: "¿Cuánto cuesta la entrada a este museo?",
                correctas: ["Gratis"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av4-es",
                tipo: "opcion",
                pregunta: "¿Cuántos gatos pueden verse representados en el panel?",
                opciones: ["3", "4", "5"],
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av4-es",
                tipo: "texto",
                pregunta: "¿Qué altura marca este panel?",
                correctas: ["1,90 metros"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av4-es",
                tipo: "texto",
                pregunta: "¿Qué año indica el panel superior?",
                correctas: ["2100"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
            {
                reto: 13,
                id: "R13-Av4-es",
                tipo: "opcion",
                pregunta: "¿Sabría decirme el nombre de este antiguo río?",
                opciones: ["Turia", "Júcar", "Segura", "Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 14,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
            {
                reto: 15,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
            {
                reto: 16,
                id: "R16-Av4-es",
                tipo: "opcion-multiple",
                pregunta: "¿Qué usos pueden tener esos badenes?",
                opciones: ["Parar el agua", "Detener las ruedas de los carros", "Recoger las suciedades del río"],
                correctas: ["Detener las ruedas de los carros", "Recoger las suciedades del río"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-Av4-es",
                tipo: "opcion",
                pregunta: "En la cumbre de las torres ondea la bandera de Valencia: sus colores se componen de rojo, amarillo y… ",
                opciones: ["Violeta", "Verde", "Azul"],
                correctas: ["Azul"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
            {
                reto: 19,
                id: "R19-Av4-es",
                tipo: "opcion",
                pregunta: "¿A qué está dedicado el museo?",
                opciones: ["Arquitectura", "Historia", "Ciencias Naturales"],
                correctas: ["Ciencias Naturales"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av4-es",
                tipo: "opcion",
                pregunta: "¿Qué figura decora la fuente?",
                opciones: ["Un pato", "Una cigüeña", "Un pez"],
                correctas: ["Una cigüeña"],
                multiple: false
            },
            {
                reto: 21,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        en: [
            // Array de retos Aventura4 INGLES
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av4-en",
                tipo: "opcion",
                pregunta: "1. How many adventures can be done with Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av4-en",
                tipo: "opcion",
                pregunta: "2. Is it a good time to start your adventure?",
                opciones: ["Yes", "No"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av4-en",
                tipo: "opcion",
                pregunta: "Could you tell me what these towers are called?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Tower of Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
            {
                reto: 5,
                id: "R5-Av4-en",
                tipo: "opcion",
                pregunta: "Above the door lintel stands out the coat of arms of the Carmelite Order.",
                opciones: ["A Crown", "A Cross", "A Star"],
                correctas: ["A Crown"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-Av4-en",
                tipo: "opcion",
                pregunta: "What is the Virgin holding in her arms?",
                opciones: ["A Heart", "A Dove", "Baby Jesus"],
                correctas: ["Baby Jesus"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av4-en",
                tipo: "opcion-multiple",
                pregunta: "What is Saint Teresa holding in her hands?",
                opciones: ["A quill", "A sword", "A book", "A jug"],
                correctas: ["A quill", "A book"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av4-en",
                tipo: "texto",
                pregunta: "How much does admission to this museum cost?",
                correctas: ["Free"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av4-en",
                tipo: "opcion",
                pregunta: "How many cats can you see depicted on the panel?",
                opciones: ["3", "4", "5"],
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av4-en",
                tipo: "texto",
                pregunta: "What height does this panel indicate?",
                correctas: ["1.90 metres"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av4-en",
                tipo: "texto",
                pregunta: "What year does the upper panel indicate?",
                correctas: ["2100"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
            {
                reto: 13,
                id: "R13-Av4-en",
                tipo: "opcion",
                pregunta: "Could you tell me the name of this ancient river?",
                opciones: ["Turia", "Júcar", "Segura", "Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 14,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
            {
                reto: 15,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
            {
                reto: 16,
                id: "R16-Av4-en",
                tipo: "opcion-multiple",
                pregunta: "What uses can those stone blocks have?",
                opciones: ["Stop the water", "Stop the cart wheels", "Collect the river waste"],
                correctas: ["Stop the cart wheels", "Collect the river waste"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-Av4-en",
                tipo: "opcion",
                pregunta: "At the top of the towers flies the flag of Valencia: its colours are red, yellow and…",
                opciones: ["Purple", "Green", "Blue"],
                correctas: ["Blue"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
            {
                reto: 19,
                id: "R19-Av4-en",
                tipo: "opcion",
                pregunta: "What is this museum dedicated to?",
                opciones: ["Architecture", "History", "Natural Sciences"],
                correctas: ["Natural Sciences"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av4-en",
                tipo: "opcion",
                pregunta: "What figure decorates the fountain?",
                opciones: ["A duck", "A stork", "A fish"],
                correctas: ["A stork"],
                multiple: false
            },
            {
                reto: 21,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        fr: [
            // Array de retos Aventura4 FRANCES
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av4-fr",
                tipo: "opcion",
                pregunta: "1. Combien d'aventures peut-on faire avec Valencia be Guides ?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av4-fr",
                tipo: "opcion",
                pregunta: "2. Est-ce le bon moment pour commencer votre aventure ?",
                opciones: ["Oui", "Non"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av4-fr",
                tipo: "opcion",
                pregunta: "Pourriez-vous me dire comment s'appellent ces tours ?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
            {
                reto: 5,
                id: "R5-Av4-fr",
                tipo: "opcion",
                pregunta: "Au-dessus du linteau de la porte se distingue le blason de l'Ordre du Carmel.",
                opciones: ["Une Couronne", "Une Croix", "Une Étoile"],
                correctas: ["Une Couronne"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-Av4-fr",
                tipo: "opcion",
                pregunta: "Que porte la Vierge dans ses bras ?",
                opciones: ["Un Cœur", "Une Colombe", "L'Enfant Jésus"],
                correctas: ["L'Enfant Jésus"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av4-fr",
                tipo: "opcion-multiple",
                pregunta: "Que porte Sainte Thérèse dans ses mains ?",
                opciones: ["Une plume", "Une épée", "Un livre", "Une cruche"],
                correctas: ["Une plume", "Un livre"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av4-fr",
                tipo: "texto",
                pregunta: "Combien coûte l'entrée de ce musée ?",
                correctas: ["Gratuit"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av4-fr",
                tipo: "opcion",
                pregunta: "Combien de chats peut-on voir représentés sur le panneau ?",
                opciones: ["3", "4", "5"],
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av4-fr",
                tipo: "texto",
                pregunta: "Quelle hauteur indique ce panneau ?",
                correctas: ["1,90 mètre"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av4-fr",
                tipo: "texto",
                pregunta: "Quelle année indique le panneau supérieur ?",
                correctas: ["2100"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
            {
                reto: 13,
                id: "R13-Av4-fr",
                tipo: "opcion",
                pregunta: "Pourriez-vous me dire le nom de cet ancien fleuve ?",
                opciones: ["Turia", "Júcar", "Segura", "Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 14,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
            {
                reto: 15,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
            {
                reto: 16,
                id: "R16-Av4-fr",
                tipo: "opcion-multiple",
                pregunta: "Quels usages peuvent avoir ces blocs de pierre ?",
                opciones: ["Arrêter l'eau", "Stopper les roues des charrettes", "Recueillir les saletés du fleuve"],
                correctas: ["Stopper les roues des charrettes", "Recueillir les saletés du fleuve"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-Av4-fr",
                tipo: "opcion",
                pregunta: "Au sommet des tours flotte le drapeau de Valence : ses couleurs se composent de rouge, jaune et…",
                opciones: ["Violet", "Vert", "Bleu"],
                correctas: ["Bleu"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
            {
                reto: 19,
                id: "R19-Av4-fr",
                tipo: "opcion",
                pregunta: "À quoi ce musée est-il consacré ?",
                opciones: ["Architecture", "Histoire", "Sciences naturelles"],
                correctas: ["Sciences naturelles"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av4-fr",
                tipo: "opcion",
                pregunta: "Quelle figure décore la fontaine ?",
                opciones: ["Un canard", "Une cigogne", "Un poisson"],
                correctas: ["Une cigogne"],
                multiple: false
            },
            {
                reto: 21,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        it: [
            // Array de retos Aventura4 ITALIANO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av4-it",
                tipo: "opcion",
                pregunta: "1. Quante avventure si possono fare con Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av4-it",
                tipo: "opcion",
                pregunta: "2. E un buon momento per iniziare la tua avventura?",
                opciones: ["Si", "No"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av4-it",
                tipo: "opcion",
                pregunta: "Saprebbe dirmi come si chiamano queste Torri?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre di Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
            {
                reto: 5,
                id: "R5-Av4-it",
                tipo: "opcion",
                pregunta: "Sopra il davanzale della porta risalta lo stemma dell'Ordine del Carmelo.",
                opciones: ["Una Corona", "Una Croce", "Una Stella"],
                correctas: ["Una Corona"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-Av4-it",
                tipo: "opcion",
                pregunta: "Cosa porta la Vergine in braccio?",
                opciones: ["Un Cuore", "Una Colomba", "Gesù Bambino"],
                correctas: ["Gesù Bambino"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av4-it",
                tipo: "opcion-multiple",
                pregunta: "Cosa porta Santa Teresa nelle sue mani?",
                opciones: ["Una penna", "Una spada", "Un libro", "Una brocca"],
                correctas: ["Una penna", "Un libro"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av4-it",
                tipo: "texto",
                pregunta: "Quanto costa l'ingresso a questo museo?",
                correctas: ["Gratis"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av4-it",
                tipo: "opcion",
                pregunta: "Quanti gatti si possono vedere raffigurati sul pannello?",
                opciones: ["3", "4", "5"],
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av4-it",
                tipo: "texto",
                pregunta: "Quale altezza indica questo pannello?",
                correctas: ["1,90 metri"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av4-it",
                tipo: "texto",
                pregunta: "Quale anno indica il pannello superiore?",
                correctas: ["2100"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
            {
                reto: 13,
                id: "R13-Av4-it",
                tipo: "opcion",
                pregunta: "Saprebbe dirmi il nome di questo antico fiume?",
                opciones: ["Turia", "Júcar", "Segura", "Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 14,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
            {
                reto: 15,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
            {
                reto: 16,
                id: "R16-Av4-it",
                tipo: "opcion-multiple",
                pregunta: "Quale uso possono avere questi blocchi di pietra?",
                opciones: ["Fermare l'acqua", "Bloccare le ruote dei carri", "Raccogliere le impurità del fiume"],
                correctas: ["Bloccare le ruote dei carri", "Raccogliere le impurità del fiume"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-Av4-it",
                tipo: "opcion",
                pregunta: "In cima alle torri sventola la bandiera di Valencia: i suoi colori sono rosso, giallo e…",
                opciones: ["Viola", "Verde", "Blu"],
                correctas: ["Blu"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
            {
                reto: 19,
                id: "R19-Av4-it",
                tipo: "opcion",
                pregunta: "A cosa è dedicato questo museo?",
                opciones: ["Architettura", "Storia", "Scienze Naturali"],
                correctas: ["Scienze Naturali"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av4-it",
                tipo: "opcion",
                pregunta: "Quale figura decora la fontana?",
                opciones: ["Un'anatra", "Una cicogna", "Un pesce"],
                correctas: ["Una cicogna"],
                multiple: false
            },
            {
                reto: 21,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        nl: [
            // Array de retos Aventura4 HOLANDES
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av4-nl",
                tipo: "opcion",
                pregunta: "1. Hoeveel avonturen kun je doen met Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av4-nl",
                tipo: "opcion",
                pregunta: "2. Is het een goed moment om je avontuur te beginnen?",
                opciones: ["Ja", "Nee"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av4-nl",
                tipo: "opcion",
                pregunta: "Weet u hoe deze Torens heten?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
            {
                reto: 5,
                id: "R5-Av4-nl",
                tipo: "opcion",
                pregunta: "Boven de deurpost staat het wapen van de Orde van de Karmel.",
                opciones: ["Een Kroon", "Een Kruis", "Een Ster"],
                correctas: ["Een Kroon"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-Av4-nl",
                tipo: "opcion",
                pregunta: "Wat draagt de Maagd in haar armen?",
                opciones: ["Een Hart", "Een Duif", "Jezuskind"],
                correctas: ["Jezuskind"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av4-nl",
                tipo: "opcion-multiple",
                pregunta: "Wat draagt de Heilige Teresa in haar handen?",
                opciones: ["Een veer", "Een zwaard", "Een boek", "Een kruik"],
                correctas: ["Een veer", "Een boek"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av4-nl",
                tipo: "texto",
                pregunta: "Hoeveel kost de toegang tot dit museum?",
                correctas: ["Gratis"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av4-nl",
                tipo: "opcion",
                pregunta: "Hoeveel katten zijn er afgebeeld op het paneel?",
                opciones: ["3", "4", "5"],
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av4-nl",
                tipo: "texto",
                pregunta: "Welke hoogte geeft dit paneel aan?",
                correctas: ["1,90 meter"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av4-nl",
                tipo: "texto",
                pregunta: "Welk jaar geeft het bovenste paneel aan?",
                correctas: ["2100"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
            {
                reto: 13,
                id: "R13-Av4-nl",
                tipo: "opcion",
                pregunta: "Kunt u mij de naam van deze oude rivier vertellen?",
                opciones: ["Turia", "Júcar", "Segura", "Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 14,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
            {
                reto: 15,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
            {
                reto: 16,
                id: "R16-Av4-nl",
                tipo: "opcion-multiple",
                pregunta: "Welk gebruik kunnen die stenen blokken hebben?",
                opciones: ["Het water stoppen", "De wielen van de wagens stoppen", "Het vuilnis van de rivier opvangen"],
                correctas: ["De wielen van de wagens stoppen", "Het vuilnis van de rivier opvangen"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-Av4-nl",
                tipo: "opcion",
                pregunta: "Aan de top van de torens wappert de vlag van Valencia: de kleuren zijn rood, geel en…",
                opciones: ["Paars", "Groen", "Blauw"],
                correctas: ["Blauw"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
            {
                reto: 19,
                id: "R19-Av4-nl",
                tipo: "opcion",
                pregunta: "Waaraan is dit museum gewijd?",
                opciones: ["Architectuur", "Geschiedenis", "Natuurwetenschappen"],
                correctas: ["Natuurwetenschappen"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av4-nl",
                tipo: "opcion",
                pregunta: "Welke figuur siert de fontein?",
                opciones: ["Een eend", "Een ooievaar", "Een vis"],
                correctas: ["Een ooievaar"],
                multiple: false
            },
            {
                reto: 21,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        ja: [
            // Array de retos Aventura4 JAPONES
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av4-ja",
                tipo: "opcion",
                pregunta: "1. [PENDING] Valencia be Guides intro question",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av4-ja",
                tipo: "opcion",
                pregunta: "2. [PENDING] Is it a good time to start your adventure?",
                opciones: ["Yes", "No"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av4-ja",
                tipo: "opcion",
                pregunta: "これらの塔の名前を教えていただけますか？",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
            {
                reto: 5,
                id: "R5-Av4-ja",
                tipo: "opcion",
                pregunta: "扉の鴨居の上にカルメル修道会の紋章が目立ちます。",
                opciones: ["王冠", "十字架", "星"],
                correctas: ["王冠"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-Av4-ja",
                tipo: "opcion",
                pregunta: "聖母は腕に何を抱いていますか？",
                opciones: ["ハート", "鳩", "幼子イエス"],
                correctas: ["幼子イエス"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av4-ja",
                tipo: "opcion-multiple",
                pregunta: "聖テレサは手に何を持っていますか？",
                opciones: ["羽根ペン", "剣", "本", "水差し"],
                correctas: ["羽根ペン", "本"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av4-ja",
                tipo: "texto",
                pregunta: "この博物館の入場料はいくらですか？",
                correctas: ["無料"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av4-ja",
                tipo: "opcion",
                pregunta: "パネルに何匹の猫が描かれているのが見えますか？",
                opciones: ["3", "4", "5"],
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av4-ja",
                tipo: "texto",
                pregunta: "このパネルはどの高さを示していますか？",
                correctas: ["1.90メートル"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av4-ja",
                tipo: "texto",
                pregunta: "上部パネルはどの年を示していますか？",
                correctas: ["2100"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
            {
                reto: 13,
                id: "R13-Av4-ja",
                tipo: "opcion",
                pregunta: "この古い川の名前を教えていただけますか？",
                opciones: ["Turia", "Júcar", "Segura", "Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 14,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
            {
                reto: 15,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
            {
                reto: 16,
                id: "R16-Av4-ja",
                tipo: "opcion-multiple",
                pregunta: "それらの石のブロックにはどのような用途がありますか？",
                opciones: ["水を止める", "荷車の車輪を止める", "川のごみを集める"],
                correctas: ["荷車の車輪を止める", "川のごみを集める"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-Av4-ja",
                tipo: "opcion",
                pregunta: "塔の頂上にはバレンシアの旗が翻っています：その色は赤、黄色、そして…",
                opciones: ["紫", "緑", "青"],
                correctas: ["青"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
            {
                reto: 19,
                id: "R19-Av4-ja",
                tipo: "opcion",
                pregunta: "この博物館は何に捧げられていますか？",
                opciones: ["建築", "歴史", "自然科学"],
                correctas: ["自然科学"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av4-ja",
                tipo: "opcion",
                pregunta: "噴水を飾っているのはどんな像ですか？",
                opciones: ["アヒル", "コウノトリ", "魚"],
                correctas: ["コウノトリ"],
                multiple: false
            },
            {
                reto: 21,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        de: [
            // Array de retos Aventura4 DE
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av4-de",
                tipo: "opcion",
                pregunta: "1. Wie viele Abenteuer kann man mit Valencia be Guides machen?",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av4-de",
                tipo: "opcion",
                pregunta: "2. Ist es ein guter Zeitpunkt, um Ihr Abenteuer zu beginnen?",
                opciones: ["Ja","Nein"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av4-de",
                tipo: "opcion",
                pregunta: "3. Können Sie mir sagen, wie diese Türme heißen?",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
            {
                reto: 5,
                id: "R5-Av4-de",
                tipo: "opcion",
                pregunta: "Über dem Türsturz sticht das Wappen des Karmeliterordens hervor.",
                opciones: ["Eine Krone","Ein Kreuz","Ein Stern"],
                correctas: ["Eine Krone"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-Av4-de",
                tipo: "opcion",
                pregunta: "Was trägt die Jungfrau auf dem Arm?",
                opciones: ["Ein Herz","Eine Taube","Das Jesuskind"],
                correctas: ["Das Jesuskind"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av4-de",
                tipo: "opcion-multiple",
                pregunta: "Was trägt die heilige Teresa in ihren Händen?",
                opciones: ["Eine Feder","Ein Schwert","Ein Buch","Ein Krug"],
                correctas: ["Eine Feder","Ein Buch"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av4-de",
                tipo: "texto",
                pregunta: "Wie viel kostet der Eintritt in dieses Museum?",
                correctas: ["Gratis"]
            },
            {
                reto: 9,
                id: "R9-Av4-de",
                tipo: "opcion",
                pregunta: "Wie viele Katzen sind auf dem Panel zu sehen?",
                opciones: ["3","4","5"],
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av4-de",
                tipo: "texto",
                pregunta: "Welche Höhe zeigt dieses Panel an?",
                correctas: ["1,90 metros"]
            },
            {
                reto: 11,
                id: "R11-Av4-de",
                tipo: "texto",
                pregunta: "Welches Jahr zeigt das obere Panel an?",
                correctas: ["2100"]
            },
            {
                reto: 12,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
            {
                reto: 13,
                id: "R13-Av4-de",
                tipo: "opcion",
                pregunta: "Können Sie mir den Namen dieses alten Flusses nennen?",
                opciones: ["Turia","Júcar","Segura","Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 14,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
            {
                reto: 15,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
            {
                reto: 16,
                id: "R16-Av4-de",
                tipo: "opcion-multiple",
                pregunta: "Welche Funktionen können diese Schwellen haben?",
                opciones: ["Das Wasser aufhalten","Die Räder der Karren stoppen","Den Schmutz des Flusses auffangen"],
                correctas: ["Die Räder der Karren stoppen","Den Schmutz des Flusses auffangen"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-Av4-de",
                tipo: "opcion",
                pregunta: "Auf dem Gipfel der Türme weht die Flagge Valencias: Ihre Farben bestehen aus Rot, Gelb und… ",
                opciones: ["Violett","Grün","Blau"],
                correctas: ["Blau"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
            {
                reto: 19,
                id: "R19-Av4-de",
                tipo: "opcion",
                pregunta: "Welchem Thema ist das Museum gewidmet?",
                opciones: ["Architektur","Geschichte","Naturwissenschaften"],
                correctas: ["Naturwissenschaften"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av4-de",
                tipo: "opcion",
                pregunta: "Welche Figur schmückt den Brunnen?",
                opciones: ["Eine Ente","Ein Storch","Ein Fisch"],
                correctas: ["Ein Storch"],
                multiple: false
            },
            {
                reto: 21,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        zh: [
            // Array de retos Aventura4 ZH
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av4-zh",
                tipo: "opcion",
                pregunta: "1. 使用Valencia be Guides可以进行多少次冒险？",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av4-zh",
                tipo: "opcion",
                pregunta: "2. 现在是开始冒险的好时机吗？",
                opciones: ["是","否"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av4-zh",
                tipo: "opcion",
                pregunta: "3. 您能告诉我这些塔叫什么名字吗？",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
            {
                reto: 5,
                id: "R5-Av4-zh",
                tipo: "opcion",
                pregunta: "在门楣上方突出的是卡尔默修道院的盾徽。",
                opciones: ["一顶王冠","一个十字架","一颗星星"],
                correctas: ["一顶王冠"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-Av4-zh",
                tipo: "opcion",
                pregunta: "圣母怀里抱着什么？",
                opciones: ["一颗心","一只鸽子","耶稣圣婴"],
                correctas: ["耶稣圣婴"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av4-zh",
                tipo: "opcion-multiple",
                pregunta: "圣大德兰双手持着什么？",
                opciones: ["一支羽毛笔","一把剑","一本书","一个壶"],
                correctas: ["一支羽毛笔","一本书"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av4-zh",
                tipo: "texto",
                pregunta: "这个博物馆的门票多少钱？",
                correctas: ["免费"]
            },
            {
                reto: 9,
                id: "R9-Av4-zh",
                tipo: "opcion",
                pregunta: "面板上可以看到几只猫？",
                opciones: ["3","4","5"],
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av4-zh",
                tipo: "texto",
                pregunta: "这个面板标注的高度是多少？",
                correctas: ["1,90 metros"]
            },
            {
                reto: 11,
                id: "R11-Av4-zh",
                tipo: "texto",
                pregunta: "上方面板显示哪一年？",
                correctas: ["2100"]
            },
            {
                reto: 12,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
            {
                reto: 13,
                id: "R13-Av4-zh",
                tipo: "opcion",
                pregunta: "您能告诉我这条古老河流的名字吗？",
                opciones: ["Turia","Júcar","Segura","Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 14,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
            {
                reto: 15,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
            {
                reto: 16,
                id: "R16-Av4-zh",
                tipo: "opcion-multiple",
                pregunta: "这些门槛有什么用途？",
                opciones: ["拦截水流","阻止马车的轮子","收集河流中的污物"],
                correctas: ["阻止马车的轮子","收集河流中的污物"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-Av4-zh",
                tipo: "opcion",
                pregunta: "塔顶飘扬着巴伦西亚的旗帜：其颜色由红色、黄色和…组成 ",
                opciones: ["紫色","绿色","蓝色"],
                correctas: ["蓝色"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
            {
                reto: 19,
                id: "R19-Av4-zh",
                tipo: "opcion",
                pregunta: "这个博物馆是关于什么的？",
                opciones: ["建筑","历史","自然科学"],
                correctas: ["自然科学"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av4-zh",
                tipo: "opcion",
                pregunta: "喷泉上装饰着什么图案？",
                opciones: ["一只鸭子","一只鹤","一条鱼"],
                correctas: ["一只鹤"],
                multiple: false
            },
            {
                reto: 21,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        pl: [
            // Array de retos Aventura4 PL
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av4-pl",
                tipo: "opcion",
                pregunta: "1. Ile przygód można przeżyć z Valencia be Guides?",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av4-pl",
                tipo: "opcion",
                pregunta: "2. Czy to dobry moment, aby rozpocząć przygodę?",
                opciones: ["Tak","Nie"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av4-pl",
                tipo: "opcion",
                pregunta: "3. Czy potrafi Pan/Pani powiedzieć mi, jak nazywają się te wieże?",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
            {
                reto: 5,
                id: "R5-Av4-pl",
                tipo: "opcion",
                pregunta: "Nad nadprożem drzwi widnieje herb Zakonu Karmelitów.",
                opciones: ["Korona","Krzyż","Gwiazda"],
                correctas: ["Korona"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-Av4-pl",
                tipo: "opcion",
                pregunta: "Co trzyma Matka Boska w ramionach?",
                opciones: ["Serce","Gołąb","Dzieciątko Jezus"],
                correctas: ["Dzieciątko Jezus"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av4-pl",
                tipo: "opcion-multiple",
                pregunta: "Co trzyma święta Teresa w swoich rękach?",
                opciones: ["Pióro","Miecz","Książka","Dzbanek"],
                correctas: ["Pióro","Książka"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av4-pl",
                tipo: "texto",
                pregunta: "Ile kosztuje wstęp do tego muzeum?",
                correctas: ["Bezpłatnie"]
            },
            {
                reto: 9,
                id: "R9-Av4-pl",
                tipo: "opcion",
                pregunta: "Ile kotów widać na panelu?",
                opciones: ["3","4","5"],
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av4-pl",
                tipo: "texto",
                pregunta: "Jaką wysokość wskazuje ten panel?",
                correctas: ["1,90 metros"]
            },
            {
                reto: 11,
                id: "R11-Av4-pl",
                tipo: "texto",
                pregunta: "Jaki rok wskazuje górny panel?",
                correctas: ["2100"]
            },
            {
                reto: 12,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
            {
                reto: 13,
                id: "R13-Av4-pl",
                tipo: "opcion",
                pregunta: "Czy potrafi Pan/Pani powiedzieć mi nazwę tej starej rzeki?",
                opciones: ["Turia","Júcar","Segura","Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 14,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
            {
                reto: 15,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
            {
                reto: 16,
                id: "R16-Av4-pl",
                tipo: "opcion-multiple",
                pregunta: "Jakie funkcje mogą pełnić te progi?",
                opciones: ["Zatrzymywanie wody","Zatrzymywanie kół wozów","Zbieranie nieczystości z rzeki"],
                correctas: ["Zatrzymywanie kół wozów","Zbieranie nieczystości z rzeki"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-Av4-pl",
                tipo: "opcion",
                pregunta: "Na szczycie wież powiewa flaga Walencji: jej kolory to czerwony, żółty i… ",
                opciones: ["Fioletowy","Zielony","Niebieski"],
                correctas: ["Niebieski"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
            {
                reto: 19,
                id: "R19-Av4-pl",
                tipo: "opcion",
                pregunta: "Czemu poświęcone jest muzeum?",
                opciones: ["Architektura","Historia","Nauki przyrodnicze"],
                correctas: ["Nauki przyrodnicze"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av4-pl",
                tipo: "opcion",
                pregunta: "Jaka figura zdobi fontannę?",
                opciones: ["Kaczka","Bocian","Ryba"],
                correctas: ["Bocian"],
                multiple: false
            },
            {
                reto: 21,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        pt: [
            // Array de retos Aventura4 PT
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av4-pt",
                tipo: "opcion",
                pregunta: "1. Quantas Aventuras podem ser feitas com Valencia be Guides?",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av4-pt",
                tipo: "opcion",
                pregunta: "2. É um bom momento para começar a sua aventura?",
                opciones: ["Sim","Não"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av4-pt",
                tipo: "opcion",
                pregunta: "3. Sabe me dizer como se chamam estas Torres?",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
            {
                reto: 5,
                id: "R5-Av4-pt",
                tipo: "opcion",
                pregunta: "Acima da verga da porta destaca-se o brasão da Ordem do Carmo.",
                opciones: ["Uma Coroa","Uma Cruz","Uma Estrela"],
                correctas: ["Uma Coroa"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-Av4-pt",
                tipo: "opcion",
                pregunta: "O que porta a Virgem nos braços?",
                opciones: ["Um Coração","Uma Pomba","Menino Jesus"],
                correctas: ["Menino Jesus"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av4-pt",
                tipo: "opcion-multiple",
                pregunta: "O que porta Santa Teresa nas suas mãos?",
                opciones: ["Uma pena","Uma espada","Um livro","Uma jarra"],
                correctas: ["Uma pena","Um livro"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av4-pt",
                tipo: "texto",
                pregunta: "Quanto custa a entrada neste museu?",
                correctas: ["Grátis"]
            },
            {
                reto: 9,
                id: "R9-Av4-pt",
                tipo: "opcion",
                pregunta: "Quantos gatos podem ser vistos representados no painel?",
                opciones: ["3","4","5"],
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av4-pt",
                tipo: "texto",
                pregunta: "Que altura indica este painel?",
                correctas: ["1,90 metros"]
            },
            {
                reto: 11,
                id: "R11-Av4-pt",
                tipo: "texto",
                pregunta: "Que ano indica o painel superior?",
                correctas: ["2100"]
            },
            {
                reto: 12,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
            {
                reto: 13,
                id: "R13-Av4-pt",
                tipo: "opcion",
                pregunta: "Sabe me dizer o nome deste antigo rio?",
                opciones: ["Turia","Júcar","Segura","Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 14,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
            {
                reto: 15,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
            {
                reto: 16,
                id: "R16-Av4-pt",
                tipo: "opcion-multiple",
                pregunta: "Que usos podem ter esses ressaltos?",
                opciones: ["Parar a água","Deter as rodas das carroças","Recolher as impurezas do rio"],
                correctas: ["Deter as rodas das carroças","Recolher as impurezas do rio"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-Av4-pt",
                tipo: "opcion",
                pregunta: "No cume das torres ondeia a bandeira de Valência: as suas cores compõem-se de vermelho, amarelo e… ",
                opciones: ["Violeta","Verde","Azul"],
                correctas: ["Azul"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
            {
                reto: 19,
                id: "R19-Av4-pt",
                tipo: "opcion",
                pregunta: "A que está dedicado o museu?",
                opciones: ["Arquitetura","História","Ciências Naturais"],
                correctas: ["Ciências Naturais"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av4-pt",
                tipo: "opcion",
                pregunta: "Que figura decora a fonte?",
                opciones: ["Um pato","Uma cegonha","Um peixe"],
                correctas: ["Uma cegonha"],
                multiple: false
            },
            {
                reto: 21,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        ru: [
            // Array de retos Aventura4 RU
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av4-ru",
                tipo: "opcion",
                pregunta: "1. Сколько приключений можно совершить с Valencia be Guides?",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av4-ru",
                tipo: "opcion",
                pregunta: "2. Сейчас хорошее время для начала приключения?",
                opciones: ["Да","Нет"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av4-ru",
                tipo: "opcion",
                pregunta: "3. Можете ли вы назвать мне, как называются эти башни?",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
            {
                reto: 5,
                id: "R5-Av4-ru",
                tipo: "opcion",
                pregunta: "Над притолокой двери выделяется герб Ордена Кармелитов.",
                opciones: ["Корона","Крест","Звезда"],
                correctas: ["Корона"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-Av4-ru",
                tipo: "opcion",
                pregunta: "Что держит Богородица на руках?",
                opciones: ["Сердце","Голубь","Младенец Иисус"],
                correctas: ["Младенец Иисус"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av4-ru",
                tipo: "opcion-multiple",
                pregunta: "Что держит святая Тереза в своих руках?",
                opciones: ["Перо","Меч","Книга","Кувшин"],
                correctas: ["Перо","Книга"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av4-ru",
                tipo: "texto",
                pregunta: "Сколько стоит вход в этот музей?",
                correctas: ["Бесплатно"]
            },
            {
                reto: 9,
                id: "R9-Av4-ru",
                tipo: "opcion",
                pregunta: "Сколько кошек можно увидеть на панели?",
                opciones: ["3","4","5"],
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av4-ru",
                tipo: "texto",
                pregunta: "Какую высоту показывает эта панель?",
                correctas: ["1,90 metros"]
            },
            {
                reto: 11,
                id: "R11-Av4-ru",
                tipo: "texto",
                pregunta: "Какой год указывает верхняя панель?",
                correctas: ["2100"]
            },
            {
                reto: 12,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
            {
                reto: 13,
                id: "R13-Av4-ru",
                tipo: "opcion",
                pregunta: "Можете ли вы назвать мне имя этой древней реки?",
                opciones: ["Turia","Júcar","Segura","Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 14,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
            {
                reto: 15,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
            {
                reto: 16,
                id: "R16-Av4-ru",
                tipo: "opcion-multiple",
                pregunta: "Для чего могут использоваться эти пороги?",
                opciones: ["Остановить воду","Остановить колёса повозок","Собирать грязь из реки"],
                correctas: ["Остановить колёса повозок","Собирать грязь из реки"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-Av4-ru",
                tipo: "opcion",
                pregunta: "На вершине башен развевается флаг Валенсии: его цвета состоят из красного, жёлтого и… ",
                opciones: ["Фиолетового","Зелёного","Синего"],
                correctas: ["Синего"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
            {
                reto: 19,
                id: "R19-Av4-ru",
                tipo: "opcion",
                pregunta: "Чему посвящён музей?",
                opciones: ["Архитектура","История","Естественные науки"],
                correctas: ["Естественные науки"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av4-ru",
                tipo: "opcion",
                pregunta: "Какая фигура украшает фонтан?",
                opciones: ["Утка","Аист","Рыба"],
                correctas: ["Аист"],
                multiple: false
            },
            {
                reto: 21,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        uk: [
            // Array de retos Aventura4 UK
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av4-uk",
                tipo: "opcion",
                pregunta: "1. Скільки пригод можна здійснити з Valencia be Guides?",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av4-uk",
                tipo: "opcion",
                pregunta: "2. Зараз хороший час для початку пригоди?",
                opciones: ["Так","Ні"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av4-uk",
                tipo: "opcion",
                pregunta: "3. Чи можете ви сказати мені, як називаються ці вежі?",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
            {
                reto: 5,
                id: "R5-Av4-uk",
                tipo: "opcion",
                pregunta: "Над притолокою дверей виділяється герб Ордену Кармелітів.",
                opciones: ["Корона","Хрест","Зірка"],
                correctas: ["Корона"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-Av4-uk",
                tipo: "opcion",
                pregunta: "Що несе Богородиця на руках?",
                opciones: ["Серце","Голуб","Немовля Ісус"],
                correctas: ["Немовля Ісус"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av4-uk",
                tipo: "opcion-multiple",
                pregunta: "Що тримає свята Тереза в своїх руках?",
                opciones: ["Перо","Меч","Книга","Глечик"],
                correctas: ["Перо","Книга"],
                multiple: true
            },
            {
                reto: 8,
                id: "R8-Av4-uk",
                tipo: "texto",
                pregunta: "Скільки коштує вхід до цього музею?",
                correctas: ["Безкоштовно"]
            },
            {
                reto: 9,
                id: "R9-Av4-uk",
                tipo: "opcion",
                pregunta: "Скільки котів можна побачити на панелі?",
                opciones: ["3","4","5"],
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av4-uk",
                tipo: "texto",
                pregunta: "Яку висоту показує ця панель?",
                correctas: ["1,90 metros"]
            },
            {
                reto: 11,
                id: "R11-Av4-uk",
                tipo: "texto",
                pregunta: "Який рік вказує верхня панель?",
                correctas: ["2100"]
            },
            {
                reto: 12,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
            {
                reto: 13,
                id: "R13-Av4-uk",
                tipo: "opcion",
                pregunta: "Чи можете ви назвати мені ім'я цієї стародавньої річки?",
                opciones: ["Turia","Júcar","Segura","Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 14,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
            {
                reto: 15,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
            {
                reto: 16,
                id: "R16-Av4-uk",
                tipo: "opcion-multiple",
                pregunta: "Для чого можуть використовуватися ці пороги?",
                opciones: ["Зупинити воду","Зупинити колеса возів","Збирати бруд з річки"],
                correctas: ["Зупинити колеса возів","Збирати бруд з річки"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-Av4-uk",
                tipo: "opcion",
                pregunta: "На вершині веж майорить прапор Валенсії: його кольори складаються з червоного, жовтого і… ",
                opciones: ["Фіолетового","Зеленого","Синього"],
                correctas: ["Синього"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
            {
                reto: 19,
                id: "R19-Av4-uk",
                tipo: "opcion",
                pregunta: "Чому присвячений музей?",
                opciones: ["Архітектура","Історія","Природничі науки"],
                correctas: ["Природничі науки"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av4-uk",
                tipo: "opcion",
                pregunta: "Яка фігура прикрашає фонтан?",
                opciones: ["Качка","Лелека","Риба"],
                correctas: ["Лелека"],
                multiple: false
            },
            {
                reto: 21,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ]
    },
    Aventura5: {
        es: [
            // Array de retos Aventura5 ESPAÑOL
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av5-es",
                tipo: "opcion",
                pregunta: "1. ¿Cuántas Aventuras pueden hacerse con Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av5-es",
                tipo: "opcion",
                pregunta: "2. ¿Es buen momento para comenzar su aventura?",
                opciones: ["Sí", "NO"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av5-es",
                tipo: "opcion",
                pregunta: "3. ¿Sabía decirme cómo se llaman estas Torres?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av5-es",
                tipo: "opcion",
                pregunta: "En la cumbre de las torres ondea la bandera de Valencia: sus colores se componen de rojo, amarillo y… ",
                opciones: ["Violeta", "Verde", "Azul"],
                correctas: ["Azul"]
            },
            {
                reto: 5,
                id: "R5-Av5-es",
                tipo: "texto",
                pregunta: "¿Sabría decirme el nombre de este antiguo río?",
                correctas: ["Turia"]
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av5-es",
                tipo: "opcion",
                pregunta: "¿Sabría decirme cómo se llaman éstas fiestas populares de Valencia?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av5-es",
                tipo: "texto",
                pregunta: "¿Qué puede verse en el vano del arco central?",
                correctas: ["Una cruz"]
            },
            {
                reto: 9,
                id: "R9-Av5-es",
                tipo: "opcion",
                pregunta: "¿Qué puede verse en la locomotora?",
                opciones: ["Un dragón", "Una estrella", "Una fecha"],
                correctas: ["Una estrella"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av5-es",
                tipo: "opcion-multiple",
                pregunta: "¿Qué elementos pueden verse en esta escena?",
                opciones: ["Un fallero y una Fallera", "Naranjas", "Uva"],
                correctas: ["Un fallero y una Fallera", "Naranjas", "Uva"],
                multiple: true
            },
            {
                reto: 11,
                id: "R11-Av5-es",
                tipo: "opcion-multiple",
                pregunta: "¿Qué puede ser?",
                opciones: ["Pan de hogaza", "cangrejos", "Manzanas"],
                correctas: ["Pan de hogaza", "cangrejos"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av5-es",
                tipo: "texto",
                pregunta: "¿Cuántos animales puede numerar? Entre ellos Fíjese que hay vacas, cerdos…",
                correctas: ["?"]
            },
            {
                reto: 13,
                id: "R13-Av5-es",
                tipo: "opcion",
                pregunta: "¿Qué animal corona el escudo de Valencia?",
                opciones: ["Un dragón", "Un murciélago", "Un caballo"],
                correctas: ["Un murciélago"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av5-es",
                tipo: "texto",
                pregunta: "¿Cuántos pisos tiene este Monumento?",
                correctas: ["4"]
            },
            {
                reto: 15,
                id: "R15-Av5-es",
                tipo: "opcion",
                pregunta: "¿Qué Fruta Cítrica natural de Valencia decora la fachada?",
                opciones: ["Limones", "Pomelos", "Naranjas"],
                correctas: ["Naranjas"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av5-es",
                tipo: "texto",
                pregunta: "¿Puede encontrar su idioma?",
                correctas: ["¿sí? ¿No?"]
            },
            {
                reto: 17,
                id: "R17-Av5-es",
                tipo: "opcion",
                pregunta: "¿Qué forma tiene la fuente?",
                opciones: ["Concha", "Pez", "Persona"],
                correctas: ["Persona"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av5-es",
                tipo: "texto",
                pregunta: "¿En qué año comenzaron las obras? ¡Mire en la fachada!",
                correctas: ["1400"]
            },
            {
                reto: 19,
                id: "R19-Av5-es",
                tipo: "texto",
                pregunta: "¿Sabría decirme el año de su última rehabilitación? ¡Seguro que ya lo ha visto!",
                correctas: ["2012"]
            },
            {
                reto: 20,
                id: "R20-Av5-es",
                tipo: "texto",
                pregunta: "¿En qué año se realizaron esas obras? ¿Necesita una Pista? Mire en la fachada del edificio.",
                correctas: ["1756"],
                multiple: false
            },
            {
                reto: 21,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
            {
                reto: 22,
                id: "R22-Av5-es",
                tipo: "opcion",
                pregunta: "¿Sabría determinar qué forma tiene?",
                opciones: ["Cuadrangular", "Redonda", "Triangular"],
                correctas: ["Redonda"],
                multiple: false
            },
            {
                reto: 23,
                id: "PZ-16",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-16"
            },
            {
                reto: 24,
                id: "R24-Av5-es",
                tipo: "opcion-multiple",
                pregunta: "El barquero que rema a contracorriente.",
                opciones: ["Un hombre con rostro triste manejando un pequeño bote de madera escapa a contracorriente de un monstruo."],
                correctas: ["Un hombre con rostro triste manejando un pequeño bote de madera escapa a contracorriente de un monstruo."],
                multiple: true
            },
            {
                reto: 25,
                id: "R25-Av5-es",
                tipo: "opcion-multiple",
                pregunta: "Un árbol muerto: símbolo del Pecado, se ve entre las dos hojas de la puerta y cumple la función de parteluz.",
                opciones: ["Observe en la copa del árbol como 4 hombres desnudos se azotan entre si."],
                correctas: ["Observe en la copa del árbol como 4 hombres desnudos se azotan entre si."],
                multiple: true
            },
            {
                reto: 26,
                id: "R26-Av5-es",
                tipo: "texto",
                pregunta: "¿Cuántas perforaciones de proyectiles puede contabilizar?",
                correctas: ["?"]
            },
            {
                reto: 27,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
            {
                reto: 28,
                id: "R28-Av5-es",
                tipo: "opcion",
                pregunta: "¿Qué corona el escudo?",
                opciones: ["Una corona", "Un murciélago", "Un dragón"],
                correctas: ["Una corona"],
                multiple: false
            },
            {
                reto: 29,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        en: [
            // Array de retos Aventura5 INGLÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av5-en",
                tipo: "opcion",
                pregunta: "1. How many adventures can be done with Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av5-en",
                tipo: "opcion",
                pregunta: "2. Is it a good time to start your adventure?",
                opciones: ["Yes", "No"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av5-en",
                tipo: "opcion",
                pregunta: "Could you tell me what these towers are called?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Tower of Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av5-en",
                tipo: "opcion",
                pregunta: "At the top of the towers flies the flag of Valencia: its colours are red, yellow and…",
                opciones: ["Purple", "Green", "Blue"],
                correctas: ["Blue"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av5-en",
                tipo: "texto",
                pregunta: "Could you tell me the name of this ancient river?",
                correctas: ["Turia"],
                multiple: false
            },
            // Reto 6 (puzzle inferido desde comentarios)
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av5-en",
                tipo: "opcion",
                pregunta: "Could you tell me the name of these popular festivals in Valencia?",
                opciones: ["Las Fallas", "La Tomatina", "Midsummer bonfires"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av5-en",
                tipo: "texto",
                pregunta: "What can be seen in the span of the central arch?",
                correctas: ["A cross"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av5-en",
                tipo: "opcion",
                pregunta: "What can be seen on the locomotive?",
                opciones: ["A dragon", "A star", "A date"],
                correctas: ["A star"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av5-en",
                tipo: "opcion-multiple",
                pregunta: "What elements can be seen in this scene?",
                opciones: ["A Faller and a Fallera", "Oranges", "Grapes"],
                correctas: ["A Faller and a Fallera", "Oranges", "Grapes"],
                multiple: true
            },
            {
                reto: 11,
                id: "R11-Av5-en",
                tipo: "opcion-multiple",
                pregunta: "What could it be?",
                opciones: ["A round loaf of bread", "Crabs", "Apples"],
                correctas: ["A round loaf of bread", "Crabs"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av5-en",
                tipo: "texto",
                pregunta: "How many animals can you count? Note that there are cows, pigs…",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-Av5-en",
                tipo: "opcion",
                pregunta: "What animal tops the coat of arms of Valencia?",
                opciones: ["A dragon", "A bat", "A horse"],
                correctas: ["A bat"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av5-en",
                tipo: "texto",
                pregunta: "How many floors does this Monument have?",
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av5-en",
                tipo: "opcion",
                pregunta: "What citrus fruit native to Valencia decorates the façade?",
                opciones: ["Lemons", "Grapefruits", "Oranges"],
                correctas: ["Oranges"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av5-en",
                tipo: "texto",
                pregunta: "Can you find your language?",
                correctas: ["Yes? No?"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av5-en",
                tipo: "opcion",
                pregunta: "What shape does the fountain have?",
                opciones: ["Shell", "Fish", "Person"],
                correctas: ["Person"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av5-en",
                tipo: "texto",
                pregunta: "In what year did the construction begin? Look at the façade!",
                correctas: ["1400"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av5-en",
                tipo: "texto",
                pregunta: "Could you tell me the year of its last renovation? I'm sure you've already seen it!",
                correctas: ["2012"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av5-en",
                tipo: "texto",
                pregunta: "In what year were those works carried out? Need a clue? Look at the façade of the building.",
                correctas: ["1756"],
                multiple: false
            },
            // Reto 21 (puzzle inferido desde comentarios)
            {
                reto: 21,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
            {
                reto: 22,
                id: "R22-Av5-en",
                tipo: "opcion",
                pregunta: "Could you determine what shape it has?",
                opciones: ["Square", "Round", "Triangular"],
                correctas: ["Round"],
                multiple: false
            },
            // Reto 23 (puzzle inferido desde comentarios)
            {
                reto: 23,
                id: "PZ-16",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-16"
            },
            {
                reto: 24,
                id: "R24-Av5-en",
                tipo: "opcion-multiple",
                pregunta: "The bargeman who rows against the current.",
                opciones: ["A man with a sad face steering a small wooden boat escapes against the current from a monster."],
                correctas: ["A man with a sad face steering a small wooden boat escapes against the current from a monster."],
                multiple: true
            },
            {
                reto: 25,
                id: "R25-Av5-en",
                tipo: "opcion-multiple",
                pregunta: "A dead tree: symbol of Sin, stands between the two door panels as a central column.",
                opciones: ["Observe at the top of the tree how 4 naked men whip each other."],
                correctas: ["Observe at the top of the tree how 4 naked men whip each other."],
                multiple: true
            },
            {
                reto: 26,
                id: "R26-Av5-en",
                tipo: "texto",
                pregunta: "How many bullet holes can you count?",
                correctas: ["?"],
                multiple: false
            },
            // Reto 27 (puzzle inferido desde comentarios)
            {
                reto: 27,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
            {
                reto: 28,
                id: "R28-Av5-en",
                tipo: "opcion",
                pregunta: "What tops the coat of arms?",
                opciones: ["A crown", "A bat", "A dragon"],
                correctas: ["A crown"],
                multiple: false
            },
            // Reto 35 (puzzle inferido desde comentarios)
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        fr: [
            // Array de retos Aventura5 FRANCÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av5-fr",
                tipo: "opcion",
                pregunta: "1. Combien d'aventures peut-on faire avec Valencia be Guides ?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av5-fr",
                tipo: "opcion",
                pregunta: "2. Est-ce le bon moment pour commencer votre aventure ?",
                opciones: ["Oui", "Non"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av5-fr",
                tipo: "opcion",
                pregunta: "Pourriez-vous me dire comment s'appellent ces tours ?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av5-fr",
                tipo: "opcion",
                pregunta: "Au sommet des tours flotte le drapeau de Valence : ses couleurs se composent de rouge, jaune et…",
                opciones: ["Violet", "Vert", "Bleu"],
                correctas: ["Bleu"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av5-fr",
                tipo: "texto",
                pregunta: "Pourriez-vous me dire le nom de cet ancien fleuve ?",
                correctas: ["Turia"],
                multiple: false
            },
            // Reto 6 (puzzle inferido desde comentarios)
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av5-fr",
                tipo: "opcion",
                pregunta: "Pourriez-vous me dire le nom de ces fêtes populaires de Valence ?",
                opciones: ["Las Fallas", "La Tomatina", "Les feux de la Saint-Jean"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av5-fr",
                tipo: "texto",
                pregunta: "Que peut-on voir dans le vide de l'arc central ?",
                correctas: ["Une croix"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av5-fr",
                tipo: "opcion",
                pregunta: "Que peut-on voir sur la locomotive ?",
                opciones: ["Un dragon", "Une étoile", "Une date"],
                correctas: ["Une étoile"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av5-fr",
                tipo: "opcion-multiple",
                pregunta: "Quels éléments peut-on voir dans cette scène ?",
                opciones: ["Un Fallero et une Fallera", "Des oranges", "Du raisin"],
                correctas: ["Un Fallero et une Fallera", "Des oranges", "Du raisin"],
                multiple: true
            },
            {
                reto: 11,
                id: "R11-Av5-fr",
                tipo: "opcion-multiple",
                pregunta: "Qu'est-ce que cela pourrait être ?",
                opciones: ["Une miche de pain", "Des crabes", "Des pommes"],
                correctas: ["Une miche de pain", "Des crabes"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av5-fr",
                tipo: "texto",
                pregunta: "Combien d'animaux pouvez-vous dénombrer ? Notez qu'il y a des vaches, des cochons…",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-Av5-fr",
                tipo: "opcion",
                pregunta: "Quel animal surmonte le blason de Valence ?",
                opciones: ["Un dragon", "Une chauve-souris", "Un cheval"],
                correctas: ["Une chauve-souris"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av5-fr",
                tipo: "texto",
                pregunta: "Combien d'étages possède ce Monument ?",
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av5-fr",
                tipo: "opcion",
                pregunta: "Quel agrume natif de Valence décore la façade ?",
                opciones: ["Citrons", "Pamplemousses", "Oranges"],
                correctas: ["Oranges"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av5-fr",
                tipo: "texto",
                pregunta: "Pouvez-vous trouver votre langue ?",
                correctas: ["Oui ? Non ?"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av5-fr",
                tipo: "opcion",
                pregunta: "Quelle forme a la fontaine ?",
                opciones: ["Coquillage", "Poisson", "Personne"],
                correctas: ["Personne"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av5-fr",
                tipo: "texto",
                pregunta: "En quelle année les travaux ont-ils commencé ? Regardez la façade !",
                correctas: ["1400"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av5-fr",
                tipo: "texto",
                pregunta: "Pourriez-vous me dire l'année de sa dernière réhabilitation ? Vous l'avez sûrement déjà vu !",
                correctas: ["2012"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av5-fr",
                tipo: "texto",
                pregunta: "En quelle année ces travaux ont-ils été réalisés ? Besoin d'un indice ? Regardez la façade du bâtiment.",
                correctas: ["1756"],
                multiple: false
            },
            // Reto 21 (puzzle inferido desde comentarios)
            {
                reto: 21,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
            {
                reto: 22,
                id: "R22-Av5-fr",
                tipo: "opcion",
                pregunta: "Pourriez-vous déterminer quelle forme il a ?",
                opciones: ["Carré", "Rond", "Triangulaire"],
                correctas: ["Rond"],
                multiple: false
            },
            // Reto 23 (puzzle inferido desde comentarios)
            {
                reto: 23,
                id: "PZ-16",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-16"
            },
            {
                reto: 24,
                id: "R24-Av5-fr",
                tipo: "opcion-multiple",
                pregunta: "Le batelier qui rame à contre-courant.",
                opciones: ["Un homme au visage triste manœuvre un petit bateau en bois et s'échappe à contre-courant d'un monstre."],
                correctas: ["Un homme au visage triste manœuvre un petit bateau en bois et s'échappe à contre-courant d'un monstre."],
                multiple: true
            },
            {
                reto: 25,
                id: "R25-Av5-fr",
                tipo: "opcion-multiple",
                pregunta: "Un arbre mort : symbole du Péché, entre les deux vantaux de la porte en guise de poteau médian.",
                opciones: ["Observez au sommet de l'arbre comment 4 hommes nus se fouettent mutuellement."],
                correctas: ["Observez au sommet de l'arbre comment 4 hommes nus se fouettent mutuellement."],
                multiple: true
            },
            {
                reto: 26,
                id: "R26-Av5-fr",
                tipo: "texto",
                pregunta: "Combien de perforations de projectiles pouvez-vous comptabiliser ?",
                correctas: ["?"],
                multiple: false
            },
            // Reto 27 (puzzle inferido desde comentarios)
            {
                reto: 27,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
            {
                reto: 28,
                id: "R28-Av5-fr",
                tipo: "opcion",
                pregunta: "Qu'est-ce qui surmonte le blason ?",
                opciones: ["Une couronne", "Une chauve-souris", "Un dragon"],
                correctas: ["Une couronne"],
                multiple: false
            },
            // Reto 35 (puzzle inferido desde comentarios)
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        it: [
            // Array de retos Aventura5 ITALIANO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av5-it",
                tipo: "opcion",
                pregunta: "1. Quante avventure si possono fare con Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av5-it",
                tipo: "opcion",
                pregunta: "2. È un buon momento per iniziare la tua avventura?",
                opciones: ["Sì", "No"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av5-it",
                tipo: "opcion",
                pregunta: "Saprebbe dirmi come si chiamano queste Torri?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre di Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av5-it",
                tipo: "opcion",
                pregunta: "In cima alle torri sventola la bandiera di Valencia: i suoi colori sono rosso, giallo e…",
                opciones: ["Viola", "Verde", "Blu"],
                correctas: ["Blu"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av5-it",
                tipo: "texto",
                pregunta: "Saprebbe dirmi il nome di questo antico fiume?",
                correctas: ["Turia"],
                multiple: false
            },
            // Reto 6 (puzzle inferido desde comentarios)
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av5-it",
                tipo: "opcion",
                pregunta: "Saprebbe dirmi il nome di queste feste popolari di Valencia?",
                opciones: ["Las Fallas", "La Tomatina", "I falò di San Giovanni"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av5-it",
                tipo: "texto",
                pregunta: "Cosa si può vedere nella luce dell'arco centrale?",
                correctas: ["Una croce"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av5-it",
                tipo: "opcion",
                pregunta: "Cosa si può vedere sulla locomotiva?",
                opciones: ["Un drago", "Una stella", "Una data"],
                correctas: ["Una stella"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av5-it",
                tipo: "opcion-multiple",
                pregunta: "Quali elementi si possono vedere in questa scena?",
                opciones: ["Un Fallero e una Fallera", "Arance", "Uva"],
                correctas: ["Un Fallero e una Fallera", "Arance", "Uva"],
                multiple: true
            },
            {
                reto: 11,
                id: "R11-Av5-it",
                tipo: "opcion-multiple",
                pregunta: "Cosa potrebbe essere?",
                opciones: ["Un pane di segale", "Granchi", "Mele"],
                correctas: ["Un pane di segale", "Granchi"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av5-it",
                tipo: "texto",
                pregunta: "Quanti animali riesce a enumerare? Noti che ci sono mucche, maiali…",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-Av5-it",
                tipo: "opcion",
                pregunta: "Quale animale corona lo stemma di Valencia?",
                opciones: ["Un drago", "Un pipistrello", "Un cavallo"],
                correctas: ["Un pipistrello"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av5-it",
                tipo: "texto",
                pregunta: "Quanti piani ha questo Monumento?",
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av5-it",
                tipo: "opcion",
                pregunta: "Quale frutto agrumato tipico di Valencia decora la facciata?",
                opciones: ["Limoni", "Pompelmi", "Arance"],
                correctas: ["Arance"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av5-it",
                tipo: "texto",
                pregunta: "Riesce a trovare la sua lingua?",
                correctas: ["Sì? No?"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av5-it",
                tipo: "opcion",
                pregunta: "Che forma ha la fontana?",
                opciones: ["Conchiglia", "Pesce", "Persona"],
                correctas: ["Persona"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av5-it",
                tipo: "texto",
                pregunta: "In che anno iniziarono i lavori? Guardi la facciata!",
                correctas: ["1400"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av5-it",
                tipo: "texto",
                pregunta: "Saprebbe dirmi l'anno del suo ultimo restauro? Sono sicuro che l'ha già visto!",
                correctas: ["2012"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av5-it",
                tipo: "texto",
                pregunta: "In che anno vennero eseguiti quei lavori? Ha bisogno di un indizio? Guardi la facciata dell'edificio.",
                correctas: ["1756"],
                multiple: false
            },
            // Reto 21 (puzzle inferido desde comentarios)
            {
                reto: 21,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
            {
                reto: 22,
                id: "R22-Av5-it",
                tipo: "opcion",
                pregunta: "Saprebbe determinare che forma ha?",
                opciones: ["Quadrata", "Rotonda", "Triangolare"],
                correctas: ["Rotonda"],
                multiple: false
            },
            // Reto 23 (puzzle inferido desde comentarios)
            {
                reto: 23,
                id: "PZ-16",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-16"
            },
            {
                reto: 24,
                id: "R24-Av5-it",
                tipo: "opcion-multiple",
                pregunta: "Il barcaiolo che rema controcorrente.",
                opciones: ["Un uomo dal volto triste manovra una piccola barca di legno e fugge controcorrente da un mostro."],
                correctas: ["Un uomo dal volto triste manovra una piccola barca di legno e fugge controcorrente da un mostro."],
                multiple: true
            },
            {
                reto: 25,
                id: "R25-Av5-it",
                tipo: "opcion-multiple",
                pregunta: "Un albero morto: simbolo del Peccato, tra i due battenti della porta come trumeau.",
                opciones: ["Osservate in cima all'albero come 4 uomini nudi si fustigano a vicenda."],
                correctas: ["Osservate in cima all'albero come 4 uomini nudi si fustigano a vicenda."],
                multiple: true
            },
            {
                reto: 26,
                id: "R26-Av5-it",
                tipo: "texto",
                pregunta: "Quante perforazioni di proiettili riesce a contare?",
                correctas: ["?"],
                multiple: false
            },
            // Reto 27 (puzzle inferido desde comentarios)
            {
                reto: 27,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
            {
                reto: 28,
                id: "R28-Av5-it",
                tipo: "opcion",
                pregunta: "Cosa corona lo stemma?",
                opciones: ["Una corona", "Un pipistrello", "Un drago"],
                correctas: ["Una corona"],
                multiple: false
            },
            // Reto 35 (puzzle inferido desde comentarios)
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        nl: [
            // Array de retos Aventura5 HOLANDÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av5-nl",
                tipo: "opcion",
                pregunta: "1. Hoeveel avonturen kun je doen met València be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av5-nl",
                tipo: "opcion",
                pregunta: "2. Is het een goed moment om je avontuur te beginnen?",
                opciones: ["Ja", "Nee"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av5-nl",
                tipo: "opcion",
                pregunta: "Weet u hoe deze Torens heten?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av5-nl",
                tipo: "opcion",
                pregunta: "Aan de top van de torens wappert de vlag van Valencia: de kleuren zijn rood, geel en…",
                opciones: ["Paars", "Groen", "Blauw"],
                correctas: ["Blauw"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av5-nl",
                tipo: "texto",
                pregunta: "Kunt u mij de naam van deze oude rivier vertellen?",
                correctas: ["Turia"],
                multiple: false
            },
            // Reto 6 (puzzle inferido desde comentarios)
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av5-nl",
                tipo: "opcion",
                pregunta: "Weet u de naam van deze volksfeesten in Valencia?",
                opciones: ["Las Fallas", "La Tomatina", "Johannisvuren"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av5-nl",
                tipo: "texto",
                pregunta: "Wat is te zien in de opening van de centrale boog?",
                correctas: ["Een kruis"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av5-nl",
                tipo: "opcion",
                pregunta: "Wat is er op de locomotief te zien?",
                opciones: ["Een draak", "Een ster", "Een datum"],
                correctas: ["Een ster"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av5-nl",
                tipo: "opcion-multiple",
                pregunta: "Welke elementen zijn er in deze scène te zien?",
                opciones: ["Een Fallero en een Fallera", "Sinaasappelen", "Druiven"],
                correctas: ["Een Fallero en een Fallera", "Sinaasappelen", "Druiven"],
                multiple: true
            },
            {
                reto: 11,
                id: "R11-Av5-nl",
                tipo: "opcion-multiple",
                pregunta: "Wat zou het kunnen zijn?",
                opciones: ["Een rond brood", "Krabben", "Appels"],
                correctas: ["Een rond brood", "Krabben"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av5-nl",
                tipo: "texto",
                pregunta: "Hoeveel dieren kunt u tellen? Let op dat er koeien, varkens zijn…",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-Av5-nl",
                tipo: "opcion",
                pregunta: "Welk dier bekroont het wapen van Valencia?",
                opciones: ["Een draak", "Een vleermuis", "Een paard"],
                correctas: ["Een vleermuis"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av5-nl",
                tipo: "texto",
                pregunta: "Hoeveel verdiepingen heeft dit Monument?",
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av5-nl",
                tipo: "opcion",
                pregunta: "Welke citrusvrucht typisch voor Valencia siert de gevel?",
                opciones: ["Citroenen", "Grapefruits", "Sinaasappelen"],
                correctas: ["Sinaasappelen"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av5-nl",
                tipo: "texto",
                pregunta: "Kunt u uw taal vinden?",
                correctas: ["Ja? Nee?"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av5-nl",
                tipo: "opcion",
                pregunta: "Welke vorm heeft de fontein?",
                opciones: ["Schelp", "Vis", "Persoon"],
                correctas: ["Persoon"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av5-nl",
                tipo: "texto",
                pregunta: "In welk jaar begon de bouw? Kijk naar de gevel!",
                correctas: ["1400"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av5-nl",
                tipo: "texto",
                pregunta: "Kunt u mij het jaar van de laatste renovatie vertellen? U heeft het vast al gezien!",
                correctas: ["2012"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av5-nl",
                tipo: "texto",
                pregunta: "In welk jaar werden die werken uitgevoerd? Heeft u een hint nodig? Kijk naar de gevel van het gebouw.",
                correctas: ["1756"],
                multiple: false
            },
            // Reto 21 (puzzle inferido desde comentarios)
            {
                reto: 21,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
            {
                reto: 22,
                id: "R22-Av5-nl",
                tipo: "opcion",
                pregunta: "Kunt u bepalen welke vorm het heeft?",
                opciones: ["Vierkant", "Rond", "Driehoekig"],
                correctas: ["Rond"],
                multiple: false
            },
            // Reto 23 (puzzle inferido desde comentarios)
            {
                reto: 23,
                id: "PZ-16",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-16"
            },
            {
                reto: 24,
                id: "R24-Av5-nl",
                tipo: "opcion-multiple",
                pregunta: "De schuitenvoerder die tegen de stroom inroeit.",
                opciones: ["Een man met een droevig gezicht bestuurt een kleine houten boot en ontsnapt stroomopwaarts aan een monster."],
                correctas: ["Een man met een droevig gezicht bestuurt een kleine houten boot en ontsnapt stroomopwaarts aan een monster."],
                multiple: true
            },
            {
                reto: 25,
                id: "R25-Av5-nl",
                tipo: "opcion-multiple",
                pregunta: "Een dode boom: symbool van de Zonde, staat tussen de twee deurbladden als middenstijl.",
                opciones: ["Bekijk hoe bovenin de boom 4 naakte mannen elkaar geselen."],
                correctas: ["Bekijk hoe bovenin de boom 4 naakte mannen elkaar geselen."],
                multiple: true
            },
            {
                reto: 26,
                id: "R26-Av5-nl",
                tipo: "texto",
                pregunta: "Hoeveel kogelgaten kunt u tellen?",
                correctas: ["?"],
                multiple: false
            },
            // Reto 27 (puzzle inferido desde comentarios)
            {
                reto: 27,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
            {
                reto: 28,
                id: "R28-Av5-nl",
                tipo: "opcion",
                pregunta: "Wat bekroont het wapen?",
                opciones: ["Een kroon", "Een vleermuis", "Een draak"],
                correctas: ["Een kroon"],
                multiple: false
            },
            // Reto 35 (puzzle inferido desde comentarios)
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        ja: [
            // Array de retos Aventura5 JAPONÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av5-ja",
                tipo: "opcion",
                pregunta: "1. Valencia be Guides ではいくつのアドベンチャーが体験できますか？",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av5-ja",
                tipo: "opcion",
                pregunta: "2. 今は冒険を始めるのに良いタイミングですか？",
                opciones: ["はい", "いいえ"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av5-ja",
                tipo: "opcion",
                pregunta: "これらの塔の名前を教えていただけますか？",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av5-ja",
                tipo: "opcion",
                pregunta: "塔の頂上にはバレンシアの旗が翻っています：その色は赤、黄色、そして…",
                opciones: ["紫", "緑", "青"],
                correctas: ["青"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-Av5-ja",
                tipo: "texto",
                pregunta: "この古い川の名前を教えていただけますか？",
                correctas: ["Turia"],
                multiple: false
            },
            // Reto 6 (puzzle inferido desde comentarios)
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av5-ja",
                tipo: "opcion",
                pregunta: "バレンシアのこれらの民衆祭りの名前を教えていただけますか？",
                opciones: ["ファジャス", "ラ・トマティーナ", "ミッドサマーのかがり火"],
                correctas: ["ファジャス"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av5-ja",
                tipo: "texto",
                pregunta: "中央アーチの開口部に何が見えますか？",
                correctas: ["十字架"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av5-ja",
                tipo: "opcion",
                pregunta: "機関車に何が見えますか？",
                opciones: ["ドラゴン", "星", "日付"],
                correctas: ["星"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av5-ja",
                tipo: "opcion-multiple",
                pregunta: "このシーンに何が見えますか？",
                opciones: ["ファジェーロとファジェーラ", "オレンジ", "ぶどう"],
                correctas: ["ファジェーロとファジェーラ", "オレンジ", "ぶどう"],
                multiple: true
            },
            {
                reto: 11,
                id: "R11-Av5-ja",
                tipo: "opcion-multiple",
                pregunta: "これは何でしょうか？",
                opciones: ["丸パン", "カニ", "リンゴ"],
                correctas: ["丸パン", "カニ"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av5-ja",
                tipo: "texto",
                pregunta: "何頭の動物が数えられますか？牛、豚…があることに注目してください。",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-Av5-ja",
                tipo: "opcion",
                pregunta: "バレンシアの紋章の上にいる動物は何ですか？",
                opciones: ["ドラゴン", "コウモリ", "馬"],
                correctas: ["コウモリ"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av5-ja",
                tipo: "texto",
                pregunta: "このモニュメントは何階建てですか？",
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av5-ja",
                tipo: "opcion",
                pregunta: "バレンシア原産の柑橘類のどれがファサードを飾っていますか？",
                opciones: ["レモン", "グレープフルーツ", "オレンジ"],
                correctas: ["オレンジ"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av5-ja",
                tipo: "texto",
                pregunta: "あなたの言語を見つけられますか？",
                correctas: ["はい？いいえ？"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av5-ja",
                tipo: "opcion",
                pregunta: "噴水の形は何ですか？",
                opciones: ["貝殻", "魚", "人"],
                correctas: ["人"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av5-ja",
                tipo: "texto",
                pregunta: "工事が始まったのは何年ですか？ファサードを見てください！",
                correctas: ["1400"],
                multiple: false
            },
            {
                reto: 19,
                id: "R19-Av5-ja",
                tipo: "texto",
                pregunta: "最後の修復の年を教えていただけますか？もう見たはずです！",
                correctas: ["2012"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av5-ja",
                tipo: "texto",
                pregunta: "それらの工事が行われたのは何年ですか？ヒントが必要ですか？建物のファサードを見てください。",
                correctas: ["1756"],
                multiple: false
            },
            // Reto 21 (puzzle inferido desde comentarios)
            {
                reto: 21,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
            {
                reto: 22,
                id: "R22-Av5-ja",
                tipo: "opcion",
                pregunta: "どんな形をしているか分かりますか？",
                opciones: ["正方形", "円形", "三角形"],
                correctas: ["円形"],
                multiple: false
            },
            // Reto 23 (puzzle inferido desde comentarios)
            {
                reto: 23,
                id: "PZ-16",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-16"
            },
            {
                reto: 24,
                id: "R24-Av5-ja",
                tipo: "opcion-multiple",
                pregunta: "流れに逆らって漕ぐ渡し守。",
                opciones: ["悲しそうな顔をした男が小さな木の舟を操りながら怪物から流れに逆らって逃げています。"],
                correctas: ["悲しそうな顔をした男が小さな木の舟を操りながら怪物から流れに逆らって逃げています。"],
                multiple: true
            },
            {
                reto: 25,
                id: "R25-Av5-ja",
                tipo: "opcion-multiple",
                pregunta: "枯れ木：罪の象徴で、扉の2枚の羽の間にあり中央柱として機能しています。",
                opciones: ["木の頂上で4人の裸の男性がお互いを鞭打つ様子を観察してください。"],
                correctas: ["木の頂上で4人の裸の男性がお互いを鞭打つ様子を観察してください。"],
                multiple: true
            },
            {
                reto: 26,
                id: "R26-Av5-ja",
                tipo: "texto",
                pregunta: "弾丸の穴をいくつ数えられますか？",
                correctas: ["?"],
                multiple: false
            },
            // Reto 27 (puzzle inferido desde comentarios)
            {
                reto: 27,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
            {
                reto: 28,
                id: "R28-Av5-ja",
                tipo: "opcion",
                pregunta: "紋章の上には何がありますか？",
                opciones: ["王冠", "コウモリ", "龍"],
                correctas: ["王冠"],
                multiple: false
            },
            // Reto 35 (puzzle inferido desde comentarios)
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        de: [
            // Array de retos Aventura5 DE
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av5-de",
                tipo: "opcion",
                pregunta: "1. Wie viele Abenteuer kann man mit Valencia be Guides machen?",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av5-de",
                tipo: "opcion",
                pregunta: "2. Ist es ein guter Zeitpunkt, um Ihr Abenteuer zu beginnen?",
                opciones: ["Ja","Nein"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av5-de",
                tipo: "opcion",
                pregunta: "3. Können Sie mir sagen, wie diese Türme heißen?",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av5-de",
                tipo: "opcion",
                pregunta: "Auf dem Gipfel der Türme weht die Flagge Valencias: Ihre Farben bestehen aus Rot, Gelb und… ",
                opciones: ["Violett","Grün","Blau"],
                correctas: ["Blau"],
                multiple: null
            },
            {
                reto: 5,
                id: "R5-Av5-de",
                tipo: "texto",
                pregunta: "Können Sie mir den Namen dieses alten Flusses nennen?",
                correctas: ["Turia"]
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av5-de",
                tipo: "opcion",
                pregunta: "Können Sie mir sagen, wie diese beliebten Feste Valencias heißen?",
                opciones: ["Las Fallas","La Tomatina","Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av5-de",
                tipo: "texto",
                pregunta: "Was ist im Bogen des Mittelbogens zu sehen?",
                correctas: ["Ein Kreuz"]
            },
            {
                reto: 9,
                id: "R9-Av5-de",
                tipo: "opcion",
                pregunta: "Was ist auf der Lokomotive zu sehen?",
                opciones: ["Ein Drache","Ein Stern","Ein Datum"],
                correctas: ["Ein Stern"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av5-de",
                tipo: "opcion-multiple",
                pregunta: "Welche Elemente sind in dieser Szene zu sehen?",
                opciones: ["Ein Fallero und eine Fallera","Orangen","Weintrauben"],
                correctas: ["Ein Fallero und eine Fallera","Orangen","Weintrauben"],
                multiple: true
            },
            {
                reto: 11,
                id: "R11-Av5-de",
                tipo: "opcion-multiple",
                pregunta: "Was könnte das sein?",
                opciones: ["Brotlaib","Krabben","Äpfel"],
                correctas: ["Brotlaib","Krabben"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av5-de",
                tipo: "texto",
                pregunta: "Wie viele Tiere können Sie zählen? Darunter gibt es Kühe, Schweine…",
                correctas: ["?"]
            },
            {
                reto: 13,
                id: "R13-Av5-de",
                tipo: "opcion",
                pregunta: "Welches Tier krönt das Wappen von Valencia?",
                opciones: ["Ein Drache","Eine Fledermaus","Ein Pferd"],
                correctas: ["Eine Fledermaus"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av5-de",
                tipo: "texto",
                pregunta: "Wie viele Stockwerke hat dieses Denkmal?",
                correctas: ["4"]
            },
            {
                reto: 15,
                id: "R15-Av5-de",
                tipo: "opcion",
                pregunta: "Welche natürliche Zitrusfrucht aus Valencia schmückt die Fassade?",
                opciones: ["Zitronen","Grapefruits","Orangen"],
                correctas: ["Orangen"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av5-de",
                tipo: "texto",
                pregunta: "Können Sie Ihre Sprache finden?",
                correctas: ["¿sí? ¿No?"]
            },
            {
                reto: 17,
                id: "R17-Av5-de",
                tipo: "opcion",
                pregunta: "Welche Form hat der Brunnen?",
                opciones: ["Muschel","Fisch","Person"],
                correctas: ["Person"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av5-de",
                tipo: "texto",
                pregunta: "In welchem Jahr begannen die Bauarbeiten? Schauen Sie an der Fassade!",
                correctas: ["1400"]
            },
            {
                reto: 19,
                id: "R19-Av5-de",
                tipo: "texto",
                pregunta: "Können Sie mir das Jahr der letzten Renovierung nennen? Sie haben es sicher schon gesehen!",
                correctas: ["2012"]
            },
            {
                reto: 20,
                id: "R20-Av5-de",
                tipo: "texto",
                pregunta: "In welchem Jahr wurden diese Arbeiten durchgeführt? Brauchen Sie einen Hinweis? Schauen Sie an der Fassade des Gebäudes.",
                correctas: ["1756"]
            },
            {
                reto: 21,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
            {
                reto: 22,
                id: "R22-Av5-de",
                tipo: "opcion",
                pregunta: "Können Sie bestimmen, welche Form es hat?",
                opciones: ["Viereckig","Rund","Dreieckig"],
                correctas: ["Rund"],
                multiple: false
            },
            {
                reto: 23,
                id: "PZ-16",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-16"
            },
            {
                reto: 24,
                id: "R24-Av5-de",
                tipo: "opcion-multiple",
                pregunta: "Der Fährmann rudert gegen den Strom.",
                opciones: ["Ein Mann mit traurigem Gesicht steuert ein kleines Holzboot und flieht gegen den Strom vor einem Monster."],
                correctas: ["Ein Mann mit traurigem Gesicht steuert ein kleines Holzboot und flieht gegen den Strom vor einem Monster."],
                multiple: true
            },
            {
                reto: 25,
                id: "R25-Av5-de",
                tipo: "opcion-multiple",
                pregunta: "Ein toter Baum: Symbol der Sünde, er steht zwischen den beiden Türflügeln und dient als Mittelpfeiler.",
                opciones: ["Beobachten Sie im Wipfel des Baumes, wie 4 nackte Männer sich gegenseitig auspeitschen."],
                correctas: ["Beobachten Sie im Wipfel des Baumes, wie 4 nackte Männer sich gegenseitig auspeitschen."],
                multiple: true
            },
            {
                reto: 26,
                id: "R26-Av5-de",
                tipo: "texto",
                pregunta: "Wie viele Einschusslöcher können Sie zählen?",
                correctas: ["?"]
            },
            {
                reto: 27,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
            {
                reto: 28,
                id: "R28-Av5-de",
                tipo: "opcion",
                pregunta: "Was krönt das Wappen?",
                opciones: ["Eine Krone","Eine Fledermaus","Ein Drache"],
                correctas: ["Eine Krone"],
                multiple: false
            },
            {
                reto: 29,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        zh: [
            // Array de retos Aventura5 ZH
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av5-zh",
                tipo: "opcion",
                pregunta: "1. 使用Valencia be Guides可以进行多少次冒险？",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av5-zh",
                tipo: "opcion",
                pregunta: "2. 现在是开始冒险的好时机吗？",
                opciones: ["是","否"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av5-zh",
                tipo: "opcion",
                pregunta: "3. 您能告诉我这些塔叫什么名字吗？",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av5-zh",
                tipo: "opcion",
                pregunta: "塔顶飘扬着巴伦西亚的旗帜：其颜色由红色、黄色和…组成 ",
                opciones: ["紫色","绿色","蓝色"],
                correctas: ["蓝色"],
                multiple: null
            },
            {
                reto: 5,
                id: "R5-Av5-zh",
                tipo: "texto",
                pregunta: "您能告诉我这条古老河流的名字吗？",
                correctas: ["Turia"]
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av5-zh",
                tipo: "opcion",
                pregunta: "您能告诉我巴伦西亚这个民间节日叫什么名字吗？",
                opciones: ["法利亚节","西红柿节","圣胡安篝火节"],
                correctas: ["法利亚节"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av5-zh",
                tipo: "texto",
                pregunta: "中央拱门的拱洞里可以看到什么？",
                correctas: ["一个十字架"]
            },
            {
                reto: 9,
                id: "R9-Av5-zh",
                tipo: "opcion",
                pregunta: "火车头上可以看到什么？",
                opciones: ["一条龙","一颗星星","一个日期"],
                correctas: ["一颗星星"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av5-zh",
                tipo: "opcion-multiple",
                pregunta: "这个场景中可以看到哪些元素？",
                opciones: ["一个法利亚男和一个法利亚女","橙子","葡萄"],
                correctas: ["一个法利亚男和一个法利亚女","橙子","葡萄"],
                multiple: true
            },
            {
                reto: 11,
                id: "R11-Av5-zh",
                tipo: "opcion-multiple",
                pregunta: "这可能是什么？",
                opciones: ["圆面包","螃蟹","苹果"],
                correctas: ["圆面包","螃蟹"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av5-zh",
                tipo: "texto",
                pregunta: "您能数出几只动物？其中有奶牛、猪……",
                correctas: ["?"]
            },
            {
                reto: 13,
                id: "R13-Av5-zh",
                tipo: "opcion",
                pregunta: "什么动物装饰着巴伦西亚的盾徽？",
                opciones: ["一条龙","一只蝙蝠","一匹马"],
                correctas: ["一只蝙蝠"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av5-zh",
                tipo: "texto",
                pregunta: "这座纪念碑有几层？",
                correctas: ["4"]
            },
            {
                reto: 15,
                id: "R15-Av5-zh",
                tipo: "opcion",
                pregunta: "巴伦西亚特产的哪种柑橘水果装饰着外墙？",
                opciones: ["柠檬","葡萄柚","橙子"],
                correctas: ["橙子"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av5-zh",
                tipo: "texto",
                pregunta: "您能找到您的语言吗？",
                correctas: ["¿sí? ¿No?"]
            },
            {
                reto: 17,
                id: "R17-Av5-zh",
                tipo: "opcion",
                pregunta: "喷泉是什么形状？",
                opciones: ["贝壳","鱼","人"],
                correctas: ["人"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av5-zh",
                tipo: "texto",
                pregunta: "建筑工程始于哪一年？看外墙！",
                correctas: ["1400"]
            },
            {
                reto: 19,
                id: "R19-Av5-zh",
                tipo: "texto",
                pregunta: "您能告诉我最后一次修缮的年份吗？您肯定已经看到了！",
                correctas: ["2012"]
            },
            {
                reto: 20,
                id: "R20-Av5-zh",
                tipo: "texto",
                pregunta: "这些工程是哪一年进行的？需要提示吗？请看建筑外墙。",
                correctas: ["1756"]
            },
            {
                reto: 21,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
            {
                reto: 22,
                id: "R22-Av5-zh",
                tipo: "opcion",
                pregunta: "您能判断它是什么形状吗？",
                opciones: ["四边形","圆形","三角形"],
                correctas: ["圆形"],
                multiple: false
            },
            {
                reto: 23,
                id: "PZ-16",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-16"
            },
            {
                reto: 24,
                id: "R24-Av5-zh",
                tipo: "opcion-multiple",
                pregunta: "逆流而上的船夫。",
                opciones: ["一个面容悲伤的男人驾驶着一艘小木船，逆流逃离一只怪物。"],
                correctas: ["一个面容悲伤的男人驾驶着一艘小木船，逆流逃离一只怪物。"],
                multiple: true
            },
            {
                reto: 25,
                id: "R25-Av5-zh",
                tipo: "opcion-multiple",
                pregunta: "一棵枯死的树：罪恶的象征，位于两扇门之间，充当中柱。",
                opciones: ["观察树顶，4个裸体男人互相鞭打。"],
                correctas: ["观察树顶，4个裸体男人互相鞭打。"],
                multiple: true
            },
            {
                reto: 26,
                id: "R26-Av5-zh",
                tipo: "texto",
                pregunta: "您能数出多少个弹孔？",
                correctas: ["?"]
            },
            {
                reto: 27,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
            {
                reto: 28,
                id: "R28-Av5-zh",
                tipo: "opcion",
                pregunta: "什么装饰着盾徽顶部？",
                opciones: ["一顶王冠","一只蝙蝠","一条龙"],
                correctas: ["一顶王冠"],
                multiple: false
            },
            {
                reto: 29,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        pl: [
            // Array de retos Aventura5 PL
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av5-pl",
                tipo: "opcion",
                pregunta: "1. Ile przygód można przeżyć z Valencia be Guides?",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av5-pl",
                tipo: "opcion",
                pregunta: "2. Czy to dobry moment, aby rozpocząć przygodę?",
                opciones: ["Tak","Nie"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av5-pl",
                tipo: "opcion",
                pregunta: "3. Czy potrafi Pan/Pani powiedzieć mi, jak nazywają się te wieże?",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av5-pl",
                tipo: "opcion",
                pregunta: "Na szczycie wież powiewa flaga Walencji: jej kolory to czerwony, żółty i… ",
                opciones: ["Fioletowy","Zielony","Niebieski"],
                correctas: ["Niebieski"],
                multiple: null
            },
            {
                reto: 5,
                id: "R5-Av5-pl",
                tipo: "texto",
                pregunta: "Czy potrafi Pan/Pani powiedzieć mi nazwę tej starej rzeki?",
                correctas: ["Turia"]
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av5-pl",
                tipo: "opcion",
                pregunta: "Czy potrafi Pan/Pani powiedzieć mi, jak nazywają się te popularne święta Walencji?",
                opciones: ["Las Fallas","La Tomatina","Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av5-pl",
                tipo: "texto",
                pregunta: "Co można zobaczyć w łuku centralnego przęsła?",
                correctas: ["Krzyż"]
            },
            {
                reto: 9,
                id: "R9-Av5-pl",
                tipo: "opcion",
                pregunta: "Co można zobaczyć na lokomotywie?",
                opciones: ["Smok","Gwiazda","Data"],
                correctas: ["Gwiazda"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av5-pl",
                tipo: "opcion-multiple",
                pregunta: "Jakie elementy można zobaczyć na tej scenie?",
                opciones: ["Fallero i Fallera","Pomarańcze","Winogrona"],
                correctas: ["Fallero i Fallera","Pomarańcze","Winogrona"],
                multiple: true
            },
            {
                reto: 11,
                id: "R11-Av5-pl",
                tipo: "opcion-multiple",
                pregunta: "Co to może być?",
                opciones: ["Bochenek chleba","Kraby","Jabłka"],
                correctas: ["Bochenek chleba","Kraby"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av5-pl",
                tipo: "texto",
                pregunta: "Ile zwierząt można naliczyć? Są wśród nich krowy, świnie…",
                correctas: ["?"]
            },
            {
                reto: 13,
                id: "R13-Av5-pl",
                tipo: "opcion",
                pregunta: "Jakie zwierzę wieńczy herb Walencji?",
                opciones: ["Smok","Nietoperz","Koń"],
                correctas: ["Nietoperz"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av5-pl",
                tipo: "texto",
                pregunta: "Ile pięter ma ten Pomnik?",
                correctas: ["4"]
            },
            {
                reto: 15,
                id: "R15-Av5-pl",
                tipo: "opcion",
                pregunta: "Jakim naturalnym owocem cytrusowym z Walencji ozdobiona jest fasada?",
                opciones: ["Cytryny","Grejpfruty","Pomarańcze"],
                correctas: ["Pomarańcze"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av5-pl",
                tipo: "texto",
                pregunta: "Czy może Pan/Pani znaleźć swój język?",
                correctas: ["¿sí? ¿No?"]
            },
            {
                reto: 17,
                id: "R17-Av5-pl",
                tipo: "opcion",
                pregunta: "Jaki kształt ma fontanna?",
                opciones: ["Muszla","Ryba","Człowiek"],
                correctas: ["Człowiek"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av5-pl",
                tipo: "texto",
                pregunta: "W którym roku rozpoczęto prace? Proszę spojrzeć na fasadę!",
                correctas: ["1400"]
            },
            {
                reto: 19,
                id: "R19-Av5-pl",
                tipo: "texto",
                pregunta: "Czy potrafi Pan/Pani podać rok ostatniej renowacji? Na pewno już to widział(a)!",
                correctas: ["2012"]
            },
            {
                reto: 20,
                id: "R20-Av5-pl",
                tipo: "texto",
                pregunta: "W którym roku przeprowadzono te prace? Potrzebuje Pan/Pani wskazówki? Proszę spojrzeć na fasadę budynku.",
                correctas: ["1756"]
            },
            {
                reto: 21,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
            {
                reto: 22,
                id: "R22-Av5-pl",
                tipo: "opcion",
                pregunta: "Czy potrafi Pan/Pani określić, jaki ma kształt?",
                opciones: ["Czworokątny","Okrągły","Trójkątny"],
                correctas: ["Okrągły"],
                multiple: false
            },
            {
                reto: 23,
                id: "PZ-16",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-16"
            },
            {
                reto: 24,
                id: "R24-Av5-pl",
                tipo: "opcion-multiple",
                pregunta: "Wioślarz płynący pod prąd.",
                opciones: ["Smutny mężczyzna sterujący małą drewnianą łódką ucieka pod prąd przed potworem."],
                correctas: ["Smutny mężczyzna sterujący małą drewnianą łódką ucieka pod prąd przed potworem."],
                multiple: true
            },
            {
                reto: 25,
                id: "R25-Av5-pl",
                tipo: "opcion-multiple",
                pregunta: "Martwe drzewo: symbol Grzechu, stoi między dwoma skrzydłami drzwi i pełni funkcję słupa środkowego.",
                opciones: ["Obserwuj w koronie drzewa, jak 4 nagie mężczyźni wzajemnie się chłostają."],
                correctas: ["Obserwuj w koronie drzewa, jak 4 nagie mężczyźni wzajemnie się chłostają."],
                multiple: true
            },
            {
                reto: 26,
                id: "R26-Av5-pl",
                tipo: "texto",
                pregunta: "Ile otworów po pociskach można zliczyć?",
                correctas: ["?"]
            },
            {
                reto: 27,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
            {
                reto: 28,
                id: "R28-Av5-pl",
                tipo: "opcion",
                pregunta: "Co wieńczy herb?",
                opciones: ["Korona","Nietoperz","Smok"],
                correctas: ["Korona"],
                multiple: false
            },
            {
                reto: 29,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        pt: [
            // Array de retos Aventura5 PT
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av5-pt",
                tipo: "opcion",
                pregunta: "1. Quantas Aventuras podem ser feitas com Valencia be Guides?",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av5-pt",
                tipo: "opcion",
                pregunta: "2. É um bom momento para começar a sua aventura?",
                opciones: ["Sim","Não"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av5-pt",
                tipo: "opcion",
                pregunta: "3. Sabe me dizer como se chamam estas Torres?",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av5-pt",
                tipo: "opcion",
                pregunta: "No cume das torres ondeia a bandeira de Valência: as suas cores compõem-se de vermelho, amarelo e… ",
                opciones: ["Violeta","Verde","Azul"],
                correctas: ["Azul"],
                multiple: null
            },
            {
                reto: 5,
                id: "R5-Av5-pt",
                tipo: "texto",
                pregunta: "Sabe me dizer o nome deste antigo rio?",
                correctas: ["Turia"]
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av5-pt",
                tipo: "opcion",
                pregunta: "Sabe me dizer como se chamam estas festas populares de Valência?",
                opciones: ["Las Fallas","La Tomatina","Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av5-pt",
                tipo: "texto",
                pregunta: "O que se pode ver na abertura do arco central?",
                correctas: ["Uma cruz"]
            },
            {
                reto: 9,
                id: "R9-Av5-pt",
                tipo: "opcion",
                pregunta: "O que se pode ver na locomotiva?",
                opciones: ["Um dragão","Uma estrela","Uma data"],
                correctas: ["Uma estrela"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av5-pt",
                tipo: "opcion-multiple",
                pregunta: "Que elementos podem ser vistos nesta cena?",
                opciones: ["Um fallero e uma Fallera","Laranjas","Uva"],
                correctas: ["Um fallero e uma Fallera","Laranjas","Uva"],
                multiple: true
            },
            {
                reto: 11,
                id: "R11-Av5-pt",
                tipo: "opcion-multiple",
                pregunta: "O que pode ser?",
                opciones: ["Pão de forma","Caranguejos","Maçãs"],
                correctas: ["Pão de forma","Caranguejos"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av5-pt",
                tipo: "texto",
                pregunta: "Quantos animais consegue contar? Entre eles há vacas, porcos…",
                correctas: ["?"]
            },
            {
                reto: 13,
                id: "R13-Av5-pt",
                tipo: "opcion",
                pregunta: "Que animal coroa o escudo de Valência?",
                opciones: ["Um dragão","Um morcego","Um cavalo"],
                correctas: ["Um morcego"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av5-pt",
                tipo: "texto",
                pregunta: "Quantos andares tem este Monumento?",
                correctas: ["4"]
            },
            {
                reto: 15,
                id: "R15-Av5-pt",
                tipo: "opcion",
                pregunta: "Que Fruto Cítrico natural de Valência decora a fachada?",
                opciones: ["Limões","Toranjas","Laranjas"],
                correctas: ["Laranjas"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av5-pt",
                tipo: "texto",
                pregunta: "Consegue encontrar o seu idioma?",
                correctas: ["¿sí? ¿No?"]
            },
            {
                reto: 17,
                id: "R17-Av5-pt",
                tipo: "opcion",
                pregunta: "Que forma tem a fonte?",
                opciones: ["Concha","Peixe","Pessoa"],
                correctas: ["Pessoa"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av5-pt",
                tipo: "texto",
                pregunta: "Em que ano começaram as obras? Olhe para a fachada!",
                correctas: ["1400"]
            },
            {
                reto: 19,
                id: "R19-Av5-pt",
                tipo: "texto",
                pregunta: "Sabe me dizer o ano da sua última reabilitação? Certamente já o viu!",
                correctas: ["2012"]
            },
            {
                reto: 20,
                id: "R20-Av5-pt",
                tipo: "texto",
                pregunta: "Em que ano foram realizadas essas obras? Precisa de uma Pista? Olhe para a fachada do edifício.",
                correctas: ["1756"]
            },
            {
                reto: 21,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
            {
                reto: 22,
                id: "R22-Av5-pt",
                tipo: "opcion",
                pregunta: "Consegue determinar que forma tem?",
                opciones: ["Quadrangular","Redonda","Triangular"],
                correctas: ["Redonda"],
                multiple: false
            },
            {
                reto: 23,
                id: "PZ-16",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-16"
            },
            {
                reto: 24,
                id: "R24-Av5-pt",
                tipo: "opcion-multiple",
                pregunta: "O barqueiro que rema contra a corrente.",
                opciones: ["Um homem com rosto triste a guiar um pequeno barco de madeira foge contra a corrente de um monstro."],
                correctas: ["Um homem com rosto triste a guiar um pequeno barco de madeira foge contra a corrente de um monstro."],
                multiple: true
            },
            {
                reto: 25,
                id: "R25-Av5-pt",
                tipo: "opcion-multiple",
                pregunta: "Uma árvore morta: símbolo do Pecado, vista entre as duas folhas da porta e cumpre a função de coluna central.",
                opciones: ["Observe na copa da árvore como 4 homens nus se açoitam mutuamente."],
                correctas: ["Observe na copa da árvore como 4 homens nus se açoitam mutuamente."],
                multiple: true
            },
            {
                reto: 26,
                id: "R26-Av5-pt",
                tipo: "texto",
                pregunta: "Quantas perfurações de projéteis consegue contabilizar?",
                correctas: ["?"]
            },
            {
                reto: 27,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
            {
                reto: 28,
                id: "R28-Av5-pt",
                tipo: "opcion",
                pregunta: "O que coroa o escudo?",
                opciones: ["Uma coroa","Um morcego","Um dragão"],
                correctas: ["Uma coroa"],
                multiple: false
            },
            {
                reto: 29,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        ru: [
            // Array de retos Aventura5 RU
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av5-ru",
                tipo: "opcion",
                pregunta: "1. Сколько приключений можно совершить с Valencia be Guides?",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av5-ru",
                tipo: "opcion",
                pregunta: "2. Сейчас хорошее время для начала приключения?",
                opciones: ["Да","Нет"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av5-ru",
                tipo: "opcion",
                pregunta: "3. Можете ли вы назвать мне, как называются эти башни?",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av5-ru",
                tipo: "opcion",
                pregunta: "На вершине башен развевается флаг Валенсии: его цвета состоят из красного, жёлтого и… ",
                opciones: ["Фиолетового","Зелёного","Синего"],
                correctas: ["Синего"],
                multiple: null
            },
            {
                reto: 5,
                id: "R5-Av5-ru",
                tipo: "texto",
                pregunta: "Можете ли вы назвать мне имя этой древней реки?",
                correctas: ["Turia"]
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av5-ru",
                tipo: "opcion",
                pregunta: "Можете ли вы назвать мне эти народные праздники Валенсии?",
                opciones: ["Лас Фальяс","Ла Томатина","Ночные костры Сан-Хуана"],
                correctas: ["Лас Фальяс"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av5-ru",
                tipo: "texto",
                pregunta: "Что можно увидеть в арочном проёме центральной арки?",
                correctas: ["Крест"]
            },
            {
                reto: 9,
                id: "R9-Av5-ru",
                tipo: "opcion",
                pregunta: "Что можно увидеть на локомотиве?",
                opciones: ["Дракон","Звезда","Дата"],
                correctas: ["Звезда"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av5-ru",
                tipo: "opcion-multiple",
                pregunta: "Какие элементы можно увидеть на этой сцене?",
                opciones: ["Фальеро и Фальера","Апельсины","Виноград"],
                correctas: ["Фальеро и Фальера","Апельсины","Виноград"],
                multiple: true
            },
            {
                reto: 11,
                id: "R11-Av5-ru",
                tipo: "opcion-multiple",
                pregunta: "Что это может быть?",
                opciones: ["Буханка хлеба","Крабы","Яблоки"],
                correctas: ["Буханка хлеба","Крабы"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av5-ru",
                tipo: "texto",
                pregunta: "Сколько животных можно насчитать? Среди них коровы, свиньи…",
                correctas: ["?"]
            },
            {
                reto: 13,
                id: "R13-Av5-ru",
                tipo: "opcion",
                pregunta: "Какое животное венчает герб Валенсии?",
                opciones: ["Дракон","Летучая мышь","Лошадь"],
                correctas: ["Летучая мышь"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av5-ru",
                tipo: "texto",
                pregunta: "Сколько этажей у этого Монумента?",
                correctas: ["4"]
            },
            {
                reto: 15,
                id: "R15-Av5-ru",
                tipo: "opcion",
                pregunta: "Каким натуральным цитрусовым фруктом из Валенсии украшен фасад?",
                opciones: ["Лимоны","Грейпфруты","Апельсины"],
                correctas: ["Апельсины"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av5-ru",
                tipo: "texto",
                pregunta: "Можете ли вы найти свой язык?",
                correctas: ["¿sí? ¿No?"]
            },
            {
                reto: 17,
                id: "R17-Av5-ru",
                tipo: "opcion",
                pregunta: "Какую форму имеет фонтан?",
                opciones: ["Ракушка","Рыба","Человек"],
                correctas: ["Человек"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av5-ru",
                tipo: "texto",
                pregunta: "В каком году началось строительство? Посмотрите на фасад!",
                correctas: ["1400"]
            },
            {
                reto: 19,
                id: "R19-Av5-ru",
                tipo: "texto",
                pregunta: "Можете ли вы назвать год последней реставрации? Вы наверняка уже видели это!",
                correctas: ["2012"]
            },
            {
                reto: 20,
                id: "R20-Av5-ru",
                tipo: "texto",
                pregunta: "В каком году проводились эти работы? Нужна подсказка? Посмотрите на фасад здания.",
                correctas: ["1756"]
            },
            {
                reto: 21,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
            {
                reto: 22,
                id: "R22-Av5-ru",
                tipo: "opcion",
                pregunta: "Можете ли вы определить, какую форму он имеет?",
                opciones: ["Четырёхугольная","Круглая","Треугольная"],
                correctas: ["Круглая"],
                multiple: false
            },
            {
                reto: 23,
                id: "PZ-16",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-16"
            },
            {
                reto: 24,
                id: "R24-Av5-ru",
                tipo: "opcion-multiple",
                pregunta: "Гребец, плывущий против течения.",
                opciones: ["Грустный мужчина управляет маленькой деревянной лодкой и бежит против течения от монстра."],
                correctas: ["Грустный мужчина управляет маленькой деревянной лодкой и бежит против течения от монстра."],
                multiple: true
            },
            {
                reto: 25,
                id: "R25-Av5-ru",
                tipo: "opcion-multiple",
                pregunta: "Мёртвое дерево: символ Греха, стоит между двумя створками двери и выполняет функцию средника.",
                opciones: ["Понаблюдайте на верхушке дерева, как 4 обнажённых мужчины хлещут друг друга."],
                correctas: ["Понаблюдайте на верхушке дерева, как 4 обнажённых мужчины хлещут друг друга."],
                multiple: true
            },
            {
                reto: 26,
                id: "R26-Av5-ru",
                tipo: "texto",
                pregunta: "Сколько пулевых отверстий вы можете насчитать?",
                correctas: ["?"]
            },
            {
                reto: 27,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
            {
                reto: 28,
                id: "R28-Av5-ru",
                tipo: "opcion",
                pregunta: "Что венчает герб?",
                opciones: ["Корона","Летучая мышь","Дракон"],
                correctas: ["Корона"],
                multiple: false
            },
            {
                reto: 29,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        uk: [
            // Array de retos Aventura5 UK
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av5-uk",
                tipo: "opcion",
                pregunta: "1. Скільки пригод можна здійснити з Valencia be Guides?",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av5-uk",
                tipo: "opcion",
                pregunta: "2. Зараз хороший час для початку пригоди?",
                opciones: ["Так","Ні"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av5-uk",
                tipo: "opcion",
                pregunta: "3. Чи можете ви сказати мені, як називаються ці вежі?",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av5-uk",
                tipo: "opcion",
                pregunta: "На вершині веж майорить прапор Валенсії: його кольори складаються з червоного, жовтого і… ",
                opciones: ["Фіолетового","Зеленого","Синього"],
                correctas: ["Синього"],
                multiple: null
            },
            {
                reto: 5,
                id: "R5-Av5-uk",
                tipo: "texto",
                pregunta: "Чи можете ви назвати мені ім'я цієї стародавньої річки?",
                correctas: ["Turia"]
            },
            {
                reto: 6,
                id: "PZ-08",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-08"
            },
            {
                reto: 7,
                id: "R7-Av5-uk",
                tipo: "opcion",
                pregunta: "Чи можете ви сказати мені, як називаються ці народні свята Валенсії?",
                opciones: ["Лас Фальяс","Ла Томатіна","Вогнища Святого Хуана"],
                correctas: ["Лас Фальяс"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av5-uk",
                tipo: "texto",
                pregunta: "Що можна побачити у прольоті центральної арки?",
                correctas: ["Хрест"]
            },
            {
                reto: 9,
                id: "R9-Av5-uk",
                tipo: "opcion",
                pregunta: "Що можна побачити на локомотиві?",
                opciones: ["Дракон","Зірка","Дата"],
                correctas: ["Зірка"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av5-uk",
                tipo: "opcion-multiple",
                pregunta: "Які елементи можна побачити на цій сцені?",
                opciones: ["Фальєро та Фальєра","Апельсини","Виноград"],
                correctas: ["Фальєро та Фальєра","Апельсини","Виноград"],
                multiple: true
            },
            {
                reto: 11,
                id: "R11-Av5-uk",
                tipo: "opcion-multiple",
                pregunta: "Що це може бути?",
                opciones: ["Буханець хліба","Краби","Яблука"],
                correctas: ["Буханець хліба","Краби"],
                multiple: true
            },
            {
                reto: 12,
                id: "R12-Av5-uk",
                tipo: "texto",
                pregunta: "Скільки тварин ви можете порахувати? Серед них корови, свині…",
                correctas: ["?"]
            },
            {
                reto: 13,
                id: "R13-Av5-uk",
                tipo: "opcion",
                pregunta: "Яка тварина вінчає герб Валенсії?",
                opciones: ["Дракон","Кажан","Кінь"],
                correctas: ["Кажан"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av5-uk",
                tipo: "texto",
                pregunta: "Скільки поверхів у цьому Монументі?",
                correctas: ["4"]
            },
            {
                reto: 15,
                id: "R15-Av5-uk",
                tipo: "opcion",
                pregunta: "Яким натуральним цитрусовим фруктом з Валенсії прикрашений фасад?",
                opciones: ["Лимони","Грейпфрути","Апельсини"],
                correctas: ["Апельсини"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av5-uk",
                tipo: "texto",
                pregunta: "Чи можете ви знайти свою мову?",
                correctas: ["¿sí? ¿No?"]
            },
            {
                reto: 17,
                id: "R17-Av5-uk",
                tipo: "opcion",
                pregunta: "Яку форму має фонтан?",
                opciones: ["Мушля","Риба","Людина"],
                correctas: ["Людина"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av5-uk",
                tipo: "texto",
                pregunta: "У якому році розпочалися будівельні роботи? Подивіться на фасад!",
                correctas: ["1400"]
            },
            {
                reto: 19,
                id: "R19-Av5-uk",
                tipo: "texto",
                pregunta: "Чи можете ви назвати рік останньої реставрації? Ви напевно вже це бачили!",
                correctas: ["2012"]
            },
            {
                reto: 20,
                id: "R20-Av5-uk",
                tipo: "texto",
                pregunta: "У якому році проводилися ці роботи? Потрібна підказка? Подивіться на фасад будівлі.",
                correctas: ["1756"]
            },
            {
                reto: 21,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
            {
                reto: 22,
                id: "R22-Av5-uk",
                tipo: "opcion",
                pregunta: "Чи можете ви визначити, яку форму вона має?",
                opciones: ["Чотирикутна","Кругла","Трикутна"],
                correctas: ["Кругла"],
                multiple: false
            },
            {
                reto: 23,
                id: "PZ-16",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-16"
            },
            {
                reto: 24,
                id: "R24-Av5-uk",
                tipo: "opcion-multiple",
                pregunta: "Весляр, який гребе проти течії.",
                opciones: ["Сумний чоловік керує маленьким дерев'яним човном і тікає проти течії від монстра."],
                correctas: ["Сумний чоловік керує маленьким дерев'яним човном і тікає проти течії від монстра."],
                multiple: true
            },
            {
                reto: 25,
                id: "R25-Av5-uk",
                tipo: "opcion-multiple",
                pregunta: "Мертве дерево: символ Гріха, знаходиться між двома стулками дверей і виконує функцію середника.",
                opciones: ["Понаблюдайте на верхівці дерева, як 4 оголені чоловіки хлещуть один одного."],
                correctas: ["Понаблюдайте на верхівці дерева, як 4 оголені чоловіки хлещуть один одного."],
                multiple: true
            },
            {
                reto: 26,
                id: "R26-Av5-uk",
                tipo: "texto",
                pregunta: "Скільки пробоїн від куль ви можете порахувати?",
                correctas: ["?"]
            },
            {
                reto: 27,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
            {
                reto: 28,
                id: "R28-Av5-uk",
                tipo: "opcion",
                pregunta: "Що вінчає герб?",
                opciones: ["Корона","Кажан","Дракон"],
                correctas: ["Корона"],
                multiple: false
            },
            {
                reto: 29,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ]
    },
    AventuraFallas: {
        es: [
            // Array de retos AventuraFallas ESPAÑOL
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-AvFallas-es",
                tipo: "opcion",
                pregunta: "¿Cuántas Aventuras pueden hacerse con Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-AvFallas-es",
                tipo: "opcion",
                pregunta: "¿Es buen momento para comenzar su aventura?",
                opciones: ["Sí", "NO"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-AvFallas-es",
                tipo: "opcion",
                pregunta: "¿Sabía decirme cómo se llaman estas Torres?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-AvFallas-es",
                tipo: "opcion",
                pregunta: "En la cumbre de las torres ondea la bandera de Valencia: sus colores se componen de rojo, amarillo y… ?",
                opciones: ["Violeta", "Verde", "Azul"],
                correctas: ["Azul"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-AvFallas-es",
                tipo: "texto",
                pregunta: "¿Sabría decirme el nombre de la calle?",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-AvFallas-es",
                tipo: "opcion",
                pregunta: "¿Qué porta San Lorenzo en la mano?",
                opciones: ["Una Paloma", "Una cuchara", "Una parrilla"],
                correctas: ["Una parrilla"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-AvFallas-es",
                tipo: "opcion",
                pregunta: "¿Con qué mano sujeta Neptuno la cornucopia?",
                opciones: ["Izquierda", "Derecha"],
                correctas: ["Derecha"],
                multiple: false
            },
            {
                reto: 8,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 9,
                id: "R9-AvFallas-es",
                tipo: "opcion",
                pregunta: "¿Sabría determinar qué geometría tiene el Cimborrio de la Catedral de Valencia? ",
                opciones: ["Hexagonal", "Octogonal", "Cuadradrangular"],
                correctas: ["Octogonal"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-AvFallas-es",
                tipo: "texto",
                pregunta: "¿Cuántas ventanas puede ver? ",
                correctas: ["?"],
            },
            {
                reto: 11,
                id: "PZ-17",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-17"
            },
            {
                reto: 12,
                id: "R12-AvFallas-es",
                tipo: "opcion",
                pregunta: "¿Recuerda qué animal corona el escudo de Valencia? ",
                opciones: ["Murciélago", "Dragón", "León"],
                correctas: ["Murciélago"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-AvFallas-es",
                tipo: "opcion-multiple",
                pregunta: "Sobre la entrada principal, en un arco de medio punto, figuras alegóricas representan a los cinco continentes. ¿Qué porta la figura central?",
                opciones: ["Una Antorcha", "Una Espada", "Una Corona"],
                correctas: ["Una Antorcha", "Una Espada"],
                multiple: true
            },
            {
                reto: 14,
                id: "R14-AvFallas-es",
                tipo: "opcion",
                pregunta: "¿Qué porta la figura en la mano?",
                opciones: ["Una balanza", "Un libro", "Una pluma"],
                correctas: ["Una balanza"],
                multiple: false
            },
             {
                reto: 15,
                id: "R15-AvFallas-es",
                tipo: "opcion",
                pregunta: "Busque la vidriera con los colores de la Señera valenciana en la fachada del edificio. ¿Sabría determinar qué forma tiene?",
                opciones: ["Cuadrangular", "Redonda", "Triangular"],
                correctas: ["Redonda"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-AvFallas-es",
                tipo: "opcion-multiple",
                pregunta: "¿Qué sostiene la virgen en su mano?",
                opciones: ["Un Rosario", "Un niño", "Una corona"],
                correctas: ["Un Rosario", "Un niño"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-AvFallas-es",
                tipo: "opcion",
                pregunta: "¿Qué le entrega el ángel al niño?",
                opciones: ["Una paloma", "Un orbe", "Alimentos"],
                correctas: ["Un orbe"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 19,
                id: "R19-AvFallas-es",
                tipo: "opcion",
                pregunta: "¿Qué sostiene el niño en sus manos?",
                opciones: ["Una paloma", "Una Concha", "Alimentos"],
                correctas: ["Una Concha"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            },
        ],
        en: [
            // Array de retos AventuraFallas INGLÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-AvFallas-en",
                tipo: "opcion",
                pregunta: "1. How many adventures can be done with Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-AvFallas-en",
                tipo: "opcion",
                pregunta: "2. Is it a good time to start your adventure?",
                opciones: ["Yes", "No"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-AvFallas-en",
                tipo: "opcion",
                pregunta: "Could you tell me what these towers are called?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Tower of Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-AvFallas-en",
                tipo: "opcion",
                pregunta: "At the top of the towers flies the flag of Valencia: its colours are red, yellow and…?",
                opciones: ["Purple", "Green", "Blue"],
                correctas: ["Blue"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-AvFallas-en",
                tipo: "texto",
                pregunta: "Could you tell me the name of this street?",
                correctas: ["Calle Muro de Santa Ana"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-AvFallas-en",
                tipo: "opcion",
                pregunta: "What is Saint Lawrence holding in his hand?",
                opciones: ["A Dove", "A spoon", "A grill"],
                correctas: ["A grill"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-AvFallas-en",
                tipo: "opcion",
                pregunta: "With which hand does Neptune hold the cornucopia?",
                opciones: ["Left", "Right"],
                correctas: ["Right"],
                multiple: false
            },
            {
                reto: 8,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 9,
                id: "R9-AvFallas-en",
                tipo: "opcion",
                pregunta: "Could you determine what geometry the Cimborrio of the Cathedral of Valencia has?",
                opciones: ["Hexagonal", "Octagonal", "Square"],
                correctas: ["Octagonal"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-AvFallas-en",
                tipo: "texto",
                pregunta: "How many windows can you see?",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 11,
                id: "PZ-17",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-17"
            },
            {
                reto: 12,
                id: "R12-AvFallas-en",
                tipo: "opcion",
                pregunta: "Do you remember which animal tops the coat of arms of Valencia?",
                opciones: ["Bat", "Dragon", "Lion"],
                correctas: ["Bat"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-AvFallas-en",
                tipo: "opcion-multiple",
                pregunta: "Above the main entrance, in a rounded arch, allegorical figures represent the five continents. What does the central figure carry?",
                opciones: ["A Torch", "A Sword", "A Crown"],
                correctas: ["A Torch", "A Sword"],
                multiple: true
            },
            {
                reto: 14,
                id: "R14-AvFallas-en",
                tipo: "opcion",
                pregunta: "What is the figure holding in its hand?",
                opciones: ["A balance", "A book", "A quill"],
                correctas: ["A balance"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-AvFallas-en",
                tipo: "opcion",
                pregunta: "Find the stained-glass window with the colours of the Valencian Senyera on the façade of the building. Could you determine what shape it has?",
                opciones: ["Square", "Round", "Triangular"],
                correctas: ["Round"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-AvFallas-en",
                tipo: "opcion-multiple",
                pregunta: "What does the Virgin hold in her hand?",
                opciones: ["A Rosary", "A child", "A crown"],
                correctas: ["A Rosary", "A child"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-AvFallas-en",
                tipo: "opcion",
                pregunta: "What does the angel give to the child?",
                opciones: ["A dove", "An orb", "Food"],
                correctas: ["An orb"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 19,
                id: "R19-AvFallas-en",
                tipo: "opcion",
                pregunta: "What is the child holding in his hands?",
                opciones: ["A dove", "A shell", "Food"],
                correctas: ["A shell"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            },
        ],
        fr: [
            // Array de retos AventuraFallas FRANCÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-AvFallas-fr",
                tipo: "opcion",
                pregunta: "1. Combien d'aventures peut-on faire avec Valencia be Guides ?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-AvFallas-fr",
                tipo: "opcion",
                pregunta: "2. Est-ce le bon moment pour commencer votre aventure ?",
                opciones: ["Oui", "Non"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-AvFallas-fr",
                tipo: "opcion",
                pregunta: "Pourriez-vous me dire comment s'appellent ces tours ?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-AvFallas-fr",
                tipo: "opcion",
                pregunta: "Au sommet des tours flotte le drapeau de Valence : ses couleurs se composent de rouge, jaune et… ?",
                opciones: ["Violet", "Vert", "Bleu"],
                correctas: ["Bleu"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-AvFallas-fr",
                tipo: "texto",
                pregunta: "Pourriez-vous me dire le nom de cette rue ?",
                correctas: ["Calle Muro de Santa Ana"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-AvFallas-fr",
                tipo: "opcion",
                pregunta: "Que porte Saint Laurent dans la main ?",
                opciones: ["Une Colombe", "Une cuillère", "Un gril"],
                correctas: ["Un gril"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-AvFallas-fr",
                tipo: "opcion",
                pregunta: "De quelle main Neptune tient-il la corne d'abondance ?",
                opciones: ["Gauche", "Droite"],
                correctas: ["Droite"],
                multiple: false
            },
            {
                reto: 8,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 9,
                id: "R9-AvFallas-fr",
                tipo: "opcion",
                pregunta: "Pourriez-vous déterminer quelle géométrie a le Cimborrio de la Cathédrale de Valence ?",
                opciones: ["Hexagonale", "Octogonale", "Carrée"],
                correctas: ["Octogonale"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-AvFallas-fr",
                tipo: "texto",
                pregunta: "Combien de fenêtres pouvez-vous voir ?",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 11,
                id: "PZ-17",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-17"
            },
            {
                reto: 12,
                id: "R12-AvFallas-fr",
                tipo: "opcion",
                pregunta: "Vous souvenez-vous quel animal surmonte le blason de Valence ?",
                opciones: ["Chauve-souris", "Dragon", "Lion"],
                correctas: ["Chauve-souris"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-AvFallas-fr",
                tipo: "opcion-multiple",
                pregunta: "Au-dessus de l'entrée principale, dans un arc en plein cintre, des figures allégoriques représentent les cinq continents. Que porte la figure centrale ?",
                opciones: ["Une Torche", "Une Épée", "Une Couronne"],
                correctas: ["Une Torche", "Une Épée"],
                multiple: true
            },
            {
                reto: 14,
                id: "R14-AvFallas-fr",
                tipo: "opcion",
                pregunta: "Que tient la figure dans la main ?",
                opciones: ["Une balance", "Un livre", "Une plume"],
                correctas: ["Une balance"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-AvFallas-fr",
                tipo: "opcion",
                pregunta: "Cherchez le vitrail aux couleurs de la Senyera valencienne sur la façade du bâtiment. Pourriez-vous déterminer quelle forme il a ?",
                opciones: ["Carré", "Rond", "Triangulaire"],
                correctas: ["Rond"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-AvFallas-fr",
                tipo: "opcion-multiple",
                pregunta: "Que tient la Vierge dans sa main ?",
                opciones: ["Un Rosaire", "Un enfant", "Une couronne"],
                correctas: ["Un Rosaire", "Un enfant"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-AvFallas-fr",
                tipo: "opcion",
                pregunta: "Que donne l'ange à l'enfant ?",
                opciones: ["Une colombe", "Un orbe", "De la nourriture"],
                correctas: ["Un orbe"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 19,
                id: "R19-AvFallas-fr",
                tipo: "opcion",
                pregunta: "Que tient l'enfant dans ses mains ?",
                opciones: ["Une colombe", "Un coquillage", "De la nourriture"],
                correctas: ["Un coquillage"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            },
        ],
        it: [
            // Array de retos AventuraFallas ITALIANO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-AvFallas-it",
                tipo: "opcion",
                pregunta: "1. Quante avventure si possono fare con Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-AvFallas-it",
                tipo: "opcion",
                pregunta: "2. È un buon momento per iniziare la tua avventura?",
                opciones: ["Sì", "No"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-AvFallas-it",
                tipo: "opcion",
                pregunta: "Saprebbe dirmi come si chiamano queste Torri?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre di Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-AvFallas-it",
                tipo: "opcion",
                pregunta: "In cima alle torri sventola la bandiera di Valencia: i suoi colori sono rosso, giallo e… ?",
                opciones: ["Viola", "Verde", "Blu"],
                correctas: ["Blu"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-AvFallas-it",
                tipo: "texto",
                pregunta: "Saprebbe dirmi il nome di questa via?",
                correctas: ["Calle Muro de Santa Ana"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-AvFallas-it",
                tipo: "opcion",
                pregunta: "Cosa porta San Lorenzo in mano?",
                opciones: ["Una Colomba", "Un cucchiaio", "Una graticola"],
                correctas: ["Una graticola"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-AvFallas-it",
                tipo: "opcion",
                pregunta: "Con quale mano Nettuno tiene la cornucopia?",
                opciones: ["Sinistra", "Destra"],
                correctas: ["Destra"],
                multiple: false
            },
            {
                reto: 8,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 9,
                id: "R9-AvFallas-it",
                tipo: "opcion",
                pregunta: "Saprebbe determinare quale geometria ha il Cimborrio della Cattedrale di Valencia?",
                opciones: ["Esagonale", "Ottagonale", "Quadrata"],
                correctas: ["Ottagonale"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-AvFallas-it",
                tipo: "texto",
                pregunta: "Quante finestre riesce a vedere?",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 11,
                id: "PZ-17",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-17"
            },
            {
                reto: 12,
                id: "R12-AvFallas-it",
                tipo: "opcion",
                pregunta: "Si ricorda quale animale corona lo stemma di Valencia?",
                opciones: ["Pipistrello", "Drago", "Leone"],
                correctas: ["Pipistrello"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-AvFallas-it",
                tipo: "opcion-multiple",
                pregunta: "Sopra l'ingresso principale, in un arco a tutto sesto, figure allegoriche rappresentano i cinque continenti. Cosa porta la figura centrale?",
                opciones: ["Una Torcia", "Una Spada", "Una Corona"],
                correctas: ["Una Torcia", "Una Spada"],
                multiple: true
            },
            {
                reto: 14,
                id: "R14-AvFallas-it",
                tipo: "opcion",
                pregunta: "Cosa porta la figura nella mano?",
                opciones: ["Una bilancia", "Un libro", "Una penna"],
                correctas: ["Una bilancia"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-AvFallas-it",
                tipo: "opcion",
                pregunta: "Cerchi la vetrata con i colori della Senyera valenciana sulla facciata dell'edificio. Saprebbe determinare che forma ha?",
                opciones: ["Quadrata", "Rotonda", "Triangolare"],
                correctas: ["Rotonda"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-AvFallas-it",
                tipo: "opcion-multiple",
                pregunta: "Cosa tiene la Vergine nella sua mano?",
                opciones: ["Un Rosario", "Un bambino", "Una corona"],
                correctas: ["Un Rosario", "Un bambino"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-AvFallas-it",
                tipo: "opcion",
                pregunta: "Cosa consegna l'angelo al bambino?",
                opciones: ["Una colomba", "Un globo", "Cibo"],
                correctas: ["Un globo"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 19,
                id: "R19-AvFallas-it",
                tipo: "opcion",
                pregunta: "Cosa tiene il bambino nelle sue mani?",
                opciones: ["Una colomba", "Una conchiglia", "Cibo"],
                correctas: ["Una conchiglia"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            },
        ],
        nl: [
            // Array de retos AventuraFallas HOLANDÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-AvFallas-nl",
                tipo: "opcion",
                pregunta: "1. Hoeveel avonturen kun je doen met València be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-AvFallas-nl",
                tipo: "opcion",
                pregunta: "2. Is het een goed moment om je avontuur te beginnen?",
                opciones: ["Ja", "Nee"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-AvFallas-nl",
                tipo: "opcion",
                pregunta: "Weet u hoe deze Torens heten?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-AvFallas-nl",
                tipo: "opcion",
                pregunta: "Aan de top van de torens wappert de vlag van Valencia: de kleuren zijn rood, geel en… ?",
                opciones: ["Paars", "Groen", "Blauw"],
                correctas: ["Blauw"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-AvFallas-nl",
                tipo: "texto",
                pregunta: "Kunt u mij de naam van deze straat vertellen?",
                correctas: ["Calle Muro de Santa Ana"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-AvFallas-nl",
                tipo: "opcion",
                pregunta: "Wat heeft de Heilige Laurentius in zijn hand?",
                opciones: ["Een Duif", "Een lepel", "Een rooster"],
                correctas: ["Een rooster"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-AvFallas-nl",
                tipo: "opcion",
                pregunta: "In welke hand houdt Neptunus de hoorn des overvloeds?",
                opciones: ["Links", "Rechts"],
                correctas: ["Rechts"],
                multiple: false
            },
            {
                reto: 8,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 9,
                id: "R9-AvFallas-nl",
                tipo: "opcion",
                pregunta: "Kunt u bepalen welke geometrie de Cimborrio van de Kathedraal van Valencia heeft?",
                opciones: ["Zeshoekig", "Achthoekig", "Vierkant"],
                correctas: ["Achthoekig"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-AvFallas-nl",
                tipo: "texto",
                pregunta: "Hoeveel ramen kunt u zien?",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 11,
                id: "PZ-17",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-17"
            },
            {
                reto: 12,
                id: "R12-AvFallas-nl",
                tipo: "opcion",
                pregunta: "Weet u nog welk dier het wapen van Valencia bekroont?",
                opciones: ["Vleermuis", "Draak", "Leeuw"],
                correctas: ["Vleermuis"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-AvFallas-nl",
                tipo: "opcion-multiple",
                pregunta: "Boven de hoofdingang, in een rondboog, stellen allegorische figuren de vijf continenten voor. Wat draagt de centrale figuur?",
                opciones: ["Een Fakkel", "Een Zwaard", "Een Kroon"],
                correctas: ["Een Fakkel", "Een Zwaard"],
                multiple: true
            },
            {
                reto: 14,
                id: "R14-AvFallas-nl",
                tipo: "opcion",
                pregunta: "Wat draagt de figuur in zijn hand?",
                opciones: ["Een weegschaal", "Een boek", "Een pen"],
                correctas: ["Een weegschaal"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-AvFallas-nl",
                tipo: "opcion",
                pregunta: "Zoek het gebrandschilderde raam met de kleuren van de Valenciaanse Senyera op de gevel van het gebouw. Kunt u bepalen welke vorm het heeft?",
                opciones: ["Vierkant", "Rond", "Driehoekig"],
                correctas: ["Rond"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-AvFallas-nl",
                tipo: "opcion-multiple",
                pregunta: "Wat houdt de Maagd in haar hand?",
                opciones: ["Een Rozenkrans", "Een kind", "Een kroon"],
                correctas: ["Een Rozenkrans", "Een kind"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-AvFallas-nl",
                tipo: "opcion",
                pregunta: "Wat geeft de engel aan het kind?",
                opciones: ["Een duif", "Een bol", "Voedsel"],
                correctas: ["Een bol"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 19,
                id: "R19-AvFallas-nl",
                tipo: "opcion",
                pregunta: "Wat houdt het kind in zijn handen?",
                opciones: ["Een duif", "Een schelp", "Voedsel"],
                correctas: ["Een schelp"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            },
        ],
        ja: [
            // Array de retos AventuraFallas JAPONÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-AvFallas-ja",
                tipo: "opcion",
                pregunta: "1. Valencia be Guides ではいくつのアドベンチャーが体験できますか？",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-AvFallas-ja",
                tipo: "opcion",
                pregunta: "2. 今は冒険を始めるのに良いタイミングですか？",
                opciones: ["はい", "いいえ"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-AvFallas-ja",
                tipo: "opcion",
                pregunta: "これらの塔の名前を教えていただけますか？",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-AvFallas-ja",
                tipo: "opcion",
                pregunta: "塔の頂上にはバレンシアの旗が翻っています：その色は赤、黄色、そして…？",
                opciones: ["紫", "緑", "青"],
                correctas: ["青"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-AvFallas-ja",
                tipo: "texto",
                pregunta: "この通りの名前を教えていただけますか？",
                correctas: ["Calle Muro de Santa Ana"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-AvFallas-ja",
                tipo: "opcion",
                pregunta: "聖ラウレンティウスは手に何を持っていますか？",
                opciones: ["鳩", "スプーン", "焼き網"],
                correctas: ["焼き網"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-AvFallas-ja",
                tipo: "opcion",
                pregunta: "ネプチューンはどちらの手で豊穣の角を持っていますか？",
                opciones: ["左手", "右手"],
                correctas: ["右手"],
                multiple: false
            },
            {
                reto: 8,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 9,
                id: "R9-AvFallas-ja",
                tipo: "opcion",
                pregunta: "バレンシア大聖堂のシンボリオはどのような幾何学形状をしているか分かりますか？",
                opciones: ["六角形", "八角形", "正方形"],
                correctas: ["八角形"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-AvFallas-ja",
                tipo: "texto",
                pregunta: "窓はいくつ見えますか？",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 11,
                id: "PZ-17",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-17"
            },
            {
                reto: 12,
                id: "R12-AvFallas-ja",
                tipo: "opcion",
                pregunta: "バレンシアの紋章の上にいる動物を覚えていますか？",
                opciones: ["コウモリ", "ドラゴン", "ライオン"],
                correctas: ["コウモリ"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-AvFallas-ja",
                tipo: "opcion-multiple",
                pregunta: "正面入口の上の丸アーチには、5大陸を表す寓意的な像があります。中央の像は何を持っていますか？",
                opciones: ["たいまつ", "剣", "王冠"],
                correctas: ["たいまつ", "剣"],
                multiple: true
            },
            {
                reto: 14,
                id: "R14-AvFallas-ja",
                tipo: "opcion",
                pregunta: "その像は手に何を持っていますか？",
                opciones: ["天秤", "本", "羽根ペン"],
                correctas: ["天秤"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-AvFallas-ja",
                tipo: "opcion",
                pregunta: "建物のファサードにあるバレンシアの旗の色のステンドグラスを探してください。どんな形をしているか分かりますか？",
                opciones: ["正方形", "円形", "三角形"],
                correctas: ["円形"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-AvFallas-ja",
                tipo: "opcion-multiple",
                pregunta: "聖母は手に何を持っていますか？",
                opciones: ["ロザリオ", "子供", "王冠"],
                correctas: ["ロザリオ", "子供"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-AvFallas-ja",
                tipo: "opcion",
                pregunta: "天使は子供に何を渡していますか？",
                opciones: ["鳩", "球体", "食べ物"],
                correctas: ["球体"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 19,
                id: "R19-AvFallas-ja",
                tipo: "opcion",
                pregunta: "子供は手に何を持っていますか？",
                opciones: ["鳩", "貝殻", "食べ物"],
                correctas: ["貝殻"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            },
        ],
        de: [
            // Array de retos AventuraFallas DE
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-AvFallas-de",
                tipo: "opcion",
                pregunta: "¿Cuántas Aventuras pueden hacerse con Valencia be Guides?",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-AvFallas-de",
                tipo: "opcion",
                pregunta: "2. Ist es ein guter Zeitpunkt, um Ihr Abenteuer zu beginnen?",
                opciones: ["Ja","Nein"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-AvFallas-de",
                tipo: "opcion",
                pregunta: "3. Können Sie mir sagen, wie diese Türme heißen?",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-AvFallas-de",
                tipo: "opcion",
                pregunta: "Auf dem Gipfel der Türme weht die Flagge Valencias: Ihre Farben bestehen aus Rot, Gelb und… ?",
                opciones: ["Violett","Grün","Blau"],
                correctas: ["Blau"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-AvFallas-de",
                tipo: "texto",
                pregunta: "Können Sie mir den Namen der Straße nennen?",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-AvFallas-de",
                tipo: "opcion",
                pregunta: "Was trägt der heilige Laurentius in der Hand?",
                opciones: ["Eine Taube","Ein Löffel","Ein Rost"],
                correctas: ["Ein Rost"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-AvFallas-de",
                tipo: "opcion",
                pregunta: "Mit welcher Hand hält Neptun das Füllhorn?",
                opciones: ["Links","Rechts"],
                correctas: ["Rechts"],
                multiple: false
            },
            {
                reto: 8,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 9,
                id: "R9-AvFallas-de",
                tipo: "opcion",
                pregunta: "Können Sie bestimmen, welche Geometrie die Laterne der Kathedrale von Valencia hat?",
                opciones: ["Sechseckig","Achteckig","Viereckig"],
                correctas: ["Achteckig"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-AvFallas-de",
                tipo: "texto",
                pregunta: "Wie viele Fenster können Sie sehen?",
                correctas: ["?"]
            },
            {
                reto: 11,
                id: "PZ-17",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-17"
            },
            {
                reto: 12,
                id: "R12-AvFallas-de",
                tipo: "opcion",
                pregunta: "Erinnern Sie sich, welches Tier das Wappen von Valencia krönt?",
                opciones: ["Fledermaus","Drache","Löwe"],
                correctas: ["Fledermaus"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-AvFallas-de",
                tipo: "opcion-multiple",
                pregunta: "Über dem Haupteingang, in einem Rundbogen, stellen allegorische Figuren die fünf Kontinente dar. Was trägt die mittlere Figur?",
                opciones: ["Eine Fackel","Ein Schwert","Eine Krone"],
                correctas: ["Eine Fackel","Ein Schwert"],
                multiple: true
            },
            {
                reto: 14,
                id: "R14-AvFallas-de",
                tipo: "opcion",
                pregunta: "Was trägt die Figur in der Hand?",
                opciones: ["Eine Waage","Ein Buch","Eine Feder"],
                correctas: ["Eine Waage"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-AvFallas-de",
                tipo: "opcion",
                pregunta: "Suchen Sie das Buntglasfenster mit den Farben der valencianischen Senyera an der Fassade. Können Sie bestimmen, welche Form es hat?",
                opciones: ["Viereckig","Rund","Dreieckig"],
                correctas: ["Rund"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-AvFallas-de",
                tipo: "opcion-multiple",
                pregunta: "Was hält die Jungfrau in ihrer Hand?",
                opciones: ["Einen Rosenkranz","Ein Kind","Eine Krone"],
                correctas: ["Einen Rosenkranz","Ein Kind"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-AvFallas-de",
                tipo: "opcion",
                pregunta: "Was überreicht der Engel dem Kind?",
                opciones: ["Eine Taube","Eine Kugel","Nahrung"],
                correctas: ["Eine Kugel"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 19,
                id: "R19-AvFallas-de",
                tipo: "opcion",
                pregunta: "Was hält das Kind in seinen Händen?",
                opciones: ["Eine Taube","Eine Muschel","Nahrung"],
                correctas: ["Eine Muschel"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        zh: [
            // Array de retos AventuraFallas ZH
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-AvFallas-zh",
                tipo: "opcion",
                pregunta: "使用Valencia be Guides可以进行多少次冒险？",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-AvFallas-zh",
                tipo: "opcion",
                pregunta: "2. 现在是开始冒险的好时机吗？",
                opciones: ["是","否"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-AvFallas-zh",
                tipo: "opcion",
                pregunta: "3. 您能告诉我这些塔叫什么名字吗？",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-AvFallas-zh",
                tipo: "opcion",
                pregunta: "塔顶飘扬着巴伦西亚的旗帜：其颜色由红色、黄色和…组成？",
                opciones: ["紫色","绿色","蓝色"],
                correctas: ["蓝色"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-AvFallas-zh",
                tipo: "texto",
                pregunta: "您能告诉我这条街道的名字吗？",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-AvFallas-zh",
                tipo: "opcion",
                pregunta: "圣洛伦佐手里拿着什么？",
                opciones: ["一只鸽子","一把勺子","一个烤架"],
                correctas: ["一个烤架"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-AvFallas-zh",
                tipo: "opcion",
                pregunta: "海神尼普顿用哪只手握着丰饶角？",
                opciones: ["左手","右手"],
                correctas: ["右手"],
                multiple: false
            },
            {
                reto: 8,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 9,
                id: "R9-AvFallas-zh",
                tipo: "opcion",
                pregunta: "您能判断巴伦西亚大教堂穹顶的几何形状吗？",
                opciones: ["六边形","八边形","四边形"],
                correctas: ["八边形"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-AvFallas-zh",
                tipo: "texto",
                pregunta: "您能看到几扇窗户？",
                correctas: ["?"]
            },
            {
                reto: 11,
                id: "PZ-17",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-17"
            },
            {
                reto: 12,
                id: "R12-AvFallas-zh",
                tipo: "opcion",
                pregunta: "您还记得什么动物装饰着巴伦西亚的盾徽吗？",
                opciones: ["蝙蝠","龙","狮子"],
                correctas: ["蝙蝠"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-AvFallas-zh",
                tipo: "opcion-multiple",
                pregunta: "在主入口上方的半圆拱门中，寓言人物代表着五大洲。中央人物拿着什么？",
                opciones: ["一支火炬","一把剑","一顶王冠"],
                correctas: ["一支火炬","一把剑"],
                multiple: true
            },
            {
                reto: 14,
                id: "R14-AvFallas-zh",
                tipo: "opcion",
                pregunta: "人物手里拿着什么？",
                opciones: ["一个天平","一本书","一支羽毛笔"],
                correctas: ["一个天平"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-AvFallas-zh",
                tipo: "opcion",
                pregunta: "在建筑外墙上寻找带有巴伦西亚旗颜色的彩色玻璃窗。您能判断它是什么形状吗？",
                opciones: ["四边形","圆形","三角形"],
                correctas: ["圆形"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-AvFallas-zh",
                tipo: "opcion-multiple",
                pregunta: "圣母手里拿着什么？",
                opciones: ["玫瑰念珠","一个孩子","一顶王冠"],
                correctas: ["玫瑰念珠","一个孩子"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-AvFallas-zh",
                tipo: "opcion",
                pregunta: "天使给孩子什么？",
                opciones: ["一只鸽子","一个宝球","食物"],
                correctas: ["一个宝球"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 19,
                id: "R19-AvFallas-zh",
                tipo: "opcion",
                pregunta: "孩子手里拿着什么？",
                opciones: ["一只鸽子","一个贝壳","食物"],
                correctas: ["一个贝壳"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        pl: [
            // Array de retos AventuraFallas PL
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-AvFallas-pl",
                tipo: "opcion",
                pregunta: "Ile przygód można przeżyć z Valencia be Guides?",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-AvFallas-pl",
                tipo: "opcion",
                pregunta: "2. Czy to dobry moment, aby rozpocząć przygodę?",
                opciones: ["Tak","Nie"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-AvFallas-pl",
                tipo: "opcion",
                pregunta: "3. Czy potrafi Pan/Pani powiedzieć mi, jak nazywają się te wieże?",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-AvFallas-pl",
                tipo: "opcion",
                pregunta: "Na szczycie wież powiewa flaga Walencji: jej kolory to czerwony, żółty i… ?",
                opciones: ["Fioletowy","Zielony","Niebieski"],
                correctas: ["Niebieski"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-AvFallas-pl",
                tipo: "texto",
                pregunta: "Czy potrafi Pan/Pani powiedzieć mi nazwę tej ulicy?",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-AvFallas-pl",
                tipo: "opcion",
                pregunta: "Co trzyma święty Wawrzyniec w ręce?",
                opciones: ["Gołąb","Łyżka","Ruszt"],
                correctas: ["Ruszt"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-AvFallas-pl",
                tipo: "opcion",
                pregunta: "Którą ręką Neptun trzyma róg obfitości?",
                opciones: ["Lewą","Prawą"],
                correctas: ["Prawą"],
                multiple: false
            },
            {
                reto: 8,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 9,
                id: "R9-AvFallas-pl",
                tipo: "opcion",
                pregunta: "Czy potrafi Pan/Pani określić, jaką geometrię ma Cimborrio Katedry w Walencji?",
                opciones: ["Sześciokąt","Ośmiokąt","Czworokąt"],
                correctas: ["Ośmiokąt"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-AvFallas-pl",
                tipo: "texto",
                pregunta: "Ile okien można zobaczyć?",
                correctas: ["?"]
            },
            {
                reto: 11,
                id: "PZ-17",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-17"
            },
            {
                reto: 12,
                id: "R12-AvFallas-pl",
                tipo: "opcion",
                pregunta: "Czy pamięta Pan/Pani, jakie zwierzę wieńczy herb Walencji?",
                opciones: ["Nietoperz","Smok","Lew"],
                correctas: ["Nietoperz"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-AvFallas-pl",
                tipo: "opcion-multiple",
                pregunta: "Nad głównym wejściem, w łuku półkolistym, alegoryczne postacie przedstawiają pięć kontynentów. Co niesie centralna figura?",
                opciones: ["Pochodnia","Miecz","Korona"],
                correctas: ["Pochodnia","Miecz"],
                multiple: true
            },
            {
                reto: 14,
                id: "R14-AvFallas-pl",
                tipo: "opcion",
                pregunta: "Co trzyma figura w ręce?",
                opciones: ["Waga","Książka","Pióro"],
                correctas: ["Waga"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-AvFallas-pl",
                tipo: "opcion",
                pregunta: "Poszukaj witrażu z kolorami walencjańskiej Senyery na fasadzie budynku. Czy potrafi Pan/Pani określić, jaki ma kształt?",
                opciones: ["Czworokątny","Okrągły","Trójkątny"],
                correctas: ["Okrągły"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-AvFallas-pl",
                tipo: "opcion-multiple",
                pregunta: "Co trzyma Matka Boska w ręce?",
                opciones: ["Różaniec","Dziecko","Korona"],
                correctas: ["Różaniec","Dziecko"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-AvFallas-pl",
                tipo: "opcion",
                pregunta: "Co anioł przekazuje dziecku?",
                opciones: ["Gołąb","Kula","Jedzenie"],
                correctas: ["Kula"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 19,
                id: "R19-AvFallas-pl",
                tipo: "opcion",
                pregunta: "Co trzyma dziecko w rękach?",
                opciones: ["Gołąb","Muszla","Jedzenie"],
                correctas: ["Muszla"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        pt: [
            // Array de retos AventuraFallas PT
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-AvFallas-pt",
                tipo: "opcion",
                pregunta: "Quantas Aventuras podem ser feitas com Valencia be Guides?",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-AvFallas-pt",
                tipo: "opcion",
                pregunta: "2. É um bom momento para começar a sua aventura?",
                opciones: ["Sim","Não"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-AvFallas-pt",
                tipo: "opcion",
                pregunta: "3. Sabe me dizer como se chamam estas Torres?",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-AvFallas-pt",
                tipo: "opcion",
                pregunta: "No cume das torres ondeia a bandeira de Valência: as suas cores compõem-se de vermelho, amarelo e… ?",
                opciones: ["Violeta","Verde","Azul"],
                correctas: ["Azul"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-AvFallas-pt",
                tipo: "texto",
                pregunta: "Sabe me dizer o nome desta rua?",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-AvFallas-pt",
                tipo: "opcion",
                pregunta: "O que porta São Lourenço na mão?",
                opciones: ["Uma Pomba","Uma colher","Uma grelha"],
                correctas: ["Uma grelha"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-AvFallas-pt",
                tipo: "opcion",
                pregunta: "Com que mão segura Neptuno a cornucópia?",
                opciones: ["Esquerda","Direita"],
                correctas: ["Direita"],
                multiple: false
            },
            {
                reto: 8,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 9,
                id: "R9-AvFallas-pt",
                tipo: "opcion",
                pregunta: "Consegue determinar que geometria tem o Cimborrio da Catedral de Valência?",
                opciones: ["Hexagonal","Octogonal","Quadrangular"],
                correctas: ["Octogonal"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-AvFallas-pt",
                tipo: "texto",
                pregunta: "Quantas janelas consegue ver?",
                correctas: ["?"]
            },
            {
                reto: 11,
                id: "PZ-17",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-17"
            },
            {
                reto: 12,
                id: "R12-AvFallas-pt",
                tipo: "opcion",
                pregunta: "Recorda que animal coroa o escudo de Valência?",
                opciones: ["Morcego","Dragão","Leão"],
                correctas: ["Morcego"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-AvFallas-pt",
                tipo: "opcion-multiple",
                pregunta: "Sobre a entrada principal, num arco de volta perfeita, figuras alegóricas representam os cinco continentes. O que porta a figura central?",
                opciones: ["Uma Tocha","Uma Espada","Uma Coroa"],
                correctas: ["Uma Tocha","Uma Espada"],
                multiple: true
            },
            {
                reto: 14,
                id: "R14-AvFallas-pt",
                tipo: "opcion",
                pregunta: "O que porta a figura na mão?",
                opciones: ["Uma balança","Um livro","Uma pena"],
                correctas: ["Uma balança"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-AvFallas-pt",
                tipo: "opcion",
                pregunta: "Procure o vitral com as cores da Senyera valenciana na fachada do edifício. Consegue determinar que forma tem?",
                opciones: ["Quadrangular","Redonda","Triangular"],
                correctas: ["Redonda"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-AvFallas-pt",
                tipo: "opcion-multiple",
                pregunta: "O que segura a virgem na mão?",
                opciones: ["Um Rosário","Uma criança","Uma coroa"],
                correctas: ["Um Rosário","Uma criança"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-AvFallas-pt",
                tipo: "opcion",
                pregunta: "O que entrega o anjo à criança?",
                opciones: ["Uma pomba","Um orbe","Alimentos"],
                correctas: ["Um orbe"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 19,
                id: "R19-AvFallas-pt",
                tipo: "opcion",
                pregunta: "O que segura a criança nas mãos?",
                opciones: ["Uma pomba","Uma Concha","Alimentos"],
                correctas: ["Uma Concha"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        ru: [
            // Array de retos AventuraFallas RU
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-AvFallas-ru",
                tipo: "opcion",
                pregunta: "Сколько приключений можно совершить с Valencia be Guides?",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-AvFallas-ru",
                tipo: "opcion",
                pregunta: "2. Сейчас хорошее время для начала приключения?",
                opciones: ["Да","Нет"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-AvFallas-ru",
                tipo: "opcion",
                pregunta: "3. Можете ли вы назвать мне, как называются эти башни?",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-AvFallas-ru",
                tipo: "opcion",
                pregunta: "На вершине башен развевается флаг Валенсии: его цвета состоят из красного, жёлтого и… ?",
                opciones: ["Фиолетового","Зелёного","Синего"],
                correctas: ["Синего"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-AvFallas-ru",
                tipo: "texto",
                pregunta: "Можете ли вы назвать мне имя этой улицы?",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-AvFallas-ru",
                tipo: "opcion",
                pregunta: "Что держит святой Лаврентий в руке?",
                opciones: ["Голубь","Ложка","Решётка"],
                correctas: ["Решётка"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-AvFallas-ru",
                tipo: "opcion",
                pregunta: "Какой рукой Нептун держит рог изобилия?",
                opciones: ["Левой","Правой"],
                correctas: ["Правой"],
                multiple: false
            },
            {
                reto: 8,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 9,
                id: "R9-AvFallas-ru",
                tipo: "opcion",
                pregunta: "Можете ли вы определить геометрию тимпана Кафедрального собора Валенсии?",
                opciones: ["Шестиугольная","Восьмиугольная","Четырёхугольная"],
                correctas: ["Восьмиугольная"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-AvFallas-ru",
                tipo: "texto",
                pregunta: "Сколько окон вы можете увидеть?",
                correctas: ["?"]
            },
            {
                reto: 11,
                id: "PZ-17",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-17"
            },
            {
                reto: 12,
                id: "R12-AvFallas-ru",
                tipo: "opcion",
                pregunta: "Помните ли вы, какое животное венчает герб Валенсии?",
                opciones: ["Летучая мышь","Дракон","Лев"],
                correctas: ["Летучая мышь"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-AvFallas-ru",
                tipo: "opcion-multiple",
                pregunta: "Над главным входом, в полукруглой арке, аллегорические фигуры представляют пять континентов. Что несёт центральная фигура?",
                opciones: ["Факел","Меч","Корона"],
                correctas: ["Факел","Меч"],
                multiple: true
            },
            {
                reto: 14,
                id: "R14-AvFallas-ru",
                tipo: "opcion",
                pregunta: "Что держит фигура в руке?",
                opciones: ["Весы","Книга","Перо"],
                correctas: ["Весы"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-AvFallas-ru",
                tipo: "opcion",
                pregunta: "Найдите витраж с цветами валенсийской Сеньеры на фасаде здания. Можете ли вы определить, какую форму он имеет?",
                opciones: ["Четырёхугольная","Круглая","Треугольная"],
                correctas: ["Круглая"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-AvFallas-ru",
                tipo: "opcion-multiple",
                pregunta: "Что держит Богородица в руке?",
                opciones: ["Чётки","Ребёнок","Корона"],
                correctas: ["Чётки","Ребёнок"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-AvFallas-ru",
                tipo: "opcion",
                pregunta: "Что ангел передаёт ребёнку?",
                opciones: ["Голубь","Держава","Еда"],
                correctas: ["Держава"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 19,
                id: "R19-AvFallas-ru",
                tipo: "opcion",
                pregunta: "Что держит ребёнок в руках?",
                opciones: ["Голубь","Ракушка","Еда"],
                correctas: ["Ракушка"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        uk: [
            // Array de retos AventuraFallas UK
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-AvFallas-uk",
                tipo: "opcion",
                pregunta: "Скільки пригод можна здійснити з Valencia be Guides?",
                opciones: ["4","5","6","7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-AvFallas-uk",
                tipo: "opcion",
                pregunta: "2. Зараз хороший час для початку пригоди?",
                opciones: ["Так","Ні"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-AvFallas-uk",
                tipo: "opcion",
                pregunta: "3. Чи можете ви сказати мені, як називаються ці вежі?",
                opciones: ["Torres de Quart","Torres de Serranos","Torre del Miguelete","Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-AvFallas-uk",
                tipo: "opcion",
                pregunta: "На вершині веж майорить прапор Валенсії: його кольори складаються з червоного, жовтого і… ?",
                opciones: ["Фіолетового","Зеленого","Синього"],
                correctas: ["Синього"],
                multiple: false
            },
            {
                reto: 5,
                id: "R5-AvFallas-uk",
                tipo: "texto",
                pregunta: "Чи можете ви назвати мені ім'я цієї вулиці?",
                correctas: ["Calle Muro de Santa Ana"]
            },
            {
                reto: 6,
                id: "R6-AvFallas-uk",
                tipo: "opcion",
                pregunta: "Що тримає святий Лаврентій у руці?",
                opciones: ["Голуб","Ложка","Решітка"],
                correctas: ["Решітка"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-AvFallas-uk",
                tipo: "opcion",
                pregunta: "Якою рукою Нептун тримає ріг достатку?",
                opciones: ["Лівою","Правою"],
                correctas: ["Правою"],
                multiple: false
            },
            {
                reto: 8,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 9,
                id: "R9-AvFallas-uk",
                tipo: "opcion",
                pregunta: "Чи можете ви визначити геометрію тимпану Собору Валенсії?",
                opciones: ["Шестикутна","Восьмикутна","Чотирикутна"],
                correctas: ["Восьмикутна"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-AvFallas-uk",
                tipo: "texto",
                pregunta: "Скільки вікон ви можете побачити?",
                correctas: ["?"]
            },
            {
                reto: 11,
                id: "PZ-17",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-17"
            },
            {
                reto: 12,
                id: "R12-AvFallas-uk",
                tipo: "opcion",
                pregunta: "Чи пам'ятаєте ви, яка тварина вінчає герб Валенсії?",
                opciones: ["Кажан","Дракон","Лев"],
                correctas: ["Кажан"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-AvFallas-uk",
                tipo: "opcion-multiple",
                pregunta: "Над головним входом, у напівкруглій арці, алегоричні фігури представляють п'ять континентів. Що несе центральна фігура?",
                opciones: ["Факел","Меч","Корона"],
                correctas: ["Факел","Меч"],
                multiple: true
            },
            {
                reto: 14,
                id: "R14-AvFallas-uk",
                tipo: "opcion",
                pregunta: "Що тримає фігура в руці?",
                opciones: ["Терези","Книга","Перо"],
                correctas: ["Терези"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-AvFallas-uk",
                tipo: "opcion",
                pregunta: "Знайдіть вітраж з кольорами валенсійської Сеньєри на фасаді будівлі. Чи можете ви визначити, яку форму він має?",
                opciones: ["Чотирикутна","Кругла","Трикутна"],
                correctas: ["Кругла"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-AvFallas-uk",
                tipo: "opcion-multiple",
                pregunta: "Що тримає Богородиця в руці?",
                opciones: ["Вервиця","Дитина","Корона"],
                correctas: ["Вервиця","Дитина"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-AvFallas-uk",
                tipo: "opcion",
                pregunta: "Що ангел передає дитині?",
                opciones: ["Голуб","Держава","Їжа"],
                correctas: ["Держава"],
                multiple: false
            },
            {
                reto: 18,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 19,
                id: "R19-AvFallas-uk",
                tipo: "opcion",
                pregunta: "Що тримає дитина в руках?",
                opciones: ["Голуб","Мушля","Їжа"],
                correctas: ["Мушля"],
                multiple: false
            },
            {
                reto: 20,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ]
    },
    Aventura34km: {
        es: [
            // Array de retos Aventura34km ESPAÑOL
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
            {
                reto: 1,
                id: "R1-Av34km-es",
                tipo: "opcion",
                pregunta: "1. ¿Cuántas Aventuras pueden hacerse con Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 2,
                id: "R2-Av34km-es",
                tipo: "opcion",
                pregunta: "2. ¿Es buen momento para comenzar su aventura?",
                opciones: ["Sí", "NO"],
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 3,
                id: "R3-Av34km-es",
                tipo: "opcion",
                pregunta: "3. ¿Sabía decirme cómo se llaman estas Torres?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "PZ-19",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-19"
            },
            {
                reto: 5,
                id: "R5-Av34km-es",
                tipo: "opcion",
                pregunta: "¿Sabría decirme cómo se llaman éstas fiestas populares de Valencia?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
            {
                reto: 6,
                id: "R6-Av34km-es",
                tipo: "opcion",
                pregunta: "La naturaleza ha esculpido el escudo de Valencia. ¿Qué puede verse arriba?",
                opciones: ["Un escudo", "Un murciélago", "Un dragón"],
                correctas: ["Un murciélago"],
                multiple: false
            },
            {
                reto: 7,
                id: "R7-Av34km-es",
                tipo: "texto",
                pregunta: "¿Sabría adivinar cuántos peldaños tiene?",
                correctas: ["16"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av34km-es",
                tipo: "opcion",
                pregunta: "¿Qué tipo de árboles puede tocar ahora mismo?",
                opciones: ["Olivos","Naranjos", "Palmeras"],
                correctas: ["Palmeras"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av34km-es",
                tipo: "texto",
                pregunta: "¿Sabría decirme el precio para acceder a esta atracción?",
                correctas: ["gratis"],
                multiple: false
            },
            {
                reto: 10,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
            {
                reto: 11,
                id: "R11-Av34km-es",
                tipo: "opcion",
                pregunta: "¿De cuántos monumentos se compone la Ciudad de las Artes y de las Ciencias?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
            {
                reto: 12,
                id: "R12-Av34km-es",
                tipo: "opcion",
                pregunta: "¿De qué está hecha la Orxata? ",
                opciones: ["Chufa", "Cebada", "Arroz"],
                correctas: ["Chufa"],
                multiple: false
            },
            {
                reto: 13,
                id: "R13-Av34km-es",
                tipo: "opcion",
                pregunta: "¿Qué rodea la base del puente? ",
                opciones: ["Agua", "Hierba", "Patos"],
                correctas: ["Agua"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av34km-es",
                tipo: "opcion",
                pregunta: "¿Recuerda qué animal corona el escudo de Valencia? ",
                opciones: ["Murciélago", "Dragón", "León"],
                correctas: ["Murciélago"],
                multiple: false
            },
            {
                reto: 15,
                id: "R15-Av34km-es",
                tipo: "opcion",
                pregunta: "¿Qué puede verse en la locomotora?",
                opciones: ["Un dragón", "Una estrella", "Una fecha"],
                correctas: ["Una estrella"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av34km-es",
                tipo: "opcion-multiple",
                pregunta: "¿Qué elementos pueden verse en esta escena?",
                opciones: ["Un fallero y una Fallera", "Naranjas", "Uva"],
                correctas: ["Un fallero y una Fallera", "Naranjas", "Uva"],
                multiple: true
            },
            {
                reto: 17,
                id: "R17-Av34km-es",
                tipo: "opcion-multiple",
                pregunta: "¿Qué puede ser?",
                opciones: ["Pan de hogaza", "cangrejos", "Manzanas"],
                correctas: ["Pan de hogaza", "cangrejos"],
                multiple: true
            },
            {
                reto: 18,
                id: "R18-Av34km-es",
                tipo: "texto",
                pregunta: "¿Cuántos animales puede numerar? Entre ellos Fíjese que hay vacas, cerdos…",
                correctas: ["?"]
            },
            {
                reto: 19,
                id: "PZ-20",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-20"
            },
            {
                reto: 20,
                id: "R20-Av34km-es",
                tipo: "texto",
                pregunta: "¿Cuántos pisos tiene este Monumento?",
                correctas: ["4"]
            },
            {
                reto: 21,
                id: "R21-Av34km-es",
                tipo: "opcion",
                pregunta: "¿Qué Fruta Cítrica natural de Valencia decora la fachada?",
                opciones: ["Limones", "Pomelos", "Naranjas"],
                correctas: ["Naranjas"],
                multiple: false
            },
            {
                reto: 22,
                id: "R22-Av34km-es",
                tipo: "texto",
                pregunta: "¿Puede encontrar su idioma?",
                correctas: ["¿sí? ¿No?"]
            },
            {
                reto: 23,
                id: "R23-Av34km-es",
                tipo: "opcion",
                pregunta: "23. ¿Recuerda qué animal corona el escudo municipal?",
                opciones: ["Un Dragón", "Un Murciélago", "Un Caballo"],
                correctas: ["Un Murciélago"],
                multiple: false
            },
            {
                reto: 24,
                id: "R24-Av34km-es",
                tipo: "opcion-multiple",
                pregunta: "24. Sobre la entrada principal, en un arco de medio punto, figuras alegóricas representan a los cinco continentes. ¿Qué porta la figura central?",
                opciones: ["Una Antorcha", "Una Espada", "Una Corona"],
                correctas: ["Una Antorcha", "Una Espada"],
                multiple: true
            },
            {
                reto: 25,
                id: "R25-Av34km-es",
                tipo: "opcion",
                pregunta: "25. ¿Qué porta la figura en la mano?",
                opciones: ["Una balanza", "Un libro", "Una pluma"],
                correctas: ["Una balanza"],
                multiple: false
            },
            {
                reto: 26,
                id: "R26-Av34km-es",
                tipo: "texto",
                pregunta: "26. ¿Cuántos pisos tiene el edificio?",
                correctas: ["10"]
            },
            {
                reto: 27,
                id: "R27-Av34km-es",
                tipo: "opcion",
                pregunta: "27. Busque la vidriera con los colores de la Señera valenciana en la fachada del edificio. ¿Sabría determinar qué forma tiene?",
                opciones: ["Cuadrangular", "Redonda", "Triangular"],
                correctas: ["Redonda"],
                multiple: false
            },
            {
                reto: 28,
                id: "R28-Av34km-es",
                tipo: "opcion-multiple",
                pregunta: "28. ¿Qué sostiene la virgen en su mano?",
                opciones: ["Un Rosario", "Un niño", "Una corona"],
                correctas: ["Un Rosario", "Un niño"],
                multiple: true
            },
            {
                reto: 29,
                id: "R29-Av34km-es",
                tipo: "opcion",
                pregunta: "29. ¿Qué le entrega el ángel al niño?",
                opciones: ["Una paloma", "Un orbe", "Alimentos"],
                correctas: ["Un orbe"],
                multiple: false
            },
            {
                reto: 30,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 31,
                id: "R31-Av34km-es",
                tipo: "opcion-multiple",
                pregunta: "31. El barquero que rema a contracorriente.",
                opciones: ["Un hombre con rostro triste manejando un pequeño bote de madera escapa a contracorriente de un monstruo."],
                correctas: ["Un hombre con rostro triste manejando un pequeño bote de madera escapa a contracorriente de un monstruo."],
                multiple: true
            },
            {
                reto: 32,
                id: "R32-Av34km-es",
                tipo: "opcion-multiple",
                pregunta: "32. Un árbol muerto: símbolo del Pecado, se ve entre las dos hojas de la puerta y cumple la función de parteluz.",
                opciones: ["Observe en la copa del árbol como 4 hombres desnudos se azotan entre si."],
                correctas: ["Observe en la copa del árbol como 4 hombres desnudos se azotan entre si."],
                multiple: true
            },
            {
                reto: 33,
                id: "R33-Av34km-es",
                tipo: "opcion-multiple",
                pregunta: "33. A la derecha, un ángel que muestra su pene y...",
                opciones: ["se dispone a introducirlo en un jarrón que sostiene con la otra mano. Algo extraño e inusual ¿no le parece?"],
                correctas: ["se dispone a introducirlo en un jarrón que sostiene con la otra mano. Algo extraño e inusual ¿no le parece?"],
                multiple: true
            },
            {
                reto: 34,
                id: "R34-Av34km-es",
                tipo: "opcion-multiple",
                pregunta: "34. En el centro El barbudo y el león:",
                opciones: ["Original y contradictoria escena en la cual el manso es precisamente el león y no el anciano barbudo."],
                correctas: ["Original y contradictoria escena en la cual el manso es precisamente el león y no el anciano barbudo."],
                multiple: true
            },
            {
                reto: 35,
                id: "R35-Av34km-es",
                tipo: "opcion-multiple",
                pregunta: "35. ¡Aquí va un reto extra! ¡Busque al fornicador de la lonja!",
                opciones: ["En una de sus ventanas, hallará a un hombre tallado, no se le advierte su cabeza, pero sí sus genitales, Y muy claramente."],
                correctas: ["En una de sus ventanas, hallará a un hombre tallado, no se le advierte su cabeza, pero sí sus genitales, Y muy claramente."],
                multiple: true
            },
            {
                reto: 36,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 37,
                id: "R37-Av34km-es",
                tipo: "texto",
                pregunta: "37. ¿Cuánto mide la entrada del edificio estrecho?",
                correctas: ["1,35 metros"]
            },
            {
                reto: 38,
                id: "R38-Av34km-es",
                tipo: "opcion-multiple",
                pregunta: "38. tres arcos ciegos. Dos de ellos son lisos el tercero se dejó sin enlucir.<br>¿Qué puede verse en ese arco sin enlucir?",
                opciones: ["Un rostro", "Un torso", "Una gárgola"],
                correctas: ["Un rostro", "Un torso"],
                multiple: true
            },
            {
                reto: 39,
                id: "R39-Av34km-es",
                tipo: "opcion",
                pregunta: "39. ¿Que hay en lo más alto de la torre de la torre barroca de Santa Catalina?",
                opciones: ["Una cruz", "El sol", "Una paloma"],
                correctas: ["Una cruz"],
                multiple: false
            },
            {
                reto: 40,
                id: "R40-Av34km-es",
                tipo: "texto",
                pregunta: "40. ¿De qué color son las tejas de la cúpula de la Torre barroca Santa Catalina?",
                correctas: ["azules"]
            },
            {
                reto: 41,
                id: "R41-Av34km-es",
                tipo: "opcion",
                pregunta: "41. ¿Sabría determinar qué geometría tiene la Torre del Miguelete de Valencia? ",
                opciones: ["Hexagonal", "Octogonal", "Cuadradrangular"],
                correctas: ["Octogonal"],
                multiple: false
            },
            {
                reto: 42,
                id: "R42-Av34km-es",
                tipo: "texto",
                pregunta: "42. ¿Cuantas ventanas puede ver?",
                correctas: ["?"]
            },
            {
                reto: 43,
                id: "R43-Av34km-es",
                tipo: "opcion-multiple",
                pregunta: "43. ¿Qué se puede ver a más de 35 metros de altura en lo alto de la portada barroca?",
                opciones: ["Una esfera", "Un murciélago", "Una cruz", "Un caballo"],
                correctas: ["Una esfera", "Una cruz"],
                multiple: true
            },
            {
                reto: 44,
                id: "R44-Av34km-es",
                tipo: "texto",
                pregunta: "¿Cuántos Arcos componen la puerta?",
                correctas: ["8"],
                multiple: false
            },
            {
                reto: 45,
                id: "R45-Av34km-es",
                tipo: "opcion",
                pregunta: "45. ¿Qué figura esculpida puede verse en el marco del cuadro?",
                opciones: ["Un Dragón", "Un Murciélago", "Una Corona"],
                correctas: ["Una Corona"],
                multiple: false
            },
            {
                reto: 46,
                id: "R46-Av34km-es",
                tipo: "opcion-multiple",
                pregunta: "46. ¿Qué puede verse dentro?",
                opciones: ["Un Altar", "Una bandera", "Una espada"],
                correctas: ["Un Altar", "Una bandera"],
                multiple: true
            },
            {
                reto: 47,
                id: "R47-Av34km-es",
                tipo: "texto",
                pregunta: "47. Sobre ésta hay una placa conmemorativa. ¿En qué año fue expuesta dicha placa?",
                correctas: ["1952"]
            },
            {
                reto: 48,
                id: "R48-Av34km-es",
                tipo: "texto",
                pregunta: "48. ¿En qué año se edificó esta finca? ¡Pista! Mire en la parte superior de la fachada.",
                correctas: ["1906"]
            },
            {
                reto: 49,
                id: "R49-Av34km-es",
                tipo: "opcion",
                pregunta: "49. Mirando la imagen de San Valero, ¿qué artefacto podría decirnos que estuvo preso?",
                opciones: ["Las cadenas", "El libro", "Su cara triste"],
                correctas: ["Las cadenas"],
                multiple: false
            },
            {
                reto: 50,
                id: "R50-Av34km-es",
                tipo: "opcion",
                pregunta: "50. ¿Qué puede verse dentro?",
                opciones: ["Una Plaza de Toros", "Unos baños romanos", "Una estación de metro"],
                correctas: ["Unos baños romanos"],
                multiple: false
            },
            {
                reto: 51,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 52,
                id: "R52-Av34km-es",
                tipo: "opcion",
                pregunta: "52. ¿Sabría determinar qué geometría tiene?",
                opciones: ["hexagonal", "Octogonal", "Cuadrangular"],
                correctas: ["hexagonal"],
                multiple: false
            },
            {
                reto: 53,
                id: "R53-Av34km-es",
                tipo: "opcion",
                pregunta: "53. ¿Con qué mano sujeta Neptuno la cornucopia?",
                opciones: ["Izquierda", "Derecha"],
                correctas: ["Derecha"],
                multiple: false
            },
            {
                reto: 54,
                id: "R54-Av34km-es",
                tipo: "texto",
                pregunta: "54. ¿Cuántas figuras rodean la fuente?",
                correctas: ["8"]
            },
            {
                reto: 55,
                id: "R55-Av34km-es",
                tipo: "opcion",
                pregunta: "55. ¿Cuál de las dos torres del Palacio de la Generalitat creen que es la más nueva: la de la plaza o ésta que tiene delante ahora?",
                opciones: ["La de la plaza", "Ésta que tiene delante"],
                correctas: ["Ésta que tiene delante"],
                multiple: false
            },
            {
                reto: 56,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 57,
                id: "R57-Av34km-es",
                tipo: "opcion-multiple",
                pregunta: "57. ¿Qué puede verse en este panel cerámico? ¿Son calaveras? ¿Es una cruz? ¿hay también una paloma?",
                opciones: ["Calaveras", "Palomas", "Cruz"],
                correctas: ["Calaveras", "Cruz"],
                multiple: true
            },
            {
                reto: 58,
                id: "R58-Av34km-es",
                tipo: "opcion",
                pregunta: "58. ¿Cuántas campanas alberga esta torre? ",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 59,
                id: "R59-Av34km-es",
                tipo: "opcion",
                pregunta: "59. ¿Qué sujeta la figura con sus manos?",
                opciones: ["Un escudo", "Una concha", "Una jarra", "Una espada"],
                correctas: ["Una concha"],
                multiple: false
            },
            {
                reto: 60,
                id: "R60-Av34km-es",
                tipo: "opcion",
                pregunta: "60. ¿Qué dirección toma la senda establecida?",
                opciones: ["Norte", "Sur", "Este", "Oeste"],
                correctas: ["Norte"],
                multiple: false
            },
            {
                reto: 61,
                id: "R61-Av34km-es",
                tipo: "opcion",
                pregunta: "61. ¿Cuántas Puertas tenía la antigua muralla árabe de Balansiya?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 62,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
            {
                reto: 63,
                id: "R63-Av34km-es",
                tipo: "opcion",
                pregunta: "Encima del dintel de la puerta resalta el escudo de la Orden del Carmen.",
                opciones: ["Una Corona", "Una Cruz", "Una Estrella"],
                correctas: ["Una Corona"],
                multiple: false
            },
            {
                reto: 64,
                id: "R64-Av34km-es",
                tipo: "opcion",
                pregunta: "¿Qué porta la Virgen en brazos?",
                opciones: ["Un Corazón", "Una Paloma", "Niño Jesús"],
                correctas: ["Niño Jesús"],
                multiple: false
            },
            {
                reto: 65,
                id: "R65-Av34km-es",
                tipo: "opcion-multiple",
                pregunta: "¿Qué porta Santa Teresa en sus manos?",
                opciones: ["Una pluma", "Una espada", "Un libro", "Una jarra"],
                correctas: ["Una pluma", "Un libro"],
                multiple: true
            },
            {
                reto: 66,
                id: "R66-Av34km-es",
                tipo: "texto",
                pregunta: "¿Cuánto cuesta la entrada a este museo?",
                correctas: ["Gratis"],
                multiple: false
            },
            {
                reto: 67,
                id: "R67-Av34km-es",
                tipo: "opcion",
                pregunta: "¿Cuántos gatos pueden verse representados en el panel?",
                opciones: ["3", "4", "5"],
                correctas: ["4"],
                multiple: false
            },
            {
                reto: 68,
                id: "R68-Av34km-es",
                tipo: "texto",
                pregunta: "¿Qué altura marca este panel?",
                correctas: ["1,90 metros"],
                multiple: false
            },
            {
                reto: 69,
                id: "R69-Av34km-es",
                tipo: "texto",
                pregunta: "¿Qué año indica el panel superior?",
                correctas: ["2100"],
                multiple: false
            },
            {
                reto: 70,
                id: "R70-Av34km-es",
                tipo: "opcion",
                pregunta: "¿Qué corona el escudo?",
                opciones: ["Una corona", "Un murciélago", "Un dragón"],
                correctas: ["Una corona"],
                multiple: false
            },
            {
                reto: 71,
                id: "R71-Av34km-es",
                tipo: "texto",
                pregunta: "¿Cuántas perforaciones de proyectiles puede contabilizar?",
                correctas: ["?"]
            },
            {
                reto: 72,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
            {
                reto: 73,
                id: "R73-Av34km-es",
                tipo: "opcion",
                pregunta: "¿Qué forma tiene la fuente?",
                opciones: ["Concha", "Pez", "Persona"],
                correctas: ["Persona"],
                multiple: false
            },
            {
                reto: 74,
                id: "R74-Av34km-es",
                tipo: "texto",
                pregunta: "¿En qué año comenzaron las obras? ¡Mire en la fachada!",
                correctas: ["1400"]
            },
            {
                reto: 75,
                id: "R75-Av34km-es",
                tipo: "texto",
                pregunta: "¿Sabría decirme el año de su última rehabilitación? ¡Seguro que ya lo ha visto!",
                correctas: ["2012"]
            },
            {
                reto: 76,
                id: "R76-Av34km-es",
                tipo: "texto",
                pregunta: "¿En qué año se realizaron esas obras? ¿Necesita una Pista? Mire en la fachada del edificio.",
                correctas: ["1756"],
                multiple: false
            },
            {
                reto: 77,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
            {
                reto: 78,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
            {
                reto: 79,
                id: "R79-Av34km-es",
                tipo: "opcion",
                pregunta: "¿Sabría decirme el nombre de este antiguo río?",
                opciones: ["Turia", "Júcar", "Segura", "Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
            {
                reto: 80,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
            {
                reto: 81,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
            {
                reto: 82,
                id: "R82-Av34km-es",
                tipo: "opcion-multiple",
                pregunta: "¿Qué usos pueden tener esos badenes?",
                opciones: ["Parar el agua", "Detener las ruedas de los carros", "Recoger las suciedades del río"],
                correctas: ["Detener las ruedas de los carros", "Recoger las suciedades del río"],
                multiple: true
            },
            {
                reto: 83,
                id: "R83-Av34km-es",
                tipo: "opcion",
                pregunta: "En la cumbre de las torres ondea la bandera de Valencia: sus colores se componen de rojo, amarillo y… ",
                opciones: ["Violeta", "Verde", "Azul"],
                correctas: ["Azul"]
            },
            {
                reto: 84,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
            {
                reto: 85,
                id: "R85-Av34km-es",
                tipo: "opcion",
                pregunta: "¿A qué está dedicado el museo?",
                opciones: ["Arquitectura", "Historia", "Ciencias Naturales"],
                correctas: ["Ciencias Naturales"],
                multiple: false
            },
            {
                reto: 86,
                id: "R86-Av34km-es",
                tipo: "opcion",
                pregunta: "¿Qué figura decora la fuente?",
                opciones: ["Un pato", "Una cigüeña", "Un pez"],
                correctas: ["Una cigüeña"],
                multiple: false
            },
            {
                reto: 87,
                id: "R87-Av34km-es",
                tipo: "texto",
                pregunta: "En esta fachada hay un reloj ¿Qué hora marca? ",
                correctas: ["?"],
                multiple: false
            },
            {
                reto: 88,
                id: "R88-Av34km-es",
                tipo: "opcion",
                pregunta: "¿Qué sujeta la figura con su mano?",
                opciones: ["Arpa", "Escudo","Jarra","Espada"],
                correctas: ["Escudo"],
                multiple: false
            },
            {
                reto: 89,
                id: "R89-Av34km-es",
                tipo: "opcion",
                pregunta: "89. ¿Qué porta San Lorenzo en la mano?",
                opciones: ["Una Paloma", "Una cuchara", "Una parrilla"],
                correctas: ["Una parrilla"],
                multiple: false
            },
            {
                reto: 90,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        en: [
            // Array de retos Aventura34km (EN)
{
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
{
                reto: 1,
                id: "R1-Av34km-en",
                tipo: "opcion",
                pregunta: "1. How many adventures can be done with Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 2,
                id: "R2-Av34km-en",
                tipo: "opcion",
                pregunta: "2. Is it a good time to start your adventure?",
                opciones: ["Yes", "No"],
                correctas: ["?"],
                multiple: false
            },
{
                reto: 3,
                id: "R3-Av34km-en",
                tipo: "opcion",
                pregunta: "3. Can you tell me the names of these towers?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
{
                reto: 4,
                id: "PZ-19",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-19"
            },
{
                reto: 5,
                id: "R5-Av34km-en",
                tipo: "opcion",
                pregunta: "Can you tell me the name of these popular festivals in Valencia?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
{
                reto: 6,
                id: "R6-Av34km-en",
                tipo: "opcion",
                pregunta: "Nature has sculpted the coat of arms of Valencia. What can you see at the top?",
                opciones: ["A shield", "A bat", "A dragon"],
                correctas: ["A bat"],
                multiple: false
            },
{
                reto: 7,
                id: "R7-Av34km-en",
                tipo: "texto",
                pregunta: "Can you guess how many steps it has?",
                correctas: ["16"],
                multiple: false
            },
{
                reto: 8,
                id: "R8-Av34km-en",
                tipo: "opcion",
                pregunta: "What type of trees can you touch right now?",
                opciones: ["Olive trees", "Orange trees", "Palm trees"],
                correctas: ["Palm trees"],
                multiple: false
            },
{
                reto: 9,
                id: "R9-Av34km-en",
                tipo: "texto",
                pregunta: "Can you tell me the price to access this attraction?",
                correctas: ["gratis"],
                multiple: false
            },
{
                reto: 10,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
{
                reto: 11,
                id: "R11-Av34km-en",
                tipo: "opcion",
                pregunta: "How many monuments make up the City of Arts and Sciences?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
{
                reto: 12,
                id: "R12-Av34km-en",
                tipo: "opcion",
                pregunta: "What is Orxata made of?",
                opciones: ["Chufa", "Barley", "Rice"],
                correctas: ["Chufa"],
                multiple: false
            },
{
                reto: 13,
                id: "R13-Av34km-en",
                tipo: "opcion",
                pregunta: "What surrounds the base of the bridge?",
                opciones: ["Water", "Grass", "Ducks"],
                correctas: ["Water"],
                multiple: false
            },
{
                reto: 14,
                id: "R14-Av34km-en",
                tipo: "opcion",
                pregunta: "Do you remember which animal crowns the coat of arms of Valencia?",
                opciones: ["Bat", "Dragon", "Lion"],
                correctas: ["Bat"],
                multiple: false
            },
{
                reto: 15,
                id: "R15-Av34km-en",
                tipo: "opcion",
                pregunta: "What can be seen on the locomotive?",
                opciones: ["A dragon", "A star", "A date"],
                correctas: ["A star"],
                multiple: false
            },
{
                reto: 16,
                id: "R16-Av34km-en",
                tipo: "opcion-multiple",
                pregunta: "What elements can be seen in this scene?",
                opciones: ["A Faller and a Fallera", "Oranges", "Grapes"],
                correctas: ["A Faller and a Fallera", "Oranges", "Grapes"],
                multiple: true
            },
{
                reto: 17,
                id: "R17-Av34km-en",
                tipo: "opcion-multiple",
                pregunta: "What could it be?",
                opciones: ["A round loaf of bread", "Crabs", "Apples"],
                correctas: ["A round loaf of bread", "Crabs"],
                multiple: true
            },
{
                reto: 18,
                id: "R18-Av34km-en",
                tipo: "texto",
                pregunta: "How many animals can you count? Note that there are cows, pigs…",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 19,
                id: "PZ-20",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-20"
            },
{
                reto: 20,
                id: "R20-Av34km-en",
                tipo: "texto",
                pregunta: "How many floors does this Monument have?",
                correctas: ["4"],
                multiple: false
            },
{
                reto: 21,
                id: "R21-Av34km-en",
                tipo: "opcion",
                pregunta: "What citrus fruit native to Valencia decorates the façade?",
                opciones: ["Lemons", "Grapefruits", "Oranges"],
                correctas: ["Oranges"],
                multiple: false
            },
{
                reto: 22,
                id: "R22-Av34km-en",
                tipo: "texto",
                pregunta: "Can you find your language?",
                correctas: ["Yes? No?"],
                multiple: false
            },
{
                reto: 23,
                id: "R23-Av34km-en",
                tipo: "opcion",
                pregunta: "23. Do you remember which animal crowns the municipal coat of arms?",
                opciones: ["A Dragon", "A Bat", "A Horse"],
                correctas: ["A Bat"],
                multiple: false
            },
{
                reto: 24,
                id: "R24-Av34km-en",
                tipo: "opcion-multiple",
                pregunta: "24. Above the main entrance, in a semicircular arch, allegorical figures represent the five continents. What does the central figure hold?",
                opciones: ["A Torch", "A Sword", "A Crown"],
                correctas: ["A Torch", "A Sword"],
                multiple: true
            },
{
                reto: 25,
                id: "R25-Av34km-en",
                tipo: "opcion",
                pregunta: "25. What does the figure hold in its hand?",
                opciones: ["A Scale", "A Book", "A Feather"],
                correctas: ["A Scale"],
                multiple: false
            },
{
                reto: 26,
                id: "R26-Av34km-en",
                tipo: "texto",
                pregunta: "26. How many floors does the building have?",
                correctas: ["10"]
            },
{
                reto: 27,
                id: "R27-Av34km-en",
                tipo: "opcion",
                pregunta: "27. Look for the stained glass with the colors of the Valencian Senyera on the building facade. Can you determine its shape?",
                opciones: ["Quadrangular", "Roundy", "Triangular"],
                correctas: ["Roundy"],
                multiple: false
            },
{
                reto: 28,
                id: "R28-Av34km-en",
                tipo: "opcion-multiple",
                pregunta: "28. What does the Virgin hold in her hand?",
                opciones: ["A Rosary", "A Child", "A Crown"],
                correctas: ["A Rosary", "A Child"],
                multiple: true
            },
{
                reto: 29,
                id: "R29-Av34km-en",
                tipo: "opcion",
                pregunta: "29. What does the angel give to the child?",
                opciones: ["A Dove", "An Orb", "Food"],
                correctas: ["An Orb"],
                multiple: false
            },
{
                reto: 30,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
{
                reto: 31,
                id: "R31-Av34km-en",
                tipo: "opcion-multiple",
                pregunta: "31. The ferryman rowing against the current.",
                opciones: ["A man with a sad face steering a small wooden boat escapes against the current from a monster."],
                correctas: ["A man with a sad face steering a small wooden boat escapes against the current from a monster."],
                multiple: true
            },
{
                reto: 32,
                id: "R32-Av34km-en",
                tipo: "opcion-multiple",
                pregunta: "32. A dead tree: symbol of Sin, is seen between the two leaves of the door and acts as a mullion.",
                opciones: ["Notice on the tree's top 4 naked men whipping each other."],
                correctas: ["Notice on the tree's top 4 naked men whipping each other."],
                multiple: true
            },
{
                reto: 33,
                id: "R33-Av34km-en",
                tipo: "opcion-multiple",
                pregunta: "33. On the right, an angel shows his penis and…",
                opciones: ["He is about to place it in a vase held with the other hand. Strange and unusual, isn't it?"],
                correctas: ["He is about to place it in a vase held with the other hand. Strange and unusual, isn't it?"],
                multiple: true
            },
{
                reto: 34,
                id: "R34-Av34km-en",
                tipo: "opcion-multiple",
                pregunta: "34. In the center: The Bearded Man and the Lion:",
                opciones: ["Original and contradictory scene in which the gentle one is precisely the lion and not the bearded old man."],
                correctas: ["Original and contradictory scene in which the gentle one is precisely the lion and not the bearded old man."],
                multiple: true
            },
{
                reto: 35,
                id: "R35-Av34km-en",
                tipo: "opcion-multiple",
                pregunta: "35. Here's an extra challenge! Look for the fornicator in the Silk Exchange!",
                opciones: ["In one of its windows, you will find a carved man; his head is not visible but his genitals are, very clearly."],
                correctas: ["In one of its windows, you will find a carved man; his head is not visible but his genitals are, very clearly."],
                multiple: true
            },
{
                reto: 36,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
{
                reto: 37,
                id: "R37-Av34km-en",
                tipo: "texto",
                pregunta: "How wide is the entrance of the narrow building?",
                correctas: ["1,35 metros"]
            },
{
                reto: 38,
                id: "R38-Av34km-en",
                tipo: "opcion-multiple",
                pregunta: "Three blind arches. Two of them are smooth, the third was left unplastered.<br>What can be seen in that unplastered arch?",
                opciones: ["A face", "A torso", "A gargoyle"],
                correctas: ["A face", "A torso"],
                multiple: true
            },
{
                reto: 39,
                id: "R39-Av34km-en",
                tipo: "opcion",
                pregunta: "What is at the very top of the baroque tower of Santa Catalina?",
                opciones: ["A cross", "The sun", "A dove"],
                correctas: ["A cross"],
                multiple: false
            },
{
                reto: 40,
                id: "R40-Av34km-en",
                tipo: "texto",
                pregunta: "What color are the tiles of the dome of the baroque tower of Santa Catalina?",
                correctas: ["azules"]
            },
{
                reto: 41,
                id: "R41-Av34km-en",
                tipo: "opcion",
                pregunta: "Can you determine the geometry of the Miguelete Tower of Valencia? ",
                opciones: ["Hexagonal", "Octagonal", "Quadrangular"],
                correctas: ["Octagonal"],
                multiple: false
            },
{
                reto: 42,
                id: "R42-Av34km-en",
                tipo: "texto",
                pregunta: "How many windows can you see?",
                correctas: ["?"]
            },
{
                reto: 43,
                id: "R43-Av34km-en",
                tipo: "opcion-multiple",
                pregunta: "What can be seen more than 35 meters high at the top of the baroque façade?",
                opciones: ["A sphere", "A bat", "A cross", "A horse"],
                correctas: ["A sphere", "A cross"],
                multiple: true
            },
{
                reto: 44,
                id: "R44-Av34km-en",
                tipo: "texto",
                pregunta: "How many arches make up the doorway?",
                correctas: ["8"],
                multiple: false
            },
{
                reto: 45,
                id: "R45-Av34km-en",
                tipo: "opcion",
                pregunta: "45. What sculpted figure can be seen in the frame of the painting?",
                opciones: ["A Dragon", "A Bat", "A Crown"],
                correctas: ["A Crown"],
                multiple: false
            },
{
                reto: 46,
                id: "R46-Av34km-en",
                tipo: "opcion-multiple",
                pregunta: "46. What can be seen inside?",
                opciones: ["An Altar", "A Flag", "A Sword"],
                correctas: ["An Altar", "A Flag"],
                multiple: true
            },
{
                reto: 47,
                id: "R47-Av34km-en",
                tipo: "texto",
                pregunta: "47. On this there is a commemorative plaque. In which year was it placed?",
                correctas: ["1952"]
            },
{
                reto: 48,
                id: "R48-Av34km-en",
                tipo: "texto",
                pregunta: "48. In which year was this building constructed? Hint: look at the top of the facade.",
                correctas: ["1906"]
            },
{
                reto: 49,
                id: "R49-Av34km-en",
                tipo: "opcion",
                pregunta: "49. Looking at the image of San Valero, which item could tell us he was imprisoned?",
                opciones: ["The chains", "The book", "His sad face"],
                correctas: ["The chains"],
                multiple: false
            },
{
                reto: 50,
                id: "R50-Av34km-en",
                tipo: "opcion",
                pregunta: "50. What can be seen inside?",
                opciones: ["A Bullring", "Roman Baths", "A Metro Station"],
                correctas: ["Roman Baths"],
                multiple: false
            },
{
                reto: 51,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
{
                reto: 52,
                id: "R52-Av34km-en",
                tipo: "opcion",
                pregunta: "52. Can you determine its geometry?",
                opciones: ["Hexagonal", "Octagonal", "Quadrangular"],
                correctas: ["Hexagonal"],
                multiple: false
            },
{
                reto: 53,
                id: "R53-Av34km-en",
                tipo: "opcion",
                pregunta: "53. With which hand does Neptune hold the cornucopia?",
                opciones: ["Left", "Right"],
                correctas: ["Right"],
                multiple: false
            },
{
                reto: 54,
                id: "R54-Av34km-en",
                tipo: "texto",
                pregunta: "How many figures surround the fountain?",
                correctas: ["8"]
            },
{
                reto: 55,
                id: "R55-Av34km-en",
                tipo: "opcion",
                pregunta: "55. Which of the two towers of the Palacio de la Generalitat do you think is newer: the one on the square, or this one in front of you now?",
                opciones: ["The one on the square", "This one in front of you"],
                correctas: ["This one in front of you"],
                multiple: false
            },
{
                reto: 56,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
{
                reto: 57,
                id: "R57-Av34km-en",
                tipo: "opcion-multiple",
                pregunta: "What can be seen on this ceramic panel? Are they skulls? Is it a cross? Is there also a dove?",
                opciones: ["Skulls", "Doves", "Cross"],
                correctas: ["Skulls", "Cross"],
                multiple: true
            },
{
                reto: 58,
                id: "R58-Av34km-en",
                tipo: "opcion",
                pregunta: "How many bells does this tower have? ",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
{
                reto: 59,
                id: "R59-Av34km-en",
                tipo: "opcion",
                pregunta: "59. What is the figure holding in its hands?",
                opciones: ["A shield", "A shell", "A jug", "A sword"],
                correctas: ["A shell"],
                multiple: false
            },
{
                reto: 60,
                id: "R60-Av34km-en",
                tipo: "opcion",
                pregunta: "Which direction does the established path take?",
                opciones: ["North", "South", "East", "West"],
                correctas: ["North"],
                multiple: false
            },
{
                reto: 61,
                id: "R61-Av34km-en",
                tipo: "opcion",
                pregunta: "How many gates did the old Arab wall of Balansiya have?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 62,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
{
                reto: 63,
                id: "R63-Av34km-en",
                tipo: "opcion",
                pregunta: "Above the door lintel stands out the coat of arms of the Carmelite Order.",
                opciones: ["A Crown", "A Cross", "A Star"],
                correctas: ["A Crown"],
                multiple: false
            },
{
                reto: 64,
                id: "R64-Av34km-en",
                tipo: "opcion",
                pregunta: "What is the Virgin holding in her arms?",
                opciones: ["A Heart", "A Dove", "Baby Jesus"],
                correctas: ["Baby Jesus"],
                multiple: false
            },
{
                reto: 65,
                id: "R65-Av34km-en",
                tipo: "opcion-multiple",
                pregunta: "What is Saint Teresa holding in her hands?",
                opciones: ["A quill", "A sword", "A book", "A jug"],
                correctas: ["A quill", "A book"],
                multiple: true
            },
{
                reto: 66,
                id: "R66-Av34km-en",
                tipo: "texto",
                pregunta: "How much does admission to this museum cost?",
                correctas: ["Free"],
                multiple: false
            },
{
                reto: 67,
                id: "R67-Av34km-en",
                tipo: "opcion",
                pregunta: "How many cats can you see depicted on the panel?",
                opciones: ["3", "4", "5"],
                correctas: ["4"],
                multiple: false
            },
{
                reto: 68,
                id: "R68-Av34km-en",
                tipo: "texto",
                pregunta: "What height does this panel indicate?",
                correctas: ["1.90 metres"],
                multiple: false
            },
{
                reto: 69,
                id: "R69-Av34km-en",
                tipo: "texto",
                pregunta: "What year does the upper panel indicate?",
                correctas: ["2100"],
                multiple: false
            },
{
                reto: 70,
                id: "R70-Av34km-en",
                tipo: "opcion",
                pregunta: "What tops the coat of arms?",
                opciones: ["A crown", "A bat", "A dragon"],
                correctas: ["A crown"],
                multiple: false
            },
{
                reto: 71,
                id: "R71-Av34km-en",
                tipo: "texto",
                pregunta: "How many bullet holes can you count?",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 72,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
{
                reto: 73,
                id: "R73-Av34km-en",
                tipo: "opcion",
                pregunta: "What shape does the fountain have?",
                opciones: ["Shell", "Fish", "Person"],
                correctas: ["Person"],
                multiple: false
            },
{
                reto: 74,
                id: "R74-Av34km-en",
                tipo: "texto",
                pregunta: "In what year did the construction begin? Look at the façade!",
                correctas: ["1400"],
                multiple: false
            },
{
                reto: 75,
                id: "R75-Av34km-en",
                tipo: "texto",
                pregunta: "Could you tell me the year of its last renovation? I'm sure you've already seen it!",
                correctas: ["2012"],
                multiple: false
            },
{
                reto: 76,
                id: "R76-Av34km-en",
                tipo: "texto",
                pregunta: "In what year were those works carried out? Need a clue? Look at the façade of the building.",
                correctas: ["1756"],
                multiple: false
            },
{
                reto: 77,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
{
                reto: 78,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
{
                reto: 79,
                id: "R79-Av34km-en",
                tipo: "opcion",
                pregunta: "Could you tell me the name of this ancient river?",
                opciones: ["Turia", "Júcar", "Segura", "Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
{
                reto: 80,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
{
                reto: 81,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
{
                reto: 82,
                id: "R82-Av34km-en",
                tipo: "opcion-multiple",
                pregunta: "What uses can those stone blocks have?",
                opciones: ["Stop the water", "Stop the cart wheels", "Collect the river waste"],
                correctas: ["Stop the cart wheels", "Collect the river waste"],
                multiple: true
            },
{
                reto: 83,
                id: "R83-Av34km-en",
                tipo: "opcion",
                pregunta: "At the top of the towers flies the flag of Valencia: its colours are red, yellow and…",
                opciones: ["Purple", "Green", "Blue"],
                correctas: ["Blue"],
                multiple: false
            },
{
                reto: 84,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
{
                reto: 85,
                id: "R85-Av34km-en",
                tipo: "opcion",
                pregunta: "What is this museum dedicated to?",
                opciones: ["Architecture", "History", "Natural Sciences"],
                correctas: ["Natural Sciences"],
                multiple: false
            },
{
                reto: 86,
                id: "R86-Av34km-en",
                tipo: "opcion",
                pregunta: "What figure decorates the fountain?",
                opciones: ["A duck", "A stork", "A fish"],
                correctas: ["A stork"],
                multiple: false
            },
{
                reto: 87,
                id: "R87-Av34km-en",
                tipo: "texto",
                pregunta: "On this façade there is a clock. What time does it show?",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 88,
                id: "R88-Av34km-en",
                tipo: "opcion",
                pregunta: "What does the figure hold in its hand?",
                opciones: ["Harp", "Shield", "Jug", "Sword"],
                correctas: ["Shield"],
                multiple: false
            },
{
                reto: 89,
                id: "R89-Av34km-en",
                tipo: "opcion",
                pregunta: "89. What does Saint Lawrence hold in his hand?",
                opciones: ["A Dove", "A Spoon", "A Grill"],
                correctas: ["A Grill"],
                multiple: false
            },
{
                reto: 90,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        fr: [
            // Array de retos Aventura34km (FR)
{
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
{
                reto: 1,
                id: "R1-Av34km-fr",
                tipo: "opcion",
                pregunta: "1. Combien d'aventures peut-on faire avec Valencia be Guides ?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 2,
                id: "R2-Av34km-fr",
                tipo: "opcion",
                pregunta: "2. Est-ce le bon moment pour commencer votre aventure ?",
                opciones: ["Oui", "Non"],
                correctas: ["?"],
                multiple: false
            },
{
                reto: 3,
                id: "R3-Av34km-fr",
                tipo: "opcion",
                pregunta: "3. Pouvez-vous me dire comment s'appellent ces tours ?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
{
                reto: 4,
                id: "PZ-19",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-19"
            },
{
                reto: 5,
                id: "R5-Av34km-fr",
                tipo: "opcion",
                pregunta: "Pouvez-vous me dire comment s'appellent ces fêtes populaires de Valence ?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
{
                reto: 6,
                id: "R6-Av34km-fr",
                tipo: "opcion",
                pregunta: "La nature a sculpté le blason de Valence. Que peut-on voir en haut ?",
                opciones: ["Un bouclier", "Une chauve-souris", "Un dragon"],
                correctas: ["Une chauve-souris"],
                multiple: false
            },
{
                reto: 7,
                id: "R7-Av34km-fr",
                tipo: "texto",
                pregunta: "Pouvez-vous deviner combien de marches il comporte ?",
                correctas: ["16"],
                multiple: false
            },
{
                reto: 8,
                id: "R8-Av34km-fr",
                tipo: "opcion",
                pregunta: "Quel type d'arbres pouvez-vous toucher en ce moment ?",
                opciones: ["Oliviers", "Orangers", "Palmiers"],
                correctas: ["Palmiers"],
                multiple: false
            },
{
                reto: 9,
                id: "R9-Av34km-fr",
                tipo: "texto",
                pregunta: "Pouvez-vous me dire le prix pour accéder à cette attraction ?",
                correctas: ["gratis"],
                multiple: false
            },
{
                reto: 10,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
{
                reto: 11,
                id: "R11-Av34km-fr",
                tipo: "opcion",
                pregunta: "De combien de monuments se compose la Cité des Arts et des Sciences ?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
{
                reto: 12,
                id: "R12-Av34km-fr",
                tipo: "opcion",
                pregunta: "De quoi est faite l'Orxata ?",
                opciones: ["Chufa", "Orge", "Riz"],
                correctas: ["Chufa"],
                multiple: false
            },
{
                reto: 13,
                id: "R13-Av34km-fr",
                tipo: "opcion",
                pregunta: "Qu'est-ce qui entoure la base du pont ?",
                opciones: ["Eau", "Herbe", "Canards"],
                correctas: ["Eau"],
                multiple: false
            },
{
                reto: 14,
                id: "R14-Av34km-fr",
                tipo: "opcion",
                pregunta: "Vous souvenez-vous quel animal couronne le blason de Valence ?",
                opciones: ["Chauve-souris", "Dragon", "Lion"],
                correctas: ["Chauve-souris"],
                multiple: false
            },
{
                reto: 15,
                id: "R15-Av34km-fr",
                tipo: "opcion",
                pregunta: "Que peut-on voir sur la locomotive ?",
                opciones: ["Un dragon", "Une étoile", "Une date"],
                correctas: ["Une étoile"],
                multiple: false
            },
{
                reto: 16,
                id: "R16-Av34km-fr",
                tipo: "opcion-multiple",
                pregunta: "Quels éléments peut-on voir dans cette scène ?",
                opciones: ["Un Fallero et une Fallera", "Des oranges", "Du raisin"],
                correctas: ["Un Fallero et une Fallera", "Des oranges", "Du raisin"],
                multiple: true
            },
{
                reto: 17,
                id: "R17-Av34km-fr",
                tipo: "opcion-multiple",
                pregunta: "Qu'est-ce que cela pourrait être ?",
                opciones: ["Une miche de pain", "Des crabes", "Des pommes"],
                correctas: ["Une miche de pain", "Des crabes"],
                multiple: true
            },
{
                reto: 18,
                id: "R18-Av34km-fr",
                tipo: "texto",
                pregunta: "Combien d'animaux pouvez-vous dénombrer ? Notez qu'il y a des vaches, des cochons…",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 19,
                id: "PZ-20",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-20"
            },
{
                reto: 20,
                id: "R20-Av34km-fr",
                tipo: "texto",
                pregunta: "Combien d'étages possède ce Monument ?",
                correctas: ["4"],
                multiple: false
            },
{
                reto: 21,
                id: "R21-Av34km-fr",
                tipo: "opcion",
                pregunta: "Quel agrume natif de Valence décore la façade ?",
                opciones: ["Citrons", "Pamplemousses", "Oranges"],
                correctas: ["Oranges"],
                multiple: false
            },
{
                reto: 22,
                id: "R22-Av34km-fr",
                tipo: "texto",
                pregunta: "Pouvez-vous trouver votre langue ?",
                correctas: ["Oui ? Non ?"],
                multiple: false
            },
{
                reto: 23,
                id: "R23-Av34km-fr",
                tipo: "opcion",
                pregunta: "23. Vous souvenez-vous de quel animal couronne le blason municipal ?",
                opciones: ["Un dragon", "Une chauve-souris", "Un cheval"],
                correctas: ["Une chauve-souris"],
                multiple: false
            },
{
                reto: 24,
                id: "R24-Av34km-fr",
                tipo: "opcion-multiple",
                pregunta: "24. Au-dessus de l'entrée principale, dans un arc en plein cintre, des figures allégoriques représentent les cinq continents. Que tient la figure centrale ?",
                opciones: ["Une torche", "Une épée", "Une couronne"],
                correctas: ["Une torche", "Une épée"],
                multiple: true
            },
{
                reto: 25,
                id: "R25-Av34km-fr",
                tipo: "opcion",
                pregunta: "25. Que tient la figure dans sa main ?",
                opciones: ["Une balance", "Un livre", "Une plume"],
                correctas: ["Une balance"],
                multiple: false
            },
{
                reto: 26,
                id: "R26-Av34km-fr",
                tipo: "texto",
                pregunta: "26. Combien d'étages a le bâtiment ?",
                correctas: ["10"]
            },
{
                reto: 27,
                id: "R27-Av34km-fr",
                tipo: "opcion",
                pregunta: "27. Cherchez le vitrail avec les couleurs de la Senyera valencienne sur la façade du bâtiment. Pouvez-vous déterminer sa forme ?",
                opciones: ["Quadrangulaire", "Ronde", "Triangulaire"],
                correctas: ["Ronde"],
                multiple: false
            },
{
                reto: 28,
                id: "R28-Av34km-fr",
                tipo: "opcion-multiple",
                pregunta: "28. Que tient la Vierge dans sa main ?",
                opciones: ["Un chapelet", "Un enfant", "Une couronne"],
                correctas: ["Un chapelet", "Un enfant"],
                multiple: true
            },
{
                reto: 29,
                id: "R29-Av34km-fr",
                tipo: "opcion",
                pregunta: "29. Que donne l'ange à l'enfant ?",
                opciones: ["Une colombe", "Un orbe", "Des aliments"],
                correctas: ["Un orbe"],
                multiple: false
            },
{
                reto: 30,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
{
                reto: 31,
                id: "R31-Av34km-fr",
                tipo: "opcion-multiple",
                pregunta: "31. Le batelier qui rame à contre-courant.",
                opciones: ["Un homme au visage triste dirige un petit bateau en bois pour échapper à contre-courant à un monstre."],
                correctas: ["Un homme au visage triste dirige un petit bateau en bois pour échapper à contre-courant à un monstre."],
                multiple: true
            },
{
                reto: 32,
                id: "R32-Av34km-fr",
                tipo: "opcion-multiple",
                pregunta: "32. Un arbre mort : symbole du péché, se trouve entre les deux feuilles de la porte et fait office de meneau.",
                opciones: ["Observez au sommet de l'arbre quatre hommes nus qui se flagellent entre eux."],
                correctas: ["Observez au sommet de l'arbre quatre hommes nus qui se flagellent entre eux."],
                multiple: true
            },
{
                reto: 33,
                id: "R33-Av34km-fr",
                tipo: "opcion-multiple",
                pregunta: "33. À droite, un ange montre son pénis et…",
                opciones: ["Il s'apprête à le placer dans un vase qu'il tient de l'autre main. Étrange et inhabituel, n'est-ce pas ?"],
                correctas: ["Il s'apprête à le placer dans un vase qu'il tient de l'autre main. Étrange et inhabituel, n'est-ce pas ?"],
                multiple: true
            },
{
                reto: 34,
                id: "R34-Av34km-fr",
                tipo: "opcion-multiple",
                pregunta: "34. Au centre : L'homme barbu et le lion :",
                opciones: ["Scène originale et contradictoire où le doux est précisément le lion et non le vieil homme barbu."],
                correctas: ["Scène originale et contradictoire où le doux est précisément le lion et non le vieil homme barbu."],
                multiple: true
            },
{
                reto: 35,
                id: "R35-Av34km-fr",
                tipo: "opcion-multiple",
                pregunta: "35. Voici un défi supplémentaire ! Cherchez le fornicateur de la Bourse de la soie !",
                opciones: ["Dans une de ses fenêtres, vous trouverez un homme sculpté ; sa tête n'est pas visible mais ses parties génitales le sont, très clairement."],
                correctas: ["Dans une de ses fenêtres, vous trouverez un homme sculpté ; sa tête n'est pas visible mais ses parties génitales le sont, très clairement."],
                multiple: true
            },
{
                reto: 36,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
{
                reto: 37,
                id: "R37-Av34km-fr",
                tipo: "texto",
                pregunta: "Quelle est la largeur de l’entrée du bâtiment étroit ?",
                correctas: ["1,35 metros"]
            },
{
                reto: 38,
                id: "R38-Av34km-fr",
                tipo: "opcion-multiple",
                pregunta: "Trois arcs aveugles. Deux d’entre eux sont lisses, le troisième a été laissé sans enduit.<br>Que peut-on voir dans cet arc sans enduit ?",
                opciones: ["Un visage", "Un torse", "Une gargouille"],
                correctas: ["Un visage", "Un torse"],
                multiple: true
            },
{
                reto: 39,
                id: "R39-Av34km-fr",
                tipo: "opcion",
                pregunta: "Que trouve-t-on tout en haut de la tour baroque de Santa Catalina ?",
                opciones: ["Une croix", "Le soleil", "Une colombe"],
                correctas: ["Une croix"],
                multiple: false
            },
{
                reto: 40,
                id: "R40-Av34km-fr",
                tipo: "texto",
                pregunta: "De quelle couleur sont les tuiles du dôme de la tour baroque de Santa Catalina ?",
                correctas: ["azules"]
            },
{
                reto: 41,
                id: "R41-Av34km-fr",
                tipo: "opcion",
                pregunta: "Sauriez-vous déterminer la géométrie de la tour du Miguelete de Valence ? ",
                opciones: ["Hexagonal", "Octogonal", "Quadrangulaire"],
                correctas: ["Octogonal"],
                multiple: false
            },
{
                reto: 42,
                id: "R42-Av34km-fr",
                tipo: "texto",
                pregunta: "Combien de fenêtres pouvez-vous voir ?",
                correctas: ["?"]
            },
{
                reto: 43,
                id: "R43-Av34km-fr",
                tipo: "opcion-multiple",
                pregunta: "Que peut-on voir à plus de 35 mètres de hauteur au sommet de la façade baroque ?",
                opciones: ["Une sphère", "Une chauve-souris", "Une croix", "Un cheval"],
                correctas: ["Une sphère", "Une croix"],
                multiple: true
            },
{
                reto: 44,
                id: "R44-Av34km-fr",
                tipo: "texto",
                pregunta: "Combien d'arcs composent la porte ?",
                correctas: ["8"],
                multiple: false
            },
{
                reto: 45,
                id: "R45-Av34km-fr",
                tipo: "opcion",
                pregunta: "45. Quelle figure sculptée peut-on voir dans le cadre du tableau ?",
                opciones: ["Un dragon", "Une chauve-souris", "Une couronne"],
                correctas: ["Une couronne"],
                multiple: false
            },
{
                reto: 46,
                id: "R46-Av34km-fr",
                tipo: "opcion-multiple",
                pregunta: "46. Que peut-on voir à l'intérieur ?",
                opciones: ["Un autel", "Un drapeau", "Une épée"],
                correctas: ["Un autel", "Un drapeau"],
                multiple: true
            },
{
                reto: 47,
                id: "R47-Av34km-fr",
                tipo: "texto",
                pregunta: "47. Sur celui-ci se trouve une plaque commémorative. En quelle année a-t-elle été placée ?",
                correctas: ["1952"]
            },
{
                reto: 48,
                id: "R48-Av34km-fr",
                tipo: "texto",
                pregunta: "48. En quelle année ce bâtiment a-t-il été construit ? Indice : regardez en haut de la façade.",
                correctas: ["1906"]
            },
{
                reto: 49,
                id: "R49-Av34km-fr",
                tipo: "opcion",
                pregunta: "49. En regardant l'image de San Valero, quel objet pourrait nous dire qu'il a été emprisonné ?",
                opciones: ["Les chaînes", "Le livre", "Son visage triste"],
                correctas: ["Les chaînes"],
                multiple: false
            },
{
                reto: 50,
                id: "R50-Av34km-fr",
                tipo: "opcion",
                pregunta: "50. Que peut-on voir à l'intérieur ?",
                opciones: ["Une arène", "Des bains romains", "Une station de métro"],
                correctas: ["Des bains romains"],
                multiple: false
            },
{
                reto: 51,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
{
                reto: 52,
                id: "R52-Av34km-fr",
                tipo: "opcion",
                pregunta: "52. Pouvez-vous déterminer sa géométrie ?",
                opciones: ["Hexagonal", "Octogonal", "Quadrangulaire"],
                correctas: ["Hexagonal"],
                multiple: false
            },
{
                reto: 53,
                id: "R53-Av34km-fr",
                tipo: "opcion",
                pregunta: "53. Avec quelle main Neptune tient-il la corne d'abondance ?",
                opciones: ["Gauche", "Droite"],
                correctas: ["Droite"],
                multiple: false
            },
{
                reto: 54,
                id: "R54-Av34km-fr",
                tipo: "texto",
                pregunta: "Combien de figures entourent la fontaine ?",
                correctas: ["8"]
            },
{
                reto: 55,
                id: "R55-Av34km-fr",
                tipo: "opcion",
                pregunta: "55. Laquelle des deux tours du Palacio de la Generalitat pensez-vous être la plus récente : celle de la place ou celle-ci devant vous ?",
                opciones: ["Celle de la place", "Celle-ci devant vous"],
                correctas: ["Celle-ci devant vous"],
                multiple: false
            },
{
                reto: 56,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
{
                reto: 57,
                id: "R57-Av34km-fr",
                tipo: "opcion-multiple",
                pregunta: "Que peut-on voir sur ce panneau en céramique ? Sont-ce des crânes ? Est-ce une croix ? Y a-t-il aussi une colombe ?",
                opciones: ["Crânes", "Colombes", "Croix"],
                correctas: ["Crânes", "Croix"],
                multiple: true
            },
{
                reto: 58,
                id: "R58-Av34km-fr",
                tipo: "opcion",
                pregunta: "Combien de cloches cette tour abrite-t-elle ? ",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
{
                reto: 59,
                id: "R59-Av34km-fr",
                tipo: "opcion",
                pregunta: "59. Que tient la figure dans ses mains ?",
                opciones: ["Un bouclier", "Une coquille", "Une cruche", "Une épée"],
                correctas: ["Une coquille"],
                multiple: false
            },
{
                reto: 60,
                id: "R60-Av34km-fr",
                tipo: "opcion",
                pregunta: "Quelle direction prend le chemin établi ?",
                opciones: ["Nord", "Sud", "Est", "Ouest"],
                correctas: ["Nord"],
                multiple: false
            },
{
                reto: 61,
                id: "R61-Av34km-fr",
                tipo: "opcion",
                pregunta: "Combien de portes possédait l’ancienne muraille arabe de Balansiya ?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 62,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
{
                reto: 63,
                id: "R63-Av34km-fr",
                tipo: "opcion",
                pregunta: "Au-dessus du linteau de la porte se distingue le blason de l'Ordre du Carmel.",
                opciones: ["Une Couronne", "Une Croix", "Une Étoile"],
                correctas: ["Une Couronne"],
                multiple: false
            },
{
                reto: 64,
                id: "R64-Av34km-fr",
                tipo: "opcion",
                pregunta: "Que porte la Vierge dans ses bras ?",
                opciones: ["Un Cœur", "Une Colombe", "L'Enfant Jésus"],
                correctas: ["L'Enfant Jésus"],
                multiple: false
            },
{
                reto: 65,
                id: "R65-Av34km-fr",
                tipo: "opcion-multiple",
                pregunta: "Que porte Sainte Thérèse dans ses mains ?",
                opciones: ["Une plume", "Une épée", "Un livre", "Une cruche"],
                correctas: ["Une plume", "Un livre"],
                multiple: true
            },
{
                reto: 66,
                id: "R66-Av34km-fr",
                tipo: "texto",
                pregunta: "Combien coûte l'entrée de ce musée ?",
                correctas: ["Gratuit"],
                multiple: false
            },
{
                reto: 67,
                id: "R67-Av34km-fr",
                tipo: "opcion",
                pregunta: "Combien de chats peut-on voir représentés sur le panneau ?",
                opciones: ["3", "4", "5"],
                correctas: ["4"],
                multiple: false
            },
{
                reto: 68,
                id: "R68-Av34km-fr",
                tipo: "texto",
                pregunta: "Quelle hauteur indique ce panneau ?",
                correctas: ["1,90 mètre"],
                multiple: false
            },
{
                reto: 69,
                id: "R69-Av34km-fr",
                tipo: "texto",
                pregunta: "Quelle année indique le panneau supérieur ?",
                correctas: ["2100"],
                multiple: false
            },
{
                reto: 70,
                id: "R70-Av34km-fr",
                tipo: "opcion",
                pregunta: "Qu'est-ce qui surmonte le blason ?",
                opciones: ["Une couronne", "Une chauve-souris", "Un dragon"],
                correctas: ["Une couronne"],
                multiple: false
            },
{
                reto: 71,
                id: "R71-Av34km-fr",
                tipo: "texto",
                pregunta: "Combien de perforations de projectiles pouvez-vous comptabiliser ?",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 72,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
{
                reto: 73,
                id: "R73-Av34km-fr",
                tipo: "opcion",
                pregunta: "Quelle forme a la fontaine ?",
                opciones: ["Coquillage", "Poisson", "Personne"],
                correctas: ["Personne"],
                multiple: false
            },
{
                reto: 74,
                id: "R74-Av34km-fr",
                tipo: "texto",
                pregunta: "En quelle année les travaux ont-ils commencé ? Regardez la façade !",
                correctas: ["1400"],
                multiple: false
            },
{
                reto: 75,
                id: "R75-Av34km-fr",
                tipo: "texto",
                pregunta: "Pourriez-vous me dire l'année de sa dernière réhabilitation ? Vous l'avez sûrement déjà vu !",
                correctas: ["2012"],
                multiple: false
            },
{
                reto: 76,
                id: "R76-Av34km-fr",
                tipo: "texto",
                pregunta: "En quelle année ces travaux ont-ils été réalisés ? Besoin d'un indice ? Regardez la façade du bâtiment.",
                correctas: ["1756"],
                multiple: false
            },
{
                reto: 77,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
{
                reto: 78,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
{
                reto: 79,
                id: "R79-Av34km-fr",
                tipo: "opcion",
                pregunta: "Pourriez-vous me dire le nom de cet ancien fleuve ?",
                opciones: ["Turia", "Júcar", "Segura", "Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
{
                reto: 80,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
{
                reto: 81,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
{
                reto: 82,
                id: "R82-Av34km-fr",
                tipo: "opcion-multiple",
                pregunta: "Quels usages peuvent avoir ces blocs de pierre ?",
                opciones: ["Arrêter l'eau", "Stopper les roues des charrettes", "Recueillir les saletés du fleuve"],
                correctas: ["Stopper les roues des charrettes", "Recueillir les saletés du fleuve"],
                multiple: true
            },
{
                reto: 83,
                id: "R83-Av34km-fr",
                tipo: "opcion",
                pregunta: "Au sommet des tours flotte le drapeau de Valence : ses couleurs se composent de rouge, jaune et…",
                opciones: ["Violet", "Vert", "Bleu"],
                correctas: ["Bleu"],
                multiple: false
            },
{
                reto: 84,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
{
                reto: 85,
                id: "R85-Av34km-fr",
                tipo: "opcion",
                pregunta: "À quoi ce musée est-il consacré ?",
                opciones: ["Architecture", "Histoire", "Sciences naturelles"],
                correctas: ["Sciences naturelles"],
                multiple: false
            },
{
                reto: 86,
                id: "R86-Av34km-fr",
                tipo: "opcion",
                pregunta: "Quelle figure décore la fontaine ?",
                opciones: ["Un canard", "Une cigogne", "Un poisson"],
                correctas: ["Une cigogne"],
                multiple: false
            },
{
                reto: 87,
                id: "R87-Av34km-fr",
                tipo: "texto",
                pregunta: "Sur cette façade il y a une horloge. Quelle heure indique-t-elle ?",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 88,
                id: "R88-Av34km-fr",
                tipo: "opcion",
                pregunta: "Que tient la figure dans sa main ?",
                opciones: ["Harpe", "Bouclier", "Cruche", "Épée"],
                correctas: ["Bouclier"],
                multiple: false
            },
{
                reto: 89,
                id: "R89-Av34km-fr",
                tipo: "opcion",
                pregunta: "89. Que tient Saint Laurent dans sa main ?",
                opciones: ["Une colombe", "Une cuillère", "Une grille"],
                correctas: ["Une grille"],
                multiple: false
            },
{
                reto: 90,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        it: [
            // Array de retos Aventura34km (IT)
{
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
{
                reto: 1,
                id: "R1-Av34km-it",
                tipo: "opcion",
                pregunta: "1. Quante avventure si possono fare con Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 2,
                id: "R2-Av34km-it",
                tipo: "opcion",
                pregunta: "2. È un buon momento per iniziare la tua avventura?",
                opciones: ["Sì", "No"],
                correctas: ["?"],
                multiple: false
            },
{
                reto: 3,
                id: "R3-Av34km-it",
                tipo: "opcion",
                pregunta: "3. Puoi dirmi come si chiamano queste torri?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre di Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
{
                reto: 4,
                id: "PZ-19",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-19"
            },
{
                reto: 5,
                id: "R5-Av34km-it",
                tipo: "opcion",
                pregunta: "Sapresti dirmi come si chiamano queste feste popolari di Valencia?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
{
                reto: 6,
                id: "R6-Av34km-it",
                tipo: "opcion",
                pregunta: "La natura ha scolpito lo stemma di Valencia. Cosa si può vedere in alto?",
                opciones: ["Uno scudo", "Un pipistrello", "Un drago"],
                correctas: ["Un pipistrello"],
                multiple: false
            },
{
                reto: 7,
                id: "R7-Av34km-it",
                tipo: "texto",
                pregunta: "Sapresti indovinare quanti gradini ha?",
                correctas: ["16"],
                multiple: false
            },
{
                reto: 8,
                id: "R8-Av34km-it",
                tipo: "opcion",
                pregunta: "Che tipo di alberi puoi toccare adesso?",
                opciones: ["Olivi", "Aranci", "Palme"],
                correctas: ["Palme"],
                multiple: false
            },
{
                reto: 9,
                id: "R9-Av34km-it",
                tipo: "texto",
                pregunta: "Sapresti dirmi il prezzo per accedere a questa attrazione?",
                correctas: ["gratis"],
                multiple: false
            },
{
                reto: 10,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
{
                reto: 11,
                id: "R11-Av34km-it",
                tipo: "opcion",
                pregunta: "Di quanti monumenti è composta la Città delle Arti e delle Scienze?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
{
                reto: 12,
                id: "R12-Av34km-it",
                tipo: "opcion",
                pregunta: "Di cosa è fatta l'Orxata?",
                opciones: ["Chufa", "Orzo", "Riso"],
                correctas: ["Chufa"],
                multiple: false
            },
{
                reto: 13,
                id: "R13-Av34km-it",
                tipo: "opcion",
                pregunta: "Cosa circonda la base del ponte?",
                opciones: ["Acqua", "Erba", "Anatre"],
                correctas: ["Acqua"],
                multiple: false
            },
{
                reto: 14,
                id: "R14-Av34km-it",
                tipo: "opcion",
                pregunta: "Ti ricordi quale animale corona lo stemma di Valencia?",
                opciones: ["Pipistrello", "Drago", "Leone"],
                correctas: ["Pipistrello"],
                multiple: false
            },
{
                reto: 15,
                id: "R15-Av34km-it",
                tipo: "opcion",
                pregunta: "Cosa si può vedere sulla locomotiva?",
                opciones: ["Un drago", "Una stella", "Una data"],
                correctas: ["Una stella"],
                multiple: false
            },
{
                reto: 16,
                id: "R16-Av34km-it",
                tipo: "opcion-multiple",
                pregunta: "Quali elementi si possono vedere in questa scena?",
                opciones: ["Un Fallero e una Fallera", "Arance", "Uva"],
                correctas: ["Un Fallero e una Fallera", "Arance", "Uva"],
                multiple: true
            },
{
                reto: 17,
                id: "R17-Av34km-it",
                tipo: "opcion-multiple",
                pregunta: "Cosa potrebbe essere?",
                opciones: ["Un pane di segale", "Granchi", "Mele"],
                correctas: ["Un pane di segale", "Granchi"],
                multiple: true
            },
{
                reto: 18,
                id: "R18-Av34km-it",
                tipo: "texto",
                pregunta: "Quanti animali riesce a enumerare? Noti che ci sono mucche, maiali…",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 19,
                id: "PZ-20",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-20"
            },
{
                reto: 20,
                id: "R20-Av34km-it",
                tipo: "texto",
                pregunta: "Quanti piani ha questo Monumento?",
                correctas: ["4"],
                multiple: false
            },
{
                reto: 21,
                id: "R21-Av34km-it",
                tipo: "opcion",
                pregunta: "Quale frutto agrumato tipico di Valencia decora la facciata?",
                opciones: ["Limoni", "Pompelmi", "Arance"],
                correctas: ["Arance"],
                multiple: false
            },
{
                reto: 22,
                id: "R22-Av34km-it",
                tipo: "texto",
                pregunta: "Riesce a trovare la sua lingua?",
                correctas: ["Sì? No?"],
                multiple: false
            },
{
                reto: 23,
                id: "R23-Av34km-it",
                tipo: "opcion",
                pregunta: "23. Ricordi quale animale corona lo stemma comunale?",
                opciones: ["Un drago", "Un pipistrello", "Un cavallo"],
                correctas: ["Un pipistrello"],
                multiple: false
            },
{
                reto: 24,
                id: "R24-Av34km-it",
                tipo: "opcion-multiple",
                pregunta: "24. Sopra l'ingresso principale, in un arco a tutto sesto, figure allegoriche rappresentano i cinque continenti. Cosa tiene la figura centrale?",
                opciones: ["Una torcia", "Una spada", "Una corona"],
                correctas: ["Una torcia", "Una spada"],
                multiple: true
            },
{
                reto: 25,
                id: "R25-Av34km-it",
                tipo: "opcion",
                pregunta: "25. Cosa tiene la figura nella mano?",
                opciones: ["Una bilancia", "Un libro", "Una piuma"],
                correctas: ["Una bilancia"],
                multiple: false
            },
{
                reto: 26,
                id: "R26-Av34km-it",
                tipo: "texto",
                pregunta: "26. Quanti piani ha l'edificio?",
                correctas: ["10"]
            },
{
                reto: 27,
                id: "R27-Av34km-it",
                tipo: "opcion",
                pregunta: "27. Cerca la vetrata con i colori della Senyera valenciana sulla facciata dell'edificio. Puoi determinarne la forma?",
                opciones: ["Cuadrangular", "Redonda", "Triangular"],
                correctas: ["Redonda"],
                multiple: false
            },
{
                reto: 28,
                id: "R28-Av34km-it",
                tipo: "opcion-multiple",
                pregunta: "28. Cosa tiene la Vergine nella sua mano?",
                opciones: ["Un rosario", "Un bambino", "Una corona"],
                correctas: ["Un rosario", "Un bambino"],
                multiple: true
            },
{
                reto: 29,
                id: "R29-Av34km-it",
                tipo: "opcion",
                pregunta: "29. Cosa dà l'angelo al bambino?",
                opciones: ["Una colomba", "Un orbe", "Cibo"],
                correctas: ["Un orbe"],
                multiple: false
            },
{
                reto: 30,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
{
                reto: 31,
                id: "R31-Av34km-it",
                tipo: "opcion-multiple",
                pregunta: "31. Il barcaiolo che rema controcorrente.",
                opciones: ["Un uomo con volto triste che manovra una piccola barca di legno fugge controcorrente da un mostro."],
                correctas: ["Un uomo con volto triste che manovra una piccola barca di legno fugge controcorrente da un mostro."],
                multiple: true
            },
{
                reto: 32,
                id: "R32-Av34km-it",
                tipo: "opcion-multiple",
                pregunta: "32. Un albero morto: simbolo del Peccato, si vede tra le due foglie della porta e funge da parteluz.",
                opciones: ["Osserva sulla cima dell'albero come 4 uomini nudi si flagellano tra loro."],
                correctas: ["Osserva sulla cima dell'albero come 4 uomini nudi si flagellano tra loro."],
                multiple: true
            },
{
                reto: 33,
                id: "R33-Av34km-it",
                tipo: "opcion-multiple",
                pregunta: "33. A destra, un angelo mostra il suo pene e...",
                opciones: ["si appresta a introdurlo in un vaso che tiene con l'altra mano. Strano e insolito, non ti sembra?"],
                correctas: ["si appresta a introdurlo in un vaso che tiene con l'altra mano. Strano e insolito, non ti sembra?"],
                multiple: true
            },
{
                reto: 34,
                id: "R34-Av34km-it",
                tipo: "opcion-multiple",
                pregunta: "34. Al centro: L'uomo barbuto e il leone:",
                opciones: ["Scena originale e contraddittoria in cui il mansueto è proprio il leone e non il vecchio uomo barbuto."],
                correctas: ["Scena originale e contraddittoria in cui il mansueto è proprio il leone e non il vecchio uomo barbuto."],
                multiple: true
            },
{
                reto: 35,
                id: "R35-Av34km-it",
                tipo: "opcion-multiple",
                pregunta: "35. Ecco una sfida extra! Cerca il fornicatore della Lonja della Seta!",
                opciones: ["In una delle sue finestre, troverai un uomo scolpito; la sua testa non è visibile ma i suoi genitali lo sono, molto chiaramente."],
                correctas: ["In una delle sue finestre, troverai un uomo scolpito; la sua testa non è visibile ma i suoi genitali lo sono, molto chiaramente."],
                multiple: true
            },
{
                reto: 36,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
{
                reto: 37,
                id: "R37-Av34km-it",
                tipo: "texto",
                pregunta: "Quanto è larga l’entrata dell’edificio stretto?",
                correctas: ["1,35 metros"]
            },
{
                reto: 38,
                id: "R38-Av34km-it",
                tipo: "opcion-multiple",
                pregunta: "Tre archi ciechi. Due di essi sono lisci, il terzo è rimasto senza intonaco.<br>Cosa si può vedere in quell’arco non intonacato?",
                opciones: ["Un volto", "Un torso", "Un gargoyle"],
                correctas: ["Un volto", "Un torso"],
                multiple: true
            },
{
                reto: 39,
                id: "R39-Av34km-it",
                tipo: "opcion",
                pregunta: "Cosa c’è in cima alla torre barocca di Santa Catalina?",
                opciones: ["Una croce", "Il sole", "Una colomba"],
                correctas: ["Una croce"],
                multiple: false
            },
{
                reto: 40,
                id: "R40-Av34km-it",
                tipo: "texto",
                pregunta: "Di che colore sono le tegole della cupola della torre barocca di Santa Catalina?",
                correctas: ["azules"]
            },
{
                reto: 41,
                id: "R41-Av34km-it",
                tipo: "opcion",
                pregunta: "Riuscirebbe a determinare la geometria della Torre del Miguelete di Valencia? ",
                opciones: ["Esagonale", "Ottagonale", "Quadrangolare"],
                correctas: ["Ottagonale"],
                multiple: false
            },
{
                reto: 42,
                id: "R42-Av34km-it",
                tipo: "texto",
                pregunta: "Quante finestre riesci a vedere?",
                correctas: ["?"]
            },
{
                reto: 43,
                id: "R43-Av34km-it",
                tipo: "opcion-multiple",
                pregunta: "Cosa si può vedere a più di 35 metri di altezza in cima alla facciata barocca?",
                opciones: ["Una sfera", "Un pipistrello", "Una croce", "Un cavallo"],
                correctas: ["Una sfera", "Una croce"],
                multiple: true
            },
{
                reto: 44,
                id: "R44-Av34km-it",
                tipo: "texto",
                pregunta: "Quanti archi compongono la porta?",
                correctas: ["8"],
                multiple: false
            },
{
                reto: 45,
                id: "R45-Av34km-it",
                tipo: "opcion",
                pregunta: "45. Quale figura scolpita si vede nella cornice del quadro?",
                opciones: ["Un drago", "Un pipistrello", "Una corona"],
                correctas: ["Una corona"],
                multiple: false
            },
{
                reto: 46,
                id: "R46-Av34km-it",
                tipo: "opcion-multiple",
                pregunta: "46. Cosa si può vedere all'interno?",
                opciones: ["Un altare", "Una bandiera", "Una spada"],
                correctas: ["Un altare", "Una bandiera"],
                multiple: true
            },
{
                reto: 47,
                id: "R47-Av34km-it",
                tipo: "texto",
                pregunta: "47. Su di essa c'è una targa commemorativa. In che anno è stata esposta?",
                correctas: ["1952"]
            },
{
                reto: 48,
                id: "R48-Av34km-it",
                tipo: "texto",
                pregunta: "48. In che anno è stato costruito questo edificio? Suggerimento: guarda in alto sulla facciata.",
                correctas: ["1906"]
            },
{
                reto: 49,
                id: "R49-Av34km-it",
                tipo: "opcion",
                pregunta: "49. Guardando l'immagine di San Valero, quale oggetto potrebbe dirci che fu imprigionato?",
                opciones: ["Le catene", "Il libro", "Il suo volto triste"],
                correctas: ["Le catene"],
                multiple: false
            },
{
                reto: 50,
                id: "R50-Av34km-it",
                tipo: "opcion",
                pregunta: "50. Cosa si può vedere all'interno?",
                opciones: ["Un'arena", "Bagni romani", "Una stazione della metropolitana"],
                correctas: ["Bagni romani"],
                multiple: false
            },
{
                reto: 51,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
{
                reto: 52,
                id: "R52-Av34km-it",
                tipo: "opcion",
                pregunta: "52. Sai determinarne la geometria?",
                opciones: ["Esagonale", "Ottagonale", "Quadrangolare"],
                correctas: ["Esagonale"],
                multiple: false
            },
{
                reto: 53,
                id: "R53-Av34km-it",
                tipo: "opcion",
                pregunta: "53. Con quale mano Nettuno tiene la cornucopia?",
                opciones: ["Sinistra", "Destra"],
                correctas: ["Destra"],
                multiple: false
            },
{
                reto: 54,
                id: "R54-Av34km-it",
                tipo: "texto",
                pregunta: "Quante figure circondano la fontana?",
                correctas: ["8"]
            },
{
                reto: 55,
                id: "R55-Av34km-it",
                tipo: "opcion",
                pregunta: "55. Quale delle due torri del Palacio de la Generalitat pensate sia la più recente: quella sulla piazza o questa che avete davanti ora?",
                opciones: ["Quella sulla piazza", "Questa davanti a voi"],
                correctas: ["Questa davanti a voi"],
                multiple: false
            },
{
                reto: 56,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
{
                reto: 57,
                id: "R57-Av34km-it",
                tipo: "opcion-multiple",
                pregunta: "Cosa si può vedere su questo pannello in ceramica? Sono teschi? È una croce? C’è anche una colomba?",
                opciones: ["Teschi", "Colombe", "Croce"],
                correctas: ["Teschi", "Croce"],
                multiple: true
            },
{
                reto: 58,
                id: "R58-Av34km-it",
                tipo: "opcion",
                pregunta: "Quante campane ospita questa torre? ",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
{
                reto: 59,
                id: "R59-Av34km-it",
                tipo: "opcion",
                pregunta: "59. Cosa tiene in mano la figura?",
                opciones: ["Uno scudo", "Una conchiglia", "Una brocca", "Una spada"],
                correctas: ["Una conchiglia"],
                multiple: false
            },
{
                reto: 60,
                id: "R60-Av34km-it",
                tipo: "opcion",
                pregunta: "In quale direzione procede il sentiero stabilito?",
                opciones: ["Nord", "Sud", "Est", "Ovest"],
                correctas: ["Nord"],
                multiple: false
            },
{
                reto: 61,
                id: "R61-Av34km-it",
                tipo: "opcion",
                pregunta: "Quante porte aveva l’antica muraglia araba di Balansiya?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 62,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
{
                reto: 63,
                id: "R63-Av34km-it",
                tipo: "opcion",
                pregunta: "Sopra il davanzale della porta risalta lo stemma dell'Ordine del Carmelo.",
                opciones: ["Una Corona", "Una Croce", "Una Stella"],
                correctas: ["Una Corona"],
                multiple: false
            },
{
                reto: 64,
                id: "R64-Av34km-it",
                tipo: "opcion",
                pregunta: "Cosa porta la Vergine in braccio?",
                opciones: ["Un Cuore", "Una Colomba", "Gesù Bambino"],
                correctas: ["Gesù Bambino"],
                multiple: false
            },
{
                reto: 65,
                id: "R65-Av34km-it",
                tipo: "opcion-multiple",
                pregunta: "Cosa porta Santa Teresa nelle sue mani?",
                opciones: ["Una penna", "Una spada", "Un libro", "Una brocca"],
                correctas: ["Una penna", "Un libro"],
                multiple: true
            },
{
                reto: 66,
                id: "R66-Av34km-it",
                tipo: "texto",
                pregunta: "Quanto costa l'ingresso a questo museo?",
                correctas: ["Gratis"],
                multiple: false
            },
{
                reto: 67,
                id: "R67-Av34km-it",
                tipo: "opcion",
                pregunta: "Quanti gatti si possono vedere raffigurati sul pannello?",
                opciones: ["3", "4", "5"],
                correctas: ["4"],
                multiple: false
            },
{
                reto: 68,
                id: "R68-Av34km-it",
                tipo: "texto",
                pregunta: "Quale altezza indica questo pannello?",
                correctas: ["1,90 metri"],
                multiple: false
            },
{
                reto: 69,
                id: "R69-Av34km-it",
                tipo: "texto",
                pregunta: "Quale anno indica il pannello superiore?",
                correctas: ["2100"],
                multiple: false
            },
{
                reto: 70,
                id: "R70-Av34km-it",
                tipo: "opcion",
                pregunta: "Cosa corona lo stemma?",
                opciones: ["Una corona", "Un pipistrello", "Un drago"],
                correctas: ["Una corona"],
                multiple: false
            },
{
                reto: 71,
                id: "R71-Av34km-it",
                tipo: "texto",
                pregunta: "Quante perforazioni di proiettili riesce a contare?",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 72,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
{
                reto: 73,
                id: "R73-Av34km-it",
                tipo: "opcion",
                pregunta: "Che forma ha la fontana?",
                opciones: ["Conchiglia", "Pesce", "Persona"],
                correctas: ["Persona"],
                multiple: false
            },
{
                reto: 74,
                id: "R74-Av34km-it",
                tipo: "texto",
                pregunta: "In che anno iniziarono i lavori? Guardi la facciata!",
                correctas: ["1400"],
                multiple: false
            },
{
                reto: 75,
                id: "R75-Av34km-it",
                tipo: "texto",
                pregunta: "Saprebbe dirmi l'anno del suo ultimo restauro? Sono sicuro che l'ha già visto!",
                correctas: ["2012"],
                multiple: false
            },
{
                reto: 76,
                id: "R76-Av34km-it",
                tipo: "texto",
                pregunta: "In che anno vennero eseguiti quei lavori? Ha bisogno di un indizio? Guardi la facciata dell'edificio.",
                correctas: ["1756"],
                multiple: false
            },
{
                reto: 77,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
{
                reto: 78,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
{
                reto: 79,
                id: "R79-Av34km-it",
                tipo: "opcion",
                pregunta: "Saprebbe dirmi il nome di questo antico fiume?",
                opciones: ["Turia", "Júcar", "Segura", "Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
{
                reto: 80,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
{
                reto: 81,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
{
                reto: 82,
                id: "R82-Av34km-it",
                tipo: "opcion-multiple",
                pregunta: "Quale uso possono avere questi blocchi di pietra?",
                opciones: ["Fermare l'acqua", "Bloccare le ruote dei carri", "Raccogliere le impurità del fiume"],
                correctas: ["Bloccare le ruote dei carri", "Raccogliere le impurità del fiume"],
                multiple: true
            },
{
                reto: 83,
                id: "R83-Av34km-it",
                tipo: "opcion",
                pregunta: "In cima alle torri sventola la bandiera di Valencia: i suoi colori sono rosso, giallo e…",
                opciones: ["Viola", "Verde", "Blu"],
                correctas: ["Blu"],
                multiple: false
            },
{
                reto: 84,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
{
                reto: 85,
                id: "R85-Av34km-it",
                tipo: "opcion",
                pregunta: "A cosa è dedicato questo museo?",
                opciones: ["Architettura", "Storia", "Scienze Naturali"],
                correctas: ["Scienze Naturali"],
                multiple: false
            },
{
                reto: 86,
                id: "R86-Av34km-it",
                tipo: "opcion",
                pregunta: "Quale figura decora la fontana?",
                opciones: ["Un'anatra", "Una cicogna", "Un pesce"],
                correctas: ["Una cicogna"],
                multiple: false
            },
{
                reto: 87,
                id: "R87-Av34km-it",
                tipo: "texto",
                pregunta: "Su questa facciata c'è un orologio. Che ora segna?",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 88,
                id: "R88-Av34km-it",
                tipo: "opcion",
                pregunta: "Cosa tiene la figura nella sua mano?",
                opciones: ["Arpa", "Scudo", "Brocca", "Spada"],
                correctas: ["Scudo"],
                multiple: false
            },
{
                reto: 89,
                id: "R89-Av34km-it",
                tipo: "opcion",
                pregunta: "89. Cosa tiene San Lorenzo in mano?",
                opciones: ["Un colomba", "Un cucchiaio", "Una griglia"],
                correctas: ["Una griglia"],
                multiple: false
            },
{
                reto: 90,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        nl: [
            // Array de retos Aventura34km (NL)
{
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
{
                reto: 1,
                id: "R1-Av34km-nl",
                tipo: "opcion",
                pregunta: "1. Hoeveel avonturen kun je doen met València be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 2,
                id: "R2-Av34km-nl",
                tipo: "opcion",
                pregunta: "2. Is het een goed moment om je avontuur te beginnen?",
                opciones: ["Ja", "Nee"],
                correctas: ["?"],
                multiple: false
            },
{
                reto: 3,
                id: "R3-Av34km-nl",
                tipo: "opcion",
                pregunta: "3. Kunt u mij de namen van deze torens vertellen?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
{
                reto: 4,
                id: "PZ-19",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-19"
            },
{
                reto: 5,
                id: "R5-Av34km-nl",
                tipo: "opcion",
                pregunta: "Kunt u mij de naam van deze populaire feesten in Valencia vertellen?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
{
                reto: 6,
                id: "R6-Av34km-nl",
                tipo: "opcion",
                pregunta: "De natuur heeft het wapen van Valencia gebeeldhouwd. Wat is er bovenaan te zien?",
                opciones: ["Een schild", "Een vleermuis", "Een draak"],
                correctas: ["Een vleermuis"],
                multiple: false
            },
{
                reto: 7,
                id: "R7-Av34km-nl",
                tipo: "texto",
                pregunta: "Kunt u raden hoeveel treden het heeft?",
                correctas: ["16"],
                multiple: false
            },
{
                reto: 8,
                id: "R8-Av34km-nl",
                tipo: "opcion",
                pregunta: "Wat voor soort bomen kunt u nu aanraken?",
                opciones: ["Olijfbomen", "Sinaasappelbomen", "Palmbomen"],
                correctas: ["Palmbomen"],
                multiple: false
            },
{
                reto: 9,
                id: "R9-Av34km-nl",
                tipo: "texto",
                pregunta: "Kunt u mij de prijs vertellen om toegang te krijgen tot deze attractie?",
                correctas: ["gratis"],
                multiple: false
            },
{
                reto: 10,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
{
                reto: 11,
                id: "R11-Av34km-nl",
                tipo: "opcion",
                pregunta: "Uit hoeveel monumenten bestaat de Stad van Kunsten en Wetenschappen?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
{
                reto: 12,
                id: "R12-Av34km-nl",
                tipo: "opcion",
                pregunta: "Waarvan is Orxata gemaakt?",
                opciones: ["Chufa", "Gerst", "Rijst"],
                correctas: ["Chufa"],
                multiple: false
            },
{
                reto: 13,
                id: "R13-Av34km-nl",
                tipo: "opcion",
                pregunta: "Wat omringt de basis van de brug?",
                opciones: ["Water", "Gras", "Eenden"],
                correctas: ["Water"],
                multiple: false
            },
{
                reto: 14,
                id: "R14-Av34km-nl",
                tipo: "opcion",
                pregunta: "Herinnert u zich welk dier het wapen van Valencia kroont?",
                opciones: ["Vleermuis", "Draak", "Leeuw"],
                correctas: ["Vleermuis"],
                multiple: false
            },
{
                reto: 15,
                id: "R15-Av34km-nl",
                tipo: "opcion",
                pregunta: "Wat is er op de locomotief te zien?",
                opciones: ["Een draak", "Een ster", "Een datum"],
                correctas: ["Een ster"],
                multiple: false
            },
{
                reto: 16,
                id: "R16-Av34km-nl",
                tipo: "opcion-multiple",
                pregunta: "Welke elementen zijn er in deze scène te zien?",
                opciones: ["Een Fallero en een Fallera", "Sinaasappelen", "Druiven"],
                correctas: ["Een Fallero en een Fallera", "Sinaasappelen", "Druiven"],
                multiple: true
            },
{
                reto: 17,
                id: "R17-Av34km-nl",
                tipo: "opcion-multiple",
                pregunta: "Wat zou het kunnen zijn?",
                opciones: ["Een rond brood", "Krabben", "Appels"],
                correctas: ["Een rond brood", "Krabben"],
                multiple: true
            },
{
                reto: 18,
                id: "R18-Av34km-nl",
                tipo: "texto",
                pregunta: "Hoeveel dieren kunt u tellen? Let op dat er koeien, varkens zijn…",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 19,
                id: "PZ-20",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-20"
            },
{
                reto: 20,
                id: "R20-Av34km-nl",
                tipo: "texto",
                pregunta: "Hoeveel verdiepingen heeft dit Monument?",
                correctas: ["4"],
                multiple: false
            },
{
                reto: 21,
                id: "R21-Av34km-nl",
                tipo: "opcion",
                pregunta: "Welke citrusvrucht typisch voor Valencia siert de gevel?",
                opciones: ["Citroenen", "Grapefruits", "Sinaasappelen"],
                correctas: ["Sinaasappelen"],
                multiple: false
            },
{
                reto: 22,
                id: "R22-Av34km-nl",
                tipo: "texto",
                pregunta: "Kunt u uw taal vinden?",
                correctas: ["Ja? Nee?"],
                multiple: false
            },
{
                reto: 23,
                id: "R23-Av34km-nl",
                tipo: "opcion",
                pregunta: "23. Herinnert u zich welk dier het gemeentewapen siert?",
                opciones: ["Een draak", "Een vleermuis", "Een paard"],
                correctas: ["Een vleermuis"],
                multiple: false
            },
{
                reto: 24,
                id: "R24-Av34km-nl",
                tipo: "opcion-multiple",
                pregunta: "24. Boven de hoofdingang, in een rondboog, vertegenwoordigen allegorische figuren de vijf continenten. Wat houdt de centrale figuur vast?",
                opciones: ["Een fakkel", "Een zwaard", "Een kroon"],
                correctas: ["Een fakkel", "Een zwaard"],
                multiple: true
            },
{
                reto: 25,
                id: "R25-Av34km-nl",
                tipo: "opcion",
                pregunta: "25. Wat houdt de figuur in zijn hand?",
                opciones: ["Een weegschaal", "Een boek", "Een veer"],
                correctas: ["Een weegschaal"],
                multiple: false
            },
{
                reto: 26,
                id: "R26-Av34km-nl",
                tipo: "texto",
                pregunta: "26. Hoeveel verdiepingen heeft het gebouw?",
                correctas: ["10"]
            },
{
                reto: 27,
                id: "R27-Av34km-nl",
                tipo: "opcion",
                pregunta: "27. Zoek het glas-in-lood met de kleuren van de Valenciaanse Senyera op de gevel. Kunt u de vorm bepalen?",
                opciones: ["Vierkant", "Rond", "Driehoekig"],
                correctas: ["Rond"],
                multiple: false
            },
{
                reto: 28,
                id: "R28-Av34km-nl",
                tipo: "opcion-multiple",
                pregunta: "28. Wat houdt de maagd in haar hand?",
                opciones: ["Een rozenkrans", "Een kind", "Een kroon"],
                correctas: ["Een rozenkrans", "Een kind"],
                multiple: true
            },
{
                reto: 29,
                id: "R29-Av34km-nl",
                tipo: "opcion",
                pregunta: "29. Wat geeft de engel aan het kind?",
                opciones: ["Een duif", "Een bol", "Voedsel"],
                correctas: ["Een bol"],
                multiple: false
            },
{
                reto: 30,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
{
                reto: 31,
                id: "R31-Av34km-nl",
                tipo: "opcion-multiple",
                pregunta: "31. De veerman die tegen de stroom in roeit.",
                opciones: ["Een man met een verdrietig gezin die een klein houten boot bestuurt ontsnapt tegen de stroom van een monster."],
                correctas: ["Een man met een verdrietig gezin die een klein houten boot bestuurt ontsnapt tegen de stroom van een monster."],
                multiple: true
            },
{
                reto: 32,
                id: "R32-Av34km-nl",
                tipo: "opcion-multiple",
                pregunta: "32. Een dode boom: symbool van Zonde, is te zien tussen de twee bladeren van de deur en fungeert als middenstijl.",
                opciones: ["Let op de top van de boom waar 4 naakte mannen elkaar geselen."],
                correctas: ["Let op de top van de boom waar 4 naakte mannen elkaar geselen."],
                multiple: true
            },
{
                reto: 33,
                id: "R33-Av34km-nl",
                tipo: "opcion-multiple",
                pregunta: "33. Rechts, een engel toont zijn penis en...",
                opciones: ["hij staat op het punt het in een vaas te plaatsen dat hij met de andere hand vasthoudt. Vreemd en ongebruikelijk, nietwaar?"],
                correctas: ["hij staat op het punt het in een vaas te plaatsen dat hij met de andere hand vasthoudt. Vreemd en ongebruikelijk, nietwaar?"],
                multiple: true
            },
{
                reto: 34,
                id: "R34-Av34km-nl",
                tipo: "opcion-multiple",
                pregunta: "34. In het midden: De baardige man en de leeuw:",
                opciones: ["Origineel en tegenstrijdig tafereel waarin de zachte precies de leeuw is en niet de baardige oude man."],
                correctas: ["Origineel en tegenstrijdig tafereel waarin de zachte precies de leeuw is en niet de baardige oude man."],
                multiple: true
            },
{
                reto: 35,
                id: "R35-Av34km-nl",
                tipo: "opcion-multiple",
                pregunta: "35. Hier is een extra uitdaging! Zoek de fornicator in de Zijdehal!",
                opciones: ["In een van zijn ramen vindt u een uitgehouwen man; zijn hoofd is niet zichtbaar maar zijn genitaliën zijn, heel duidelijk."],
                correctas: ["In een van zijn ramen vindt u een uitgehouwen man; zijn hoofd is niet zichtbaar maar zijn genitaliën zijn, heel duidelijk."],
                multiple: true
            },
{
                reto: 36,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
{
                reto: 37,
                id: "R37-Av34km-nl",
                tipo: "texto",
                pregunta: "Hoe breed is de ingang van het smalle gebouw?",
                correctas: ["1,35 metros"]
            },
{
                reto: 38,
                id: "R38-Av34km-nl",
                tipo: "opcion-multiple",
                pregunta: "Drie blinde bogen. Twee zijn glad, de derde is niet gepleisterd gebleven.<br>Wat is er te zien in die niet gepleisterde boog?",
                opciones: ["Een gezicht", "Een torso", "Een waterspuwer"],
                correctas: ["Een gezicht", "Een torso"],
                multiple: true
            },
{
                reto: 39,
                id: "R39-Av34km-nl",
                tipo: "opcion",
                pregunta: "Wat bevindt zich bovenaan de barokke toren van Santa Catalina?",
                opciones: ["Een kruis", "De zon", "Een duif"],
                correctas: ["Een kruis"],
                multiple: false
            },
{
                reto: 40,
                id: "R40-Av34km-nl",
                tipo: "texto",
                pregunta: "Welke kleur hebben de tegels van de koepel van de barokke toren van Santa Catalina?",
                correctas: ["azules"]
            },
{
                reto: 41,
                id: "R41-Av34km-nl",
                tipo: "opcion",
                pregunta: "Kunt u de geometrie van de Miguelete-toren van Valencia bepalen? ",
                opciones: ["Hexagonaal", "Octogonaal", "Vierkant"],
                correctas: ["Octogonaal"],
                multiple: false
            },
{
                reto: 42,
                id: "R42-Av34km-nl",
                tipo: "texto",
                pregunta: "Hoeveel ramen kunt u zien?",
                correctas: ["?"]
            },
{
                reto: 43,
                id: "R43-Av34km-nl",
                tipo: "opcion-multiple",
                pregunta: "Wat is er meer dan 35 meter hoog te zien bovenaan de barokke gevel?",
                opciones: ["Een bol", "Een vleermuis", "Een kruis", "Een paard"],
                correctas: ["Een bol", "Een kruis"],
                multiple: true
            },
{
                reto: 44,
                id: "R44-Av34km-nl",
                tipo: "texto",
                pregunta: "Hoeveel bogen vormen de deuropening?",
                correctas: ["8"],
                multiple: false
            },
{
                reto: 45,
                id: "R45-Av34km-nl",
                tipo: "opcion",
                pregunta: "45. Welke gebeeldhouwde figuur is te zien in de lijst van het schilderij?",
                opciones: ["Een draak", "Een vleermuis", "Een kroon"],
                correctas: ["Een kroon"],
                multiple: false
            },
{
                reto: 46,
                id: "R46-Av34km-nl",
                tipo: "opcion-multiple",
                pregunta: "46. Wat is er binnen te zien?",
                opciones: ["Een altaar", "Een vlag", "Een zwaard"],
                correctas: ["Een altaar", "Een vlag"],
                multiple: true
            },
{
                reto: 47,
                id: "R47-Av34km-nl",
                tipo: "texto",
                pregunta: "47. Hierop staat een gedenkplaat. In welk jaar is deze geplaatst?",
                correctas: ["1952"]
            },
{
                reto: 48,
                id: "R48-Av34km-nl",
                tipo: "texto",
                pregunta: "48. In welk jaar is dit gebouw gebouwd? Tip: kijk bovenaan de gevel.",
                correctas: ["1906"]
            },
{
                reto: 49,
                id: "R49-Av34km-nl",
                tipo: "opcion",
                pregunta: "49. Als u naar het beeld van San Valero kijkt, welk voorwerp zou ons kunnen vertellen dat hij gevangen zat?",
                opciones: ["De kettingen", "Het boek", "Zijn droevige gezicht"],
                correctas: ["De kettingen"],
                multiple: false
            },
{
                reto: 50,
                id: "R50-Av34km-nl",
                tipo: "opcion",
                pregunta: "50. Wat is er binnen te zien?",
                opciones: ["Een stierenarena", "Romeinse baden", "Een metrostation"],
                correctas: ["Romeinse baden"],
                multiple: false
            },
{
                reto: 51,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
{
                reto: 52,
                id: "R52-Av34km-nl",
                tipo: "opcion",
                pregunta: "52. Kunt u de geometrie bepalen?",
                opciones: ["Zeshoekig", "Achthoekig", "Vierkant"],
                correctas: ["Achthoekig"],
                multiple: false
            },
{
                reto: 53,
                id: "R53-Av34km-nl",
                tipo: "opcion",
                pregunta: "53. Met welke hand houdt Neptunus de hoorn des overvloeds vast?",
                opciones: ["Links", "Rechts"],
                correctas: ["Rechts"],
                multiple: false
            },
{
                reto: 54,
                id: "R54-Av34km-nl",
                tipo: "texto",
                pregunta: "Hoeveel figuren omringen de fontein?",
                correctas: ["8"]
            },
{
                reto: 55,
                id: "R55-Av34km-nl",
                tipo: "opcion",
                pregunta: "55. Welke van de twee torens van het Palacio de la Generalitat is volgens u de nieuwste: die op het plein of deze die nu voor u staat?",
                opciones: ["Die op het plein", "Deze voor u"],
                correctas: ["Deze voor u"],
                multiple: false
            },
{
                reto: 56,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
{
                reto: 57,
                id: "R57-Av34km-nl",
                tipo: "opcion-multiple",
                pregunta: "Wat is er te zien op dit keramische paneel? Zijn het schedels? Is het een kruis? Is er ook een duif?",
                opciones: ["Schedels", "Duiven", "Kruis"],
                correctas: ["Schedels", "Kruis"],
                multiple: true
            },
{
                reto: 58,
                id: "R58-Av34km-nl",
                tipo: "opcion",
                pregunta: "Hoeveel klokken heeft deze toren? ",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
{
                reto: 59,
                id: "R59-Av34km-nl",
                tipo: "opcion",
                pregunta: "59. Wat houdt de figuur in zijn handen?",
                opciones: ["Een schild", "Een schelp", "Een kruik", "Een zwaard"],
                correctas: ["Een schelp"],
                multiple: false
            },
{
                reto: 60,
                id: "R60-Av34km-nl",
                tipo: "opcion",
                pregunta: "Welke richting volgt het aangelegde pad?",
                opciones: ["Noord", "Zuid", "Oost", "West"],
                correctas: ["Noord"],
                multiple: false
            },
{
                reto: 61,
                id: "R61-Av34km-nl",
                tipo: "opcion",
                pregunta: "Hoeveel poorten had de oude Arabische muur van Balansiya?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 62,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
{
                reto: 63,
                id: "R63-Av34km-nl",
                tipo: "opcion",
                pregunta: "Boven de deurpost staat het wapen van de Orde van de Karmel.",
                opciones: ["Een Kroon", "Een Kruis", "Een Ster"],
                correctas: ["Een Kroon"],
                multiple: false
            },
{
                reto: 64,
                id: "R64-Av34km-nl",
                tipo: "opcion",
                pregunta: "Wat draagt de Maagd in haar armen?",
                opciones: ["Een Hart", "Een Duif", "Jezuskind"],
                correctas: ["Jezuskind"],
                multiple: false
            },
{
                reto: 65,
                id: "R65-Av34km-nl",
                tipo: "opcion-multiple",
                pregunta: "Wat draagt de Heilige Teresa in haar handen?",
                opciones: ["Een veer", "Een zwaard", "Een boek", "Een kruik"],
                correctas: ["Een veer", "Een boek"],
                multiple: true
            },
{
                reto: 66,
                id: "R66-Av34km-nl",
                tipo: "texto",
                pregunta: "Hoeveel kost de toegang tot dit museum?",
                correctas: ["Gratis"],
                multiple: false
            },
{
                reto: 67,
                id: "R67-Av34km-nl",
                tipo: "opcion",
                pregunta: "Hoeveel katten zijn er afgebeeld op het paneel?",
                opciones: ["3", "4", "5"],
                correctas: ["4"],
                multiple: false
            },
{
                reto: 68,
                id: "R68-Av34km-nl",
                tipo: "texto",
                pregunta: "Welke hoogte geeft dit paneel aan?",
                correctas: ["1,90 meter"],
                multiple: false
            },
{
                reto: 69,
                id: "R69-Av34km-nl",
                tipo: "texto",
                pregunta: "Welk jaar geeft het bovenste paneel aan?",
                correctas: ["2100"],
                multiple: false
            },
{
                reto: 70,
                id: "R70-Av34km-nl",
                tipo: "opcion",
                pregunta: "Wat bekroont het wapen?",
                opciones: ["Een kroon", "Een vleermuis", "Een draak"],
                correctas: ["Een kroon"],
                multiple: false
            },
{
                reto: 71,
                id: "R71-Av34km-nl",
                tipo: "texto",
                pregunta: "Hoeveel kogelgaten kunt u tellen?",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 72,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
{
                reto: 73,
                id: "R73-Av34km-nl",
                tipo: "opcion",
                pregunta: "Welke vorm heeft de fontein?",
                opciones: ["Schelp", "Vis", "Persoon"],
                correctas: ["Persoon"],
                multiple: false
            },
{
                reto: 74,
                id: "R74-Av34km-nl",
                tipo: "texto",
                pregunta: "In welk jaar begon de bouw? Kijk naar de gevel!",
                correctas: ["1400"],
                multiple: false
            },
{
                reto: 75,
                id: "R75-Av34km-nl",
                tipo: "texto",
                pregunta: "Kunt u mij het jaar van de laatste renovatie vertellen? U heeft het vast al gezien!",
                correctas: ["2012"],
                multiple: false
            },
{
                reto: 76,
                id: "R76-Av34km-nl",
                tipo: "texto",
                pregunta: "In welk jaar werden die werken uitgevoerd? Heeft u een hint nodig? Kijk naar de gevel van het gebouw.",
                correctas: ["1756"],
                multiple: false
            },
{
                reto: 77,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
{
                reto: 78,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
{
                reto: 79,
                id: "R79-Av34km-nl",
                tipo: "opcion",
                pregunta: "Kunt u mij de naam van deze oude rivier vertellen?",
                opciones: ["Turia", "Júcar", "Segura", "Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
{
                reto: 80,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
{
                reto: 81,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
{
                reto: 82,
                id: "R82-Av34km-nl",
                tipo: "opcion-multiple",
                pregunta: "Welk gebruik kunnen die stenen blokken hebben?",
                opciones: ["Het water stoppen", "De wielen van de wagens stoppen", "Het vuilnis van de rivier opvangen"],
                correctas: ["De wielen van de wagens stoppen", "Het vuilnis van de rivier opvangen"],
                multiple: true
            },
{
                reto: 83,
                id: "R83-Av34km-nl",
                tipo: "opcion",
                pregunta: "Aan de top van de torens wappert de vlag van Valencia: de kleuren zijn rood, geel en…",
                opciones: ["Paars", "Groen", "Blauw"],
                correctas: ["Blauw"],
                multiple: false
            },
{
                reto: 84,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
{
                reto: 85,
                id: "R85-Av34km-nl",
                tipo: "opcion",
                pregunta: "Waaraan is dit museum gewijd?",
                opciones: ["Architectuur", "Geschiedenis", "Natuurwetenschappen"],
                correctas: ["Natuurwetenschappen"],
                multiple: false
            },
{
                reto: 86,
                id: "R86-Av34km-nl",
                tipo: "opcion",
                pregunta: "Welke figuur siert de fontein?",
                opciones: ["Een eend", "Een ooievaar", "Een vis"],
                correctas: ["Een ooievaar"],
                multiple: false
            },
{
                reto: 87,
                id: "R87-Av34km-nl",
                tipo: "texto",
                pregunta: "Op deze gevel hangt een klok. Hoe laat is het?",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 88,
                id: "R88-Av34km-nl",
                tipo: "opcion",
                pregunta: "Wat houdt de figuur in zijn hand?",
                opciones: ["Harp", "Schild", "Kruik", "Zwaard"],
                correctas: ["Schild"],
                multiple: false
            },
{
                reto: 89,
                id: "R89-Av34km-nl",
                tipo: "opcion",
                pregunta: "89. Wat houdt Sint-Laurens in zijn hand?",
                opciones: ["Een duif", "Een lepel", "Een rooster"],
                correctas: ["Een rooster"],
                multiple: false
            },
{
                reto: 90,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        ja: [
            // Array de retos Aventura34km (JA)
{
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
{
                reto: 1,
                id: "R1-Av34km-ja",
                tipo: "opcion",
                pregunta: "1. Valencia be Guides ではいくつのアドベンチャーが体験できますか？",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 2,
                id: "R2-Av34km-ja",
                tipo: "opcion",
                pregunta: "2. 今は冒険を始めるのに良いタイミングですか？",
                opciones: ["はい", "いいえ"],
                correctas: ["?"],
                multiple: false
            },
{
                reto: 3,
                id: "R3-Av34km-ja",
                tipo: "opcion",
                pregunta: "3. これらの塔の名前を教えてもらえますか？",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
{
                reto: 4,
                id: "PZ-19",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-19"
            },
{
                reto: 5,
                id: "R5-Av34km-ja",
                tipo: "opcion",
                pregunta: "バレンシアのこの人気祭りの名前を教えてもらえますか？",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
{
                reto: 6,
                id: "R6-Av34km-ja",
                tipo: "opcion",
                pregunta: "自然がバレンシアの紋章を彫刻しました。上に何が見えますか？",
                opciones: ["盾", "コウモリ", "ドラゴン"],
                correctas: ["コウモリ"],
                multiple: false
            },
{
                reto: 7,
                id: "R7-Av34km-ja",
                tipo: "texto",
                pregunta: "何段あるか当てられますか？",
                correctas: ["16"],
                multiple: false
            },
{
                reto: 8,
                id: "R8-Av34km-ja",
                tipo: "opcion",
                pregunta: "今触れることができる木は何の種類ですか？",
                opciones: ["オリーブの木", "オレンジの木", "ヤシの木"],
                correctas: ["ヤシの木"],
                multiple: false
            },
{
                reto: 9,
                id: "R9-Av34km-ja",
                tipo: "texto",
                pregunta: "このアトラクションに入場する料金を教えてもらえますか？",
                correctas: ["gratis"],
                multiple: false
            },
{
                reto: 10,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
{
                reto: 11,
                id: "R11-Av34km-ja",
                tipo: "opcion",
                pregunta: "芸術科学都市はいくつのモニュメントで構成されていますか？",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
{
                reto: 12,
                id: "R12-Av34km-ja",
                tipo: "opcion",
                pregunta: "Orxataは何から作られていますか？",
                opciones: ["Chufa", "大麦", "米"],
                correctas: ["Chufa"],
                multiple: false
            },
{
                reto: 13,
                id: "R13-Av34km-ja",
                tipo: "opcion",
                pregunta: "橋の基部を囲んでいるのは何ですか？",
                opciones: ["水", "草", "アヒル"],
                correctas: ["水"],
                multiple: false
            },
{
                reto: 14,
                id: "R14-Av34km-ja",
                tipo: "opcion",
                pregunta: "バレンシアの紋章を飾る動物を覚えていますか？",
                opciones: ["コウモリ", "ドラゴン", "ライオン"],
                correctas: ["コウモリ"],
                multiple: false
            },
{
                reto: 15,
                id: "R15-Av34km-ja",
                tipo: "opcion",
                pregunta: "機関車に何が見えますか？",
                opciones: ["ドラゴン", "星", "日付"],
                correctas: ["星"],
                multiple: false
            },
{
                reto: 16,
                id: "R16-Av34km-ja",
                tipo: "opcion-multiple",
                pregunta: "このシーンに何が見えますか？",
                opciones: ["ファジェーロとファジェーラ", "オレンジ", "ぶどう"],
                correctas: ["ファジェーロとファジェーラ", "オレンジ", "ぶどう"],
                multiple: true
            },
{
                reto: 17,
                id: "R17-Av34km-ja",
                tipo: "opcion-multiple",
                pregunta: "これは何でしょうか？",
                opciones: ["丸パン", "カニ", "リンゴ"],
                correctas: ["丸パン", "カニ"],
                multiple: true
            },
{
                reto: 18,
                id: "R18-Av34km-ja",
                tipo: "texto",
                pregunta: "何頭の動物が数えられますか？牛、豚…があることに注目してください。",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 19,
                id: "PZ-20",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-20"
            },
{
                reto: 20,
                id: "R20-Av34km-ja",
                tipo: "texto",
                pregunta: "このモニュメントは何階建てですか？",
                correctas: ["4"],
                multiple: false
            },
{
                reto: 21,
                id: "R21-Av34km-ja",
                tipo: "opcion",
                pregunta: "バレンシア原産の柑橘類のどれがファサードを飾っていますか？",
                opciones: ["レモン", "グレープフルーツ", "オレンジ"],
                correctas: ["オレンジ"],
                multiple: false
            },
{
                reto: 22,
                id: "R22-Av34km-ja",
                tipo: "texto",
                pregunta: "あなたの言語を見つけられますか？",
                correctas: ["はい？いいえ？"],
                multiple: false
            },
{
                reto: 23,
                id: "R23-Av34km-ja",
                tipo: "opcion",
                pregunta: "23. 市章の上にいる動物を覚えていますか？",
                opciones: ["ドラゴン", "コウモリ", "馬"],
                correctas: ["コウモリ"],
                multiple: false
            },
{
                reto: 24,
                id: "R24-Av34km-ja",
                tipo: "opcion-multiple",
                pregunta: "24. 正面入口の上の半円アーチには、5大陸を表す寓意的な像があります。中央の像は何を持っていますか？",
                opciones: ["たいまつ", "剣", "王冠"],
                correctas: ["たいまつ", "剣"],
                multiple: true
            },
{
                reto: 25,
                id: "R25-Av34km-ja",
                tipo: "opcion",
                pregunta: "25. この像は手に何を持っていますか？",
                opciones: ["天秤", "本", "羽ペン"],
                correctas: ["天秤"],
                multiple: false
            },
{
                reto: 26,
                id: "R26-Av34km-ja",
                tipo: "texto",
                pregunta: "26. 建物は何階建てですか？",
                correctas: ["10"]
            },
{
                reto: 27,
                id: "R27-Av34km-ja",
                tipo: "opcion",
                pregunta: "27. ファサードのバレンシアのセニェーラの色のステンドグラスを探してください。形状は何ですか？",
                opciones: ["「四角形」", "「円形」", "「三角形」"],
                correctas: ["「円形」"],
                multiple: false
            },
{
                reto: 28,
                id: "R28-Av34km-ja",
                tipo: "opcion-multiple",
                pregunta: "28. 聖母は手に何を持っていますか？",
                opciones: ["ロザリオ", "子供", "王冠"],
                correctas: ["ロザリオ", "子供"],
                multiple: true
            },
{
                reto: 29,
                id: "R29-Av34km-ja",
                tipo: "opcion",
                pregunta: "29. 天使は子供に何を渡していますか？",
                opciones: ["鳩", "オーブ", "食べ物"],
                correctas: ["オーブ"],
                multiple: false
            },
{
                reto: 30,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
{
                reto: 31,
                id: "R31-Av34km-ja",
                tipo: "opcion-multiple",
                pregunta: "31. 逆流を漕ぐ船頭。",
                opciones: ["悲しい表情の男が小さな木製の舟を操り、怪物から逃げるように逆流を進んでいる。"],
                correctas: ["悲しい表情の男が小さな木製の舟を操り、怪物から逃げるように逆流を進んでいる。"],
                multiple: true
            },
{
                reto: 32,
                id: "R32-Av34km-ja",
                tipo: "opcion-multiple",
                pregunta: "32. 死んだ木：罪の象徴、門の2枚の扉の間にあり、中央の柱として機能しています。",
                opciones: ["木の頂上で4人の裸の男性がお互いを鞭打つ様子を観察してください。"],
                correctas: ["木の頂上で4人の裸の男性がお互いを鞭打つ様子を観察してください。"],
                multiple: true
            },
{
                reto: 33,
                id: "R33-Av34km-ja",
                tipo: "opcion-multiple",
                pregunta: "33. 右側、天使が陰茎を見せて…",
                opciones: ["もう片方の手で持つ花瓶に挿入しようとしている。不思議で異常ですよね？"],
                correctas: ["もう片方の手で持つ花瓶に挿入しようとしている。不思議で異常ですよね？"],
                multiple: true
            },
{
                reto: 34,
                id: "R34-Av34km-ja",
                tipo: "opcion-multiple",
                pregunta: "34. 中央：ひげの男とライオン：",
                opciones: ["穏やかなのはライオンであり、ひげの老人ではない、という独特で矛盾した場面。"],
                correctas: ["穏やかなのはライオンであり、ひげの老人ではない、という独特で矛盾した場面。"],
                multiple: true
            },
{
                reto: 35,
                id: "R35-Av34km-ja",
                tipo: "opcion-multiple",
                pregunta: "35. ここで追加チャレンジ！絹の取引所の乱交者を探してください！",
                opciones: ["窓の一つに彫刻された男性がいます。頭は見えませんが、性器ははっきり見えます。"],
                correctas: ["窓の一つに彫刻された男性がいます。頭は見えませんが、性器ははっきり見えます。"],
                multiple: true
            },
{
                reto: 36,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
{
                reto: 37,
                id: "R37-Av34km-ja",
                tipo: "texto",
                pregunta: "狭い建物の入り口の幅はどれくらいですか？",
                correctas: ["1,35 metros"]
            },
{
                reto: 38,
                id: "R38-Av34km-ja",
                tipo: "opcion-multiple",
                pregunta: "三つの盲アーチがあります。二つは滑らかで、三つ目は漆喰が塗られていません。<br>漆喰が塗られていないアーチには何が見えますか？",
                opciones: ["顔", "胴体", "ガーゴイル"],
                correctas: ["顔", "胴体"],
                multiple: true
            },
{
                reto: 39,
                id: "R39-Av34km-ja",
                tipo: "opcion",
                pregunta: "サンタカタリナのバロック塔の最上部には何がありますか？",
                opciones: ["十字架", "太陽", "鳩"],
                correctas: ["十字架"],
                multiple: false
            },
{
                reto: 40,
                id: "R40-Av34km-ja",
                tipo: "texto",
                pregunta: "サンタカタリナのバロック塔のドームの瓦の色は何ですか？",
                correctas: ["azules"]
            },
{
                reto: 41,
                id: "R41-Av34km-ja",
                tipo: "opcion",
                pregunta: "バレンシアのミゲレット塔の形状は何ですか？",
                opciones: ["六角形", "八角形", "四角形"],
                correctas: ["八角形"],
                multiple: false
            },
{
                reto: 42,
                id: "R42-Av34km-ja",
                tipo: "texto",
                pregunta: "いくつの窓が見えますか？",
                correctas: ["?"]
            },
{
                reto: 43,
                id: "R43-Av34km-ja",
                tipo: "opcion-multiple",
                pregunta: "バロック様式の正面の頂上、高さ35メートル以上で何が見えますか？",
                opciones: ["球体", "コウモリ", "十字架", "馬"],
                correctas: ["球体", "十字架"],
                multiple: true
            },
{
                reto: 44,
                id: "R44-Av34km-ja",
                tipo: "texto",
                pregunta: "門はいくつのアーチで構成されていますか？",
                correctas: ["8"],
                multiple: false
            },
{
                reto: 45,
                id: "R45-Av34km-ja",
                tipo: "opcion",
                pregunta: "45. 絵の額縁にはどの彫刻が見えますか？",
                opciones: ["ドラゴン", "コウモリ", "王冠"],
                correctas: ["王冠"],
                multiple: false
            },
{
                reto: 46,
                id: "R46-Av34km-ja",
                tipo: "opcion-multiple",
                pregunta: "46. 内部には何が見えますか？",
                opciones: ["祭壇", "旗", "剣"],
                correctas: ["祭壇", "旗"],
                multiple: true
            },
{
                reto: 47,
                id: "R47-Av34km-ja",
                tipo: "texto",
                pregunta: "47. この場所には記念プレートがあります。設置された年はいつですか？",
                correctas: ["1952"]
            },
{
                reto: 48,
                id: "R48-Av34km-ja",
                tipo: "texto",
                pregunta: "48. この建物は何年に建てられましたか？ヒント：ファサードの上部を見てください。",
                correctas: ["1906"]
            },
{
                reto: 49,
                id: "R49-Av34km-ja",
                tipo: "opcion",
                pregunta: "49. サン・バレロ像を見て、彼が投獄されていたことを示す道具はどれだと思いますか？",
                opciones: ["鎖", "本", "悲しい顔"],
                correctas: ["鎖"],
                multiple: false
            },
{
                reto: 50,
                id: "R50-Av34km-ja",
                tipo: "opcion",
                pregunta: "50. 内部には何が見えますか？",
                opciones: ["闘牛場", "ローマ風浴場", "地下鉄駅"],
                correctas: ["ローマ風浴場"],
                multiple: false
            },
{
                reto: 51,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
{
                reto: 52,
                id: "R52-Av34km-ja",
                tipo: "opcion",
                pregunta: "52. 形状を判定できますか？",
                opciones: ["「六角形」", "「八角形」", "「四角形」"],
                correctas: ["「六角形」"],
                multiple: false
            },
{
                reto: 53,
                id: "R53-Av34km-ja",
                tipo: "opcion",
                pregunta: "53. ネプチューンはどちらの手で角笛を持っていますか？",
                opciones: ["左手", "右手"],
                correctas: ["右手"],
                multiple: false
            },
{
                reto: 54,
                id: "R54-Av34km-ja",
                tipo: "texto",
                pregunta: "噴水の周りにはいくつの像がありますか？",
                correctas: ["8"]
            },
{
                reto: 55,
                id: "R55-Av34km-ja",
                tipo: "opcion",
                pregunta: "55. ジェネラリタット宮殿の2つの塔のうち、どちらが新しいと思いますか？広場側の塔か、今目の前にあるこの塔か？",
                opciones: ["広場側の塔", "目の前のこの塔"],
                correctas: ["目の前のこの塔"],
                multiple: false
            },
{
                reto: 56,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
{
                reto: 57,
                id: "R57-Av34km-ja",
                tipo: "opcion-multiple",
                pregunta: "この陶器のパネルには何が見えますか？骸骨ですか？十字架ですか？鳩もいますか？",
                opciones: ["骸骨", "鳩", "十字架"],
                correctas: ["骸骨", "十字架"],
                multiple: true
            },
{
                reto: 58,
                id: "R58-Av34km-ja",
                tipo: "opcion",
                pregunta: "この塔にはいくつの鐘がありますか？",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
{
                reto: 59,
                id: "R59-Av34km-ja",
                tipo: "opcion",
                pregunta: "59. この像は手に何を持っていますか？",
                opciones: ["盾", "貝殻", "水差し", "剣"],
                correctas: ["貝殻"],
                multiple: false
            },
{
                reto: 60,
                id: "R60-Av34km-ja",
                tipo: "opcion",
                pregunta: "設けられた道はどの方向に向かっていますか？",
                opciones: ["北", "南", "東", "西"],
                correctas: ["北"],
                multiple: false
            },
{
                reto: 61,
                id: "R61-Av34km-ja",
                tipo: "opcion",
                pregunta: "古代バレンシアのアラブの城壁にはいくつの門がありましたか？",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 62,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
{
                reto: 63,
                id: "R63-Av34km-ja",
                tipo: "opcion",
                pregunta: "扉の鴨居の上にカルメル修道会の紋章が目立ちます。",
                opciones: ["王冠", "十字架", "星"],
                correctas: ["王冠"],
                multiple: false
            },
{
                reto: 64,
                id: "R64-Av34km-ja",
                tipo: "opcion",
                pregunta: "聖母は腕に何を抱いていますか？",
                opciones: ["ハート", "鳩", "幼子イエス"],
                correctas: ["幼子イエス"],
                multiple: false
            },
{
                reto: 65,
                id: "R65-Av34km-ja",
                tipo: "opcion-multiple",
                pregunta: "聖テレサは手に何を持っていますか？",
                opciones: ["羽根ペン", "剣", "本", "水差し"],
                correctas: ["羽根ペン", "本"],
                multiple: true
            },
{
                reto: 66,
                id: "R66-Av34km-ja",
                tipo: "texto",
                pregunta: "この博物館の入場料はいくらですか？",
                correctas: ["無料"],
                multiple: false
            },
{
                reto: 67,
                id: "R67-Av34km-ja",
                tipo: "opcion",
                pregunta: "パネルに何匹の猫が描かれているのが見えますか？",
                opciones: ["3", "4", "5"],
                correctas: ["4"],
                multiple: false
            },
{
                reto: 68,
                id: "R68-Av34km-ja",
                tipo: "texto",
                pregunta: "このパネルはどの高さを示していますか？",
                correctas: ["1.90メートル"],
                multiple: false
            },
{
                reto: 69,
                id: "R69-Av34km-ja",
                tipo: "texto",
                pregunta: "上部パネルはどの年を示していますか？",
                correctas: ["2100"],
                multiple: false
            },
{
                reto: 70,
                id: "R70-Av34km-ja",
                tipo: "opcion",
                pregunta: "紋章の上には何がありますか？",
                opciones: ["王冠", "コウモリ", "龍"],
                correctas: ["王冠"],
                multiple: false
            },
{
                reto: 71,
                id: "R71-Av34km-ja",
                tipo: "texto",
                pregunta: "弾丸の穴をいくつ数えられますか？",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 72,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
{
                reto: 73,
                id: "R73-Av34km-ja",
                tipo: "opcion",
                pregunta: "噴水の形は何ですか？",
                opciones: ["貝殻", "魚", "人"],
                correctas: ["人"],
                multiple: false
            },
{
                reto: 74,
                id: "R74-Av34km-ja",
                tipo: "texto",
                pregunta: "工事が始まったのは何年ですか？ファサードを見てください！",
                correctas: ["1400"],
                multiple: false
            },
{
                reto: 75,
                id: "R75-Av34km-ja",
                tipo: "texto",
                pregunta: "最後の修復の年を教えていただけますか？もう見たはずです！",
                correctas: ["2012"],
                multiple: false
            },
{
                reto: 76,
                id: "R76-Av34km-ja",
                tipo: "texto",
                pregunta: "それらの工事が行われたのは何年ですか？ヒントが必要ですか？建物のファサードを見てください。",
                correctas: ["1756"],
                multiple: false
            },
{
                reto: 77,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
{
                reto: 78,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
{
                reto: 79,
                id: "R79-Av34km-ja",
                tipo: "opcion",
                pregunta: "この古い川の名前を教えていただけますか？",
                opciones: ["Turia", "Júcar", "Segura", "Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
{
                reto: 80,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
{
                reto: 81,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
{
                reto: 82,
                id: "R82-Av34km-ja",
                tipo: "opcion-multiple",
                pregunta: "それらの石のブロックにはどのような用途がありますか？",
                opciones: ["水を止める", "荷車の車輪を止める", "川のごみを集める"],
                correctas: ["荷車の車輪を止める", "川のごみを集める"],
                multiple: true
            },
{
                reto: 83,
                id: "R83-Av34km-ja",
                tipo: "opcion",
                pregunta: "塔の頂上にはバレンシアの旗が翻っています：その色は赤、黄色、そして…",
                opciones: ["紫", "緑", "青"],
                correctas: ["青"],
                multiple: false
            },
{
                reto: 84,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
{
                reto: 85,
                id: "R85-Av34km-ja",
                tipo: "opcion",
                pregunta: "この博物館は何に捧げられていますか？",
                opciones: ["建築", "歴史", "自然科学"],
                correctas: ["自然科学"],
                multiple: false
            },
{
                reto: 86,
                id: "R86-Av34km-ja",
                tipo: "opcion",
                pregunta: "噴水を飾っているのはどんな像ですか？",
                opciones: ["アヒル", "コウノトリ", "魚"],
                correctas: ["コウノトリ"],
                multiple: false
            },
{
                reto: 87,
                id: "R87-Av34km-ja",
                tipo: "texto",
                pregunta: "この外壁には時計があります。何時を指していますか？",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 88,
                id: "R88-Av34km-ja",
                tipo: "opcion",
                pregunta: "像は手に何を持っていますか？",
                opciones: ["ハープ", "盾", "水差し", "剣"],
                correctas: ["盾"],
                multiple: false
            },
{
                reto: 89,
                id: "R89-Av34km-ja",
                tipo: "opcion",
                pregunta: "89. 聖ロレンスは手に何を持っていますか？",
                opciones: ["ハト", "スプーン", "グリル"],
                correctas: ["グリル"],
                multiple: false
            },
{
                reto: 90,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        de: [
            // Array de retos Aventura34km (DE)
{
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
{
                reto: 1,
                id: "R1-Av34km-de",
                tipo: "opcion",
                pregunta: "1. Wie viele Abenteuer können mit Valencia be Guides unternommen werden?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 2,
                id: "R2-Av34km-de",
                tipo: "opcion",
                pregunta: "2. Ist es ein guter Zeitpunkt, Ihr Abenteuer zu beginnen?",
                opciones: ["Ja", "Nein"],
                correctas: ["?"],
                multiple: false
            },
{
                reto: 3,
                id: "R3-Av34km-de",
                tipo: "opcion",
                pregunta: "3. Können Sie mir sagen, wie diese Türme heißen?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
{
                reto: 4,
                id: "PZ-19",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-19"
            },
{
                reto: 5,
                id: "R5-Av34km-de",
                tipo: "opcion",
                pregunta: "Können Sie mir sagen, wie diese beliebten Feste in Valencia heißen?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
{
                reto: 6,
                id: "R6-Av34km-de",
                tipo: "opcion",
                pregunta: "Die Natur hat das Wappen von Valencia geformt. Was ist oben zu sehen?",
                opciones: ["Ein Schild", "Eine Fledermaus", "Ein Drache"],
                correctas: ["Eine Fledermaus"],
                multiple: false
            },
{
                reto: 7,
                id: "R7-Av34km-de",
                tipo: "texto",
                pregunta: "Können Sie erraten, wie viele Stufen es hat?",
                correctas: ["16"],
                multiple: false
            },
{
                reto: 8,
                id: "R8-Av34km-de",
                tipo: "opcion",
                pregunta: "Was für Bäume können Sie gerade anfassen?",
                opciones: ["Olivenbäume", "Orangenbäume", "Palmen"],
                correctas: ["Palmen"],
                multiple: false
            },
{
                reto: 9,
                id: "R9-Av34km-de",
                tipo: "texto",
                pregunta: "Können Sie mir den Preis für den Zugang zu dieser Attraktion nennen?",
                correctas: ["gratis"],
                multiple: false
            },
{
                reto: 10,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
{
                reto: 11,
                id: "R11-Av34km-de",
                tipo: "opcion",
                pregunta: "Aus wie vielen Monumenten besteht die Stadt der Künste und Wissenschaften?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
{
                reto: 12,
                id: "R12-Av34km-de",
                tipo: "opcion",
                pregunta: "Woraus wird Orxata gemacht?",
                opciones: ["Chufa", "Gerste", "Reis"],
                correctas: ["Chufa"],
                multiple: false
            },
{
                reto: 13,
                id: "R13-Av34km-de",
                tipo: "opcion",
                pregunta: "Was umgibt die Basis der Brücke?",
                opciones: ["Wasser", "Gras", "Enten"],
                correctas: ["Wasser"],
                multiple: false
            },
{
                reto: 14,
                id: "R14-Av34km-de",
                tipo: "opcion",
                pregunta: "Erinnern Sie sich, welches Tier das Wappen von Valencia krönt?",
                opciones: ["Fledermaus", "Drache", "Löwe"],
                correctas: ["Fledermaus"],
                multiple: false
            },
{
                reto: 15,
                id: "R15-Av34km-de",
                tipo: "opcion",
                pregunta: "Was ist auf der Lokomotive zu sehen?",
                opciones: ["Ein Drache","Ein Stern","Ein Datum"],
                correctas: ["Ein Stern"],
                multiple: false
            },
{
                reto: 16,
                id: "R16-Av34km-de",
                tipo: "opcion-multiple",
                pregunta: "Welche Elemente sind in dieser Szene zu sehen?",
                opciones: ["Ein Fallero und eine Fallera","Orangen","Weintrauben"],
                correctas: ["Ein Fallero und eine Fallera","Orangen","Weintrauben"],
                multiple: true
            },
{
                reto: 17,
                id: "R17-Av34km-de",
                tipo: "opcion-multiple",
                pregunta: "Was könnte das sein?",
                opciones: ["Brotlaib","Krabben","Äpfel"],
                correctas: ["Brotlaib","Krabben"],
                multiple: true
            },
{
                reto: 18,
                id: "R18-Av34km-de",
                tipo: "texto",
                pregunta: "Wie viele Tiere können Sie zählen? Darunter gibt es Kühe, Schweine…",
                correctas: ["?"]
            },
{
                reto: 19,
                id: "PZ-20",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-20"
            },
{
                reto: 20,
                id: "R20-Av34km-de",
                tipo: "texto",
                pregunta: "Wie viele Stockwerke hat dieses Denkmal?",
                correctas: ["4"]
            },
{
                reto: 21,
                id: "R21-Av34km-de",
                tipo: "opcion",
                pregunta: "Welche natürliche Zitrusfrucht aus Valencia schmückt die Fassade?",
                opciones: ["Zitronen","Grapefruits","Orangen"],
                correctas: ["Orangen"],
                multiple: false
            },
{
                reto: 22,
                id: "R22-Av34km-de",
                tipo: "texto",
                pregunta: "Können Sie Ihre Sprache finden?",
                correctas: ["¿sí? ¿No?"]
            },
{
                reto: 23,
                id: "R23-Av34km-de",
                tipo: "opcion",
                pregunta: "23. Erinnern Sie sich, welches Tier das Stadtwappen krönt?",
                opciones: ["Ein Drache", "Eine Fledermaus", "Ein Pferd"],
                correctas: ["Eine Fledermaus"],
                multiple: false
            },
{
                reto: 24,
                id: "R24-Av34km-de",
                tipo: "opcion-multiple",
                pregunta: "24. Über dem Haupteingang, in einem Rundbogen, repräsentieren allegorische Figuren die fünf Kontinente. Was hält die zentrale Figur?",
                opciones: ["Eine Fackel", "Ein Schwert", "Eine Krone"],
                correctas: ["Eine Fackel", "Ein Schwert"],
                multiple: true
            },
{
                reto: 25,
                id: "R25-Av34km-de",
                tipo: "opcion",
                pregunta: "25. Was hält die Figur in seiner Hand?",
                opciones: ["Eine Waage", "Ein Buch", "Eine Feder"],
                correctas: ["Eine Waage"],
                multiple: false
            },
{
                reto: 26,
                id: "R26-Av34km-de",
                tipo: "texto",
                pregunta: "26. Wie viele Stockwerke hat das Gebäude?",
                correctas: ["10"]
            },
{
                reto: 27,
                id: "R27-Av34km-de",
                tipo: "opcion",
                pregunta: "27. Suchen Sie das Buntglasfenster mit den Farben der valencianischen Senyera an der Fassade. Können Sie seine Form bestimmen?",
                opciones: ["Quadrangular", "Rund", "Dreieckig"],
                correctas: ["Rund"],
                multiple: false
            },
{
                reto: 28,
                id: "R28-Av34km-de",
                tipo: "opcion-multiple",
                pregunta: "28. Was hält die Jungfrau in ihrer Hand?",
                opciones: ["Ein Rosenkranz", "Ein Kind", "Eine Krone"],
                correctas: ["Ein Rosenkranz", "Ein Kind"],
                multiple: true
            },
{
                reto: 29,
                id: "R29-Av34km-de",
                tipo: "opcion",
                pregunta: "29. Was gibt der Engel dem Kind?",
                opciones: ["Eine Taube", "Eine Kugel", "Nahrung"],
                correctas: ["Eine Kugel"],
                multiple: false
            },
{
                reto: 30,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
{
                reto: 31,
                id: "R31-Av34km-de",
                tipo: "opcion-multiple",
                pregunta: "31. Der Fährmann, der gegen den Strom rudert.",
                opciones: ["Ein Mann mit traurigem Gesicht, der ein kleines Holzboot steuert, entkommt einem Monster gegen den Strom."],
                correctas: ["Ein Mann mit traurigem Gesicht, der ein kleines Holzboot steuert, entkommt einem Monster gegen den Strom."],
                multiple: true
            },
{
                reto: 32,
                id: "R32-Av34km-de",
                tipo: "opcion-multiple",
                pregunta: "32. Ein toter Baum: Symbol der Sünde, ist zwischen den beiden Türflügeln zu sehen und dient als Pfeilerstab.",
                opciones: ["Beobachten Sie an der Baumkrone, wie 4 nackte Männer sich gegenseitig auspeitschen."],
                correctas: ["Beobachten Sie an der Baumkrone, wie 4 nackte Männer sich gegenseitig auspeitschen."],
                multiple: true
            },
{
                reto: 33,
                id: "R33-Av34km-de",
                tipo: "opcion-multiple",
                pregunta: "33. Rechts, ein Engel zeigt seinen Penis und...",
                opciones: ["...er ist dabei, ihn in eine Vase einzuführen, die er mit der anderen Hand hält. Seltsam und ungewöhnlich, finden Sie nicht?"],
                correctas: ["...er ist dabei, ihn in eine Vase einzuführen, die er mit der anderen Hand hält. Seltsam und ungewöhnlich, finden Sie nicht?"],
                multiple: true
            },
{
                reto: 34,
                id: "R34-Av34km-de",
                tipo: "opcion-multiple",
                pregunta: "34. In der Mitte: Der bärtige Mann und der Löwe:",
                opciones: ["Originale und widersprüchliche Szene, in der der sanfte genau der Löwe ist und nicht der bärtige alte Mann."],
                correctas: ["Originale und widersprüchliche Szene, in der der sanfte genau der Löwe ist und nicht der bärtige alte Mann."],
                multiple: true
            },
{
                reto: 35,
                id: "R35-Av34km-de",
                tipo: "opcion-multiple",
                pregunta: "35. Hier eine zusätzliche Herausforderung! Suchen Sie den Fornikator der Seidenbörse!",
                opciones: ["In einem seiner Fenster finden Sie einen gemeißelten Mann; sein Kopf ist nicht sichtbar, aber sein Geschlechtsorgan ist es, sehr deutlich."],
                correctas: ["In einem seiner Fenster finden Sie einen gemeißelten Mann; sein Kopf ist nicht sichtbar, aber sein Geschlechtsorgan ist es, sehr deutlich."],
                multiple: true
            },
{
                reto: 36,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
{
                reto: 37,
                id: "R37-Av34km-de",
                tipo: "texto",
                pregunta: "37. Wie breit ist der Eingang des schmalen Gebäudes?",
                correctas: ["1,35 metros"]
            },
{
                reto: 38,
                id: "R38-Av34km-de",
                tipo: "opcion-multiple",
                pregunta: "38. Drei Blendbögen. Zwei davon sind glatt, der dritte wurde ohne Verputz gelassen.<br>Was ist in diesem unvergipsten Bogen zu sehen?",
                opciones: ["Ein Gesicht", "Ein Torso", "Ein Wasserspeier"],
                correctas: ["Ein Gesicht", "Ein Torso"],
                multiple: true
            },
{
                reto: 39,
                id: "R39-Av34km-de",
                tipo: "opcion",
                pregunta: "39. Was befindet sich ganz oben am Barockturm von Santa Catalina?",
                opciones: ["Ein Kreuz", "Die Sonne", "Eine Taube"],
                correctas: ["Ein Kreuz"],
                multiple: false
            },
{
                reto: 40,
                id: "R40-Av34km-de",
                tipo: "texto",
                pregunta: "40. Welche Farbe haben die Dachziegel der Kuppel des Barockturms von Santa Catalina?",
                correctas: ["azules"]
            },
{
                reto: 41,
                id: "R41-Av34km-de",
                tipo: "opcion",
                pregunta: "41. Können Sie die Geometrie des Miguelete-Turms von Valencia bestimmen?",
                opciones: ["Hexagonal", "Oktagonal", "Viereckig"],
                correctas: ["Oktagonal"],
                multiple: false
            },
{
                reto: 42,
                id: "R42-Av34km-de",
                tipo: "texto",
                pregunta: "42. Wie viele Fenster können Sie sehen?",
                correctas: ["?"]
            },
{
                reto: 43,
                id: "R43-Av34km-de",
                tipo: "opcion-multiple",
                pregunta: "43. Was ist mehr als 35 Meter hoch oben an der Barockfassade zu sehen?",
                opciones: ["Eine Kugel", "Eine Fledermaus", "Ein Kreuz", "Ein Pferd"],
                correctas: ["Eine Kugel", "Ein Kreuz"],
                multiple: true
            },
{
                reto: 44,
                id: "R44-Av34km-de",
                tipo: "texto",
                pregunta: "Aus wie vielen Bögen besteht das Tor?",
                correctas: ["8"],
                multiple: false
            },
{
                reto: 45,
                id: "R45-Av34km-de",
                tipo: "opcion",
                pregunta: "45. Welche skulptierte Figur ist im Rahmen des Gemäldes zu sehen?",
                opciones: ["Ein Drache", "Eine Fledermaus", "Eine Krone"],
                correctas: ["Eine Krone"],
                multiple: false
            },
{
                reto: 46,
                id: "R46-Av34km-de",
                tipo: "opcion-multiple",
                pregunta: "46. Was ist im Inneren zu sehen?",
                opciones: ["Ein Altar", "Eine Flagge", "Ein Schwert"],
                correctas: ["Ein Altar", "Eine Flagge"],
                multiple: true
            },
{
                reto: 47,
                id: "R47-Av34km-de",
                tipo: "texto",
                pregunta: "47. Daran befindet sich eine Gedenktafel. In welchem Jahr wurde sie aufgestellt?",
                correctas: ["1952"]
            },
{
                reto: 48,
                id: "R48-Av34km-de",
                tipo: "texto",
                pregunta: "48. In welchem Jahr wurde dieses Gebäude errichtet? Tipp: Schauen Sie an der Oberseite der Fassade nach.",
                correctas: ["1906"]
            },
{
                reto: 49,
                id: "R49-Av34km-de",
                tipo: "opcion",
                pregunta: "49. Wenn Sie sich das Bild von San Valero ansehen, welcher Gegenstand könnte uns sagen, dass er gefangen war?",
                opciones: ["Die Ketten", "Das Buch", "Sein trauriges Gesicht"],
                correctas: ["Die Ketten"],
                multiple: false
            },
{
                reto: 50,
                id: "R50-Av34km-de",
                tipo: "opcion",
                pregunta: "50. Was ist im Inneren zu sehen?",
                opciones: ["Eine Stierkampfarena", "Römische Bäder", "Eine U-Bahn-Station"],
                correctas: ["Römische Bäder"],
                multiple: false
            },
{
                reto: 51,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
{
                reto: 52,
                id: "R52-Av34km-de",
                tipo: "opcion",
                pregunta: "52. Können Sie seine Geometrie bestimmen?",
                opciones: ["Hexagonal", "Oktogonal", "Quadrangular"],
                correctas: ["Hexagonal"],
                multiple: false
            },
{
                reto: 53,
                id: "R53-Av34km-de",
                tipo: "opcion",
                pregunta: "53. Mit welcher Hand hält Neptun das Füllhorn?",
                opciones: ["Links", "Rechts"],
                correctas: ["Rechts"],
                multiple: false
            },
{
                reto: 54,
                id: "R54-Av34km-de",
                tipo: "texto",
                pregunta: "54. Wie viele Figuren umgeben den Brunnen?",
                correctas: ["8"]
            },
{
                reto: 55,
                id: "R55-Av34km-de",
                tipo: "opcion",
                pregunta: "55. Welcher der beiden Türme des Palacio de la Generalitat ist Ihrer Meinung nach der neuere: der auf dem Platz oder dieser hier vor Ihnen?",
                opciones: ["Der auf dem Platz", "Dieser vor Ihnen"],
                correctas: ["Dieser vor Ihnen"],
                multiple: false
            },
{
                reto: 56,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
{
                reto: 57,
                id: "R57-Av34km-de",
                tipo: "opcion-multiple",
                pregunta: "57. Was ist auf diesem Keramikpaneel zu sehen? Sind es Schädel? Ist es ein Kreuz? Gibt es auch eine Taube?",
                opciones: ["Schädel", "Tauben", "Kreuz"],
                correctas: ["Schädel", "Kreuz"],
                multiple: true
            },
{
                reto: 58,
                id: "R58-Av34km-de",
                tipo: "opcion",
                pregunta: "58. Wie viele Glocken beherbergt dieser Turm?",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
{
                reto: 59,
                id: "R59-Av34km-de",
                tipo: "opcion",
                pregunta: "59. Was hält die Figur in ihren Händen?",
                opciones: ["Einen Schild", "Eine Muschel", "Einen Krug", "Ein Schwert"],
                correctas: ["Eine Muschel"],
                multiple: false
            },
{
                reto: 60,
                id: "R60-Av34km-de",
                tipo: "opcion",
                pregunta: "60. In welche Richtung verläuft der festgelegte Weg?",
                opciones: ["Norden", "Süden", "Osten", "Westen"],
                correctas: ["Norden"],
                multiple: false
            },
{
                reto: 61,
                id: "R61-Av34km-de",
                tipo: "opcion",
                pregunta: "61. Wie viele Tore hatte die alte arabische Mauer von Balansiya?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 62,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
{
                reto: 63,
                id: "R63-Av34km-de",
                tipo: "opcion",
                pregunta: "Über dem Türsturz sticht das Wappen des Karmeliterordens hervor.",
                opciones: ["Eine Krone","Ein Kreuz","Ein Stern"],
                correctas: ["Eine Krone"],
                multiple: false
            },
{
                reto: 64,
                id: "R64-Av34km-de",
                tipo: "opcion",
                pregunta: "Was trägt die Jungfrau auf dem Arm?",
                opciones: ["Ein Herz","Eine Taube","Das Jesuskind"],
                correctas: ["Das Jesuskind"],
                multiple: false
            },
{
                reto: 65,
                id: "R65-Av34km-de",
                tipo: "opcion-multiple",
                pregunta: "Was trägt die heilige Teresa in ihren Händen?",
                opciones: ["Eine Feder","Ein Schwert","Ein Buch","Ein Krug"],
                correctas: ["Eine Feder","Ein Buch"],
                multiple: true
            },
{
                reto: 66,
                id: "R66-Av34km-de",
                tipo: "texto",
                pregunta: "Wie viel kostet der Eintritt in dieses Museum?",
                correctas: ["Gratis"]
            },
{
                reto: 67,
                id: "R67-Av34km-de",
                tipo: "opcion",
                pregunta: "Wie viele Katzen sind auf dem Panel zu sehen?",
                opciones: ["3","4","5"],
                correctas: ["4"],
                multiple: false
            },
{
                reto: 68,
                id: "R68-Av34km-de",
                tipo: "texto",
                pregunta: "Welche Höhe zeigt dieses Panel an?",
                correctas: ["1,90 metros"]
            },
{
                reto: 69,
                id: "R69-Av34km-de",
                tipo: "texto",
                pregunta: "Welches Jahr zeigt das obere Panel an?",
                correctas: ["2100"]
            },
{
                reto: 70,
                id: "R70-Av34km-de",
                tipo: "opcion",
                pregunta: "Was krönt das Wappen?",
                opciones: ["Eine Krone","Eine Fledermaus","Ein Drache"],
                correctas: ["Eine Krone"],
                multiple: false
            },
{
                reto: 71,
                id: "R71-Av34km-de",
                tipo: "texto",
                pregunta: "Wie viele Einschusslöcher können Sie zählen?",
                correctas: ["?"]
            },
{
                reto: 72,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
{
                reto: 73,
                id: "R73-Av34km-de",
                tipo: "opcion",
                pregunta: "Welche Form hat der Brunnen?",
                opciones: ["Muschel","Fisch","Person"],
                correctas: ["Person"],
                multiple: false
            },
{
                reto: 74,
                id: "R74-Av34km-de",
                tipo: "texto",
                pregunta: "In welchem Jahr begannen die Bauarbeiten? Schauen Sie an der Fassade!",
                correctas: ["1400"]
            },
{
                reto: 75,
                id: "R75-Av34km-de",
                tipo: "texto",
                pregunta: "Können Sie mir das Jahr der letzten Renovierung nennen? Sie haben es sicher schon gesehen!",
                correctas: ["2012"]
            },
{
                reto: 76,
                id: "R76-Av34km-de",
                tipo: "texto",
                pregunta: "In welchem Jahr wurden diese Arbeiten durchgeführt? Brauchen Sie einen Hinweis? Schauen Sie an der Fassade des Gebäudes.",
                correctas: ["1756"]
            },
{
                reto: 77,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
{
                reto: 78,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
{
                reto: 79,
                id: "R79-Av34km-de",
                tipo: "opcion",
                pregunta: "Können Sie mir den Namen dieses alten Flusses nennen?",
                opciones: ["Turia","Júcar","Segura","Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
{
                reto: 80,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
{
                reto: 81,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
{
                reto: 82,
                id: "R82-Av34km-de",
                tipo: "opcion-multiple",
                pregunta: "Welche Funktionen können diese Schwellen haben?",
                opciones: ["Das Wasser aufhalten","Die Räder der Karren stoppen","Den Schmutz des Flusses auffangen"],
                correctas: ["Die Räder der Karren stoppen","Den Schmutz des Flusses auffangen"],
                multiple: true
            },
{
                reto: 83,
                id: "R83-Av34km-de",
                tipo: "opcion",
                pregunta: "Auf dem Gipfel der Türme weht die Flagge Valencias: Ihre Farben bestehen aus Rot, Gelb und… ",
                opciones: ["Violett","Grün","Blau"],
                correctas: ["Blau"],
                multiple: null
            },
{
                reto: 84,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
{
                reto: 85,
                id: "R85-Av34km-de",
                tipo: "opcion",
                pregunta: "Welchem Thema ist das Museum gewidmet?",
                opciones: ["Architektur","Geschichte","Naturwissenschaften"],
                correctas: ["Naturwissenschaften"],
                multiple: false
            },
{
                reto: 86,
                id: "R86-Av34km-de",
                tipo: "opcion",
                pregunta: "Welche Figur schmückt den Brunnen?",
                opciones: ["Eine Ente","Ein Storch","Ein Fisch"],
                correctas: ["Ein Storch"],
                multiple: false
            },
{
                reto: 87,
                id: "R87-Av34km-de",
                tipo: "texto",
                pregunta: "An dieser Fassade befindet sich eine Uhr. Welche Zeit zeigt sie?",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 88,
                id: "R88-Av34km-de",
                tipo: "opcion",
                pregunta: "Was hält die Figur in ihrer Hand?",
                opciones: ["Harfe", "Schild", "Krug", "Schwert"],
                correctas: ["Schild"],
                multiple: false
            },
{
                reto: 89,
                id: "R89-Av34km-de",
                tipo: "opcion",
                pregunta: "89. Was trägt der heilige Laurentius in seiner Hand?",
                opciones: ["Eine Taube", "Ein Löffel", "Ein Rost"],
                correctas: ["Ein Rost"],
                multiple: false
            },
{
                reto: 90,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        zh: [
            // Array de retos Aventura34km (ZH)
{
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
{
                reto: 1,
                id: "R1-Av34km-zh",
                tipo: "opcion",
                pregunta: "1. Valencia be Guides 可以进行多少次冒险？",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 2,
                id: "R2-Av34km-zh",
                tipo: "opcion",
                pregunta: "2. 现在是开始冒险的好时机吗？",
                opciones: ["是", "否"],
                correctas: ["?"],
                multiple: false
            },
{
                reto: 3,
                id: "R3-Av34km-zh",
                tipo: "opcion",
                pregunta: "3. 您知道这些塔楼叫什么名字吗？",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
{
                reto: 4,
                id: "PZ-19",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-19"
            },
{
                reto: 5,
                id: "R5-Av34km-zh",
                tipo: "opcion",
                pregunta: "您能告诉我巴伦西亚这些流行节日的名字吗？",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
{
                reto: 6,
                id: "R6-Av34km-zh",
                tipo: "opcion",
                pregunta: "大自然雕刻了巴伦西亚的盾形纹章。顶部能看到什么？",
                opciones: ["盾牌", "蝙蝠", "龙"],
                correctas: ["蝙蝠"],
                multiple: false
            },
{
                reto: 7,
                id: "R7-Av34km-zh",
                tipo: "texto",
                pregunta: "您能猜出它有多少个台阶吗？",
                correctas: ["16"],
                multiple: false
            },
{
                reto: 8,
                id: "R8-Av34km-zh",
                tipo: "opcion",
                pregunta: "您现在能摸到的是什么类型的树？",
                opciones: ["橄榄树", "橙树", "棕榈树"],
                correctas: ["棕榈树"],
                multiple: false
            },
{
                reto: 9,
                id: "R9-Av34km-zh",
                tipo: "texto",
                pregunta: "您能告诉我进入这个景点的价格吗？",
                correctas: ["gratis"],
                multiple: false
            },
{
                reto: 10,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
{
                reto: 11,
                id: "R11-Av34km-zh",
                tipo: "opcion",
                pregunta: "艺术与科学城由多少个建筑组成？",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
{
                reto: 12,
                id: "R12-Av34km-zh",
                tipo: "opcion",
                pregunta: "Orxata是用什么做的？",
                opciones: ["Chufa", "大麦", "大米"],
                correctas: ["Chufa"],
                multiple: false
            },
{
                reto: 13,
                id: "R13-Av34km-zh",
                tipo: "opcion",
                pregunta: "什么环绕着桥的底部？",
                opciones: ["水", "草", "鸭子"],
                correctas: ["水"],
                multiple: false
            },
{
                reto: 14,
                id: "R14-Av34km-zh",
                tipo: "opcion",
                pregunta: "您还记得什么动物装饰着巴伦西亚的盾形纹章吗？",
                opciones: ["蝙蝠", "龙", "狮子"],
                correctas: ["蝙蝠"],
                multiple: false
            },
{
                reto: 15,
                id: "R15-Av34km-zh",
                tipo: "opcion",
                pregunta: "火车头上可以看到什么？",
                opciones: ["一条龙","一颗星星","一个日期"],
                correctas: ["一颗星星"],
                multiple: false
            },
{
                reto: 16,
                id: "R16-Av34km-zh",
                tipo: "opcion-multiple",
                pregunta: "这个场景中可以看到哪些元素？",
                opciones: ["一个法利亚男和一个法利亚女","橙子","葡萄"],
                correctas: ["一个法利亚男和一个法利亚女","橙子","葡萄"],
                multiple: true
            },
{
                reto: 17,
                id: "R17-Av34km-zh",
                tipo: "opcion-multiple",
                pregunta: "这可能是什么？",
                opciones: ["圆面包","螃蟹","苹果"],
                correctas: ["圆面包","螃蟹"],
                multiple: true
            },
{
                reto: 18,
                id: "R18-Av34km-zh",
                tipo: "texto",
                pregunta: "您能数出几只动物？其中有奶牛、猪……",
                correctas: ["?"]
            },
{
                reto: 19,
                id: "PZ-20",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-20"
            },
{
                reto: 20,
                id: "R20-Av34km-zh",
                tipo: "texto",
                pregunta: "这座纪念碑有几层？",
                correctas: ["4"]
            },
{
                reto: 21,
                id: "R21-Av34km-zh",
                tipo: "opcion",
                pregunta: "巴伦西亚特产的哪种柑橘水果装饰着外墙？",
                opciones: ["柠檬","葡萄柚","橙子"],
                correctas: ["橙子"],
                multiple: false
            },
{
                reto: 22,
                id: "R22-Av34km-zh",
                tipo: "texto",
                pregunta: "您能找到您的语言吗？",
                correctas: ["¿sí? ¿No?"]
            },
{
                reto: 23,
                id: "R23-Av34km-zh",
                tipo: "opcion",
                pregunta: "23. 您还记得市徽上是什么动物吗？",
                opciones: ["一条龙", "一只蝙蝠", "一匹马"],
                correctas: ["一只蝙蝠"],
                multiple: false
            },
{
                reto: 24,
                id: "R24-Av34km-zh",
                tipo: "opcion-multiple",
                pregunta: "24. 在主入口上方的半圆拱门中，寓言人物代表五大洲。中央人物拿着什么？",
                opciones: ["一把火炬", "一把剑", "一顶王冠"],
                correctas: ["一把火炬", "一把剑"],
                multiple: true
            },
{
                reto: 25,
                id: "R25-Av34km-zh",
                tipo: "opcion",
                pregunta: "25. 这个人物手中拿着什么？",
                opciones: ["一把天平", "一本书", "一根羽毛"],
                correctas: ["一把天平"],
                multiple: false
            },
{
                reto: 26,
                id: "R26-Av34km-zh",
                tipo: "texto",
                pregunta: "26. 这栋建筑有几层楼？",
                correctas: ["10"]
            },
{
                reto: 27,
                id: "R27-Av34km-zh",
                tipo: "opcion",
                pregunta: "27. 在建筑外立面上寻找带有巴伦西亚旗帜颜色的彩色玻璃窗。您能判断它的形状吗？",
                opciones: ["四边形", "圆形", "三角形"],
                correctas: ["圆形"],
                multiple: false
            },
{
                reto: 28,
                id: "R28-Av34km-zh",
                tipo: "opcion-multiple",
                pregunta: "28. 圣母手中拿着什么？",
                opciones: ["一串玫瑰念珠", "一个孩子", "一顶王冠"],
                correctas: ["一串玫瑰念珠", "一个孩子"],
                multiple: true
            },
{
                reto: 29,
                id: "R29-Av34km-zh",
                tipo: "opcion",
                pregunta: "29. 天使给孩子什么？",
                opciones: ["一只鸽子", "一个宝球", "食物"],
                correctas: ["一个宝球"],
                multiple: false
            },
{
                reto: 30,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
{
                reto: 31,
                id: "R31-Av34km-zh",
                tipo: "opcion-multiple",
                pregunta: "31. 逆流而上的船夫。",
                opciones: ["一个面带愁容的男人驾驶着一艘小木船，逆流逃离一只怪物。"],
                correctas: ["一个面带愁容的男人驾驶着一艘小木船，逆流逃离一只怪物。"],
                multiple: true
            },
{
                reto: 32,
                id: "R32-Av34km-zh",
                tipo: "opcion-multiple",
                pregunta: "32. 一棵枯树：罪孽的象征，出现在门的两扇叶片之间，充当中柱。",
                opciones: ["观察树顶，4名裸男相互鞭打。"],
                correctas: ["观察树顶，4名裸男相互鞭打。"],
                multiple: true
            },
{
                reto: 33,
                id: "R33-Av34km-zh",
                tipo: "opcion-multiple",
                pregunta: "33. 右侧，一个天使展示着他的阴茎，并……",
                opciones: ["准备将其插入另一只手拿着的花瓶中。奇怪而不寻常，不是吗？"],
                correctas: ["准备将其插入另一只手拿着的花瓶中。奇怪而不寻常，不是吗？"],
                multiple: true
            },
{
                reto: 34,
                id: "R34-Av34km-zh",
                tipo: "opcion-multiple",
                pregunta: "34. 中央：蓄胡子的男人和狮子：",
                opciones: ["原创而矛盾的场景，其中温顺的恰恰是狮子，而不是蓄胡子的老人。"],
                correctas: ["原创而矛盾的场景，其中温顺的恰恰是狮子，而不是蓄胡子的老人。"],
                multiple: true
            },
{
                reto: 35,
                id: "R35-Av34km-zh",
                tipo: "opcion-multiple",
                pregunta: "35. 这是一个额外挑战！寻找丝绸交易所的通奸者！",
                opciones: ["在它的一扇窗户里，您会发现一个雕刻的男人；他的头部不可见，但他的生殖器非常清晰可见。"],
                correctas: ["在它的一扇窗户里，您会发现一个雕刻的男人；他的头部不可见，但他的生殖器非常清晰可见。"],
                multiple: true
            },
{
                reto: 36,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
{
                reto: 37,
                id: "R37-Av34km-zh",
                tipo: "texto",
                pregunta: "37. 这座狭窄建筑入口有多宽？",
                correctas: ["1,35 metros"]
            },
{
                reto: 38,
                id: "R38-Av34km-zh",
                tipo: "opcion-multiple",
                pregunta: "38. 三个盲拱。其中两个是光滑的，第三个未经粉刷。<br>在这个未粉刷的拱门里能看到什么？",
                opciones: ["一张脸", "一个躯干", "一个滴水兽"],
                correctas: ["一张脸", "一个躯干"],
                multiple: true
            },
{
                reto: 39,
                id: "R39-Av34km-zh",
                tipo: "opcion",
                pregunta: "39. 圣卡塔利娜巴洛克塔的最顶端有什么？",
                opciones: ["一个十字架", "太阳", "一只鸽子"],
                correctas: ["一个十字架"],
                multiple: false
            },
{
                reto: 40,
                id: "R40-Av34km-zh",
                tipo: "texto",
                pregunta: "40. 圣卡塔利娜巴洛克塔穹顶的瓦片是什么颜色？",
                correctas: ["azules"]
            },
{
                reto: 41,
                id: "R41-Av34km-zh",
                tipo: "opcion",
                pregunta: "41. 您能确定巴伦西亚米格莱特塔的几何形状吗？",
                opciones: ["六边形", "八边形", "四边形"],
                correctas: ["八边形"],
                multiple: false
            },
{
                reto: 42,
                id: "R42-Av34km-zh",
                tipo: "texto",
                pregunta: "42. 您能看到多少扇窗户？",
                correctas: ["?"]
            },
{
                reto: 43,
                id: "R43-Av34km-zh",
                tipo: "opcion-multiple",
                pregunta: "43. 在巴洛克式正门顶端35米以上能看到什么？",
                opciones: ["一个球体", "一只蝙蝠", "一个十字架", "一匹马"],
                correctas: ["一个球体", "一个十字架"],
                multiple: true
            },
{
                reto: 44,
                id: "R44-Av34km-zh",
                tipo: "texto",
                pregunta: "门由几个拱门组成？",
                correctas: ["8"],
                multiple: false
            },
{
                reto: 45,
                id: "R45-Av34km-zh",
                tipo: "opcion",
                pregunta: "45. 画框上可以看到什么雕刻图案？",
                opciones: ["一条龙", "一只蝙蝠", "一顶王冠"],
                correctas: ["一顶王冠"],
                multiple: false
            },
{
                reto: 46,
                id: "R46-Av34km-zh",
                tipo: "opcion-multiple",
                pregunta: "46. 内部可以看到什么？",
                opciones: ["一座祭坛", "一面旗帜", "一把剑"],
                correctas: ["一座祭坛", "一面旗帜"],
                multiple: true
            },
{
                reto: 47,
                id: "R47-Av34km-zh",
                tipo: "texto",
                pregunta: "47. 上面有一块纪念牌匾。这块牌匾是哪年放置的？",
                correctas: ["1952"]
            },
{
                reto: 48,
                id: "R48-Av34km-zh",
                tipo: "texto",
                pregunta: "48. 这栋建筑建于哪一年？提示：看建筑外立面的上部。",
                correctas: ["1906"]
            },
{
                reto: 49,
                id: "R49-Av34km-zh",
                tipo: "opcion",
                pregunta: "49. 看着圣瓦莱罗的雕像，哪件物品能告诉我们他曾被囚禁？",
                opciones: ["锁链", "书", "悲伤的表情"],
                correctas: ["锁链"],
                multiple: false
            },
{
                reto: 50,
                id: "R50-Av34km-zh",
                tipo: "opcion",
                pregunta: "50. 内部可以看到什么？",
                opciones: ["一个斗牛场", "罗马浴场", "一个地铁站"],
                correctas: ["罗马浴场"],
                multiple: false
            },
{
                reto: 51,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
{
                reto: 52,
                id: "R52-Av34km-zh",
                tipo: "opcion",
                pregunta: "52. 您能判断它的几何形状吗？",
                opciones: ["六边形", "八边形", "四边形"],
                correctas: ["六边形"],
                multiple: false
            },
{
                reto: 53,
                id: "R53-Av34km-zh",
                tipo: "opcion",
                pregunta: "53. 海神尼普顿用哪只手拿着丰饶角？",
                opciones: ["左手", "右手"],
                correctas: ["右手"],
                multiple: false
            },
{
                reto: 54,
                id: "R54-Av34km-zh",
                tipo: "texto",
                pregunta: "54. 喷泉周围有多少个雕像？",
                correctas: ["8"]
            },
{
                reto: 55,
                id: "R55-Av34km-zh",
                tipo: "opcion",
                pregunta: "55. 赫内拉利塔宫的两座塔中，您认为哪一座更新：广场那座，还是您现在面前的这座？",
                opciones: ["广场那座", "面前这座"],
                correctas: ["面前这座"],
                multiple: false
            },
{
                reto: 56,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
{
                reto: 57,
                id: "R57-Av34km-zh",
                tipo: "opcion-multiple",
                pregunta: "57. 这块陶瓷板上能看到什么？是骷髅吗？是十字架吗？还有鸽子吗？",
                opciones: ["骷髅", "鸽子", "十字架"],
                correctas: ["骷髅", "十字架"],
                multiple: true
            },
{
                reto: 58,
                id: "R58-Av34km-zh",
                tipo: "opcion",
                pregunta: "58. 这座塔里有多少口钟？",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
{
                reto: 59,
                id: "R59-Av34km-zh",
                tipo: "opcion",
                pregunta: "59. 这个雕像手里拿着什么？",
                opciones: ["盾牌", "贝壳", "水罐", "剑"],
                correctas: ["贝壳"],
                multiple: false
            },
{
                reto: 60,
                id: "R60-Av34km-zh",
                tipo: "opcion",
                pregunta: "60. 既定的道路朝哪个方向走？",
                opciones: ["北", "南", "东", "西"],
                correctas: ["北"],
                multiple: false
            },
{
                reto: 61,
                id: "R61-Av34km-zh",
                tipo: "opcion",
                pregunta: "61. 古代巴伦西亚阿拉伯城墙有几座城门？",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 62,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
{
                reto: 63,
                id: "R63-Av34km-zh",
                tipo: "opcion",
                pregunta: "在门楣上方突出的是卡尔默修道院的盾徽。",
                opciones: ["一顶王冠","一个十字架","一颗星星"],
                correctas: ["一顶王冠"],
                multiple: false
            },
{
                reto: 64,
                id: "R64-Av34km-zh",
                tipo: "opcion",
                pregunta: "圣母怀里抱着什么？",
                opciones: ["一颗心","一只鸽子","耶稣圣婴"],
                correctas: ["耶稣圣婴"],
                multiple: false
            },
{
                reto: 65,
                id: "R65-Av34km-zh",
                tipo: "opcion-multiple",
                pregunta: "圣大德兰双手持着什么？",
                opciones: ["一支羽毛笔","一把剑","一本书","一个壶"],
                correctas: ["一支羽毛笔","一本书"],
                multiple: true
            },
{
                reto: 66,
                id: "R66-Av34km-zh",
                tipo: "texto",
                pregunta: "这个博物馆的门票多少钱？",
                correctas: ["免费"]
            },
{
                reto: 67,
                id: "R67-Av34km-zh",
                tipo: "opcion",
                pregunta: "面板上可以看到几只猫？",
                opciones: ["3","4","5"],
                correctas: ["4"],
                multiple: false
            },
{
                reto: 68,
                id: "R68-Av34km-zh",
                tipo: "texto",
                pregunta: "这个面板标注的高度是多少？",
                correctas: ["1,90 metros"]
            },
{
                reto: 69,
                id: "R69-Av34km-zh",
                tipo: "texto",
                pregunta: "上方面板显示哪一年？",
                correctas: ["2100"]
            },
{
                reto: 70,
                id: "R70-Av34km-zh",
                tipo: "opcion",
                pregunta: "什么装饰着盾徽顶部？",
                opciones: ["一顶王冠","一只蝙蝠","一条龙"],
                correctas: ["一顶王冠"],
                multiple: false
            },
{
                reto: 71,
                id: "R71-Av34km-zh",
                tipo: "texto",
                pregunta: "您能数出多少个弹孔？",
                correctas: ["?"]
            },
{
                reto: 72,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
{
                reto: 73,
                id: "R73-Av34km-zh",
                tipo: "opcion",
                pregunta: "喷泉是什么形状？",
                opciones: ["贝壳","鱼","人"],
                correctas: ["人"],
                multiple: false
            },
{
                reto: 74,
                id: "R74-Av34km-zh",
                tipo: "texto",
                pregunta: "建筑工程始于哪一年？看外墙！",
                correctas: ["1400"]
            },
{
                reto: 75,
                id: "R75-Av34km-zh",
                tipo: "texto",
                pregunta: "您能告诉我最后一次修缮的年份吗？您肯定已经看到了！",
                correctas: ["2012"]
            },
{
                reto: 76,
                id: "R76-Av34km-zh",
                tipo: "texto",
                pregunta: "这些工程是哪一年进行的？需要提示吗？请看建筑外墙。",
                correctas: ["1756"]
            },
{
                reto: 77,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
{
                reto: 78,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
{
                reto: 79,
                id: "R79-Av34km-zh",
                tipo: "opcion",
                pregunta: "您能告诉我这条古老河流的名字吗？",
                opciones: ["Turia","Júcar","Segura","Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
{
                reto: 80,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
{
                reto: 81,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
{
                reto: 82,
                id: "R82-Av34km-zh",
                tipo: "opcion-multiple",
                pregunta: "这些门槛有什么用途？",
                opciones: ["拦截水流","阻止马车的轮子","收集河流中的污物"],
                correctas: ["阻止马车的轮子","收集河流中的污物"],
                multiple: true
            },
{
                reto: 83,
                id: "R83-Av34km-zh",
                tipo: "opcion",
                pregunta: "塔顶飘扬着巴伦西亚的旗帜：其颜色由红色、黄色和…组成 ",
                opciones: ["紫色","绿色","蓝色"],
                correctas: ["蓝色"],
                multiple: null
            },
{
                reto: 84,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
{
                reto: 85,
                id: "R85-Av34km-zh",
                tipo: "opcion",
                pregunta: "这个博物馆是关于什么的？",
                opciones: ["建筑","历史","自然科学"],
                correctas: ["自然科学"],
                multiple: false
            },
{
                reto: 86,
                id: "R86-Av34km-zh",
                tipo: "opcion",
                pregunta: "喷泉上装饰着什么图案？",
                opciones: ["一只鸭子","一只鹤","一条鱼"],
                correctas: ["一只鹤"],
                multiple: false
            },
{
                reto: 87,
                id: "R87-Av34km-zh",
                tipo: "texto",
                pregunta: "这个外立面上有一个时钟。它显示几点？",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 88,
                id: "R88-Av34km-zh",
                tipo: "opcion",
                pregunta: "这个雕像手里拿着什么？",
                opciones: ["竖琴", "盾牌", "水罐", "宝剑"],
                correctas: ["盾牌"],
                multiple: false
            },
{
                reto: 89,
                id: "R89-Av34km-zh",
                tipo: "opcion",
                pregunta: "89. 圣劳伦斯手中拿着什么？",
                opciones: ["一只鸽子", "一把勺子", "一个烤架"],
                correctas: ["一个烤架"],
                multiple: false
            },
{
                reto: 90,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        pl: [
            // Array de retos Aventura34km (PL)
{
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
{
                reto: 1,
                id: "R1-Av34km-pl",
                tipo: "opcion",
                pregunta: "1. Ile przygód można przeżyć z Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 2,
                id: "R2-Av34km-pl",
                tipo: "opcion",
                pregunta: "2. Czy to dobry moment, aby rozpocząć przygodę?",
                opciones: ["Tak", "Nie"],
                correctas: ["?"],
                multiple: false
            },
{
                reto: 3,
                id: "R3-Av34km-pl",
                tipo: "opcion",
                pregunta: "3. Czy może mi Pan/Pani powiedzieć, jak nazywają się te wieże?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
{
                reto: 4,
                id: "PZ-19",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-19"
            },
{
                reto: 5,
                id: "R5-Av34km-pl",
                tipo: "opcion",
                pregunta: "Czy potrafi mi powiedzieć, jak nazywają się te popularne święta w Walencji?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
{
                reto: 6,
                id: "R6-Av34km-pl",
                tipo: "opcion",
                pregunta: "Natura wyrzeźbiła herb Walencji. Co widać na górze?",
                opciones: ["Tarcza", "Nietoperz", "Smok"],
                correctas: ["Nietoperz"],
                multiple: false
            },
{
                reto: 7,
                id: "R7-Av34km-pl",
                tipo: "texto",
                pregunta: "Czy potrafisz zgadnąć, ile ma stopni?",
                correctas: ["16"],
                multiple: false
            },
{
                reto: 8,
                id: "R8-Av34km-pl",
                tipo: "opcion",
                pregunta: "Jakie drzewa możesz teraz dotknąć?",
                opciones: ["Drzewa oliwne", "Drzewa pomarańczowe", "Palmy"],
                correctas: ["Palmy"],
                multiple: false
            },
{
                reto: 9,
                id: "R9-Av34km-pl",
                tipo: "texto",
                pregunta: "Czy potrafi mi powiedzieć cenę wejścia do tej atrakcji?",
                correctas: ["gratis"],
                multiple: false
            },
{
                reto: 10,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
{
                reto: 11,
                id: "R11-Av34km-pl",
                tipo: "opcion",
                pregunta: "Z ilu monumentów składa się Miasto Sztuki i Nauki?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
{
                reto: 12,
                id: "R12-Av34km-pl",
                tipo: "opcion",
                pregunta: "Z czego jest zrobiona Orxata?",
                opciones: ["Chufa", "Jęczmień", "Ryż"],
                correctas: ["Chufa"],
                multiple: false
            },
{
                reto: 13,
                id: "R13-Av34km-pl",
                tipo: "opcion",
                pregunta: "Co otacza podstawę mostu?",
                opciones: ["Woda", "Trawa", "Kaczki"],
                correctas: ["Woda"],
                multiple: false
            },
{
                reto: 14,
                id: "R14-Av34km-pl",
                tipo: "opcion",
                pregunta: "Czy pamiętasz, jakie zwierzę wieńczy herb Walencji?",
                opciones: ["Nietoperz", "Smok", "Lew"],
                correctas: ["Nietoperz"],
                multiple: false
            },
{
                reto: 15,
                id: "R15-Av34km-pl",
                tipo: "opcion",
                pregunta: "Co można zobaczyć na lokomotywie?",
                opciones: ["Smok","Gwiazda","Data"],
                correctas: ["Gwiazda"],
                multiple: false
            },
{
                reto: 16,
                id: "R16-Av34km-pl",
                tipo: "opcion-multiple",
                pregunta: "Jakie elementy można zobaczyć na tej scenie?",
                opciones: ["Fallero i Fallera","Pomarańcze","Winogrona"],
                correctas: ["Fallero i Fallera","Pomarańcze","Winogrona"],
                multiple: true
            },
{
                reto: 17,
                id: "R17-Av34km-pl",
                tipo: "opcion-multiple",
                pregunta: "Co to może być?",
                opciones: ["Bochenek chleba","Kraby","Jabłka"],
                correctas: ["Bochenek chleba","Kraby"],
                multiple: true
            },
{
                reto: 18,
                id: "R18-Av34km-pl",
                tipo: "texto",
                pregunta: "Ile zwierząt można naliczyć? Są wśród nich krowy, świnie…",
                correctas: ["?"]
            },
{
                reto: 19,
                id: "PZ-20",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-20"
            },
{
                reto: 20,
                id: "R20-Av34km-pl",
                tipo: "texto",
                pregunta: "Ile pięter ma ten Pomnik?",
                correctas: ["4"]
            },
{
                reto: 21,
                id: "R21-Av34km-pl",
                tipo: "opcion",
                pregunta: "Jakim naturalnym owocem cytrusowym z Walencji ozdobiona jest fasada?",
                opciones: ["Cytryny","Grejpfruty","Pomarańcze"],
                correctas: ["Pomarańcze"],
                multiple: false
            },
{
                reto: 22,
                id: "R22-Av34km-pl",
                tipo: "texto",
                pregunta: "Czy może Pan/Pani znaleźć swój język?",
                correctas: ["¿sí? ¿No?"]
            },
{
                reto: 23,
                id: "R23-Av34km-pl",
                tipo: "opcion",
                pregunta: "23. Czy pamięta Pan/Pani, jakie zwierzę wieńczy herb miejski?",
                opciones: ["Smok", "Nietoperz", "Koń"],
                correctas: ["Nietoperz"],
                multiple: false
            },
{
                reto: 24,
                id: "R24-Av34km-pl",
                tipo: "opcion-multiple",
                pregunta: "24. Nad głównym wejściem, w półokrągłym łuku, alegoryczne figury reprezentują pięć kontynentów. Co trzyma centralna figura?",
                opciones: ["Pochodnia", "Miecz", "Korona"],
                correctas: ["Pochodnia", "Miecz"],
                multiple: true
            },
{
                reto: 25,
                id: "R25-Av34km-pl",
                tipo: "opcion",
                pregunta: "25. Co trzyma figura w swojej ręce?",
                opciones: ["Waga", "Książka", "Pióro"],
                correctas: ["Waga"],
                multiple: false
            },
{
                reto: 26,
                id: "R26-Av34km-pl",
                tipo: "texto",
                pregunta: "26. Ile pięter ma budynek?",
                correctas: ["10"]
            },
{
                reto: 27,
                id: "R27-Av34km-pl",
                tipo: "opcion",
                pregunta: "27. Poszukaj witrażu w kolorach walencjańskiej Senyery na fasadzie budynku. Czy potrafi Pan/Pani określić jego kształt?",
                opciones: ["Czworokąt", "Okrągły", "Trójkąt"],
                correctas: ["Okrągły"],
                multiple: false
            },
{
                reto: 28,
                id: "R28-Av34km-pl",
                tipo: "opcion-multiple",
                pregunta: "28. Co trzyma Dziewica w swojej ręce?",
                opciones: ["Różaniec", "Dziecko", "Korona"],
                correctas: ["Różaniec", "Dziecko"],
                multiple: true
            },
{
                reto: 29,
                id: "R29-Av34km-pl",
                tipo: "opcion",
                pregunta: "29. Co anioł daje dziecku?",
                opciones: ["Gołąb", "Kula", "Jedzenie"],
                correctas: ["Kula"],
                multiple: false
            },
{
                reto: 30,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
{
                reto: 31,
                id: "R31-Av34km-pl",
                tipo: "opcion-multiple",
                pregunta: "31. Przewoźnik wiosłujący pod prąd.",
                opciones: ["Smutny mężczyzna kierujący małą drewnianą łódką ucieka pod prąd przed potworem."],
                correctas: ["Smutny mężczyzna kierujący małą drewnianą łódką ucieka pod prąd przed potworem."],
                multiple: true
            },
{
                reto: 32,
                id: "R32-Av34km-pl",
                tipo: "opcion-multiple",
                pregunta: "32. Martwe drzewo: symbol Grzechu, widać je między dwoma skrzydłami drzwi, pełni funkcję słupka.",
                opciones: ["Obserwuj wierzchołek drzewa, gdzie 4 nagich mężczyzn biczuje się nawzajem."],
                correctas: ["Obserwuj wierzchołek drzewa, gdzie 4 nagich mężczyzn biczuje się nawzajem."],
                multiple: true
            },
{
                reto: 33,
                id: "R33-Av34km-pl",
                tipo: "opcion-multiple",
                pregunta: "33. Po prawej, anioł pokazuje swój penis i...",
                opciones: ["...zamierza włożyć go do wazonu, który trzyma w drugiej ręce. Dziwne i niezwykłe, prawda?"],
                correctas: ["...zamierza włożyć go do wazonu, który trzyma w drugiej ręce. Dziwne i niezwykłe, prawda?"],
                multiple: true
            },
{
                reto: 34,
                id: "R34-Av34km-pl",
                tipo: "opcion-multiple",
                pregunta: "34. W centrum: Brodaty mężczyzna i lew:",
                opciones: ["Oryginalna i sprzeczna scena, w której łagodnym jest właśnie lew, a nie brodaty starzec."],
                correctas: ["Oryginalna i sprzeczna scena, w której łagodnym jest właśnie lew, a nie brodaty starzec."],
                multiple: true
            },
{
                reto: 35,
                id: "R35-Av34km-pl",
                tipo: "opcion-multiple",
                pregunta: "35. Oto dodatkowe wyzwanie! Znajdź lubieżnika z Giełdy Jedwabiu!",
                opciones: ["W jednym z jej okien znajdziesz wykutego mężczyznę; jego głowy nie widać, ale genitalia są bardzo wyraźnie widoczne."],
                correctas: ["W jednym z jej okien znajdziesz wykutego mężczyznę; jego głowy nie widać, ale genitalia są bardzo wyraźnie widoczne."],
                multiple: true
            },
{
                reto: 36,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
{
                reto: 37,
                id: "R37-Av34km-pl",
                tipo: "texto",
                pregunta: "37. Jak szeroki jest wejście do wąskiego budynku?",
                correctas: ["1,35 metros"]
            },
{
                reto: 38,
                id: "R38-Av34km-pl",
                tipo: "opcion-multiple",
                pregunta: "38. Trzy ślepe łuki. Dwa z nich są gładkie, trzeci pozostał bez tynku.<br>Co można zobaczyć w tym nieobitym łuku?",
                opciones: ["Twarz", "Tors", "Gargulec"],
                correctas: ["Twarz", "Tors"],
                multiple: true
            },
{
                reto: 39,
                id: "R39-Av34km-pl",
                tipo: "opcion",
                pregunta: "39. Co znajduje się na samym szczycie barokowej wieży Santa Catalina?",
                opciones: ["Krzyż", "Słońce", "Gołąb"],
                correctas: ["Krzyż"],
                multiple: false
            },
{
                reto: 40,
                id: "R40-Av34km-pl",
                tipo: "texto",
                pregunta: "40. Jakiego koloru są dachówki kopuły barokowej wieży Santa Catalina?",
                correctas: ["azules"]
            },
{
                reto: 41,
                id: "R41-Av34km-pl",
                tipo: "opcion",
                pregunta: "41. Czy potrafiłbyś określić geometrię wieży Miguelete w Walencji?",
                opciones: ["Sześciokątne", "Ośmiokątne", "Czworokątne"],
                correctas: ["Ośmiokątne"],
                multiple: false
            },
{
                reto: 42,
                id: "R42-Av34km-pl",
                tipo: "texto",
                pregunta: "42. Ile okien można zobaczyć?",
                correctas: ["?"]
            },
{
                reto: 43,
                id: "R43-Av34km-pl",
                tipo: "opcion-multiple",
                pregunta: "43. Co można zobaczyć ponad 35 metrów w górze na szczycie barokowej fasady?",
                opciones: ["Kula", "Nietoperz", "Krzyż", "Koń"],
                correctas: ["Kula", "Krzyż"],
                multiple: true
            },
{
                reto: 44,
                id: "R44-Av34km-pl",
                tipo: "texto",
                pregunta: "Z ilu łuków składa się brama?",
                correctas: ["8"],
                multiple: false
            },
{
                reto: 45,
                id: "R45-Av34km-pl",
                tipo: "opcion",
                pregunta: "45. Jaką rzeźbioną figurę można zobaczyć w ramie obrazu?",
                opciones: ["Smok", "Nietoperz", "Korona"],
                correctas: ["Korona"],
                multiple: false
            },
{
                reto: 46,
                id: "R46-Av34km-pl",
                tipo: "opcion-multiple",
                pregunta: "46. Co można zobaczyć wewnątrz?",
                opciones: ["Ołtarz", "Flaga", "Miecz"],
                correctas: ["Ołtarz", "Flaga"],
                multiple: true
            },
{
                reto: 47,
                id: "R47-Av34km-pl",
                tipo: "texto",
                pregunta: "47. Na nim znajduje się tablica pamiątkowa. W którym roku została umieszczona?",
                correctas: ["1952"]
            },
{
                reto: 48,
                id: "R48-Av34km-pl",
                tipo: "texto",
                pregunta: "48. W którym roku zbudowano tę kamienicę? Wskazówka: spójrz na górę fasady.",
                correctas: ["1906"]
            },
{
                reto: 49,
                id: "R49-Av34km-pl",
                tipo: "opcion",
                pregunta: "49. Patrząc na wizerunek San Valero, jaki przedmiot mógłby nam powiedzieć, że był więziony?",
                opciones: ["Łańcuchy", "Księga", "Jego smutna twarz"],
                correctas: ["Łańcuchy"],
                multiple: false
            },
{
                reto: 50,
                id: "R50-Av34km-pl",
                tipo: "opcion",
                pregunta: "50. Co można zobaczyć wewnątrz?",
                opciones: ["Arena do walk byków", "Łaźnie rzymskie", "Stacja metra"],
                correctas: ["Łaźnie rzymskie"],
                multiple: false
            },
{
                reto: 51,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
{
                reto: 52,
                id: "R52-Av34km-pl",
                tipo: "opcion",
                pregunta: "52. Czy potrafi Pan/Pani określić jego geometrię?",
                opciones: ["Sześciokąt", "Ośmiokąt", "Czworokąt"],
                correctas: ["Sześciokąt"],
                multiple: false
            },
{
                reto: 53,
                id: "R53-Av34km-pl",
                tipo: "opcion",
                pregunta: "53. Którą ręką Neptun trzyma róg obfitości?",
                opciones: ["Lewą", "Prawą"],
                correctas: ["Prawą"],
                multiple: false
            },
{
                reto: 54,
                id: "R54-Av34km-pl",
                tipo: "texto",
                pregunta: "54. Ile postaci otacza fontannę?",
                correctas: ["8"]
            },
{
                reto: 55,
                id: "R55-Av34km-pl",
                tipo: "opcion",
                pregunta: "55. Która z dwóch wież Pałacu Generalitat jest waszym zdaniem nowsza: ta na placu, czy ta, która stoi teraz przed wami?",
                opciones: ["Ta na placu", "Ta przed wami"],
                correctas: ["Ta przed wami"],
                multiple: false
            },
{
                reto: 56,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
{
                reto: 57,
                id: "R57-Av34km-pl",
                tipo: "opcion-multiple",
                pregunta: "57. Co można zobaczyć na tym ceramicznym panelu? Czy to czaszki? Czy jest krzyż? Czy jest też gołąb?",
                opciones: ["Czaszki", "Gołębie", "Krzyż"],
                correctas: ["Czaszki", "Krzyż"],
                multiple: true
            },
{
                reto: 58,
                id: "R58-Av34km-pl",
                tipo: "opcion",
                pregunta: "58. Ile dzwonów mieści ta wieża?",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
{
                reto: 59,
                id: "R59-Av34km-pl",
                tipo: "opcion",
                pregunta: "59. Co postać trzyma w rękach?",
                opciones: ["Tarczę", "Muszlę", "Dzban", "Miecz"],
                correctas: ["Muszlę"],
                multiple: false
            },
{
                reto: 60,
                id: "R60-Av34km-pl",
                tipo: "opcion",
                pregunta: "60. W jakim kierunku przebiega wyznaczona ścieżka?",
                opciones: ["Północ", "Południe", "Wschód", "Zachód"],
                correctas: ["Północ"],
                multiple: false
            },
{
                reto: 61,
                id: "R61-Av34km-pl",
                tipo: "opcion",
                pregunta: "61. Ile bram miał stary arabski mur Balansiya?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 62,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
{
                reto: 63,
                id: "R63-Av34km-pl",
                tipo: "opcion",
                pregunta: "Nad nadprożem drzwi widnieje herb Zakonu Karmelitów.",
                opciones: ["Korona","Krzyż","Gwiazda"],
                correctas: ["Korona"],
                multiple: false
            },
{
                reto: 64,
                id: "R64-Av34km-pl",
                tipo: "opcion",
                pregunta: "Co trzyma Matka Boska w ramionach?",
                opciones: ["Serce","Gołąb","Dzieciątko Jezus"],
                correctas: ["Dzieciątko Jezus"],
                multiple: false
            },
{
                reto: 65,
                id: "R65-Av34km-pl",
                tipo: "opcion-multiple",
                pregunta: "Co trzyma święta Teresa w swoich rękach?",
                opciones: ["Pióro","Miecz","Książka","Dzbanek"],
                correctas: ["Pióro","Książka"],
                multiple: true
            },
{
                reto: 66,
                id: "R66-Av34km-pl",
                tipo: "texto",
                pregunta: "Ile kosztuje wstęp do tego muzeum?",
                correctas: ["Bezpłatnie"]
            },
{
                reto: 67,
                id: "R67-Av34km-pl",
                tipo: "opcion",
                pregunta: "Ile kotów widać na panelu?",
                opciones: ["3","4","5"],
                correctas: ["4"],
                multiple: false
            },
{
                reto: 68,
                id: "R68-Av34km-pl",
                tipo: "texto",
                pregunta: "Jaką wysokość wskazuje ten panel?",
                correctas: ["1,90 metros"]
            },
{
                reto: 69,
                id: "R69-Av34km-pl",
                tipo: "texto",
                pregunta: "Jaki rok wskazuje górny panel?",
                correctas: ["2100"]
            },
{
                reto: 70,
                id: "R70-Av34km-pl",
                tipo: "opcion",
                pregunta: "Co wieńczy herb?",
                opciones: ["Korona","Nietoperz","Smok"],
                correctas: ["Korona"],
                multiple: false
            },
{
                reto: 71,
                id: "R71-Av34km-pl",
                tipo: "texto",
                pregunta: "Ile otworów po pociskach można zliczyć?",
                correctas: ["?"]
            },
{
                reto: 72,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
{
                reto: 73,
                id: "R73-Av34km-pl",
                tipo: "opcion",
                pregunta: "Jaki kształt ma fontanna?",
                opciones: ["Muszla","Ryba","Człowiek"],
                correctas: ["Człowiek"],
                multiple: false
            },
{
                reto: 74,
                id: "R74-Av34km-pl",
                tipo: "texto",
                pregunta: "W którym roku rozpoczęto prace? Proszę spojrzeć na fasadę!",
                correctas: ["1400"]
            },
{
                reto: 75,
                id: "R75-Av34km-pl",
                tipo: "texto",
                pregunta: "Czy potrafi Pan/Pani podać rok ostatniej renowacji? Na pewno już to widział(a)!",
                correctas: ["2012"]
            },
{
                reto: 76,
                id: "R76-Av34km-pl",
                tipo: "texto",
                pregunta: "W którym roku przeprowadzono te prace? Potrzebuje Pan/Pani wskazówki? Proszę spojrzeć na fasadę budynku.",
                correctas: ["1756"]
            },
{
                reto: 77,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
{
                reto: 78,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
{
                reto: 79,
                id: "R79-Av34km-pl",
                tipo: "opcion",
                pregunta: "Czy potrafi Pan/Pani powiedzieć mi nazwę tej starej rzeki?",
                opciones: ["Turia","Júcar","Segura","Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
{
                reto: 80,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
{
                reto: 81,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
{
                reto: 82,
                id: "R82-Av34km-pl",
                tipo: "opcion-multiple",
                pregunta: "Jakie funkcje mogą pełnić te progi?",
                opciones: ["Zatrzymywanie wody","Zatrzymywanie kół wozów","Zbieranie nieczystości z rzeki"],
                correctas: ["Zatrzymywanie kół wozów","Zbieranie nieczystości z rzeki"],
                multiple: true
            },
{
                reto: 83,
                id: "R83-Av34km-pl",
                tipo: "opcion",
                pregunta: "Na szczycie wież powiewa flaga Walencji: jej kolory to czerwony, żółty i… ",
                opciones: ["Fioletowy","Zielony","Niebieski"],
                correctas: ["Niebieski"],
                multiple: null
            },
{
                reto: 84,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
{
                reto: 85,
                id: "R85-Av34km-pl",
                tipo: "opcion",
                pregunta: "Czemu poświęcone jest muzeum?",
                opciones: ["Architektura","Historia","Nauki przyrodnicze"],
                correctas: ["Nauki przyrodnicze"],
                multiple: false
            },
{
                reto: 86,
                id: "R86-Av34km-pl",
                tipo: "opcion",
                pregunta: "Jaka figura zdobi fontannę?",
                opciones: ["Kaczka","Bocian","Ryba"],
                correctas: ["Bocian"],
                multiple: false
            },
{
                reto: 87,
                id: "R87-Av34km-pl",
                tipo: "texto",
                pregunta: "Na tej fasadzie jest zegar. Którą godzinę pokazuje?",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 88,
                id: "R88-Av34km-pl",
                tipo: "opcion",
                pregunta: "Co trzyma figura w swojej dłoni?",
                opciones: ["Harfa", "Tarcza", "Dzban", "Miecz"],
                correctas: ["Tarcza"],
                multiple: false
            },
{
                reto: 89,
                id: "R89-Av34km-pl",
                tipo: "opcion",
                pregunta: "89. Co trzyma święty Wawrzyniec w swojej ręce?",
                opciones: ["Gołąb", "Łyżka", "Ruszt"],
                correctas: ["Ruszt"],
                multiple: false
            },
{
                reto: 90,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        pt: [
            // Array de retos Aventura34km (PT)
{
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
{
                reto: 1,
                id: "R1-Av34km-pt",
                tipo: "opcion",
                pregunta: "1. Quantas aventuras podem ser feitas com Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 2,
                id: "R2-Av34km-pt",
                tipo: "opcion",
                pregunta: "2. É um bom momento para começar a sua aventura?",
                opciones: ["Sim", "Não"],
                correctas: ["?"],
                multiple: false
            },
{
                reto: 3,
                id: "R3-Av34km-pt",
                tipo: "opcion",
                pregunta: "3. Pode dizer-me como se chamam estas torres?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
{
                reto: 4,
                id: "PZ-19",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-19"
            },
{
                reto: 5,
                id: "R5-Av34km-pt",
                tipo: "opcion",
                pregunta: "Saberia dizer-me como se chamam estas festas populares de Valência?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
{
                reto: 6,
                id: "R6-Av34km-pt",
                tipo: "opcion",
                pregunta: "A natureza esculpiu o brasão de Valência. O que se pode ver em cima?",
                opciones: ["Um escudo", "Um morcego", "Um dragão"],
                correctas: ["Um morcego"],
                multiple: false
            },
{
                reto: 7,
                id: "R7-Av34km-pt",
                tipo: "texto",
                pregunta: "Consegue adivinhar quantos degraus tem?",
                correctas: ["16"],
                multiple: false
            },
{
                reto: 8,
                id: "R8-Av34km-pt",
                tipo: "opcion",
                pregunta: "Que tipo de árvores pode tocar agora mesmo?",
                opciones: ["Oliveiras", "Laranjeiras", "Palmeiras"],
                correctas: ["Palmeiras"],
                multiple: false
            },
{
                reto: 9,
                id: "R9-Av34km-pt",
                tipo: "texto",
                pregunta: "Saberia dizer-me o preço para aceder a esta atração?",
                correctas: ["gratis"],
                multiple: false
            },
{
                reto: 10,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
{
                reto: 11,
                id: "R11-Av34km-pt",
                tipo: "opcion",
                pregunta: "De quantos monumentos se compõe a Cidade das Artes e das Ciências?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
{
                reto: 12,
                id: "R12-Av34km-pt",
                tipo: "opcion",
                pregunta: "Do que é feita a Orxata?",
                opciones: ["Chufa", "Cevada", "Arroz"],
                correctas: ["Chufa"],
                multiple: false
            },
{
                reto: 13,
                id: "R13-Av34km-pt",
                tipo: "opcion",
                pregunta: "O que rodeia a base da ponte?",
                opciones: ["Água", "Erva", "Patos"],
                correctas: ["Água"],
                multiple: false
            },
{
                reto: 14,
                id: "R14-Av34km-pt",
                tipo: "opcion",
                pregunta: "Recorda-se que animal coroa o brasão de Valência?",
                opciones: ["Morcego", "Dragão", "Leão"],
                correctas: ["Morcego"],
                multiple: false
            },
{
                reto: 15,
                id: "R15-Av34km-pt",
                tipo: "opcion",
                pregunta: "O que se pode ver na locomotiva?",
                opciones: ["Um dragão","Uma estrela","Uma data"],
                correctas: ["Uma estrela"],
                multiple: false
            },
{
                reto: 16,
                id: "R16-Av34km-pt",
                tipo: "opcion-multiple",
                pregunta: "Que elementos podem ser vistos nesta cena?",
                opciones: ["Um fallero e uma Fallera","Laranjas","Uva"],
                correctas: ["Um fallero e uma Fallera","Laranjas","Uva"],
                multiple: true
            },
{
                reto: 17,
                id: "R17-Av34km-pt",
                tipo: "opcion-multiple",
                pregunta: "O que pode ser?",
                opciones: ["Pão de forma","Caranguejos","Maçãs"],
                correctas: ["Pão de forma","Caranguejos"],
                multiple: true
            },
{
                reto: 18,
                id: "R18-Av34km-pt",
                tipo: "texto",
                pregunta: "Quantos animais consegue contar? Entre eles há vacas, porcos…",
                correctas: ["?"]
            },
{
                reto: 19,
                id: "PZ-20",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-20"
            },
{
                reto: 20,
                id: "R20-Av34km-pt",
                tipo: "texto",
                pregunta: "Quantos andares tem este Monumento?",
                correctas: ["4"]
            },
{
                reto: 21,
                id: "R21-Av34km-pt",
                tipo: "opcion",
                pregunta: "Que Fruto Cítrico natural de Valência decora a fachada?",
                opciones: ["Limões","Toranjas","Laranjas"],
                correctas: ["Laranjas"],
                multiple: false
            },
{
                reto: 22,
                id: "R22-Av34km-pt",
                tipo: "texto",
                pregunta: "Consegue encontrar o seu idioma?",
                correctas: ["¿sí? ¿No?"]
            },
{
                reto: 23,
                id: "R23-Av34km-pt",
                tipo: "opcion",
                pregunta: "23. Recorda que animal coroa o brasão municipal?",
                opciones: ["Um dragão", "Um morcego", "Um cavalo"],
                correctas: ["Um morcego"],
                multiple: false
            },
{
                reto: 24,
                id: "R24-Av34km-pt",
                tipo: "opcion-multiple",
                pregunta: "24. Sobre a entrada principal, num arco de volta perfeita, figuras alegóricas representam os cinco continentes. O que segura a figura central?",
                opciones: ["Uma tocha", "Uma espada", "Uma coroa"],
                correctas: ["Uma tocha", "Uma espada"],
                multiple: true
            },
{
                reto: 25,
                id: "R25-Av34km-pt",
                tipo: "opcion",
                pregunta: "25. O que segura a figura na mão?",
                opciones: ["Uma balança", "Um livro", "Uma pena"],
                correctas: ["Uma balança"],
                multiple: false
            },
{
                reto: 26,
                id: "R26-Av34km-pt",
                tipo: "texto",
                pregunta: "26. Quantos andares tem o edifício?",
                correctas: ["10"]
            },
{
                reto: 27,
                id: "R27-Av34km-pt",
                tipo: "opcion",
                pregunta: "27. Procure o vitral com as cores da Senyera valenciana na fachada do edifício. Consegue determinar a sua forma?",
                opciones: ["Quadrangular", "Redonda", "Triangular"],
                correctas: ["Redonda"],
                multiple: false
            },
{
                reto: 28,
                id: "R28-Av34km-pt",
                tipo: "opcion-multiple",
                pregunta: "28. O que segura a Virgem na sua mão?",
                opciones: ["Um rosário", "Uma criança", "Uma coroa"],
                correctas: ["Um rosário", "Uma criança"],
                multiple: true
            },
{
                reto: 29,
                id: "R29-Av34km-pt",
                tipo: "opcion",
                pregunta: "29. O que dá o anjo à criança?",
                opciones: ["Uma pomba", "Um orbe", "Alimentos"],
                correctas: ["Um orbe"],
                multiple: false
            },
{
                reto: 30,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
{
                reto: 31,
                id: "R31-Av34km-pt",
                tipo: "opcion-multiple",
                pregunta: "31. O barqueiro que rema contra a corrente.",
                opciones: ["Um homem com rosto triste a conduzir um pequeno barco de madeira foge contra a corrente de um monstro."],
                correctas: ["Um homem com rosto triste a conduzir um pequeno barco de madeira foge contra a corrente de um monstro."],
                multiple: true
            },
{
                reto: 32,
                id: "R32-Av34km-pt",
                tipo: "opcion-multiple",
                pregunta: "32. Uma árvore morta: símbolo do Pecado, vê-se entre as duas folhas da porta e cumpre a função de parteluz.",
                opciones: ["Observe no topo da árvore como 4 homens nus se açoitam entre si."],
                correctas: ["Observe no topo da árvore como 4 homens nus se açoitam entre si."],
                multiple: true
            },
{
                reto: 33,
                id: "R33-Av34km-pt",
                tipo: "opcion-multiple",
                pregunta: "33. À direita, um anjo mostra o seu pénis e...",
                opciones: ["...prepara-se para o introduzir num vaso que segura com a outra mão. Estranho e incomum, não lhe parece?"],
                correctas: ["...prepara-se para o introduzir num vaso que segura com a outra mão. Estranho e incomum, não lhe parece?"],
                multiple: true
            },
{
                reto: 34,
                id: "R34-Av34km-pt",
                tipo: "opcion-multiple",
                pregunta: "34. No centro: O homem barbudo e o leão:",
                opciones: ["Cena original e contraditória na qual o manso é precisamente o leão e não o velho barbudo."],
                correctas: ["Cena original e contraditória na qual o manso é precisamente o leão e não o velho barbudo."],
                multiple: true
            },
{
                reto: 35,
                id: "R35-Av34km-pt",
                tipo: "opcion-multiple",
                pregunta: "35. Aqui vai um desafio extra! Procure o fornicador da Lonja da Seda!",
                opciones: ["Numa das suas janelas, encontrará um homem esculpido; a sua cabeça não é visível mas os seus genitais estão, muito claramente."],
                correctas: ["Numa das suas janelas, encontrará um homem esculpido; a sua cabeça não é visível mas os seus genitais estão, muito claramente."],
                multiple: true
            },
{
                reto: 36,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
{
                reto: 37,
                id: "R37-Av34km-pt",
                tipo: "texto",
                pregunta: "37. Qual é a largura da entrada do edifício estreito?",
                correctas: ["1,35 metros"]
            },
{
                reto: 38,
                id: "R38-Av34km-pt",
                tipo: "opcion-multiple",
                pregunta: "38. Três arcos cegos. Dois deles são lisos, o terceiro ficou sem reboco.<br>O que se pode ver nesse arco sem reboco?",
                opciones: ["Um rosto", "Um torso", "Uma gárgula"],
                correctas: ["Um rosto", "Um torso"],
                multiple: true
            },
{
                reto: 39,
                id: "R39-Av34km-pt",
                tipo: "opcion",
                pregunta: "39. O que há no cimo da torre barroca de Santa Catalina?",
                opciones: ["Uma cruz", "O sol", "Uma pomba"],
                correctas: ["Uma cruz"],
                multiple: false
            },
{
                reto: 40,
                id: "R40-Av34km-pt",
                tipo: "texto",
                pregunta: "40. De que cor são as telhas da cúpula da torre barroca de Santa Catalina?",
                correctas: ["azules"]
            },
{
                reto: 41,
                id: "R41-Av34km-pt",
                tipo: "opcion",
                pregunta: "41. Consegue determinar que geometria tem a Torre do Miguelete de Valência?",
                opciones: ["Hexagonal", "Octogonal", "Quadrangular"],
                correctas: ["Octogonal"],
                multiple: false
            },
{
                reto: 42,
                id: "R42-Av34km-pt",
                tipo: "texto",
                pregunta: "42. Quantas janelas consegue ver?",
                correctas: ["?"]
            },
{
                reto: 43,
                id: "R43-Av34km-pt",
                tipo: "opcion-multiple",
                pregunta: "43. O que se pode ver a mais de 35 metros de altura no topo da fachada barroca?",
                opciones: ["Uma esfera", "Um morcego", "Uma cruz", "Um cavalo"],
                correctas: ["Uma esfera", "Uma cruz"],
                multiple: true
            },
{
                reto: 44,
                id: "R44-Av34km-pt",
                tipo: "texto",
                pregunta: "Quantos arcos compõem a porta?",
                correctas: ["8"],
                multiple: false
            },
{
                reto: 45,
                id: "R45-Av34km-pt",
                tipo: "opcion",
                pregunta: "45. Que figura esculpida se pode ver na moldura do quadro?",
                opciones: ["Um dragão", "Um morcego", "Uma coroa"],
                correctas: ["Uma coroa"],
                multiple: false
            },
{
                reto: 46,
                id: "R46-Av34km-pt",
                tipo: "opcion-multiple",
                pregunta: "46. O que se pode ver no interior?",
                opciones: ["Um altar", "Uma bandeira", "Uma espada"],
                correctas: ["Um altar", "Uma bandeira"],
                multiple: true
            },
{
                reto: 47,
                id: "R47-Av34km-pt",
                tipo: "texto",
                pregunta: "47. Há uma placa comemorativa neste local. Em que ano foi colocada?",
                correctas: ["1952"]
            },
{
                reto: 48,
                id: "R48-Av34km-pt",
                tipo: "texto",
                pregunta: "48. Em que ano foi construído este edifício? Dica: olhe para a parte superior da fachada.",
                correctas: ["1906"]
            },
{
                reto: 49,
                id: "R49-Av34km-pt",
                tipo: "opcion",
                pregunta: "49. Olhando para a imagem de San Valero, que objeto poderia dizer-nos que ele esteve preso?",
                opciones: ["As correntes", "O livro", "O seu rosto triste"],
                correctas: ["As correntes"],
                multiple: false
            },
{
                reto: 50,
                id: "R50-Av34km-pt",
                tipo: "opcion",
                pregunta: "50. O que se pode ver no interior?",
                opciones: ["Uma praça de touros", "Banhos romanos", "Uma estação de metro"],
                correctas: ["Banhos romanos"],
                multiple: false
            },
{
                reto: 51,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
{
                reto: 52,
                id: "R52-Av34km-pt",
                tipo: "opcion",
                pregunta: "52. Consegue determinar a sua geometria?",
                opciones: ["Hexagonal", "Octogonal", "Quadrangular"],
                correctas: ["Hexagonal"],
                multiple: false
            },
{
                reto: 53,
                id: "R53-Av34km-pt",
                tipo: "opcion",
                pregunta: "53. Com que mão Neptuno segura a cornucópia?",
                opciones: ["Esquerda", "Direita"],
                correctas: ["Direita"],
                multiple: false
            },
{
                reto: 54,
                id: "R54-Av34km-pt",
                tipo: "texto",
                pregunta: "54. Quantas figuras rodeiam a fonte?",
                correctas: ["8"]
            },
{
                reto: 55,
                id: "R55-Av34km-pt",
                tipo: "opcion",
                pregunta: "55. Qual das duas torres do Palacio de la Generalitat acham que é a mais nova: a da praça ou esta que têm à vossa frente agora?",
                opciones: ["A da praça", "Esta à vossa frente"],
                correctas: ["Esta à vossa frente"],
                multiple: false
            },
{
                reto: 56,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
{
                reto: 57,
                id: "R57-Av34km-pt",
                tipo: "opcion-multiple",
                pregunta: "57. O que se pode ver neste painel de cerâmica? São caveiras? É uma cruz? Há também uma pomba?",
                opciones: ["Caveiras", "Pombas", "Cruz"],
                correctas: ["Caveiras", "Cruz"],
                multiple: true
            },
{
                reto: 58,
                id: "R58-Av34km-pt",
                tipo: "opcion",
                pregunta: "58. Quantos sinos tem esta torre?",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
{
                reto: 59,
                id: "R59-Av34km-pt",
                tipo: "opcion",
                pregunta: "59. O que a figura segura nas mãos?",
                opciones: ["Um escudo", "Uma concha", "Um jarro", "Uma espada"],
                correctas: ["Uma concha"],
                multiple: false
            },
{
                reto: 60,
                id: "R60-Av34km-pt",
                tipo: "opcion",
                pregunta: "60. Que direção toma o caminho estabelecido?",
                opciones: ["Norte", "Sul", "Leste", "Oeste"],
                correctas: ["Norte"],
                multiple: false
            },
{
                reto: 61,
                id: "R61-Av34km-pt",
                tipo: "opcion",
                pregunta: "61. Quantas portas tinha a antiga muralha árabe de Balansiya?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 62,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
{
                reto: 63,
                id: "R63-Av34km-pt",
                tipo: "opcion",
                pregunta: "Acima da verga da porta destaca-se o brasão da Ordem do Carmo.",
                opciones: ["Uma Coroa","Uma Cruz","Uma Estrela"],
                correctas: ["Uma Coroa"],
                multiple: false
            },
{
                reto: 64,
                id: "R64-Av34km-pt",
                tipo: "opcion",
                pregunta: "O que porta a Virgem nos braços?",
                opciones: ["Um Coração","Uma Pomba","Menino Jesus"],
                correctas: ["Menino Jesus"],
                multiple: false
            },
{
                reto: 65,
                id: "R65-Av34km-pt",
                tipo: "opcion-multiple",
                pregunta: "O que porta Santa Teresa nas suas mãos?",
                opciones: ["Uma pena","Uma espada","Um livro","Uma jarra"],
                correctas: ["Uma pena","Um livro"],
                multiple: true
            },
{
                reto: 66,
                id: "R66-Av34km-pt",
                tipo: "texto",
                pregunta: "Quanto custa a entrada neste museu?",
                correctas: ["Grátis"]
            },
{
                reto: 67,
                id: "R67-Av34km-pt",
                tipo: "opcion",
                pregunta: "Quantos gatos podem ser vistos representados no painel?",
                opciones: ["3","4","5"],
                correctas: ["4"],
                multiple: false
            },
{
                reto: 68,
                id: "R68-Av34km-pt",
                tipo: "texto",
                pregunta: "Que altura indica este painel?",
                correctas: ["1,90 metros"]
            },
{
                reto: 69,
                id: "R69-Av34km-pt",
                tipo: "texto",
                pregunta: "Que ano indica o painel superior?",
                correctas: ["2100"]
            },
{
                reto: 70,
                id: "R70-Av34km-pt",
                tipo: "opcion",
                pregunta: "O que coroa o escudo?",
                opciones: ["Uma coroa","Um morcego","Um dragão"],
                correctas: ["Uma coroa"],
                multiple: false
            },
{
                reto: 71,
                id: "R71-Av34km-pt",
                tipo: "texto",
                pregunta: "Quantas perfurações de projéteis consegue contabilizar?",
                correctas: ["?"]
            },
{
                reto: 72,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
{
                reto: 73,
                id: "R73-Av34km-pt",
                tipo: "opcion",
                pregunta: "Que forma tem a fonte?",
                opciones: ["Concha","Peixe","Pessoa"],
                correctas: ["Pessoa"],
                multiple: false
            },
{
                reto: 74,
                id: "R74-Av34km-pt",
                tipo: "texto",
                pregunta: "Em que ano começaram as obras? Olhe para a fachada!",
                correctas: ["1400"]
            },
{
                reto: 75,
                id: "R75-Av34km-pt",
                tipo: "texto",
                pregunta: "Sabe me dizer o ano da sua última reabilitação? Certamente já o viu!",
                correctas: ["2012"]
            },
{
                reto: 76,
                id: "R76-Av34km-pt",
                tipo: "texto",
                pregunta: "Em que ano foram realizadas essas obras? Precisa de uma Pista? Olhe para a fachada do edifício.",
                correctas: ["1756"]
            },
{
                reto: 77,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
{
                reto: 78,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
{
                reto: 79,
                id: "R79-Av34km-pt",
                tipo: "opcion",
                pregunta: "Sabe me dizer o nome deste antigo rio?",
                opciones: ["Turia","Júcar","Segura","Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
{
                reto: 80,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
{
                reto: 81,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
{
                reto: 82,
                id: "R82-Av34km-pt",
                tipo: "opcion-multiple",
                pregunta: "Que usos podem ter esses ressaltos?",
                opciones: ["Parar a água","Deter as rodas das carroças","Recolher as impurezas do rio"],
                correctas: ["Deter as rodas das carroças","Recolher as impurezas do rio"],
                multiple: true
            },
{
                reto: 83,
                id: "R83-Av34km-pt",
                tipo: "opcion",
                pregunta: "No cume das torres ondeia a bandeira de Valência: as suas cores compõem-se de vermelho, amarelo e… ",
                opciones: ["Violeta","Verde","Azul"],
                correctas: ["Azul"],
                multiple: null
            },
{
                reto: 84,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
{
                reto: 85,
                id: "R85-Av34km-pt",
                tipo: "opcion",
                pregunta: "A que está dedicado o museu?",
                opciones: ["Arquitetura","História","Ciências Naturais"],
                correctas: ["Ciências Naturais"],
                multiple: false
            },
{
                reto: 86,
                id: "R86-Av34km-pt",
                tipo: "opcion",
                pregunta: "Que figura decora a fonte?",
                opciones: ["Um pato","Uma cegonha","Um peixe"],
                correctas: ["Uma cegonha"],
                multiple: false
            },
{
                reto: 87,
                id: "R87-Av34km-pt",
                tipo: "texto",
                pregunta: "Nesta fachada há um relógio. Que horas marca?",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 88,
                id: "R88-Av34km-pt",
                tipo: "opcion",
                pregunta: "O que segura a figura na sua mão?",
                opciones: ["Harpa", "Escudo", "Jarro", "Espada"],
                correctas: ["Escudo"],
                multiple: false
            },
{
                reto: 89,
                id: "R89-Av34km-pt",
                tipo: "opcion",
                pregunta: "89. O que tem São Lourenço na mão?",
                opciones: ["Uma pomba", "Uma colher", "Uma grelha"],
                correctas: ["Uma grelha"],
                multiple: false
            },
{
                reto: 90,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        ru: [
            // Array de retos Aventura34km (RU)
{
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
{
                reto: 1,
                id: "R1-Av34km-ru",
                tipo: "opcion",
                pregunta: "1. Сколько приключений можно совершить с Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 2,
                id: "R2-Av34km-ru",
                tipo: "opcion",
                pregunta: "2. Сейчас хороший момент для начала приключения?",
                opciones: ["Да", "Нет"],
                correctas: ["?"],
                multiple: false
            },
{
                reto: 3,
                id: "R3-Av34km-ru",
                tipo: "opcion",
                pregunta: "3. Вы можете назвать мне, как называются эти башни?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
{
                reto: 4,
                id: "PZ-19",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-19"
            },
{
                reto: 5,
                id: "R5-Av34km-ru",
                tipo: "opcion",
                pregunta: "Вы знаете, как называются эти популярные праздники в Валенсии?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
{
                reto: 6,
                id: "R6-Av34km-ru",
                tipo: "opcion",
                pregunta: "Природа выточила герб Валенсии. Что можно увидеть наверху?",
                opciones: ["Щит", "Летучая мышь", "Дракон"],
                correctas: ["Летучая мышь"],
                multiple: false
            },
{
                reto: 7,
                id: "R7-Av34km-ru",
                tipo: "texto",
                pregunta: "Вы можете угадать, сколько здесь ступеней?",
                correctas: ["16"],
                multiple: false
            },
{
                reto: 8,
                id: "R8-Av34km-ru",
                tipo: "opcion",
                pregunta: "Какие деревья вы можете потрогать прямо сейчас?",
                opciones: ["Оливковые деревья", "Апельсиновые деревья", "Пальмы"],
                correctas: ["Пальмы"],
                multiple: false
            },
{
                reto: 9,
                id: "R9-Av34km-ru",
                tipo: "texto",
                pregunta: "Вы знаете, сколько стоит вход в эту достопримечательность?",
                correctas: ["gratis"],
                multiple: false
            },
{
                reto: 10,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
{
                reto: 11,
                id: "R11-Av34km-ru",
                tipo: "opcion",
                pregunta: "Из скольких монументов состоит Город искусств и наук?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
{
                reto: 12,
                id: "R12-Av34km-ru",
                tipo: "opcion",
                pregunta: "Из чего сделана Orxata?",
                opciones: ["Chufa", "Ячмень", "Рис"],
                correctas: ["Chufa"],
                multiple: false
            },
{
                reto: 13,
                id: "R13-Av34km-ru",
                tipo: "opcion",
                pregunta: "Что окружает основание моста?",
                opciones: ["Вода", "Трава", "Утки"],
                correctas: ["Вода"],
                multiple: false
            },
{
                reto: 14,
                id: "R14-Av34km-ru",
                tipo: "opcion",
                pregunta: "Вы помните, какое животное венчает герб Валенсии?",
                opciones: ["Летучая мышь", "Дракон", "Лев"],
                correctas: ["Летучая мышь"],
                multiple: false
            },
{
                reto: 15,
                id: "R15-Av34km-ru",
                tipo: "opcion",
                pregunta: "Что можно увидеть на локомотиве?",
                opciones: ["Дракон","Звезда","Дата"],
                correctas: ["Звезда"],
                multiple: false
            },
{
                reto: 16,
                id: "R16-Av34km-ru",
                tipo: "opcion-multiple",
                pregunta: "Какие элементы можно увидеть на этой сцене?",
                opciones: ["Фальеро и Фальера","Апельсины","Виноград"],
                correctas: ["Фальеро и Фальера","Апельсины","Виноград"],
                multiple: true
            },
{
                reto: 17,
                id: "R17-Av34km-ru",
                tipo: "opcion-multiple",
                pregunta: "Что это может быть?",
                opciones: ["Буханка хлеба","Крабы","Яблоки"],
                correctas: ["Буханка хлеба","Крабы"],
                multiple: true
            },
{
                reto: 18,
                id: "R18-Av34km-ru",
                tipo: "texto",
                pregunta: "Сколько животных можно насчитать? Среди них коровы, свиньи…",
                correctas: ["?"]
            },
{
                reto: 19,
                id: "PZ-20",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-20"
            },
{
                reto: 20,
                id: "R20-Av34km-ru",
                tipo: "texto",
                pregunta: "Сколько этажей у этого Монумента?",
                correctas: ["4"]
            },
{
                reto: 21,
                id: "R21-Av34km-ru",
                tipo: "opcion",
                pregunta: "Каким натуральным цитрусовым фруктом из Валенсии украшен фасад?",
                opciones: ["Лимоны","Грейпфруты","Апельсины"],
                correctas: ["Апельсины"],
                multiple: false
            },
{
                reto: 22,
                id: "R22-Av34km-ru",
                tipo: "texto",
                pregunta: "Можете ли вы найти свой язык?",
                correctas: ["¿sí? ¿No?"]
            },
{
                reto: 23,
                id: "R23-Av34km-ru",
                tipo: "opcion",
                pregunta: "23. Помните ли вы, какое животное венчает городской герб?",
                opciones: ["Дракон", "Летучая мышь", "Конь"],
                correctas: ["Летучая мышь"],
                multiple: false
            },
{
                reto: 24,
                id: "R24-Av34km-ru",
                tipo: "opcion-multiple",
                pregunta: "24. Над главным входом, в полуциркульной арке, аллегорические фигуры представляют пять континентов. Что держит центральная фигура?",
                opciones: ["Факел", "Меч", "Корона"],
                correctas: ["Факел", "Меч"],
                multiple: true
            },
{
                reto: 25,
                id: "R25-Av34km-ru",
                tipo: "opcion",
                pregunta: "25. Что держит фигура в своей руке?",
                opciones: ["Весы", "Книга", "Перо"],
                correctas: ["Весы"],
                multiple: false
            },
{
                reto: 26,
                id: "R26-Av34km-ru",
                tipo: "texto",
                pregunta: "26. Сколько этажей в здании?",
                correctas: ["10"]
            },
{
                reto: 27,
                id: "R27-Av34km-ru",
                tipo: "opcion",
                pregunta: "27. Найдите витраж с цветами валенсийской Сеньеры на фасаде здания. Можете ли вы определить его форму?",
                opciones: ["Четырёхугольная", "Круглая", "Треугольная"],
                correctas: ["Круглая"],
                multiple: false
            },
{
                reto: 28,
                id: "R28-Av34km-ru",
                tipo: "opcion-multiple",
                pregunta: "28. Что держит Дева Мария в своей руке?",
                opciones: ["Чётки", "Ребёнок", "Корона"],
                correctas: ["Чётки", "Ребёнок"],
                multiple: true
            },
{
                reto: 29,
                id: "R29-Av34km-ru",
                tipo: "opcion",
                pregunta: "29. Что даёт ангел ребёнку?",
                opciones: ["Голубь", "Держава", "Еда"],
                correctas: ["Держава"],
                multiple: false
            },
{
                reto: 30,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
{
                reto: 31,
                id: "R31-Av34km-ru",
                tipo: "opcion-multiple",
                pregunta: "31. Лодочник, гребущий против течения.",
                opciones: ["Грустный мужчина, управляющий маленькой деревянной лодкой, спасается от монстра, плывя против течения."],
                correctas: ["Грустный мужчина, управляющий маленькой деревянной лодкой, спасается от монстра, плывя против течения."],
                multiple: true
            },
{
                reto: 32,
                id: "R32-Av34km-ru",
                tipo: "opcion-multiple",
                pregunta: "32. Мёртвое дерево: символ Греха, видно между двумя створками двери и служит средником.",
                opciones: ["Посмотрите на вершину дерева, где 4 обнажённых мужчины хлещут друг друга."],
                correctas: ["Посмотрите на вершину дерева, где 4 обнажённых мужчины хлещут друг друга."],
                multiple: true
            },
{
                reto: 33,
                id: "R33-Av34km-ru",
                tipo: "opcion-multiple",
                pregunta: "33. Справа, ангел демонстрирует свой пенис и...",
                opciones: ["...собирается ввести его в вазу, которую держит другой рукой. Странно и необычно, не правда ли?"],
                correctas: ["...собирается ввести его в вазу, которую держит другой рукой. Странно и необычно, не правда ли?"],
                multiple: true
            },
{
                reto: 34,
                id: "R34-Av34km-ru",
                tipo: "opcion-multiple",
                pregunta: "34. В центре: Бородатый мужчина и лев:",
                opciones: ["Оригинальная и противоречивая сцена, в которой кротким оказывается именно лев, а не бородатый старец."],
                correctas: ["Оригинальная и противоречивая сцена, в которой кротким оказывается именно лев, а не бородатый старец."],
                multiple: true
            },
{
                reto: 35,
                id: "R35-Av34km-ru",
                tipo: "opcion-multiple",
                pregunta: "35. Вот дополнительное испытание! Найдите блудника Шёлковой биржи!",
                opciones: ["В одном из её окон вы найдёте высеченного мужчину; его голова не видна, но гениталии видны очень отчётливо."],
                correctas: ["В одном из её окон вы найдёте высеченного мужчину; его голова не видна, но гениталии видны очень отчётливо."],
                multiple: true
            },
{
                reto: 36,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
{
                reto: 37,
                id: "R37-Av34km-ru",
                tipo: "texto",
                pregunta: "37. Какова ширина входа в узкое здание?",
                correctas: ["1,35 metros"]
            },
{
                reto: 38,
                id: "R38-Av34km-ru",
                tipo: "opcion-multiple",
                pregunta: "38. Три глухих арки. Две из них гладкие, третья осталась без штукатурки.<br>Что можно увидеть в этой неоштукатуренной арке?",
                opciones: ["Лицо", "Торс", "Горгулья"],
                correctas: ["Лицо", "Торс"],
                multiple: true
            },
{
                reto: 39,
                id: "R39-Av34km-ru",
                tipo: "opcion",
                pregunta: "39. Что находится на самом верху барочной башни Санта-Каталина?",
                opciones: ["Крест", "Солнце", "Голубь"],
                correctas: ["Крест"],
                multiple: false
            },
{
                reto: 40,
                id: "R40-Av34km-ru",
                tipo: "texto",
                pregunta: "40. Какого цвета черепица купола барочной башни Санта-Каталина?",
                correctas: ["azules"]
            },
{
                reto: 41,
                id: "R41-Av34km-ru",
                tipo: "opcion",
                pregunta: "41. Вы могли бы определить геометрическую форму башни Мигелете в Валенсии?",
                opciones: ["Шестиугольная", "Восьмиугольная", "Четырёхугольная"],
                correctas: ["Восьмиугольная"],
                multiple: false
            },
{
                reto: 42,
                id: "R42-Av34km-ru",
                tipo: "texto",
                pregunta: "42. Сколько окон вы можете увидеть?",
                correctas: ["?"]
            },
{
                reto: 43,
                id: "R43-Av34km-ru",
                tipo: "opcion-multiple",
                pregunta: "43. Что можно увидеть на высоте более 35 метров на вершине барочного фасада?",
                opciones: ["Сфера", "Летучая мышь", "Крест", "Лошадь"],
                correctas: ["Сфера", "Крест"],
                multiple: true
            },
{
                reto: 44,
                id: "R44-Av34km-ru",
                tipo: "texto",
                pregunta: "Из скольких арок состоят ворота?",
                correctas: ["8"],
                multiple: false
            },
{
                reto: 45,
                id: "R45-Av34km-ru",
                tipo: "opcion",
                pregunta: "45. Какую скульптурную фигуру можно увидеть в раме картины?",
                opciones: ["Дракон", "Летучая мышь", "Корона"],
                correctas: ["Корона"],
                multiple: false
            },
{
                reto: 46,
                id: "R46-Av34km-ru",
                tipo: "opcion-multiple",
                pregunta: "46. Что можно увидеть внутри?",
                opciones: ["Алтарь", "Флаг", "Меч"],
                correctas: ["Алтарь", "Флаг"],
                multiple: true
            },
{
                reto: 47,
                id: "R47-Av34km-ru",
                tipo: "texto",
                pregunta: "47. На нём есть памятная табличка. В каком году она была установлена?",
                correctas: ["1952"]
            },
{
                reto: 48,
                id: "R48-Av34km-ru",
                tipo: "texto",
                pregunta: "48. В каком году было построено это здание? Подсказка: посмотрите на верхнюю часть фасада.",
                correctas: ["1906"]
            },
{
                reto: 49,
                id: "R49-Av34km-ru",
                tipo: "opcion",
                pregunta: "49. Глядя на изображение Сан-Валеро, какой предмет мог бы сказать нам, что он был заключён в тюрьму?",
                opciones: ["Цепи", "Книга", "Его печальное лицо"],
                correctas: ["Цепи"],
                multiple: false
            },
{
                reto: 50,
                id: "R50-Av34km-ru",
                tipo: "opcion",
                pregunta: "50. Что можно увидеть внутри?",
                opciones: ["Арена для боя быков", "Римские бани", "Станция метро"],
                correctas: ["Римские бани"],
                multiple: false
            },
{
                reto: 51,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
{
                reto: 52,
                id: "R52-Av34km-ru",
                tipo: "opcion",
                pregunta: "52. Можете ли вы определить его геометрическую форму?",
                opciones: ["Шестиугольная", "Восьмиугольная", "Четырёхугольная"],
                correctas: ["Шестиугольная"],
                multiple: false
            },
{
                reto: 53,
                id: "R53-Av34km-ru",
                tipo: "opcion",
                pregunta: "53. Какой рукой Нептун держит рог изобилия?",
                opciones: ["Левой", "Правой"],
                correctas: ["Правой"],
                multiple: false
            },
{
                reto: 54,
                id: "R54-Av34km-ru",
                tipo: "texto",
                pregunta: "54. Сколько фигур окружает фонтан?",
                correctas: ["8"]
            },
{
                reto: 55,
                id: "R55-Av34km-ru",
                tipo: "opcion",
                pregunta: "55. Какая из двух башен Дворца Хенералитат, по-вашему, новее: та, что на площади, или та, что сейчас перед вами?",
                opciones: ["Та, что на площади", "Та, что перед вами"],
                correctas: ["Та, что перед вами"],
                multiple: false
            },
{
                reto: 56,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
{
                reto: 57,
                id: "R57-Av34km-ru",
                tipo: "opcion-multiple",
                pregunta: "57. Что можно увидеть на этой керамической панели? Это черепа? Это крест? Есть ли там голубь?",
                opciones: ["Черепа", "Голуби", "Крест"],
                correctas: ["Черепа", "Крест"],
                multiple: true
            },
{
                reto: 58,
                id: "R58-Av34km-ru",
                tipo: "opcion",
                pregunta: "58. Сколько колоколов в этой башне?",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
{
                reto: 59,
                id: "R59-Av34km-ru",
                tipo: "opcion",
                pregunta: "59. Что держит фигура в руках?",
                opciones: ["Щит", "Раковину", "Кувшин", "Меч"],
                correctas: ["Раковину"],
                multiple: false
            },
{
                reto: 60,
                id: "R60-Av34km-ru",
                tipo: "opcion",
                pregunta: "60. В каком направлении идёт установленный путь?",
                opciones: ["Север", "Юг", "Восток", "Запад"],
                correctas: ["Север"],
                multiple: false
            },
{
                reto: 61,
                id: "R61-Av34km-ru",
                tipo: "opcion",
                pregunta: "61. Сколько ворот было в старой арабской стене Балансии?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 62,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
{
                reto: 63,
                id: "R63-Av34km-ru",
                tipo: "opcion",
                pregunta: "Над притолокой двери выделяется герб Ордена Кармелитов.",
                opciones: ["Корона","Крест","Звезда"],
                correctas: ["Корона"],
                multiple: false
            },
{
                reto: 64,
                id: "R64-Av34km-ru",
                tipo: "opcion",
                pregunta: "Что держит Богородица на руках?",
                opciones: ["Сердце","Голубь","Младенец Иисус"],
                correctas: ["Младенец Иисус"],
                multiple: false
            },
{
                reto: 65,
                id: "R65-Av34km-ru",
                tipo: "opcion-multiple",
                pregunta: "Что держит святая Тереза в своих руках?",
                opciones: ["Перо","Меч","Книга","Кувшин"],
                correctas: ["Перо","Книга"],
                multiple: true
            },
{
                reto: 66,
                id: "R66-Av34km-ru",
                tipo: "texto",
                pregunta: "Сколько стоит вход в этот музей?",
                correctas: ["Бесплатно"]
            },
{
                reto: 67,
                id: "R67-Av34km-ru",
                tipo: "opcion",
                pregunta: "Сколько кошек можно увидеть на панели?",
                opciones: ["3","4","5"],
                correctas: ["4"],
                multiple: false
            },
{
                reto: 68,
                id: "R68-Av34km-ru",
                tipo: "texto",
                pregunta: "Какую высоту показывает эта панель?",
                correctas: ["1,90 metros"]
            },
{
                reto: 69,
                id: "R69-Av34km-ru",
                tipo: "texto",
                pregunta: "Какой год указывает верхняя панель?",
                correctas: ["2100"]
            },
{
                reto: 70,
                id: "R70-Av34km-ru",
                tipo: "opcion",
                pregunta: "Что венчает герб?",
                opciones: ["Корона","Летучая мышь","Дракон"],
                correctas: ["Корона"],
                multiple: false
            },
{
                reto: 71,
                id: "R71-Av34km-ru",
                tipo: "texto",
                pregunta: "Сколько пулевых отверстий вы можете насчитать?",
                correctas: ["?"]
            },
{
                reto: 72,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
{
                reto: 73,
                id: "R73-Av34km-ru",
                tipo: "opcion",
                pregunta: "Какую форму имеет фонтан?",
                opciones: ["Ракушка","Рыба","Человек"],
                correctas: ["Человек"],
                multiple: false
            },
{
                reto: 74,
                id: "R74-Av34km-ru",
                tipo: "texto",
                pregunta: "В каком году началось строительство? Посмотрите на фасад!",
                correctas: ["1400"]
            },
{
                reto: 75,
                id: "R75-Av34km-ru",
                tipo: "texto",
                pregunta: "Можете ли вы назвать год последней реставрации? Вы наверняка уже видели это!",
                correctas: ["2012"]
            },
{
                reto: 76,
                id: "R76-Av34km-ru",
                tipo: "texto",
                pregunta: "В каком году проводились эти работы? Нужна подсказка? Посмотрите на фасад здания.",
                correctas: ["1756"]
            },
{
                reto: 77,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
{
                reto: 78,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
{
                reto: 79,
                id: "R79-Av34km-ru",
                tipo: "opcion",
                pregunta: "Можете ли вы назвать мне имя этой древней реки?",
                opciones: ["Turia","Júcar","Segura","Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
{
                reto: 80,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
{
                reto: 81,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
{
                reto: 82,
                id: "R82-Av34km-ru",
                tipo: "opcion-multiple",
                pregunta: "Для чего могут использоваться эти пороги?",
                opciones: ["Остановить воду","Остановить колёса повозок","Собирать грязь из реки"],
                correctas: ["Остановить колёса повозок","Собирать грязь из реки"],
                multiple: true
            },
{
                reto: 83,
                id: "R83-Av34km-ru",
                tipo: "opcion",
                pregunta: "На вершине башен развевается флаг Валенсии: его цвета состоят из красного, жёлтого и… ",
                opciones: ["Фиолетового","Зелёного","Синего"],
                correctas: ["Синего"],
                multiple: null
            },
{
                reto: 84,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
{
                reto: 85,
                id: "R85-Av34km-ru",
                tipo: "opcion",
                pregunta: "Чему посвящён музей?",
                opciones: ["Архитектура","История","Естественные науки"],
                correctas: ["Естественные науки"],
                multiple: false
            },
{
                reto: 86,
                id: "R86-Av34km-ru",
                tipo: "opcion",
                pregunta: "Какая фигура украшает фонтан?",
                opciones: ["Утка","Аист","Рыба"],
                correctas: ["Аист"],
                multiple: false
            },
{
                reto: 87,
                id: "R87-Av34km-ru",
                tipo: "texto",
                pregunta: "На этом фасаде есть часы. Который час они показывают?",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 88,
                id: "R88-Av34km-ru",
                tipo: "opcion",
                pregunta: "Что держит фигура в своей руке?",
                opciones: ["Арфа", "Щит", "Кувшин", "Меч"],
                correctas: ["Щит"],
                multiple: false
            },
{
                reto: 89,
                id: "R89-Av34km-ru",
                tipo: "opcion",
                pregunta: "89. Что держит святой Лаврентий в руке?",
                opciones: ["Голубь", "Ложка", "Решётка"],
                correctas: ["Решётка"],
                multiple: false
            },
{
                reto: 90,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        uk: [
            // Array de retos Aventura34km (UK)
{
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-intro"
            },
{
                reto: 1,
                id: "R1-Av34km-uk",
                tipo: "opcion",
                pregunta: "1. Скільки пригод можна здійснити з Valencia be Guides?",
                opciones: ["4", "5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 2,
                id: "R2-Av34km-uk",
                tipo: "opcion",
                pregunta: "2. Чи зараз гарний момент для початку пригоди?",
                opciones: ["Так", "Ні"],
                correctas: ["?"],
                multiple: false
            },
{
                reto: 3,
                id: "R3-Av34km-uk",
                tipo: "opcion",
                pregunta: "3. Чи можете ви сказати мені, як називаються ці вежі?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
{
                reto: 4,
                id: "PZ-19",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-19"
            },
{
                reto: 5,
                id: "R5-Av34km-uk",
                tipo: "opcion",
                pregunta: "Ви знаєте, як називаються ці популярні свята у Валенсії?",
                opciones: ["Las Fallas", "La Tomatina", "Las Hogueras de San Juan"],
                correctas: ["Las Fallas"],
                multiple: false
            },
{
                reto: 6,
                id: "R6-Av34km-uk",
                tipo: "opcion",
                pregunta: "Природа вирізьбила герб Валенсії. Що можна побачити вгорі?",
                opciones: ["Щит", "Кажан", "Дракон"],
                correctas: ["Кажан"],
                multiple: false
            },
{
                reto: 7,
                id: "R7-Av34km-uk",
                tipo: "texto",
                pregunta: "Чи можете ви вгадати, скільки тут сходинок?",
                correctas: ["16"],
                multiple: false
            },
{
                reto: 8,
                id: "R8-Av34km-uk",
                tipo: "opcion",
                pregunta: "Які дерева ви можете торкнутися прямо зараз?",
                opciones: ["Оливкові дерева", "Апельсинові дерева", "Пальми"],
                correctas: ["Пальми"],
                multiple: false
            },
{
                reto: 9,
                id: "R9-Av34km-uk",
                tipo: "texto",
                pregunta: "Ви знаєте, скільки коштує вхід до цієї пам'ятки?",
                correctas: ["gratis"],
                multiple: false
            },
{
                reto: 10,
                id: "PZ-09",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-09"
            },
{
                reto: 11,
                id: "R11-Av34km-uk",
                tipo: "opcion",
                pregunta: "З скількох монументів складається Місто мистецтв і наук?",
                opciones: ["5", "6", "7"],
                correctas: ["6"],
                multiple: false
            },
{
                reto: 12,
                id: "R12-Av34km-uk",
                tipo: "opcion",
                pregunta: "З чого зроблена Orxata?",
                opciones: ["Chufa", "Ячмінь", "Рис"],
                correctas: ["Chufa"],
                multiple: false
            },
{
                reto: 13,
                id: "R13-Av34km-uk",
                tipo: "opcion",
                pregunta: "Що оточує підніжжя мосту?",
                opciones: ["Вода", "Трава", "Качки"],
                correctas: ["Вода"],
                multiple: false
            },
{
                reto: 14,
                id: "R14-Av34km-uk",
                tipo: "opcion",
                pregunta: "Ви пам'ятаєте, яка тварина прикрашає герб Валенсії?",
                opciones: ["Кажан", "Дракон", "Лев"],
                correctas: ["Кажан"],
                multiple: false
            },
{
                reto: 15,
                id: "R15-Av34km-uk",
                tipo: "opcion",
                pregunta: "Що можна побачити на локомотиві?",
                opciones: ["Дракон","Зірка","Дата"],
                correctas: ["Зірка"],
                multiple: false
            },
{
                reto: 16,
                id: "R16-Av34km-uk",
                tipo: "opcion-multiple",
                pregunta: "Які елементи можна побачити на цій сцені?",
                opciones: ["Фальєро та Фальєра","Апельсини","Виноград"],
                correctas: ["Фальєро та Фальєра","Апельсини","Виноград"],
                multiple: true
            },
{
                reto: 17,
                id: "R17-Av34km-uk",
                tipo: "opcion-multiple",
                pregunta: "Що це може бути?",
                opciones: ["Буханець хліба","Краби","Яблука"],
                correctas: ["Буханець хліба","Краби"],
                multiple: true
            },
{
                reto: 18,
                id: "R18-Av34km-uk",
                tipo: "texto",
                pregunta: "Скільки тварин ви можете порахувати? Серед них корови, свині…",
                correctas: ["?"]
            },
{
                reto: 19,
                id: "PZ-20",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-20"
            },
{
                reto: 20,
                id: "R20-Av34km-uk",
                tipo: "texto",
                pregunta: "Скільки поверхів у цьому Монументі?",
                correctas: ["4"]
            },
{
                reto: 21,
                id: "R21-Av34km-uk",
                tipo: "opcion",
                pregunta: "Яким натуральним цитрусовим фруктом з Валенсії прикрашений фасад?",
                opciones: ["Лимони","Грейпфрути","Апельсини"],
                correctas: ["Апельсини"],
                multiple: false
            },
{
                reto: 22,
                id: "R22-Av34km-uk",
                tipo: "texto",
                pregunta: "Чи можете ви знайти свою мову?",
                correctas: ["¿sí? ¿No?"]
            },
{
                reto: 23,
                id: "R23-Av34km-uk",
                tipo: "opcion",
                pregunta: "23. Чи пам'ятаєте ви, яка тварина прикрашає міський герб?",
                opciones: ["Дракон", "Кажан", "Кінь"],
                correctas: ["Кажан"],
                multiple: false
            },
{
                reto: 24,
                id: "R24-Av34km-uk",
                tipo: "opcion-multiple",
                pregunta: "24. Над головним входом, у напівкруглій арці, алегоричні фігури представляють п'ять континентів. Що тримає центральна фігура?",
                opciones: ["Смолоскип", "Меч", "Корона"],
                correctas: ["Смолоскип", "Меч"],
                multiple: true
            },
{
                reto: 25,
                id: "R25-Av34km-uk",
                tipo: "opcion",
                pregunta: "25. Що тримає фігура в своїй руці?",
                opciones: ["Терези", "Книга", "Перо"],
                correctas: ["Терези"],
                multiple: false
            },
{
                reto: 26,
                id: "R26-Av34km-uk",
                tipo: "texto",
                pregunta: "26. Скільки поверхів у будівлі?",
                correctas: ["10"]
            },
{
                reto: 27,
                id: "R27-Av34km-uk",
                tipo: "opcion",
                pregunta: "27. Знайдіть вітраж з кольорами валенсійської Сеньєри на фасаді будівлі. Чи можете ви визначити його форму?",
                opciones: ["Чотирикутна", "Кругла", "Трикутна"],
                correctas: ["Кругла"],
                multiple: false
            },
{
                reto: 28,
                id: "R28-Av34km-uk",
                tipo: "opcion-multiple",
                pregunta: "28. Що тримає Діва Марія у своїй руці?",
                opciones: ["Вервиця", "Дитина", "Корона"],
                correctas: ["Вервиця", "Дитина"],
                multiple: true
            },
{
                reto: 29,
                id: "R29-Av34km-uk",
                tipo: "opcion",
                pregunta: "29. Що дає ангел дитині?",
                opciones: ["Голуб", "Держава", "Їжа"],
                correctas: ["Держава"],
                multiple: false
            },
{
                reto: 30,
                id: "PZ-04",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-04"
            },
{
                reto: 31,
                id: "R31-Av34km-uk",
                tipo: "opcion-multiple",
                pregunta: "31. Поромник, що гребе проти течії.",
                opciones: ["Сумний чоловік, який керує невеликим дерев'яним човном, тікає від монстра проти течії."],
                correctas: ["Сумний чоловік, який керує невеликим дерев'яним човном, тікає від монстра проти течії."],
                multiple: true
            },
{
                reto: 32,
                id: "R32-Av34km-uk",
                tipo: "opcion-multiple",
                pregunta: "32. Мертве дерево: символ Гріха, видно між двома стулками дверей і виконує функцію центрального стовпа.",
                opciones: ["Подивіться на вершину дерева, де 4 оголених чоловіки шмагають один одного."],
                correctas: ["Подивіться на вершину дерева, де 4 оголених чоловіки шмагають один одного."],
                multiple: true
            },
{
                reto: 33,
                id: "R33-Av34km-uk",
                tipo: "opcion-multiple",
                pregunta: "33. Праворуч, ангел демонструє свій статевий орган і...",
                opciones: ["...збирається ввести його у вазу, яку тримає іншою рукою. Дивно і незвично, правда?"],
                correctas: ["...збирається ввести його у вазу, яку тримає іншою рукою. Дивно і незвично, правда?"],
                multiple: true
            },
{
                reto: 34,
                id: "R34-Av34km-uk",
                tipo: "opcion-multiple",
                pregunta: "34. У центрі: Бородатий чоловік і лев:",
                opciones: ["Оригінальна і суперечлива сцена, в якій лагідним є саме лев, а не бородатий старий."],
                correctas: ["Оригінальна і суперечлива сцена, в якій лагідним є саме лев, а не бородатий старий."],
                multiple: true
            },
{
                reto: 35,
                id: "R35-Av34km-uk",
                tipo: "opcion-multiple",
                pregunta: "35. Ось додатковий виклик! Знайдіть блудника Шовкової біржі!",
                opciones: ["В одному з її вікон ви знайдете висіченого чоловіка; його голова не видно, але геніталії дуже чітко видно."],
                correctas: ["В одному з її вікон ви знайдете висіченого чоловіка; його голова не видно, але геніталії дуже чітко видно."],
                multiple: true
            },
{
                reto: 36,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
{
                reto: 37,
                id: "R37-Av34km-uk",
                tipo: "texto",
                pregunta: "37. Яка ширина входу вузького будинку?",
                correctas: ["1,35 metros"]
            },
{
                reto: 38,
                id: "R38-Av34km-uk",
                tipo: "opcion-multiple",
                pregunta: "38. Три глухі арки. Дві з них гладкі, третя залишилась без штукатурки.<br>Що можна побачити в цій нетинькованій арці?",
                opciones: ["Обличчя", "Торс", "Гаргулья"],
                correctas: ["Обличчя", "Торс"],
                multiple: true
            },
{
                reto: 39,
                id: "R39-Av34km-uk",
                tipo: "opcion",
                pregunta: "39. Що знаходиться на самому верху барокової вежі Санта-Каталіна?",
                opciones: ["Хрест", "Сонце", "Голуб"],
                correctas: ["Хрест"],
                multiple: false
            },
{
                reto: 40,
                id: "R40-Av34km-uk",
                tipo: "texto",
                pregunta: "40. Якого кольору черепиця купола барокової вежі Санта-Каталіна?",
                correctas: ["azules"]
            },
{
                reto: 41,
                id: "R41-Av34km-uk",
                tipo: "opcion",
                pregunta: "41. Чи могли б ви визначити геометричну форму вежі Мігелете у Валенсії?",
                opciones: ["Шестикутна", "Восьмикутна", "Чотирикутна"],
                correctas: ["Восьмикутна"],
                multiple: false
            },
{
                reto: 42,
                id: "R42-Av34km-uk",
                tipo: "texto",
                pregunta: "42. Скільки вікон ви можете побачити?",
                correctas: ["?"]
            },
{
                reto: 43,
                id: "R43-Av34km-uk",
                tipo: "opcion-multiple",
                pregunta: "43. Що можна побачити на висоті понад 35 метрів на вершині барокового фасаду?",
                opciones: ["Сфера", "Кажан", "Хрест", "Кінь"],
                correctas: ["Сфера", "Хрест"],
                multiple: true
            },
{
                reto: 44,
                id: "R44-Av34km-uk",
                tipo: "texto",
                pregunta: "З скількох арок складаються ворота?",
                correctas: ["8"],
                multiple: false
            },
{
                reto: 45,
                id: "R45-Av34km-uk",
                tipo: "opcion",
                pregunta: "45. Яку скульптурну фігуру можна побачити в рамі картини?",
                opciones: ["Дракон", "Кажан", "Корона"],
                correctas: ["Корона"],
                multiple: false
            },
{
                reto: 46,
                id: "R46-Av34km-uk",
                tipo: "opcion-multiple",
                pregunta: "46. Що можна побачити всередині?",
                opciones: ["Вівтар", "Прапор", "Меч"],
                correctas: ["Вівтар", "Прапор"],
                multiple: true
            },
{
                reto: 47,
                id: "R47-Av34km-uk",
                tipo: "texto",
                pregunta: "47. На ньому є меморіальна табличка. В якому році вона була встановлена?",
                correctas: ["1952"]
            },
{
                reto: 48,
                id: "R48-Av34km-uk",
                tipo: "texto",
                pregunta: "48. В якому році було збудовано цю будівлю? Підказка: подивіться на верхню частину фасаду.",
                correctas: ["1906"]
            },
{
                reto: 49,
                id: "R49-Av34km-uk",
                tipo: "opcion",
                pregunta: "49. Дивлячись на зображення Сан-Валеро, який предмет міг би сказати нам, що він був ув'язнений?",
                opciones: ["Кайдани", "Книга", "Його сумне обличчя"],
                correctas: ["Кайдани"],
                multiple: false
            },
{
                reto: 50,
                id: "R50-Av34km-uk",
                tipo: "opcion",
                pregunta: "50. Що можна побачити всередині?",
                opciones: ["Арена для кориди", "Римські лазні", "Станція метро"],
                correctas: ["Римські лазні"],
                multiple: false
            },
{
                reto: 51,
                id: "PZ-02",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-02"
            },
{
                reto: 52,
                id: "R52-Av34km-uk",
                tipo: "opcion",
                pregunta: "52. Чи можете ви визначити його геометричну форму?",
                opciones: ["Шестикутна", "Восьмикутна", "Чотирикутна"],
                correctas: ["Шестикутна"],
                multiple: false
            },
{
                reto: 53,
                id: "R53-Av34km-uk",
                tipo: "opcion",
                pregunta: "53. Якою рукою Нептун тримає ріг достатку?",
                opciones: ["Лівою", "Правою"],
                correctas: ["Правою"],
                multiple: false
            },
{
                reto: 54,
                id: "R54-Av34km-uk",
                tipo: "texto",
                pregunta: "54. Скільки фігур оточує фонтан?",
                correctas: ["8"]
            },
{
                reto: 55,
                id: "R55-Av34km-uk",
                tipo: "opcion",
                pregunta: "55. Яка з двох веж Палацу Хенералітат, на вашу думку, новіша: та, що на площі, чи та, що зараз перед вами?",
                opciones: ["Та, що на площі", "Та, що перед вами"],
                correctas: ["Та, що перед вами"],
                multiple: false
            },
{
                reto: 56,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
{
                reto: 57,
                id: "R57-Av34km-uk",
                tipo: "opcion-multiple",
                pregunta: "57. Що можна побачити на цій керамічній панелі? Це черепи? Це хрест? Є також голуб?",
                opciones: ["Черепи", "Голуби", "Хрест"],
                correctas: ["Черепи", "Хрест"],
                multiple: true
            },
{
                reto: 58,
                id: "R58-Av34km-uk",
                tipo: "opcion",
                pregunta: "58. Скільки дзвонів у цій вежі?",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
{
                reto: 59,
                id: "R59-Av34km-uk",
                tipo: "opcion",
                pregunta: "59. Що тримає фігура в руках?",
                opciones: ["Щит", "Мушлю", "Глечик", "Меч"],
                correctas: ["Мушлю"],
                multiple: false
            },
{
                reto: 60,
                id: "R60-Av34km-uk",
                tipo: "opcion",
                pregunta: "60. В якому напрямку проходить встановлений маршрут?",
                opciones: ["Північ", "Південь", "Схід", "Захід"],
                correctas: ["Північ"],
                multiple: false
            },
{
                reto: 61,
                id: "R61-Av34km-uk",
                tipo: "opcion",
                pregunta: "61. Скільки воріт мала стара арабська стіна Балансії?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
{
                reto: 62,
                id: "PZ-18",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-18"
            },
{
                reto: 63,
                id: "R63-Av34km-uk",
                tipo: "opcion",
                pregunta: "Над притолокою дверей виділяється герб Ордену Кармелітів.",
                opciones: ["Корона","Хрест","Зірка"],
                correctas: ["Корона"],
                multiple: false
            },
{
                reto: 64,
                id: "R64-Av34km-uk",
                tipo: "opcion",
                pregunta: "Що несе Богородиця на руках?",
                opciones: ["Серце","Голуб","Немовля Ісус"],
                correctas: ["Немовля Ісус"],
                multiple: false
            },
{
                reto: 65,
                id: "R65-Av34km-uk",
                tipo: "opcion-multiple",
                pregunta: "Що тримає свята Тереза в своїх руках?",
                opciones: ["Перо","Меч","Книга","Глечик"],
                correctas: ["Перо","Книга"],
                multiple: true
            },
{
                reto: 66,
                id: "R66-Av34km-uk",
                tipo: "texto",
                pregunta: "Скільки коштує вхід до цього музею?",
                correctas: ["Безкоштовно"]
            },
{
                reto: 67,
                id: "R67-Av34km-uk",
                tipo: "opcion",
                pregunta: "Скільки котів можна побачити на панелі?",
                opciones: ["3","4","5"],
                correctas: ["4"],
                multiple: false
            },
{
                reto: 68,
                id: "R68-Av34km-uk",
                tipo: "texto",
                pregunta: "Яку висоту показує ця панель?",
                correctas: ["1,90 metros"]
            },
{
                reto: 69,
                id: "R69-Av34km-uk",
                tipo: "texto",
                pregunta: "Який рік вказує верхня панель?",
                correctas: ["2100"]
            },
{
                reto: 70,
                id: "R70-Av34km-uk",
                tipo: "opcion",
                pregunta: "Що вінчає герб?",
                opciones: ["Корона","Кажан","Дракон"],
                correctas: ["Корона"],
                multiple: false
            },
{
                reto: 71,
                id: "R71-Av34km-uk",
                tipo: "texto",
                pregunta: "Скільки пробоїн від куль ви можете порахувати?",
                correctas: ["?"]
            },
{
                reto: 72,
                id: "PZ-15",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-15"
            },
{
                reto: 73,
                id: "R73-Av34km-uk",
                tipo: "opcion",
                pregunta: "Яку форму має фонтан?",
                opciones: ["Мушля","Риба","Людина"],
                correctas: ["Людина"],
                multiple: false
            },
{
                reto: 74,
                id: "R74-Av34km-uk",
                tipo: "texto",
                pregunta: "У якому році розпочалися будівельні роботи? Подивіться на фасад!",
                correctas: ["1400"]
            },
{
                reto: 75,
                id: "R75-Av34km-uk",
                tipo: "texto",
                pregunta: "Чи можете ви назвати рік останньої реставрації? Ви напевно вже це бачили!",
                correctas: ["2012"]
            },
{
                reto: 76,
                id: "R76-Av34km-uk",
                tipo: "texto",
                pregunta: "У якому році проводилися ці роботи? Потрібна підказка? Подивіться на фасад будівлі.",
                correctas: ["1756"]
            },
{
                reto: 77,
                id: "PZ-14",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-14"
            },
{
                reto: 78,
                id: "PZ-10",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-10"
            },
{
                reto: 79,
                id: "R79-Av34km-uk",
                tipo: "opcion",
                pregunta: "Чи можете ви назвати мені ім'я цієї стародавньої річки?",
                opciones: ["Turia","Júcar","Segura","Ebro"],
                correctas: ["Turia"],
                multiple: false
            },
{
                reto: 80,
                id: "PZ-11",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-11"
            },
{
                reto: 81,
                id: "PZ-12",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-12"
            },
{
                reto: 82,
                id: "R82-Av34km-uk",
                tipo: "opcion-multiple",
                pregunta: "Для чого можуть використовуватися ці пороги?",
                opciones: ["Зупинити воду","Зупинити колеса возів","Збирати бруд з річки"],
                correctas: ["Зупинити колеса возів","Збирати бруд з річки"],
                multiple: true
            },
{
                reto: 83,
                id: "R83-Av34km-uk",
                tipo: "opcion",
                pregunta: "На вершині веж майорить прапор Валенсії: його кольори складаються з червоного, жовтого і… ",
                opciones: ["Фіолетового","Зеленого","Синього"],
                correctas: ["Синього"],
                multiple: null
            },
{
                reto: 84,
                id: "PZ-13",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-13"
            },
{
                reto: 85,
                id: "R85-Av34km-uk",
                tipo: "opcion",
                pregunta: "Чому присвячений музей?",
                opciones: ["Архітектура","Історія","Природничі науки"],
                correctas: ["Природничі науки"],
                multiple: false
            },
{
                reto: 86,
                id: "R86-Av34km-uk",
                tipo: "opcion",
                pregunta: "Яка фігура прикрашає фонтан?",
                opciones: ["Качка","Лелека","Риба"],
                correctas: ["Лелека"],
                multiple: false
            },
{
                reto: 87,
                id: "R87-Av34km-uk",
                tipo: "texto",
                pregunta: "На цьому фасаді є годинник. Котра година на ньому?",
                correctas: ["?"],
                multiple: false
            },
{
                reto: 88,
                id: "R88-Av34km-uk",
                tipo: "opcion",
                pregunta: "Що тримає фігура у своїй руці?",
                opciones: ["Арфа", "Щит", "Глечик", "Меч"],
                correctas: ["Щит"],
                multiple: false
            },
{
                reto: 89,
                id: "R89-Av34km-uk",
                tipo: "opcion",
                pregunta: "89. Що тримає святий Лаврентій у руці?",
                opciones: ["Голуб", "Ложка", "Решітка"],
                correctas: ["Решітка"],
                multiple: false
            },
{
                reto: 90,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ]
    }
};

// Para uso en entornos CommonJS (Node.js) y navegador
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RETOS_AVENTURAS };
} else {
    globalThis.RETOS_AVENTURAS = RETOS_AVENTURAS;
}
