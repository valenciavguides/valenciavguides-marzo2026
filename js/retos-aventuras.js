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
                pregunta: "Puzzle INTRO",
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
                pregunta: "9. Plaza de la Virgen",
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
                pregunta: "15. Plaza de la Almoína",
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
                pregunta: "20. Plaza de Toros y Estación del Norte",
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
                pregunta: "24. ¿Cuantas plantas tiene el edificio?",
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
                pregunta: "28. Lonja de la Seda",
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
                pregunta: "34. ¿Qué sostiene el niño en sus manos?",
                opciones: ["Una paloma", "Una Concha", "Alimentos"],
                correctas: ["Una Concha"],
                multiple: false
            },
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                pregunta: "35. Torres de Serranos",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        en: [
            // Array de retos Aventura1 INGLÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                pregunta: "Puzzle INTRO",
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
                pregunta: "9. Plaza de la Virgen",
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
                pregunta: "15. Plaza de la Almoína",
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
                pregunta: "20. Plaza de Toros y Estación del Norte",
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
                pregunta: "28. The ferryman rowing against the current.",
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
                pregunta: "34. What does the child hold in his hands?",
                opciones: ["A Dove", "A Shell", "Food"],
                correctas: ["A Shell"],
                multiple: false
            },
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        fr: [
            // Array de retos Aventura1 FRANCÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                pregunta: "Puzzle INTRO",
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
                pregunta: "8. Plaza de la Virgen",
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
                pregunta: "14. Plaza de la Almoína",
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
                pregunta: "19. Plaza de Toros y Estación del Norte",
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
                pregunta: "27. Le batelier qui rame à contre-courant.",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 29,
                id: "R29-Av1-fr",
                tipo: "opcion-multiple",
                pregunta: "28. Le batelier qui rame à contre-courant.",
                opciones: ["Un homme au visage triste dirige un petit bateau en bois pour échapper à contre-courant à un monstre."],
                correctas: ["Un homme au visage triste dirige un petit bateau en bois pour échapper à contre-courant à un monstre."],
                multiple: true
            },
            {
                reto: 30,
                id: "R30-Av1-fr",
                tipo: "opcion-multiple",
                pregunta: "29. Un arbre mort : symbole du péché, se trouve entre les deux feuilles de la porte et fait office de meneau.",
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
                pregunta: "31. Au centre : L'homme barbu et le lion :",
                opciones: ["Scène originale et contradictoire où le doux est précisément le lion et non le vieil homme barbu."],
                correctas: ["Scène originale et contradictoire où le doux est précisément le lion et non le vieil homme barbu."],
                multiple: true
            },
            {
                reto: 33,
                id: "R33-Av1-fr",
                tipo: "opcion-multiple",
                pregunta: "32. Voici un défi supplémentaire ! Cherchez le fornicateur de la Bourse de la soie !",
                opciones: ["Dans une de ses fenêtres, vous trouverez un homme sculpté ; sa tête n'est pas visible mais ses parties génitales le sont, très clairement."],
                correctas: ["Dans une de ses fenêtres, vous trouverez un homme sculpté ; sa tête n'est pas visible mais ses parties génitales le sont, très clairement."],
                multiple: true
            },
            {
                reto: 34,
                id: "R34-Av1-fr",
                tipo: "opcion",
                pregunta: "33. Que tient l'enfant dans ses mains ?",
                opciones: ["Une colombe", "Une coquille", "Des aliments"],
                correctas: ["Une coquille"],
                multiple: false
            },
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        it: [
            // Array de retos Aventura1 ITALIANO
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                pregunta: "Puzzle INTRO",
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
                pregunta: "8. Plaza de la Virgen",
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
                pregunta: "14. Plaza de la Almoína",
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
                pregunta: "19. Plaza de Toros y Estación del Norte",
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
                pregunta: "27. Lonja de la Seda",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 29,
                id: "R29-Av1-it",
                tipo: "opcion-multiple",
                pregunta: "28. Il barcaiolo che rema controcorrente.",
                opciones: ["Un uomo con volto triste che manovra una piccola barca di legno fugge controcorrente da un mostro."],
                correctas: ["Un uomo con volto triste che manovra una piccola barca di legno fugge controcorrente da un mostro."],
                multiple: true
            },
            {
                reto: 30,
                id: "R30-Av1-it",
                tipo: "opcion-multiple",
                pregunta: "29. Un albero morto: simbolo del Peccato, si vede tra le due foglie della porta e funge da parteluz.",
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
                pregunta: "31. Al centro: L'uomo barbuto e il leone:",
                opciones: ["Scena originale e contraddittoria in cui il mansueto è proprio il leone e non il vecchio uomo barbuto."],
                correctas: ["Scena originale e contraddittoria in cui il mansueto è proprio il leone e non il vecchio uomo barbuto."],
                multiple: true
            },
            {
                reto: 33,
                id: "R33-Av1-it",
                tipo: "opcion-multiple",
                pregunta: "32. Ecco una sfida extra! Cerca il fornicatore della Lonja della Seta!",
                opciones: ["In una delle sue finestre, troverai un uomo scolpito; la sua testa non è visibile ma i suoi genitali lo sono, molto chiaramente."],
                correctas: ["In una delle sue finestre, troverai un uomo scolpito; la sua testa non è visibile ma i suoi genitali lo sono, molto chiaramente."],
                multiple: true
            },
            {
                reto: 34,
                id: "R34-Av1-it",
                tipo: "opcion",
                pregunta: "33. Cosa tiene il bambino nelle sue mani?",
                opciones: ["Una colomba", "Una conchiglia", "Cibo"],
                correctas: ["Una conchiglia"],
                multiple: false
            },
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        nl: [
            // Array de retos Aventura1 HOLANDÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                pregunta: "Puzzle INTRO",
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
                pregunta: "8. Plaza de la Virgen",
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
                pregunta: "14. Plaza de la Almoína",
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
                pregunta: "19. Plaza de Toros y Estación del Norte",
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
                pregunta: "27. Lonja de la Seda",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 29,
                id: "R29-Av1-nl",
                tipo: "opcion-multiple",
                pregunta: "28. De veerman die tegen de stroom in roeit.",
                opciones: ["Een man met een verdrietig gezin die een klein houten boot bestuurt ontsnapt tegen de stroom van een monster."],
                correctas: ["Een man met een verdrietig gezin die een klein houten boot bestuurt ontsnapt tegen de stroom van een monster."],
                multiple: true
            },
            {
                reto: 30,
                id: "R30-Av1-nl",
                tipo: "opcion-multiple",
                pregunta: "29. Een dode boom: symbool van Zonde, is te zien tussen de twee bladeren van de deur en fungeert als middenstijl.",
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
                pregunta: "31. In het midden: De baardige man en de leeuw:",
                opciones: ["Origineel en tegenstrijdig tafereel waarin de zachte precies de leeuw is en niet de baardige oude man."],
                correctas: ["Origineel en tegenstrijdig tafereel waarin de zachte precies de leeuw is en niet de baardige oude man."],
                multiple: true
            },
            {
                reto: 33,
                id: "R33-Av1-nl",
                tipo: "opcion-multiple",
                pregunta: "32. Hier is een extra uitdaging! Zoek de fornicator in de Zijdehal!",
                opciones: ["In een van zijn ramen vindt u een uitgehouwen man; zijn hoofd is niet zichtbaar maar zijn genitaliën zijn, heel duidelijk."],
                correctas: ["In een van zijn ramen vindt u een uitgehouwen man; zijn hoofd is niet zichtbaar maar zijn genitaliën zijn, heel duidelijk."],
                multiple: true
            },
            {
                reto: 34,
                id: "R34-Av1-nl",
                tipo: "opcion",
                pregunta: "33. Wat houdt het kind in zijn handen?",
                opciones: ["Een duif", "Een schelp", "Voedsel"],
                correctas: ["Een schelp"],
                multiple: false
            },
            {
                reto: 35,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ],
        ja: [
            // Array de retos Aventura1 JAPONÉS
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                pregunta: "Puzzle INTRO",
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
                pregunta: "8. Plaza de la Virgen",
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
                reto: 12,
                id: "R12-Av1-ja",
                tipo: "texto",
                pregunta: "12. この建物は何年に建てられましたか？ヒント：ファサードの上部を見てください。",
                correctas: ["1906"]
            },
            {
                reto: 13,
                id: "R13-Av1-ja",
                tipo: "opcion",
                pregunta: "13. 内部には何が見えますか？",
                opciones: ["闘牛場", "ローマ風浴場", "地下鉄駅"],
                correctas: ["ローマ風浴場"],
                multiple: false
            },
            {
                reto: 14,
                id: "PZ-02",
                tipo: "puzzle",
                pregunta: "14. Plaza de la Almoína",
                src: "puzzle.html?id=PZ-02"
            },
            {
                reto: 15,
                id: "R15-Av1-ja",
                tipo: "opcion",
                pregunta: "15. 形状を判定できますか？",
                opciones: ["「六角形」,「八角形」,「四角形」r"],
                correctas: ["「六角形」"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av1-ja",
                tipo: "texto",
                pregunta: "16. 門はいくつのアーチで構成されていますか？",
                correctas: ["6"]
            },
            {
                reto: 17,
                id: "R17-Av1-ja",
                tipo: "opcion",
                pregunta: "17. 市章の上にいる動物を覚えていますか？",
                opciones: ["ドラゴン", "コウモリ", "馬"],
                correctas: ["コウモリ"],
                multiple: false
            },
            {
                reto: 18,
                id: "R18-Av1-ja",
                tipo: "opcion",
                pregunta: "18. 第一の塔のファサードに注目！どの柑橘類が装飾されていますか？",
                opciones: ["レモン", "グレープフルーツ", "オレンジ"],
                correctas: ["オレンジ"],
                multiple: false
            },
            {
                reto: 19,
                id: "PZ-03",
                tipo: "puzzle",
                pregunta: "19. Plaza de Toros y Estación del Norte",
                src: "puzzle.html?id=PZ-03"
            },
            {
                reto: 20,
                id: "R20-Av1-ja",
                tipo: "texto",
                pregunta: "20. この建物にはどの商店が入っていますか？",
                correctas: ["?"]
            },
            {
                reto: 21,
                id: "R21-Av1-ja",
                tipo: "opcion-multiple",
                pregunta: "21. 正面入口の上の半円アーチには、5大陸を表す寓意的な像があります。中央の像は何を持っていますか？",
                opciones: ["たいまつ", "剣", "王冠"],
                correctas: ["たいまつ", "剣"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av1-ja",
                tipo: "opcion",
                pregunta: "22. この像は手に何を持っていますか？",
                opciones: ["天秤", "本", "羽ペン"],
                correctas: ["天秤"],
                multiple: false
            },
            {
                reto: 23,
                id: "R23-Av1-ja",
                tipo: "texto",
                pregunta: "22. 建物は何階建てですか？",
                correctas: ["10"]
            },
            {
                reto: 24,
                id: "R24-Av1-ja",
                tipo: "opcion",
                pregunta: "23. ファサードのバレンシアのセニェーラの色のステンドグラスを探してください。形状は何ですか？",
                opciones: ["「四角形」,「円形」,「三角形」"],
                correctas: ["「円形」"],
                multiple: false
            },
            {
                reto: 25,
                id: "R25-Av1-ja",
                tipo: "opcion-multiple",
                pregunta: "24. 聖母は手に何を持っていますか？",
                opciones: ["ロザリオ", "子供", "王冠"],
                correctas: ["ロザリオ", "子供"],
                multiple: true
            },
            {
                reto: 26,
                id: "R26-Av1-ja",
                tipo: "opcion",
                pregunta: "26. 天使は子供に何を渡していますか？",
                opciones: ["鳩", "オーブ", "食べ物"],
                correctas: ["オーブ"],
                multiple: false
            },
            {
                reto: 27,
                id: "PZ-04",
                tipo: "puzzle",
                pregunta: "27. Lonja de la Seda (ラ・ロンハ・デ・ラ・セダ)",
                src: "puzzle.html?id=PZ-04"
            },
            {
                reto: 28,
                id: "R28-Av1-ja",
                tipo: "opcion-multiple",
                pregunta: "28. 死んだ木：罪の象徴、門の2枚の扉の間にあり、中央の柱として機能しています。",
                opciones: ["木の頂上で4人の裸の男性がお互いを鞭打つ様子を観察してください。"],
                correctas: ["木の頂上で4人の裸の男性がお互いを鞭打つ様子を観察してください。"],
                multiple: true
            },
            {
                reto: 29,
                id: "R29-Av1-ja",
                tipo: "opcion-multiple",
                pregunta: "29. 右側、天使が陰茎を見せて…",
                opciones: ["もう片方の手で持つ花瓶に挿入しようとしている。不思議で異常ですよね？"],
                correctas: ["もう片方の手で持つ花瓶に挿入しようとしている。不思議で異常ですよね？"],
                multiple: true
            },
            {
                reto: 30,
                id: "R30-Av1-ja",
                tipo: "opcion-multiple",
                pregunta: "30. 中央：ひげの男とライオン：",
                opciones: ["穏やかなのはライオンであり、ひげの老人ではない、という独特で矛盾した場面。"],
                correctas: ["穏やかなのはライオンであり、ひげの老人ではない、という独特で矛盾した場面。"],
                multiple: true
            },
            {
                reto: 31,
                id: "R31-Av1-ja",
                tipo: "opcion-multiple",
                pregunta: "31. ここで追加チャレンジ！絹の取引所の乱交者を探してください！",
                opciones: ["窓の一つに彫刻された男性がいます。頭は見えませんが、性器ははっきり見えます。"],
                correctas: ["窓の一つに彫刻された男性がいます。頭は見えませんが、性器ははっきり見えます。"],
                multiple: true
            },
            {
                reto: 32,
                id: "R32-Av1-ja",
                tipo: "opcion-multiple",
                pregunta: "32. 「追加のチャレンジがあります！ラ・ロンハ・デ・ラ・セダの好色な人物を探してみてください！」",
                opciones: ["「その窓の一つには彫刻された男性が見つかります。彼の頭は見えませんが、性器は非常にはっきりと見えます。」"],
                correctas: ["「その窓の一つには彫刻された男性が見つかります。彼の頭は見えませんが、性器は非常にはっきりと見えます。」"],
                multiple: true
            },
            {
                reto: 33,
                id: "R33-Av1-ja",
                tipo: "opcion",
                pregunta: "33. 「その子どもは手に何を持っていますか？」",
                opciones: ["「一羽の鳩」「貝殻」「食べ物」"],
                correctas: ["「貝殻」"],
                multiple: false
            },
            {
                reto: 34,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ]
    },
    Aventura2: {
        es: [
            // Array de retos Aventura2 ESPAÑOL
            {
                reto: 0,
                id: "PZ-intro",
                tipo: "puzzle",
                pregunta: "Puzzle INTRO",
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
                pregunta: "4. ¿Cuál de las dos torres creen que es la más nueva la de la plaza o ésta que tiene delante ahora?",
                opciones: ["La más cercana", "La más alejada"],
                correctas: ["La más alejada"],
                multiple: false
            },
            {
                reto: 5,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 6,
                id: "R6-Av2-es",
                tipo: "opcion-multiple",
                pregunta: "6. ¿Qué puede verse en este panel cerámico? ¿Son calaveras? ¿Es una cruz? ¿hay también una paloma?",
                opciones: ["Calaveras", "Palomas", "Cruz"],
                correctas: ["Calaveras", "Cruz"],
                multiple: true
            },
            {
                reto: 7,
                id: "R7-Av2-es",
                tipo: "opcion",
                pregunta: "7. ¿Cuántas campanas alberga esta torre? ",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av2-es",
                tipo: "opcion",
                pregunta: "8. ¿Por qué se pusieron tan altos estos picaportes?",
                opciones: ["Para personas altas", "Para llamar estando encima del caballo", "Para no ser molestados a la hora de la siesta"],
                correctas: ["Para llamar estando encima del caballo"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-es",
                tipo: "opcion",
                pregunta: "9. ¿Qué sujeta la figura con sus manos? ",
                opciones: ["Un escudo", "Una concha", "Una jarra", "Una espada"],
                correctas: ["Una concha"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-es",
                tipo: "opcion",
                pregunta: "10. ¿Qué dirección toma la senda establecida?",
                opciones: ["Norte", "Sur", "Este", "Oeste"],
                correctas: ["Norte"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-es",
                tipo: "opcion",
                pregunta: "11. ¿Cuántas Puertas tenía la antigua muralla árabe de Balansiya?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 13,
                id: "R13-Av2-es",
                tipo: "opcion",
                pregunta: "13. ¿Con qué mano sujeta Neptuno la cornucopia de la abundancia?",
                opciones: ["Izquierda", "Derecha"],
                correctas: ["Derecha"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av2-es",
                tipo: "texto",
                pregunta: "14. ¿Cuántas figuras rodean la fuente?",
                correctas: ["?"]
            },
            {
                reto: 15,
                id: "R15-Av2-es",
                tipo: "opcion",
                pregunta: "15. ¿Sabría determinar qué geometría tiene el Cimborrio de la Catedral de Valencia? ",
                opciones: ["Hexagonal", "Octogonal", "Cuadradrangular"],
                correctas: ["Octogonal"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av2-es",
                tipo: "opcion",
                pregunta: "16. ¿Sabría determinar qué geometría tiene la Torre del Miguelete de Valencia? ",
                opciones: ["Hexagonal", "Octogonal", "Cuadradrangular"],
                correctas: ["Octogonal"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-es",
                tipo: "texto",
                pregunta: "17. ¿Cuantas ventanas puede ver?",
                correctas: ["?"]
            },
            {
                reto: 18,
                id: "R18-Av2-es",
                tipo: "opcion-multiple",
                pregunta: "18. ¿Qué se puede ver a más de 35 metros de altura en lo alto de la portada barroca?",
                opciones: ["Una esfera", "Un murciélago", "Una cruz", "Un caballo"],
                correctas: ["Una esfera", "Una cruz"],
                multiple: true
            },
            {
                reto: 19,
                id: "R19-Av2-es",
                tipo: "opcion",
                pregunta: "19. ¿Que hay en lo más alto de la torre de la torre barroca de Santa Catalina?",
                opciones: ["Una cruz", "El sol", "Una paloma"],
                correctas: ["Una cruz"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av2-es",
                tipo: "texto",
                pregunta: "20. ¿De qué color son las tejas de la cúpula de la Torre barroca Santa Catalina?",
                correctas: ["?"]
            },
            {
                reto: 21,
                id: "R21-Av2-es",
                tipo: "opcion-multiple",
                pregunta: "21. tres arcos ciegos. Dos de ellos son lisos el tercero se dejó sin enlucir.<br>¿Qué puede verse en ese arco sin enlucir?",
                opciones: ["Un rostro", "Un torso", "Una gárgola"],
                correctas: ["Un rostro", "Un torso"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av2-es",
                tipo: "texto",
                pregunta: "22. ¿Cuánto mide la entrada del edificio estrecho?",
                correctas: ["?"]
            },
            {
                reto: 23,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 24,
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
                pregunta: "Puzzle INTRO",
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
                pregunta: "3. Can you tell me the names of these towers?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 5,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 6,
                id: "R6-Av2-en",
                tipo: "opcion-multiple",
                pregunta: "What can be seen on this ceramic panel? Are they skulls? Is it a cross? Is there also a dove?",
                opciones: ["Skulls", "Doves", "Cross"],
                correctas: ["Skulls", "Cross"],
                multiple: true
            },
            {
                reto: 7,
                id: "R7-Av2-en",
                tipo: "opcion",
                pregunta: "How many bells does this tower have? ",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av2-en",
                tipo: "opcion",
                pregunta: "Why were these door knockers placed so high?",
                opciones: ["For tall people", "To knock while on horseback", "To avoid being disturbed during siesta"],
                correctas: ["To knock while on horseback"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-en",
                tipo: "opcion",
                pregunta: "What is the figure holding in its hands? ",
                opciones: ["A shield", "A shell", "A jug", "A sword"],
                correctas: ["A shell"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-en",
                tipo: "opcion",
                pregunta: "Which direction does the established path take?",
                opciones: ["North", "South", "East", "West"],
                correctas: ["North"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-en",
                tipo: "opcion",
                pregunta: "How many gates did the old Arab wall of Balansiya have?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 12,
                id: "R12PZ-Av2-en",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 13,
                id: "R13-Av2-en",
                tipo: "opcion",
                pregunta: "With which hand does Neptune hold the cornucopia of abundance?",
                opciones: ["Left", "Right"],
                correctas: ["Right"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av2-en",
                tipo: "texto",
                pregunta: "How many figures surround the fountain?",
                correctas: ["?"]
            },
            {
                reto: 15,
                id: "R15-Av2-en",
                tipo: "opcion",
                pregunta: "Can you determine the geometry of the dome of Valencia Cathedral? ",
                opciones: ["Hexagonal", "Octagonal", "Quadrangular"],
                correctas: ["Octagonal"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av2-en",
                tipo: "opcion",
                pregunta: "Can you determine the geometry of the Miguelete Tower of Valencia? ",
                opciones: ["Hexagonal", "Octagonal", "Quadrangular"],
                correctas: ["Octagonal"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-en",
                tipo: "texto",
                pregunta: "How many windows can you see?",
                correctas: ["?"]
            },
            {
                reto: 18,
                id: "R18-Av2-en",
                tipo: "opcion-multiple",
                pregunta: "What can be seen more than 35 meters high at the top of the baroque façade?",
                opciones: ["A sphere", "A bat", "A cross", "A horse"],
                correctas: ["A sphere", "A cross"],
                multiple: true
            },
            {
                reto: 19,
                id: "R19-Av2-en",
                tipo: "opcion",
                pregunta: "What is at the very top of the baroque tower of Santa Catalina?",
                opciones: ["A cross", "The sun", "A dove"],
                correctas: ["A cross"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av2-en",
                tipo: "texto",
                pregunta: "What color are the tiles of the dome of the baroque tower of Santa Catalina?",
                correctas: ["?"]
            },
            {
                reto: 21,
                id: "R21-Av2-en",
                tipo: "opcion-multiple",
                pregunta: "Three blind arches. Two of them are smooth, the third was left unplastered.<br>What can be seen in that unplastered arch?",
                opciones: ["A face", "A torso", "A gargoyle"],
                correctas: ["A face", "A torso"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av2-en",
                tipo: "texto",
                pregunta: "How wide is the entrance of the narrow building?",
                correctas: ["?"]
            },
            {
                reto: 23,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 24,
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
                pregunta: "Puzzle INTRO",
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
                pregunta: "2. Pouvez-vous me dire comment s'appellent ces tours ?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av2-fr",
                tipo: "opcion",
                pregunta: "Laquelle des deux tours pensez-vous être la plus récente, celle de la place ou celle que vous avez devant vous maintenant ?",
                opciones: ["La plus proche", "La plus éloignée"],
                correctas: ["La plus éloignée"],
                multiple: false
            },
            {
                reto: 5,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 6,
                id: "R6-Av2-fr",
                tipo: "opcion-multiple",
                pregunta: "Que peut-on voir sur ce panneau en céramique ? Sont-ce des crânes ? Est-ce une croix ? Y a-t-il aussi une colombe ?",
                opciones: ["Crânes", "Colombes", "Croix"],
                correctas: ["Crânes", "Croix"],
                multiple: true
            },
            {
                reto: 7,
                id: "R7-Av2-fr",
                tipo: "opcion",
                pregunta: "Combien de cloches cette tour abrite-t-elle ? ",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av2-fr",
                tipo: "opcion",
                pregunta: "Pourquoi ces heurtoirs ont-ils été placés si haut ?",
                opciones: ["Pour les personnes grandes", "Pour frapper en étant à cheval", "Pour ne pas être dérangé pendant la sieste"],
                correctas: ["Pour frapper en étant à cheval"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-fr",
                tipo: "opcion",
                pregunta: "Que tient la figure dans ses mains ? ",
                opciones: ["Un bouclier", "Une coquille", "Une cruche", "Une épée"],
                correctas: ["Une coquille"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-fr",
                tipo: "opcion",
                pregunta: "Quelle direction prend le chemin établi ?",
                opciones: ["Nord", "Sud", "Est", "Ouest"],
                correctas: ["Nord"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-fr",
                tipo: "opcion",
                pregunta: "Combien de portes possédait l’ancienne muraille arabe de Balansiya ?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 12,
                id: "R12PZ-Av2-fr",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 13,
                id: "R13-Av2-fr",
                tipo: "opcion",
                pregunta: "De quelle main Neptune tient-il la corne d’abondance ?",
                opciones: ["Gauche", "Droite"],
                correctas: ["Droite"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av2-fr",
                tipo: "texto",
                pregunta: "Combien de figures entourent la fontaine ?",
                correctas: ["?"]
            },
            {
                reto: 15,
                id: "R15-Av2-fr",
                tipo: "opcion",
                pregunta: "Sauriez-vous déterminer la géométrie du ciborium de la cathédrale de Valence ? ",
                opciones: ["Hexagonal", "Octogonal", "Quadrangulaire"],
                correctas: ["Octogonal"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av2-fr",
                tipo: "opcion",
                pregunta: "Sauriez-vous déterminer la géométrie de la tour du Miguelete de Valence ? ",
                opciones: ["Hexagonal", "Octogonal", "Quadrangulaire"],
                correctas: ["Octogonal"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-fr",
                tipo: "texto",
                pregunta: "Combien de fenêtres pouvez-vous voir ?",
                correctas: ["?"]
            },
            {
                reto: 18,
                id: "R18-Av2-fr",
                tipo: "opcion-multiple",
                pregunta: "Que peut-on voir à plus de 35 mètres de hauteur au sommet de la façade baroque ?",
                opciones: ["Une sphère", "Une chauve-souris", "Une croix", "Un cheval"],
                correctas: ["Une sphère", "Une croix"],
                multiple: true
            },
            {
                reto: 19,
                id: "R19-Av2-fr",
                tipo: "opcion",
                pregunta: "Que trouve-t-on tout en haut de la tour baroque de Santa Catalina ?",
                opciones: ["Une croix", "Le soleil", "Une colombe"],
                correctas: ["Une croix"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av2-fr",
                tipo: "texto",
                pregunta: "De quelle couleur sont les tuiles du dôme de la tour baroque de Santa Catalina ?",
                correctas: ["?"]
            },
            {
                reto: 21,
                id: "R21-Av2-fr",
                tipo: "opcion-multiple",
                pregunta: "Trois arcs aveugles. Deux d’entre eux sont lisses, le troisième a été laissé sans enduit.<br>Que peut-on voir dans cet arc sans enduit ?",
                opciones: ["Un visage", "Un torse", "Une gargouille"],
                correctas: ["Un visage", "Un torse"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av2-fr",
                tipo: "texto",
                pregunta: "Quelle est la largeur de l’entrée du bâtiment étroit ?",
                correctas: ["?"]
            },
            {
                reto: 23,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 24,
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
                pregunta: "Puzzle INTRO",
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
                pregunta: "2. Puoi dirmi come si chiamano queste torri?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre di Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av2-it",
                tipo: "opcion",
                pregunta: "Quale delle due torri pensate sia più nuova, quella in piazza o quella davanti a voi ora?",
                opciones: ["La più vicina", "La più lontana"],
                correctas: ["La più lontana"],
                multiple: false
            },
            {
                reto: 5,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 6,
                id: "R6-Av2-it",
                tipo: "opcion-multiple",
                pregunta: "Cosa si può vedere su questo pannello in ceramica? Sono teschi? È una croce? C’è anche una colomba?",
                opciones: ["Teschi", "Colombe", "Croce"],
                correctas: ["Teschi", "Croce"],
                multiple: true
            },
            {
                reto: 7,
                id: "R7-Av2-it",
                tipo: "opcion",
                pregunta: "Quante campane ospita questa torre? ",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av2-it",
                tipo: "opcion",
                pregunta: "Perché questi battenti sono stati posti così in alto?",
                opciones: ["Per persone alte", "Per suonare da cavallo", "Per non essere disturbati durante il pisolino"],
                correctas: ["Per suonare da cavallo"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-it",
                tipo: "opcion",
                pregunta: "Cosa tiene la figura tra le mani? ",
                opciones: ["Uno scudo", "Una conchiglia", "Una brocca", "Una spada"],
                correctas: ["Una conchiglia"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-it",
                tipo: "opcion",
                pregunta: "In quale direzione procede il sentiero stabilito?",
                opciones: ["Nord", "Sud", "Est", "Ovest"],
                correctas: ["Nord"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-it",
                tipo: "opcion",
                pregunta: "Quante porte aveva l’antica muraglia araba di Balansiya?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 12,
                id: "R12PZ-Av2-it",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 13,
                id: "R13-Av2-it",
                tipo: "opcion",
                pregunta: "Con quale mano Nettuno tiene la cornucopia dell’abbondanza?",
                opciones: ["Sinistra", "Destra"],
                correctas: ["Destra"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av2-it",
                tipo: "texto",
                pregunta: "Quante figure circondano la fontana?",
                correctas: ["?"]
            },
            {
                reto: 15,
                id: "R15-Av2-it",
                tipo: "opcion",
                pregunta: "Riuscirebbe a determinare la geometria del ciborio della Cattedrale di Valencia? ",
                opciones: ["Esagonale", "Ottagonale", "Quadrangolare"],
                correctas: ["Ottagonale"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av2-it",
                tipo: "opcion",
                pregunta: "Riuscirebbe a determinare la geometria della Torre del Miguelete di Valencia? ",
                opciones: ["Esagonale", "Ottagonale", "Quadrangolare"],
                correctas: ["Ottagonale"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-it",
                tipo: "texto",
                pregunta: "Quante finestre riesci a vedere?",
                correctas: ["?"]
            },
            {
                reto: 18,
                id: "R18-Av2-it",
                tipo: "opcion-multiple",
                pregunta: "Cosa si può vedere a più di 35 metri di altezza in cima alla facciata barocca?",
                opciones: ["Una sfera", "Un pipistrello", "Una croce", "Un cavallo"],
                correctas: ["Una sfera", "Una croce"],
                multiple: true
            },
            {
                reto: 19,
                id: "R19-Av2-it",
                tipo: "opcion",
                pregunta: "Cosa c’è in cima alla torre barocca di Santa Catalina?",
                opciones: ["Una croce", "Il sole", "Una colomba"],
                correctas: ["Una croce"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av2-it",
                tipo: "texto",
                pregunta: "Di che colore sono le tegole della cupola della torre barocca di Santa Catalina?",
                correctas: ["?"]
            },
            {
                reto: 21,
                id: "R21-Av2-it",
                tipo: "opcion-multiple",
                pregunta: "Tre archi ciechi. Due di essi sono lisci, il terzo è rimasto senza intonaco.<br>Cosa si può vedere in quell’arco non intonacato?",
                opciones: ["Un volto", "Un torso", "Un gargoyle"],
                correctas: ["Un volto", "Un torso"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av2-it",
                tipo: "texto",
                pregunta: "Quanto è larga l’entrata dell’edificio stretto?",
                correctas: ["?"]
            },
            {
                reto: 23,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 24,
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
                pregunta: "Puzzle INTRO",
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
                pregunta: "2. Kunt u mij de namen van deze torens vertellen?",
                opciones: ["Torres de Quart", "Torres de Serranos", "Torre del Miguelete", "Torre de Santa Catalina"],
                correctas: ["Torres de Serranos"],
                multiple: false
            },
            {
                reto: 4,
                id: "R4-Av2-nl",
                tipo: "opcion",
                pregunta: "Welke van de twee torens denkt u dat nieuwer is, die op het plein of die nu voor u staat?",
                opciones: ["De dichtstbijzijnde", "De verste"],
                correctas: ["De verste"],
                multiple: false
            },
            {
                reto: 5,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 6,
                id: "R6-Av2-nl",
                tipo: "opcion-multiple",
                pregunta: "Wat is er te zien op dit keramische paneel? Zijn het schedels? Is het een kruis? Is er ook een duif?",
                opciones: ["Schedels", "Duiven", "Kruis"],
                correctas: ["Schedels", "Kruis"],
                multiple: true
            },
            {
                reto: 7,
                id: "R7-Av2-nl",
                tipo: "opcion",
                pregunta: "Hoeveel klokken heeft deze toren? ",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av2-nl",
                tipo: "opcion",
                pregunta: "Waarom zijn deze deurkloppers zo hoog geplaatst?",
                opciones: ["Voor lange mensen", "Om te kloppen te paard", "Om niet gestoord te worden tijdens de siësta"],
                correctas: ["Om te kloppen te paard"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-nl",
                tipo: "opcion",
                pregunta: "Wat houdt het beeld in zijn handen? ",
                opciones: ["Een schild", "Een schelp", "Een kruik", "Een zwaard"],
                correctas: ["Een schelp"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-nl",
                tipo: "opcion",
                pregunta: "Welke richting volgt het aangelegde pad?",
                opciones: ["Noord", "Zuid", "Oost", "West"],
                correctas: ["Noord"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-nl",
                tipo: "opcion",
                pregunta: "Hoeveel poorten had de oude Arabische muur van Balansiya?",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 12,
                id: "R11PZ-Av2-nl",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 13,
                id: "R13-Av2-nl",
                tipo: "opcion",
                pregunta: "Met welke hand houdt Neptunus de hoorn des overvloeds vast?",
                opciones: ["Links", "Rechts"],
                correctas: ["Rechts"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av2-nl",
                tipo: "texto",
                pregunta: "Hoeveel figuren omringen de fontein?",
                correctas: ["?"]
            },
            {
                reto: 15,
                id: "R15-Av2-nl",
                tipo: "opcion",
                pregunta: "Kunt u de geometrie van het koepeltje van de kathedraal van Valencia bepalen? ",
                opciones: ["Hexagonaal", "Octogonaal", "Vierkant"],
                correctas: ["Octogonaal"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av2-nl",
                tipo: "opcion",
                pregunta: "Kunt u de geometrie van de Miguelete-toren van Valencia bepalen? ",
                opciones: ["Hexagonaal", "Octogonaal", "Vierkant"],
                correctas: ["Octogonaal"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-nl",
                tipo: "texto",
                pregunta: "Hoeveel ramen kunt u zien?",
                correctas: ["?"]
            },
            {
                reto: 18,
                id: "R18-Av2-nl",
                tipo: "opcion-multiple",
                pregunta: "Wat is er meer dan 35 meter hoog te zien bovenaan de barokke gevel?",
                opciones: ["Een bol", "Een vleermuis", "Een kruis", "Een paard"],
                correctas: ["Een bol", "Een kruis"],
                multiple: true
            },
            {
                reto: 19,
                id: "R19-Av2-nl",
                tipo: "opcion",
                pregunta: "Wat bevindt zich bovenaan de barokke toren van Santa Catalina?",
                opciones: ["Een kruis", "De zon", "Een duif"],
                correctas: ["Een kruis"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av2-nl",
                tipo: "texto",
                pregunta: "Welke kleur hebben de tegels van de koepel van de barokke toren van Santa Catalina?",
                correctas: ["?"]
            },
            {
                reto: 21,
                id: "R21-Av2-nl",
                tipo: "opcion-multiple",
                pregunta: "Drie blinde bogen. Twee zijn glad, de derde is niet gepleisterd gebleven.<br>Wat is er te zien in die niet gepleisterde boog?",
                opciones: ["Een gezicht", "Een torso", "Een waterspuwer"],
                correctas: ["Een gezicht", "Een torso"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av2-nl",
                tipo: "texto",
                pregunta: "Hoe breed is de ingang van het smalle gebouw?",
                correctas: ["?"]
            },
            {
                reto: 23,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 23,
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
                pregunta: "Puzzle INTRO",
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
                pregunta: "二つの塔のうち、どちらが新しいと思いますか？広場の塔、それとも今目の前にある塔ですか？",
                opciones: ["一番近い塔", "一番遠い塔"],
                correctas: ["一番遠い塔"],
                multiple: false
            },
            {
                reto: 5,
                id: "PZ-06",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-06"
            },
            {
                reto: 6,
                id: "R6-Av2-ja",
                tipo: "opcion-multiple",
                pregunta: "この陶器のパネルには何が見えますか？骸骨ですか？十字架ですか？鳩もいますか？",
                opciones: ["骸骨", "鳩", "十字架"],
                correctas: ["骸骨", "十字架"],
                multiple: true
            },
            {
                reto: 7,
                id: "R7-Av2-ja",
                tipo: "opcion",
                pregunta: "この塔にはいくつの鐘がありますか？",
                opciones: ["3", "4", "5"],
                correctas: ["5"],
                multiple: false
            },
            {
                reto: 8,
                id: "R8-Av2-ja",
                tipo: "opcion",
                pregunta: "なぜこのドアノッカーはこんなに高い位置にあるのですか？",
                opciones: ["背の高い人のため", "馬に乗って鳴らすため", "昼寝の時間に邪魔されないため"],
                correctas: ["馬に乗って鳴らすため"],
                multiple: false
            },
            {
                reto: 9,
                id: "R9-Av2-ja",
                tipo: "opcion",
                pregunta: "像は何を手に持っていますか？",
                opciones: ["盾", "貝殻", "壺", "剣"],
                correctas: ["貝殻"],
                multiple: false
            },
            {
                reto: 10,
                id: "R10-Av2-ja",
                tipo: "opcion",
                pregunta: "設けられた道はどの方向に向かっていますか？",
                opciones: ["北", "南", "東", "西"],
                correctas: ["北"],
                multiple: false
            },
            {
                reto: 11,
                id: "R11-Av2-ja",
                tipo: "opcion",
                pregunta: "古代バレンシアのアラブの城壁にはいくつの門がありましたか？",
                opciones: ["5", "6", "7"],
                correctas: ["7"],
                multiple: false
            },
            {
                reto: 12,
                id: "PZ-01",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-01"
            },
            {
                reto: 13,
                id: "R13-Av2-ja",
                tipo: "opcion",
                pregunta: "ネプチューンはどちらの手で豊穣の角を持っていますか？",
                opciones: ["左手", "右手"],
                correctas: ["右手"],
                multiple: false
            },
            {
                reto: 14,
                id: "R14-Av2-ja",
                tipo: "texto",
                pregunta: "噴水の周りにはいくつの像がありますか？",
                correctas: ["?"]
            },
            {
                reto: 15,
                id: "R15-Av2-ja",
                tipo: "opcion",
                pregunta: "バレンシア大聖堂のキンボリウムの形状は何ですか？",
                opciones: ["六角形", "八角形", "四角形"],
                correctas: ["八角形"],
                multiple: false
            },
            {
                reto: 16,
                id: "R16-Av2-ja",
                tipo: "opcion",
                pregunta: "バレンシアのミゲレット塔の形状は何ですか？",
                opciones: ["六角形", "八角形", "四角形"],
                correctas: ["八角形"],
                multiple: false
            },
            {
                reto: 17,
                id: "R17-Av2-ja",
                tipo: "texto",
                pregunta: "いくつの窓が見えますか？",
                correctas: ["?"]
            },
            {
                reto: 18,
                id: "R18-Av2-ja",
                tipo: "opcion-multiple",
                pregunta: "バロック様式の正面の頂上、高さ35メートル以上で何が見えますか？",
                opciones: ["球体", "コウモリ", "十字架", "馬"],
                correctas: ["球体", "十字架"],
                multiple: true
            },
            {
                reto: 19,
                id: "R19-Av2-ja",
                tipo: "opcion",
                pregunta: "サンタカタリナのバロック塔の最上部には何がありますか？",
                opciones: ["十字架", "太陽", "鳩"],
                correctas: ["十字架"],
                multiple: false
            },
            {
                reto: 20,
                id: "R20-Av2-ja",
                tipo: "texto",
                pregunta: "サンタカタリナのバロック塔のドームの瓦の色は何ですか？",
                correctas: ["?"]
            },
            {
                reto: 21,
                id: "R21-Av2-ja",
                tipo: "opcion-multiple",
                pregunta: "三つの盲アーチがあります。二つは滑らかで、三つ目は漆喰が塗られていません。<br>漆喰が塗られていないアーチには何が見えますか？",
                opciones: ["顔", "胴体", "ガーゴイル"],
                correctas: ["顔", "胴体"],
                multiple: true
            },
            {
                reto: 22,
                id: "R22-Av2-ja",
                tipo: "texto",
                pregunta: "狭い建物の入り口の幅はどれくらいですか？",
                correctas: ["?"]
            },
            {
                reto: 23,
                id: "PZ-07",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-07"
            },
            {
                reto: 24,
                id: "PZ-05",
                tipo: "puzzle",
                src: "puzzle.html?id=PZ-05"
            }
        ]
    },
    Aventura3: {
        es: [
            // Array de retos Aventura3 ESPAÑOL
        ],
        en: [
            // Array de retos Aventura3 INGLÉS
        ],
        fr: [
            // Array de retos Aventura3 FRANCÉS
        ],
        it: [
            // Array de retos Aventura3 ITALIANO
        ],
        nl: [
            // Array de retos Aventura3 HOLANDÉS
        ],
        ja: [
            // Array de retos Aventura3 JAPONÉS
        ]
    },
    Aventura4: {
        es: [
            // Array de retos Aventura4 ESPAÑOL
        ],
        en: [
            // Array de retos Aventura4 INGLÉS
        ],
        fr: [
            // Array de retos Aventura4 FRANCÉS
        ],
        it: [
            // Array de retos Aventura4 ITALIANO
        ],
        nl: [
            // Array de retos Aventura4 HOLANDÉS
        ],
        ja: [
            // Array de retos Aventura4 JAPONÉS
        ]
    },
    Aventura5: {
        es: [
            // Array de retos Aventura5 ESPAÑOL
        ],
        en: [
            // Array de retos Aventura5 INGLÉS
        ],
        fr: [
            // Array de retos Aventura5 FRANCÉS
        ],
        it: [
            // Array de retos Aventura5 ITALIANO
        ],
        nl: [
            // Array de retos Aventura5 HOLANDÉS
        ],
        ja: [
            // Array de retos Aventura5 JAPONÉS
        ]
    },
    AventuraFallas: {
        es: [
            // Array de retos AventuraFallas ESPAÑOL
        ],
        en: [
            // Array de retos AventuraFallas INGLÉS
        ],
        fr: [
            // Array de retos AventuraFallas FRANCÉS
        ],
        it: [
            // Array de retos AventuraFallas ITALIANO
        ],
        nl: [
            // Array de retos AventuraFallas HOLANDÉS
        ],
        ja: [
            // Array de retos AventuraFallas JAPONÉS
        ]
    },
    Aventura34km: {
        es: [
            // Array de retos Aventura34km ESPAÑOL
        ],
        en: [
            // Array de retos Aventura34km INGLÉS
        ],
        fr: [
            // Array de retos Aventura34km FRANCÉS
        ],
        it: [
            // Array de retos Aventura34km ITALIANO
        ],
        nl: [
            // Array de retos Aventura34km HOLANDÉS
        ],
        ja: [
            // Array de retos Aventura34km JAPONÉS
        ]
    }
};

// Para uso en entornos CommonJS (Node.js) y navegador
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RETOS_AVENTURAS };
} else {
    window.RETOS_AVENTURAS = RETOS_AVENTURAS;
}
