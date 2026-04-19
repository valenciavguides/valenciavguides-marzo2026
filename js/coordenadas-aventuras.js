export const DATOS_AVENTURAS = {
  Aventura1: {
    "coordenadas-hijo2.html": {
      coordenadas: [



    // poner las coordenadas específicas de los puntos a visitar del mapa. dibujarReferencias() ignora automáticamente las que tengan coordenadas: null.
    {
        tipo: "referencia",
        id: "REF-2",
        mapa_numero: 2,
        coordenadas: null,
        nombre: null,
    },
    {
        tipo: "referencia",
        id: "REF-4",
        mapa_numero: 4,
        coordenadas: null,
        nombre: null,
    },
    {
        tipo: "referencia",
        id: "REF-7",
        mapa_numero: 7,
        coordenadas: null,
        nombre: null,
    },
    {
        tipo: "referencia",
        id: "REF-22",
        mapa_numero: 22,
        coordenadas: null,
        nombre: null,
    },

    // ────-------------------------------------------------
// coordenadas completas hijo2 Aventura1 //

    // Parada 0 - Torres de Serranos (start) (Reto 3) (Párrafos: 223, 226, 228)
    {
        id: "P-0",
        tipo: "inicio",
        parada: 0, // mapa número 1
        mapa_numero: 1,
        nombre: "Torres de Serranos (start)",
        coordenadas: { lat: 39.47876, lng: -0.37626 },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
    },

    // Tramo 1: Torres de Serranos → Plaza de la crida (Puente de Serranos)(Parrafos: 229, 2)
    {
        id: "TR-1",
        tipo: "tramo",
        tramo: 1, // De mapa número 1 a mapa número 1
        mapa_numero: "1→1",
        nombre: "Torres de Serranos → Plaza de la crida (Puente de Serranos)",
        inicio: { lat: 39.47876, lng: -0.37626 },
        waypoints: [
            { lat: 39.47905, lng: -0.37613 },
            { lat: 39.479341, lng: -0.376408 },
            { lat: 39.4795, lng:  -0.37621 },
            { lat: 39.47943, lng: -0.37597 }
        ],
        fin: { lat: 39.47959, lng: -0.37583 },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
        imagen2: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        video: "",
    },
    // Parada 1: Plaza de la crída (Puente de Serranos) (Reto 4) (Parrafos: 126, 233)
    {
        id: "P-1",
        tipo: "parada",
        parada: 1, // mapa número 1 (Sí, hay dos 1 en el mapa por ser el mismo monumento desde diferente perspectiva)
        mapa_numero: 1,
        nombre: "Plaza de la crida (Puente de Serranos)",
        coordenadas: { lat: 39.47959, lng: -0.37583 },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
    },
    // Tramo 2: Plaza de la crída → Calle Muro de Santa Ana (Párrafos: 81)
    {
        id: "TR-2",
        tipo: "tramo",
        tramo: 2, //De mapa número 1 a sin núemero en el mapa (Calle Muro de Santa Ana)
        mapa_numero: "1→-",
        inicio: { lat: 39.47959, lng: -0.37583 },
        waypoints: [
            { lat: 39.47939, lng: -0.3752 },
            { lat: 39.47913, lng: -0.37476 },
            { lat: 39.47886, lng: -0.3749 },
            { lat: 39.47886, lng:  -0.3747 },
        ],
        fin: { lat: 39.47866, lng: -0.3747 },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        imagen2: "imagenes/imagenes-aventuras/Calle_Muro_Santa_Ana.jpg",
        video: "videos-aventuras/av1/tramo_2.mp4",
    },

    // Parada 2: calle Muro Santa Ana (Reto 5) (Párrafo: 68)
    {
        id: "P-2",
        tipo: "parada",
        parada: 2, // sin número en el mapa
        mapa_numero: null,
        nombre: "Calle Muro de Santa Ana",
        coordenadas: { lat: 39.47866, lng: -0.3747 },
        imagen: "imagenes/imagenes-aventuras/Calle_Muro_Santa_Ana.jpg",
    },

    // Tramo 3: Calle Muro de Santa Ana → Palacio de los Borgia (Párrafos: 52, 686)
    {
        id: "TR-3",
        tipo: "tramo",
        tramo: 3, // De Calle Muro Santa Ana a mapa número 2
        mapa_numero: "-→2",
        nombre: "Calle Muro de Santa Ana → Palacio de los Borgia",
        inicio: { lat: 39.47866, lng: -0.3747 },
        waypoints: [
            { lat: 39.47821, lng: -0.37479},
        ],
        fin: { lat: 39.47784, lng: -0.37485 },
        imagen: "imagenes/imagenes-aventuras/Calle_Muro_Santa_Ana.jpg",
        imagen2: "imagenes/imagenes-aventuras/cortes_valencianas.jpg",
        video: "videos-aventuras/av1/tramo_3.mp4",
    },

    // Parada 3: Iglesia de San Lorenzo (Reto 6) (Párrafos: 682-B, 462, 684, 683)
    {
        id: "P-3",
        tipo: "parada",
        parada: 3, // sin número en el mapa (Iglesia de San Lorenzo)
        mapa_numero: null,
        nombre: "Iglesia de San Lorenzo",
        coordenadas: { lat: 39.47782, lng: -0.37487 },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_lorenzo.jpg",
    },

    // Tramo 4: Iglesia de San Lorenzo → Plaza de la Virgen (Párrafos: 465-B)
    {
        id: "TR-4",
        tipo: "tramo",
        tramo: 4, // Iglesia de San Lorenzo a mapa número 3
        mapa_numero: "-→3",
        nombre: "Iglesia de San Lorenzo → Plaza de la Virgen",
        inicio: { lat: 39.47782, lng: -0.37487 },
        waypoints: [
            { lat: 39.4772, lng: -0.37503 },
        ],
        fin: { lat: 39.47661, lng: -0.37516 },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_lorenzo.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
        video: "videos-aventuras/av1/tramo_4.mp4",
    },

    // Parada 4: Plaza de la Virgen (Reto 7) (Párrafos: 466, 467)
    {
        id: "P-4",
        tipo: "parada",
        parada: 4, // mapa número 3
        mapa_numero: 3,
        nombre: "Plaza de la Virgen",
        coordenadas: { lat: 39.47662, lng: -0.37524 },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
    },

    // Parada 5: Plaza de la Virgen (Reto 8) (Párrafos: 477-B, 479, 141, 468)
    {
        id: "P-5",
        tipo: "parada",
        parada: 5, // mapa número 3
        mapa_numero: 3,
        nombre: "Plaza de la Virgen",
        coordenadas: { lat: 39.47657, lng: -0.37524 },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
    },

    // Parada 6: Plaza de la Virgen (Reto9Puzzle PZ-01)
    {
        id: "P-6",
        tipo: "parada",
        parada: 6, // mapa número 3
        mapa_numero: 3,
        nombre: "Plaza de la Virgen",
        coordenadas: { lat: 39.47656, lng: -0.37516 },
        imagen: "", //no hay imagen porque es un reto de puzzle
    },

    // Tramo 5: Plaza de la Virgen → Plaza de la Almoína (Párrafos: 83)
    {
        id: "TR-5",
        tipo: "tramo",
        tramo: 5, //De mapa número 3 a mapa número 4
        mapa_numero: "3→4",
        nombre: "Plaza de la Virgen → Plaza de la Almoína",
        inicio: { lat: 39.47656, lng: -0.37516 },
        waypoints: [
            { lat: 39.47658, lng: -0.37496 },
            { lat: 39.4766, lng: -0.37473 },
            { lat: 39.47656, lng: -0.37453 }
        ],
        fin: { lat: 39.47629, lng: -0.3746 },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
        imagen2: "imagenes/imagenes-aventuras/Paso_Plaza_Almoina.jpg",
        video: "videos-aventuras/av1/tramo_5.mp4",
    },

    // Parada 7: Panel cerámico muro Catedral (Reto 10) (Párrafos: 8-c, 434, 440, 441, 442 )
    {
        id: "P-7",
        tipo: "parada",
        parada: 7, // mapa número 5
        mapa_numero: 5,
        nombre: "Panel cerámico muro Catedral",
        coordenadas: { lat: 39.476, lng: -0.37462 },
        imagen: "imagenes/imagenes-aventuras/panel_ceramico_muro_norte catedral.jpg",
    },

    // Parada 8: Capilla exterior catedral (Reto 11) (Párrafos: 443, 444)
    {
        id: "P-8",
        tipo: "parada",
        parada: 8, // mapa número 5
        mapa_numero: 5,
        nombre: "Capilla exterior catedral",
        coordenadas: { lat: 39.47603, lng: -0.37476 },
        imagen: "imagenes/imagenes-aventuras/capilla_exterior_catedral.jpg",
    },

    // Parada 9: Capilla exterior catedral (Reto 12) (Párrafos: 445)
    {
        id: "P-9",
        tipo: "parada",
        parada: 9, // mapa número 5
        mapa_numero: 5,
        nombre: "Capilla exterior catedral",
        coordenadas: { lat: 39.47604, lng: -0.37482 },
        imagen: "imagenes/imagenes-aventuras/capilla_exterior_catedral.jpg",
    },

    // Parada 10: Arco Novo Catedral y Puerta Negra Basílica (Párrafos: 446, 355, 447, 11-B, 451, 452,)
    {
        id: "P-10",
        tipo: "parada",
        parada: 10, // mapa número 5 y mapa número 9
        mapa_numero: "5,9",
        nombre: "Arco Novo Catedral y Puerta Negra Basílica",
        coordenadas: { lat: 39.47607, lng: -0.3749 },
        imagen: "imagenes/imagenes-aventuras/arco_novo_catedral.jpg",
        imagen2: "imagenes/imagenes-aventuras/puerta_negra_relieve_basilica.jpg",
    },

    // Parada 11: Casa del Punt de Gantxo (Reto 13) (Párrafos: 51-C, 454, 455, 455-B, 148, 456)
    {
        id: "P-11",
        tipo: "parada",
        parada: 11, // sin número en el mapa (Casa del Punt de Gantxo)
        mapa_numero: null,
        nombre: "Casa del Punt de Gantxo",
        coordenadas: { lat: 39.47605, lng: -0.37427 },
        imagen: "imagenes/imagenes-aventuras/casa_del_punt_de_gantxo.jpg",
    },

    // Tramo 6: Plaza de la Almoína → Museo Arqueológico (Párrafos: 457, 10-B)
    {
        id: "TR-6",
        tipo: "tramo",
        tramo: 6, // De Casa del punt de gantxo a mapa número 6
        mapa_numero: "-→6",
        nombre: "Plaza de la Almoína → Plaza Decimo Junio Bruto (Museo Arqueológico de la Almoína)",
        inicio: { lat: 39.47605, lng: -0.37427 },
        waypoints: [
            { lat: 39.47611, lng: -0.37422 },
        ],
        fin: { lat: 39.47624, lng: -0.37425 },
       imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/museo_la_almoina.jpg",
        video: "videos-aventuras/av1/tramo_6.mp4",
    },

    // Parada 12: Museo arqueológico La Almoína (Reto 14) (Párrafos: 458)
    {
        id: "P-12",
        tipo: "parada",
        parada: 12, // mapa número 6
        mapa_numero: 6,
        nombre: "Museo arqueológico La Almoína",
        coordenadas: { lat: 39.47624, lng: -0.37425 },
        imagen: "imagenes/imagenes-aventuras/museo_la_almoina.jpg",
    },

    // Parada 13: Museo arqueológico La Almoína (segunda parte) (Reto15Puzzle: PZ-02) (Párrafos: 460, 461)
    {
        id: "P-13",
        tipo: "parada",
        parada: 13, // mapa número 6
        mapa_numero: 6,
        nombre: "Museo arqueológico La Almoína",
        coordenadas: { lat: 39.47624,  lng: -0.37429 },
        imagen: "imagenes/imagenes-aventuras/museo_la_almoina.jpg",
    },

    // Parada 14: Vista de la Catedral, Cimborrio (Reto: 16) (Párrafos: 8-C,564)
    {
        id: "P-14",
        tipo: "parada",
        parada: 14, // mapa número 5
        mapa_numero: 5,
        nombre: "Vista de la Catedral, Cimborrio",
        coordenadas: { lat: 39.47622, lng: -0.37428 },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
    },

    // Tramo 7: Museo arqueológico La Almoína → Palacio Arzobispal (Párrafos: 85)
    {
        id: "TR-7",
        tipo: "tramo",
        tramo: 7, // De mapa número 6 a mapa número 8
        mapa_numero: "6→8",
        nombre: "Museo arqueológico La Almoína → Palacio Arzobispal",
        inicio: { lat: 39.47622, lng: -0.37428 },
        waypoints: [
            { lat: 39.47597, lng: -0.37433 },
            { lat: 39.47575, lng: -0.3744 },
            { lat: 39.47561, lng: -0.37445 }
        ],
        fin: { lat: 39.47549, lng: -0.37427 },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg",
        video: "videos-aventuras/av1/tramo_7.mp4",
    },

    // Parada 15: Palacio Arzobispal, Puerta Románica de la Catedral y Torre del Miguelete (Reto 17) (Párrafos: 673, 86, 426-B, 141, 437, 438)
    {
        id: "P-15",
        tipo: "parada",
        parada: 15, //mapa número 8
        mapa_numero: 8,
        nombre: "Palacio Arzobispal y Puerta Románica de la Catedral",
        coordenadas: { lat: 39.47549, lng: -0.37427 },
        imagen: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg",
        imagen2: "imagenes/imagenes-aventuras/puerta_romanica_catedral.jpg"
    },

    // Parada 16: Puerta Románica de la Catedral (Párrafos: 439)
    {
        id: "P-16",
        tipo: "parada",
        parada: 16, // mapa número 5
        mapa_numero: 5,
        nombre: "Puerta Románica de la Catedral",
        coordenadas: { lat: 39.47561, lng: -0.37465 },
        imagen: "imagenes/imagenes-aventuras/puerta_romanica_catedral.jpg",
    },

    // Tramo 8: Puerta Románica de la Catedral → Plaza del Ayuntamiento (Párrafos: 125)
    {
        id: "TR-8",
        tipo: "tramo",
        tramo: 8, // De mapa número 8 a mapa número 9
        mapa_numero: "8→9",
        nombre: "Puerta Románica de la Catedral → Plaza del Ayuntamiento",
        inicio: { lat: 39.47561, lng: -0.37465 },
        waypoints: [
            { lat: 39.47551, lng: -0.37472 },
            { lat: 39.47535, lng: -0.37486 },
            { lat: 39.47519, lng: -0.37491 },
            { lat: 39.47503, lng: -0.37505 },
            { lat: 39.47512, lng: -0.37531 },
            { lat: 39.47482, lng: -0.37535 },
            { lat: 39.47416, lng: -0.37542 },
            { lat: 39.47378, lng: -0.37547 },
            { lat: 39.47374, lng: -0.37566 },
            { lat: 39.47342, lng: -0.37592 },
            { lat: 39.47302, lng: -0.37622 },
            { lat: 39.47247, lng: -0.37663 },
            { lat: 39.47212, lng: -0.37676 },
            { lat: 39.47144, lng: -0.37689 },
        ],
        fin: { lat: 39.47056, lng: -0.37677 },
        imagen: "imagenes/imagenes-aventuras/puerta_romanica_catedral.jpg",
        imagen2: "imagenes/imagenes-aventuras/Plaza_Reina_2.jpg",
        imagen3: "imagenes/imagenes-aventuras/calle_san_Vicente_2.jpg",
        imagen4: "imagenes/imagenes-aventuras/plaza_del_ayuntamiento.jpg",
        video: "videos-aventuras/av1/tramo_8.mp4",
    },

    // Parada 17: Plaza del Ayuntamiento (Párrafos 13-B, 263)
    {
        id: "P-17",
        tipo: "parada",
        parada: 17, // mapa número 9
        mapa_numero: 9,
        nombre: "Plaza del Ayuntamiento",
        coordenadas: { lat: 39.47056, lng: -0.37677 },
        imagen: "imagenes/imagenes-aventuras/plaza_del_ayuntamiento.jpg",
    },

    // Tramo 9: Plaza del Ayuntamiento → Edificio del Ayuntamiento de València (Párrafos: 332, 14-C, 334, 335)
    {
        id: "TR-9",
        tipo: "tramo",
        tramo: 9, // De mapa número 9 a mapa número 10
        mapa_numero: "9→10",
        nombre: "Plaza del Ayuntamiento → Edificio del Ayuntamiento de València",
        inicio: { lat: 39.47056, lng: -0.37677 },
        waypoints: [
            { lat: 39.47007, lng: -0.37681 },
        ],
        fin: { lat: 39.46971, lng: -0.37693 },
        imagen: "imagenes/imagenes-aventuras/plaza_del_ayuntamiento.jpg",
        imagen2: "imagenes/imagenes-aventuras/ayuntamiento.jpg",
        video: "videos-aventuras/av1/tramo_9.mp4",
    },

    // Parada 18: Edificio del Ayuntamiento (Reto 18) (Párrafos: 336, 337, 338)
    {
        id: "P-18",
        tipo: "parada",
        parada: 18, // mapa número 10
        mapa_numero: 10,
        nombre: "Edificio del Ayuntamiento",
        coordenadas: { lat: 39.46971, lng: -0.37693 },
        imagen: "imagenes/imagenes-aventuras/ayuntamiento.jpg",
    },

    // Parada 19: Edificio del Ayuntamiento (segunda parte) (Párrafos: 339, 340, 341, 54)
    {
        id: "P-19",
        tipo: "parada",
        parada: 19, // mapa número 10
        mapa_numero: 10,
        nombre: "Edificio del Ayuntamiento",
        coordenadas: { lat: 39.46961, lng: -0.37687 },
        imagen: "imagenes/imagenes-aventuras/ayuntamiento.jpg",
    },

    // Tramo 10: Edificio del Ayuntamiento → Estación del Norte - Tren (Párrafos: 87, 15-C)
    {
        id: "TR-10",
        tipo: "tramo",
        tramo: 10, // De mapa número 10 a mapa número 11
        mapa_numero: "10→11",
        nombre: "Edificio del Ayuntamiento → Estación del Norte",
        inicio: { lat: 39.46961, lng: -0.37687 },
        waypoints: [
            { lat: 39.46879, lng: -0.37689 },
            { lat: 39.46795, lng: -0.37701 },
            { lat: 39.46755, lng: -0.37715 },
        ],
        fin: { lat: 39.46722, lng: -0.37702 },
        imagen: "imagenes/imagenes-aventuras/ayuntamiento.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_de_toros_y_estacion_del_norte.jpg",
        video: "videos-aventuras/av1/tramo_10.mp4",
    },

    // Parada 20: Estación del Norte - Tren (Reto 19) (Párrafos: 326)
    {
        id: "P-20",
        tipo: "parada",
        parada: 20, // mapa número 11
        mapa_numero: 11,
        nombre: "Estación del Norte",
        coordenadas: { lat: 39.46722, lng: -0.37702 },
        imagen: "imagenes/imagenes-aventuras/Estacion_Norte.jpg",
    },

    // Tramo 11: Estación del Norte - Tren → Plaza de Toros de València (Párafos: 20-C, 323-B)
    {
        id: "TR-11",
        tipo: "tramo",
        tramo: 11, // De mapa número 11 a mapa número 12
        mapa_numero: "11→12",
        nombre: "Estación del Norte → Plaza de Toros de València",
        inicio: { lat: 39.46722, lng: -0.37702 },
        waypoints: [
            { lat: 39.46722, lng: -0.37644 },
        ],
        fin: { lat: 39.46714, lng: -0.37593 },
        imagen: "imagenes/imagenes-aventuras/Estacion_Norte.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_de_toros_y_estacion_del_norte.jpg",
        imagen3: "imagenes/imagenes-aventuras/Plaza_Toros.jpg",
        video: "videos-aventuras/av1/tramo_11.mp4",
    },

    // Parada 21: Plaza de Toros (Reto20Puzzle: PZ-03) (Párrafos: 323-B, 88)
    {
        id: "P-21",
        tipo: "parada",
        parada: 21, // mapa número 12
        mapa_numero: 12,
        nombre: "Plaza de Toros",
        coordenadas: { lat: 39.46714, lng: -0.37593 },
        imagen: "imagenes/imagenes-aventuras/Plaza_Toros.jpg",
    },

    // Tramo 12: Plaza de Toros → Casa estilo Árabe (Párrafos: 89, 3-D)
    {
        id: "TR-12",
        tipo: "tramo",
        tramo: 12, // De mapa número 12 a mapa número 13
        mapa_numero: "12→13",
        nombre: "Plaza de Toros → Casa estilo Árabe",
        inicio: { lat: 39.46714, lng: -0.37593 },
        waypoints: [
            { lat: 39.46714, lng: -0.37498 },
        ],
        fin: { lat: 39.46752, lng: -0.37511 },
        imagen: "imagenes/imagenes-aventuras/Plaza_Toros.jpg",
        imagen2: "imagenes/imagenes-aventuras/Casa_arabe.jpg",
        video: "videos-aventuras/av1/tramo_12.mp4",
    },

    // Parada 22: Casa estilo Árabe (mitad Aventura) (Reto: 21) (Párrafos: 100, 99)
    {
        id: "P-22",
        tipo: "parada",
        parada: 22, // mapa número 13
        mapa_numero: 13,
        nombre: "Casa estilo Árabe",
        coordenadas: { lat: 39.46752, lng: -0.37511 },
        imagen: "imagenes/imagenes-aventuras/Casa_arabe.jpg",
    },

    // Tramo 13: Casa estilo Árabe → Palacio de Comunicaciones (Correos) (Párrfos: 21-B)
    {
        id: "TR-13",
        tipo: "tramo",
        tramo: 13, // De mapa número 13 a mapa número 14
        mapa_numero: "13→14",
        nombre: "Casa estilo Árabe → Palacio de Comunicaciones (Correos)",
        inicio: { lat: 39.46752, lng: -0.37511 },
        waypoints: [
            { lat: 39.46839, lng: -0.37528 },
            { lat: 39.46891, lng: -0.37542 },
        ],
        fin: { lat: 39.46942, lng: -0.37559 },
        imagen: "imagenes/imagenes-aventuras/Casa_arabe.jpg",
        imagen2: "imagenes/imagenes-aventuras/correos.jpg",
        video: "videos-aventuras/av1/tramo_13.mp4",
    },

    // Parada 23: Palacio de Comunicaciones (Correos) (Reto 22) (Párrafos: 700, 343, 344)
    {
        id: "P-23",
        tipo: "parada",
        parada: 23, // mapa número 14
        mapa_numero: 14,
        nombre: "Palacio de Comunicaciones: Correos",
        coordenadas: { lat: 39.46942, lng: -0.37559 },
        imagen: "imagenes/imagenes-aventuras/correos.jpg",
    },

    // Parada 24: Edificio Suay - La Equitativa (Reto 23) (Párrafos: 693, 693-B)
    {
        id: "P-24",
        tipo: "parada",
        parada: 24, // sin número en el mapa (Edificio Suay - La Equitativa)
        mapa_numero: null,
        nombre: "Edificio Suay - La Equitativa",
        coordenadas: { lat: 39.46961, lng: -0.37568 },
        imagen: "imagenes/imagenes-aventuras/edificio_suay.jpg",
    },

    // Tramo 14: Palacio de Comunicaciones (Correos) → Banco de Valencia (Párrafos: 345, 347, 348, 22)
    {
        id: "TR-14",
        tipo: "tramo",
        tramo: 14, // De mapa número 14 a mapa número 15
        mapa_numero: "14→15",
        nombre: "Palacio de Comunicaciones → Banco de València",
        inicio: { lat: 39.46961, lng: -0.37568 },
        waypoints: [
            { lat: 39.46998, lng: -0.37587 },
            { lat: 39.4703, lng: -0.3759 },
            { lat: 39.47039, lng: -0.37505 },
            { lat: 39.47043, lng: -0.37427 }
        ],
        fin: { lat: 39.47061, lng: -0.37408 },
        imagen: "imagenes/imagenes-aventuras/correos.jpg",
        imagen2: "imagenes/imagenes-aventuras/Calle_barcas.jpg",
        imagen3: "imagenes/imagenes-aventuras/banco_de_valencia.jpg",
        video: "videos-aventuras/av1/tramo_14.mp4",
    },

    // Parada 25: Banco de Valencia (Reto: 24) (Párrafos: 349, 350)
    {
        id: "P-25",
        tipo: "parada",
        parada: 25, // mapa número 15
        mapa_numero: 15,
        nombre: "Banco de Valencia",
        coordenadas: { lat: 39.47061, lng: -0.37408 },
        imagen: "imagenes/imagenes-aventuras/banco_de_valencia.jpg",
    },

    // Tramo 15: Banco de Valencia → Palacio del Marqués de Dos Aguas "Museo Nacional de Cerámica" (Párrafos: 351, 23-B, 352, 354)
    {
        id: "TR-15",
        tipo: "tramo",
        tramo: 15, // De mapa número 15 a mapa número 16
        mapa_numero: "15→16",
        nombre: "Banco de València → Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)",
        inicio: { lat: 39.47061, lng: -0.37408 },
        waypoints: [
            { lat: 39.47119, lng: -0.37423 },
            { lat: 39.47214, lng: -0.37446 },
            { lat: 39.47275, lng: -0.37445 }
        ],
        fin: { lat: 39.47276, lng: -0.37467 },
        imagen: "imagenes/imagenes-aventuras/banco_de_valencia.jpg",
        imagen2: "imagenes/imagenes-aventuras/Iglesia_San_juan_cruz.jpg",
        imagen3: "imagenes/imagenes-aventuras/Marques_dos_aguas_2.jpg",
        video: "videos-aventuras/av1/parada_15.mp4",
    },

    // Parada 26: Palacio del Marqués de Dos Aguas "Museo Nacional de Cerámica" (Párrafos: 356, 357)
    {
        id: "P-26",
        tipo: "parada",
        parada: 26, // mapa número 16
        mapa_numero: 16,
        nombre: "Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)",
        coordenadas: { lat: 39.47276, lng: -0.37467 },
        imagen: "imagenes/imagenes-aventuras/Marques_dos_aguas_1.jpg",
    },

    // Tramo 16: Palacio del Marqués de Dos Aguas "Museo Nacional de Cerámica" → Mercado Central (Párrafos: 358, 359-B, 101)
    {
        id: "TR-16",
        tipo: "tramo",
        tramo: 16, // De mapa número 16 a mapa número 17
        mapa_numero: "16→17",
        nombre: "Palacio del Marqués → Mercado Central",
        inicio: { lat: 39.47276, lng: -0.37467 },
        waypoints: [
            { lat: 39.47303, lng: -0.37527 },
            { lat: 39.47308, lng: -0.37583 },
            { lat: 39.47315, lng: -0.37608 },
            { lat: 39.47261, lng: -0.37654 },
            { lat: 39.47216, lng: -0.37684 },
            { lat: 39.4724, lng: -0.37705 },
            { lat: 39.47319, lng: -0.37765 },
        ],
        fin: { lat: 39.47377, lng: -0.37832 },
        imagen: "imagenes/imagenes-aventuras/Marques_dos_aguas_1.jpg",
        imagen2: "imagenes/imagenes-aventuras/Calle_San_Vicente.jpg",
        imagen3: "imagenes/imagenes-aventuras/mercado_central.jpg",
        video: "videos-aventuras/av1/tramo_16.mp4",
    },

    // Parada 27: Mercado central (Reto 25) (Párrafos: 701, 24-D, 361, 362, 363, 364)
    {
        id: "P-27",
        tipo: "parada",
        parada: 27, // mapa número 17
        mapa_numero: 17,
        nombre: "Mercado central",
        coordenadas: { lat: 39.47377, lng: -0.37832 },
        imagen: "imagenes/imagenes-aventuras/mercado_central.jpg",
    },

    // Tramo 17: Mercado Central → Iglesia de los Santos Juanes (Párrafos: 274, 27-C)
    {
        id: "TR-17",
        tipo: "tramo",
        tramo: 17, // De mapa número 17 a mapa número 18
        mapa_numero: "17→18",
        nombre: "Mercado Central → Iglesia de los Santos Juanes o San Juan del Mercado",
        inicio: { lat: 39.47377, lng: -0.37832 },
        waypoints: [
            { lat: 39.47408, lng: -0.37862 },
        ],
        fin: { lat: 39.47425, lng: -0.37895 },
        imagen: "imagenes/imagenes-aventuras/mercado_central.jpg",
        imagen2: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg",
        video: "videos-aventuras/av1/tramo_17.mp4",
    },

    // Parada 28: Iglesia de los Santos Juanes o San Juan del Mercado 1 (Reto 26) (Párrafos: 27-C, 365, 366)
    {
        id: "P-28",
        tipo: "parada",
        parada: 28, // mapa número 18
        mapa_numero: 18,
        nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)",
        coordenadas: { lat: 39.47425, lng: -0.37895 },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg",
    },

    // Parada 29: Iglesia de los Santos Juanes 2 (San Juan del Mercado) (Reto 27) (Párrafos: 368, 367)
    {
        id: "P-29",
        tipo: "parada",
        parada: 29, // mapa número 18
        mapa_numero: 18,
        nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)",
        coordenadas: { lat: 39.47424, lng: -0.37889 },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg",
    },

    // Tramo 18: Iglesia Santos Juanes (San Juan del Mercado) → Lonja de Valencia (Mercado de la Seda) (Párrafos: 369, 28)
    {
        id: "TR-18",
        tipo: "tramo",
        tramo: 18, // De mapa número 18 a mapa número 19
        mapa_numero: "18→19",
        nombre: "Iglesia Santos Juanes → Lonja de València (Mercado de la Seda)",
        inicio: { lat: 39.47424, lng: -0.37889 },
        waypoints: [],
        fin: { lat: 39.47422, lng:  -0.37875 },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg",
        imagen2: "imagenes/imagenes-aventuras/lonja.jpg",
        video: "videos-aventuras/av1/tramo_18.mp4",
    },

    // Parada 30: Lonja (Mercado de la Seda) historia (Reto28Puzzle PZ-04) (Párrafos: 370, 371, 372, 373, 374, 375, 376)
    {
        id: "P-30",
        tipo: "parada",
        parada: 30, // mapa número 19
        mapa_numero: 19,
        nombre: "Lonja Historia",
        coordenadas: { lat: 39.47422, lng:  -0.37875 },
        imagen: "imagenes/imagenes-aventuras/lonja.jpg",
    },

    // Parada 31: Lonja (Mercado de la Seda) Puerta de Los Pecados 1 (Reto 29) (Párrafos: 375, 376, 377, 378, 379)
    {
        id: "P-31",
        tipo: "parada",
        parada: 31, // mapa número 19
        mapa_numero: 19,
        nombre: "Lonja Puerta de Los Pecados (Puerta de los Pecados 1)",
        coordenadas: { lat: 39.47417, lng: -0.3786 },
        imagen: "imagenes/imagenes-aventuras/Lonja_puerta_pecados.jpg",
        imagen2: "imagenes/imagenes-aventuras/lonja4.jpg",
    },

    // Parada 32: Lonja (Mercado de la Seda) Puerta de Los Pecados 2 (Reto 30) (Párrafos: 380, 381)
    {
        id: "P-32",
        tipo: "parada",
        parada: 32, // mapa número 19
        mapa_numero: 19,
        nombre: "Lonja Puerta de Los Pecados (Puerta de los Pecados 2)",
        coordenadas: { lat: 39.47416, lng: -0.37857 },
        imagen: "imagenes/imagenes-aventuras/lonja5.jpg",
    },

    // Parada 33: Lonja (Mercado de la Seda) Gárgolas 1 (Reto 31) (Párrafos: 383, 384)
    {
        id: "P-33",
        tipo: "parada",
        parada: 33, // mapa número 19
        mapa_numero: 19,
        nombre: "Lonja (Gárgolas 1)",
        coordenadas: { lat: 39.47417, lng: -0.37868 },
        imagen: "imagenes/imagenes-aventuras/lonja3.jpg",
    },

    // Parada 34: Lonja (Mercado de la Seda) Gárgolas 2 (Reto 32) (Párrafos: 385)
    {
        id: "P-34",
        tipo: "parada",
        parada: 34, // mapa número 19
        mapa_numero: 19,
        nombre: "Lonja (Gárgolas 2)",
        coordenadas: { lat: 39.47419, lng: -0.37871 },
        imagen: "imagenes/imagenes-aventuras/lonja.jpg",
    },

    // Parada 35: Lonja (Mercado de la Seda) Fornicador (Reto 33) (Párrafos: 386)
    {
        id: "P-35",
        tipo: "parada",
        parada: 35, // mapa número 19
        mapa_numero: 19,
        nombre: "Lonja (tallado ventana)",
        coordenadas: { lat: 39.47434, lng: -0.37878 },
        imagen: "imagenes/imagenes-aventuras/lonja6.jpg",
    },

    // Tramo 19: Rodeando la Lonja (Mercado de la Seda)(Párrafos: 388)
    {
        id: "TR-19",
        tipo: "tramo",
        tramo: 19, // De mapa número 19 a mapa número 19
        mapa_numero: "19→19",
        nombre: "Rodeando la Lonja",
        inicio: { lat: 39.47434, lng: -0.37878 },
        waypoints: [
            { lat: 39.47445, lng: -0.37889 },
        ],
        fin: { lat: 39.47456, lng: -0.3787 },
        imagen: "imagenes/imagenes-aventuras/Lonja_esquina_izquierda.jpg",
        imagen2: "imagenes/imagenes-aventuras/Lonja_patio_naranjos_far_view.jpg",
        imagen3: "imagenes/imagenes-aventuras/Lonja_patio_narajnos_close_view.jpg",
        video: "videos-aventuras/av1/tramo_19.mp4",
    },

    // Parada 36: Lonja (Mercado de la Seda) - Gárgola Torre (Párrafos: 390, 391)
    {
        id: "P-36",
        tipo: "parada",
        parada: 36, // mapa número 19
        mapa_numero: 19,
        nombre: "Lonja (Gárgola Torre)",
        coordenadas: { lat: 39.47456, lng: -0.3787 },
        imagen: "imagenes/imagenes-aventuras/lonja7.jpg",
    },

    // Tramo 20: Lonja (Mercado de la Seda) - Patio de los naranjos → Lonja entrada visitantes (Párrafos: 392)
    {
        id: "TR-20",
        tipo: "tramo",
        tramo: 20, // De mapa número 19 a mapa número 19
        mapa_numero: "19→19",
        nombre: "Lonja Patio de los naranjos → Lonja entrada visitantes",
        inicio: { lat: 39.47456, lng: -0.3787 },
        waypoints: [
            { lat: 39.47475, lng: -0.37842 },
        ],
        fin: { lat: 39.47466, lng: -0.37834 },
        imagen: "imagenes/imagenes-aventuras/Lonja_patio_narajnos_close_view.jpg",
        imagen2: "imagenes/imagenes-aventuras/Lonja-puerta-visitante.jpg",
        video: "videos-aventuras/av1/tramo_20.mp4",
    },

    // Tramo 21: Lonja (Mercado de la Seda) -entrada visitantes →  Plaza Doctor López Collado (Párrafos: 333, 397, 31)
    {
        id: "TR-21",
        tipo: "tramo",
        tramo: 21, // De mapa número 19 a mapa número 20
        mapa_numero: "19→20",
        nombre: "Lonja entrada visitantes →  Plaza Doctor López Collado",
        inicio: { lat: 39.47466, lng: -0.37834 },
        waypoints: [
            { lat: 39.47453, lng: -0.37819 },
            { lat: 39.47436, lng: -0.378 },
        ],
        fin: { lat: 39.47444, lng: -0.3779 },
        imagen: "imagenes/imagenes-aventuras/Lonja-puerta-visitante.jpg",
        imagen2: "imagenes/imagenes-aventuras/lonja2.jpg",
        imagen3: "imagenes/imagenes-aventuras/Plaza_collado.jpg",
        video: "videos-aventuras/av1/tramo_21.mp4",
    },

    // Parada 37: Plaza Doctor López Collado (Párrafos: 398)
    {
        id: "P-37",
        tipo: "parada",
        parada: 37, // mapa número 20
        mapa_numero: 20,
        nombre: "Plaza Doctor López Collado",
        coordenadas: { lat: 39.47444, lng: -0.3779 },
        imagen: "imagenes/imagenes-aventuras/lonja7.jpg",
        imagen2: "imagenes/imagenes-aventuras/Plaza_collado.jpg",
    },

    // Tramo 22: Plaza del Doctor López Collado → Plaza del Negrito (Párrafos: 198, 671, 522, 32-C)
    {
        id: "TR-22",
        tipo: "tramo",
        tramo: 22, // De mapa número 20 a mapa número 21
        mapa_numero: "20→21",
        nombre: "Plaza del Doctor Collado → Plaza del Negrito (Fuente del Negrito)",
        inicio: { lat: 39.47444, lng: -0.3779 },
        waypoints: [
            { lat: 39.47467, lng: -0.37766 },
            { lat: 39.47476, lng: -0.37759},
            { lat: 39.47493, lng: -0.37761 },
            { lat: 39.47529, lng: -0.37768 },
            { lat: 39.47559, lng: -0.37772 },
            { lat: 39.47585, lng: -0.37759 },
        ],
        fin: { lat: 39.47611, lng: -0.37741 },
        imagen: "imagenes/imagenes-aventuras/Plaza_collado.jpg",
        imagen2: "imagenes/imagenes-aventuras/Plaza_negrito.jpg",
        imagen3: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
        video: "videos-aventuras/av1/tramo_22.mp4",
    },

    // Parada 38: Fuente del Negrito (Reto 34) (Párrafos: 382, 501)
    {
        id: "P-38",
        tipo: "parada",
        parada: 38, // mapa número 21
        mapa_numero: 21,
        nombre: "Fuente del Negrito",
        coordenadas: { lat: 39.47611, lng: -0.37741 },
        imagen: "imagenes/imagenes-aventuras/Plaza_negrito.jpg",
        image2: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
    },

    // Tramo 23: Plaza del Negrito → Calle Caballeros (Párrafos: 33-B, 486, 480-B)
    {
        id: "TR-23",
        tipo: "tramo",
        tramo: 23, // De mapa número 21 a mapa número 22
        mapa_numero: "21→22",
        nombre: "Plaza del Negrito → Calle Caballeros",
        inicio: { lat: 39.47611, lng: -0.37741 },
        waypoints: [
            { lat: 39.47639, lng: -0.37736 },
            { lat: 39.47663, lng: -0.3773 },
            { lat: 39.47661, lng: -0.37685 }
        ],
        fin: { lat: 39.47661, lng: -0.37673 },
        imagen: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
        imagen2: "imagenes/imagenes-aventuras/Calle_caballeros.jpg",
        imagen3: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
        video: "videos-aventuras/av1/tramo_23.mp4",
    },

    // Parada 39: Palau de la Generalitat (Párrafos: 481-B, 482-B)
    {
        id: "P-39",
        tipo: "parada",
        parada: 39, // mapa número 23
        mapa_numero: 23,
        nombre: "Palau de la Generalitat",
        coordenadas: { lat: 39.47668, lng: -0.37671 },
        imagen: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
    },

     // Tramo 24: Palacio de la Generalitat → Calle de los Serranos (Párrafos: 2-D)
    {
        id: "TR-24",
        tipo: "tramo",
        tramo: 24, // De mapa número 23 a mapa número 1
        mapa_numero: "23→1",
        nombre: "Palacio de la Generalitat → Calle de los Serranos (FINAL)",
        inicio: { lat: 39.47668, lng: -0.37671 },
        waypoints: [
            { lat: 39.47687, lng: -0.37686 },
            { lat: 39.4773, lng: -0.37689 },
            { lat: 39.47773, lng: -0.37671 },
        ],
        fin: { lat: 39.47859, lng: -0.37633 },
        imagen:"imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
        imagen2: "imagenes/imagenes-aventuras/Calle_serranos.jpg",
        video: "videos-aventuras/av1/tramo_24.mp4"
    },

    // Parada 40 - FINAL: Torres de Serranos Final (Reto35Puzzle PZ-05) (Párrafos: 475, 503, 507, 526,)
    {
        id: "P-40",
        tipo: "parada",
        parada: 40, // mapa número 1
        mapa_numero: 1,
        nombre: "Torres de Serranos Final",
        coordenadas: { lat: 39.47859, lng: -0.37633 },
        imagen: "imagenes/imagenes-aventuras/Calle_serranos.jpg",
        imagen2: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg"
    },

      ]
    }
  },
Aventura2: {
    "coordenadas-hijo2.html": {
            coordenadas: [

    // poner las coordenadas específicas de los puntos a visitar del mapa. dibujarReferencias() ignora automáticamente las que tengan coordenadas: null.
    {
        tipo: "referencia",
        id: "REF-2",
        mapa_numero: 2,
        coordenadas: null,
        nombre: null,
    },
    {
        tipo: "referencia",
        id: "REF-4",
        mapa_numero: 4,
        coordenadas: null,
        nombre: null,
    },
    {
        tipo: "referencia",
        id: "REF-7",
        mapa_numero: 7,
        coordenadas: null,
        nombre: null,
    },
    {
        tipo: "referencia",
        id: "REF-22",
        mapa_numero: 22,
        coordenadas: null,
        nombre: null,
    },
    // ────---------------------------------------------

                // coordenadas completas hijo2 Aventura2 //

    // ─── CÓMO AÑADIR UNA REFERENCIA VISUAL ───────────────────────────────────
    // { tipo: "referencia", id: "REF-X", mapa_numero: X,
    //   coordenadas: { lat: XX.XXXXX, lng: -X.XXXXX },
    //   nombre: "Nombre del monumento" },
    // Colócala justo después de la parada que la menciona.
    // ─────────────────────────────────────────────────────────────────────────


                // Parada 0 - Torres de Serranos (start) (Reto 3) (Párrafos: 223, 226, 228)
                {
                    id: "P-0",
                    tipo: "inicio",
                    parada: 0, // mapa número 1
                    mapa_numero: 1,
                    nombre: "Torres de Serranos (start)",
                    coordenadas: { lat: 39.47876, lng: -0.37626 },
                    imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
                },

                // Parada 1 - Torres de Serranos (Reto 4) (Reto de la Bandera) (Párrafos: 229, 233)
                {
                    id: "P-1",
                    tipo: "parada",
                    parada: 1, // mapa número 1
                    mapa_numero: 1,
                    nombre: "Torres de Serranos (Historia de la bandera)",
                    coordenadas: { lat: 39.47876, lng: -0.37626 },
                    imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
                },

                // Parada 2 - Torres de Serranos (Historia de la bandera) (Párrafos: 641, 642, 643)
                {
                    id: "P-2",
                    tipo: "parada",
                    parada: 2, // mapa número 1
                    mapa_numero: 1,
                    nombre: "Torres de Serranos (Historia de la bandera)",
                    coordenadas: { lat: 39.47876, lng: -0.37626 },
                    imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
                },

                // Tramo 1 - Torres de Serranos → Refugio Guerra Civil (Párrafos: 103)
                {
                    id: "TR-1",
                    tipo: "tramo",
                    tramo: 1, // De mapa número 1 a mapa número 2
                    mapa_numero: "1→2",
                    nombre: "Torres de Serranos → Refugio Guerra Civil",
                    inicio: { lat: 39.47876, lng: -0.37626 },
                    waypoints:
                    [
                        { lat: 39.47855, lng:  -0.37635 },
                    ],
                    fin: { lat: 39.47831, lng: -0.37654 },
                    imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
                    imagen2: "imagenes/imagenes-aventuras/refugio_guerra_civil.jpg",
                    video: ""
                },

                // Parada 3 - Refugio Guerra Civil (Párrafos: 524, 395)
                {
                    id: "P-3",
                    tipo: "parada",
                    parada: 2, // mapa número 2
                    mapa_numero: 2,
                    nombre: "Refugio Guerra Civil",
                    coordenadas: { lat: 39.47831, lng: -0.37654 },
                    imagen: "imagenes/imagenes-aventuras/refugio_guerra_civil.jpg",
                },

                // Tramo 2 - Refugio Guerra Civil → Palau de la Generalitat (Párrafos: 104)
                {
                    id: "TR-2",
                    tipo: "tramo",
                    tramo: 2, // De mapa número 2 a mapa número 3
                    mapa_numero: "2→3",
                    nombre: "Refugio Guerra Civil → Palau de la Generalitat",
                    inicio: { lat: 39.47831, lng: -0.37654 },
                    waypoints:
                    [
                     { lat: 39.47808, lng: -0.37656 },
                     { lat: 39.47773, lng: -0.37671 },
                     { lat: 39.47751, lng: -0.37682 },
                     { lat: 39.47731, lng: -0.37688 },
                     { lat: 39.47688, lng: -0.37686 },
                     { lat: 39.47681, lng: -0.37669 },
                    ],
                    fin: { lat: 39.47668, lng: -0.37671 },
                    imagen: "imagenes/imagenes-aventuras/refugio_guerra_civil.jpg",
                    imagen2: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
                    video: ""
                },

                // Parada 4 - Palau de la Generalitat (Reto 5) (Párrafos: 481, 482, 482-B, 483)
                {
                    id: "P-4",
                    tipo: "parada",
                    parada: 4, // mapa número 3
                    mapa_numero: 3,
                    nombre: "Palau de la Generalitat",
                    coordenadas: { lat: 39.47668, lng: -0.37671 },
                    imagen: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
                },

                // Tramo 3 - Palau de la Generalitat → Calle Caballeros (Párrafos: 104)
                {
                    id: "TR-3",
                    tipo: "tramo",
                    tramo: 3, // De mapa número 3 a mapa número 4
                    mapa_numero: "3→4",
                    nombre: "Palau de la Generalitat → Calle Caballeros",
                    inicio: { lat: 39.47668, lng: -0.37671 },
                    waypoints: [],
                    fin: { lat: 39.47659, lng: -0.37694 },
                    imagen: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
                    imagen2: "imagenes/imagenes-aventuras/Calle_caballeros.jpg",
                    video: ""
                },

                // Tramo 4 - Calle Caballeros → Iglesia de San Nicolás (Párrafos: 487-B)
                {
                    id: "TR-4",
                    tipo: "tramo",
                    tramo: 4, // De mapa número 4 a mapa número 5
                    mapa_numero: "4→5",
                    nombre: "Calle Caballeros → Iglesia de San Nicolás",
                    inicio: { lat: 39.47659, lng: -0.37694 },
                    waypoints:
                    [
                        { lat: 39.4766, lng: -0.37686 },
                        { lat: 39.47663, lng: -0.37783 },
                        { lat: 39.47667, lng: -0.37838 },
                        { lat: 39.47662, lng: -0.37865 },
                    ],
                    fin: { lat: 39.47657, lng: -0.37883 },
                    imagen: "imagenes/imagenes-aventuras/Calle_caballeros.jpg",
                    imagen2: "imagenes/imagenes-aventuras/iglesia_san_nicolas_front.jpg",
                    video: ""
                },

                // Parada 5 - Iglesia de San Nicolás FRONT (Reto6puzzle PZ-06) (Párrafos: 488, 489, 490)
                {
                    id: "P-5",
                    tipo: "parada",
                    parada: 5, // mapa número 5
                    mapa_numero: 5,
                    nombre: "Iglesia de San Nicolás FRONT",
                    coordenadas: { lat: 39.47657, lng: -0.37883 },
                    imagen: "imagenes/imagenes-aventuras/iglesia_san_nicolas_front.jpg",
                },

                // Tramo 5 - Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK (Párrafos: 491, 10)
                {
                    id: "TR-5",
                    tipo: "tramo",
                    tramo: 5, // De mapa número 5 a mapa número 6
                    mapa_numero: "5→6",
                    nombre: "Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK",
                    inicio: { lat: 39.47657, lng: -0.37883 },
                    waypoints:
                    [
                        { lat: 39.47655, lng: -0.37918 },
                        { lat: 39.47632, lng: -0.37917 },
                    ],
                    fin: { lat: 39.4761, lng: -0.37918 },
                    imagen: "imagenes/imagenes-aventuras/iglesia_san_nicolas_front.jpg",
                    imagen2: "imagenes/imagenes-aventuras/iglesia_san_nicolas_back.jpg",
                    video: ""
                },

                // Parada 6 - Iglesia de San Nicolás BACK (Reto 6) (Párrafos: 493, 494-B, 496)
                {
                    id: "P-6",
                    tipo: "parada",
                    parada: 6, // mapa número 6
                    mapa_numero: 6,
                    nombre: "Iglesia de San Nicolás BACK",
                    coordenadas: { lat: 39.4761, lng: -0.37918 },
                    imagen: "imagenes/imagenes-aventuras/Iglesia_San_Nicolas_esquina_back.jpg",
                },

                // Parada 7 - Iglesia de San Nicolás BACK (Reto 8) (Párrafos: 497, 498)
                {
                    id: "P-7",
                    tipo: "parada",
                    parada: 7, // mapa número 6
                    mapa_numero: 6,
                    nombre: "Iglesia de San Nicolás BACK",
                    coordenadas: { lat: 39.47607, lng: -0.37918 },
                    imagen: "imagenes/imagenes-aventuras/iglesia_san_nicolas_back.jpg",
                },

                // Parada 8 - Iglesia de San Nicolás BACK (Reto 9) (Párrafos: 504, 505)
                {
                    id: "P-8",
                    tipo: "parada",
                    parada: 8, // mapa número 6
                    mapa_numero: 6,
                    nombre: "Iglesia de San Nicolás BACK",
                    coordenadas: { lat: 39.47605, lng: -0.37915 },
                    imagen: "imagenes/imagenes-aventuras/Iglesia_San_Nicolas_esquina_back.jpg",
                },

                // Tramo 6 - Iglesia de San Nicolás BACK → Plaza del Negrito (Párrafos: 499, 500-B)
                {
                    id: "TR-6",
                    tipo: "tramo",
                    tramo: 6, // De mapa número 6 a mapa número 7
                    mapa_numero: "6→7",
                    nombre: "Iglesia de San Nicolás BACK → Plaza del Negrito",
                    inicio: { lat: 39.47605, lng: -0.37915 },
                    waypoints:
                    [
                        { lat: 39.47603, lng: -0.37891 },
                        { lat: 39.47598, lng: -0.37854 },
                        { lat: 39.4759, lng: -0.37811 },
                        { lat: 39.47581, lng: -0.37768 },
                        { lat: 39.47595, lng: -0.37752 },


                    ],
                    fin: { lat: 39.47611, lng: -0.37741 },
                    imagen: "imagenes/imagenes-aventuras/Iglesia_San_Nicolas_esquina_back.jpg",
                    imagen2: "imagenes/imagenes-aventuras/Plaza_negrito.jpg",
                    imagen3: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
                    video: ""
                },

                // Parada 9 - Plaza del Negrito (Reto 10) (Párrafos: 382, 501)
                {
                    id: "P-9",
                    tipo: "parada",
                    parada: 9, // mapa número 7
                    mapa_numero: 7,
                    nombre: "Plaza del Negrito",
                    coordenadas: { lat: 39.47611, lng: -0.37741 },
                    imagen: "imagenes/imagenes-aventuras/Plaza_negrito.jpg",
                    imagen2: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
                },

                // Tramo 7 - Plaza del Negrito → Calle Caballeros → Plaza del Tossal (Párrafos: 502-B, 506, 12)
                {
                    id: "TR-7",
                    tipo: "tramo",
                    tramo: 7, // De mapa número 7 a mapa número 4 y mapa número 8
                    mapa_numero: "7→4→8",
                    nombre: "Plaza del Negrito → Calle Caballeros → Plaza del Tossal",
                    inicio: { lat: 39.47611, lng: -0.37741 },
                    waypoints:
                    [
                        { lat: 39.47631, lng: -0.37737 },
                        { lat: 39.47649, lng: -0.37734 },
                        { lat: 39.47662, lng: -0.37733 },
                        { lat: 39.47663, lng: -0.37783 },
                        { lat: 39.47667, lng: -0.37838 },
                        { lat: 39.47662, lng: -0.37865 },
                        { lat: 39.47656, lng: -0.37911 },
                        { lat: 39.47651, lng: -0.37944 },
                        { lat: 39.47646, lng: -0.37972 },
                    ],
                    fin: { lat: 39.47639, lng: -0.38001 },
                    imagen: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
                    imagen2: "imagenes/imagenes-aventuras/Calle_caballeros.jpg",
                    imagen3: "imagenes/imagenes-aventuras/plaza_del_tossal.jpg",
                    video: ""
                },

                // Parada 10 - Plaza del Tossal (Reto 11) (Párrafos: 12-C, 508, 509)
                {
                    id: "P-10",
                    tipo: "parada",
                    parada: 10, // mapa número 8
                    mapa_numero: 8,
                    nombre: "Plaza del Tossal",
                    coordenadas: { lat: 39.47639, lng: -0.38001 },
                    imagen: "imagenes/imagenes-aventuras/plaza_del_tossal.jpg",
                },

                // Parada 11 - Plaza del Tossal (Párrafos: 510, 511)
                {
                    id: "P-11",
                    tipo: "parada",
                    parada: 11, // mapa número 8
                    mapa_numero: 8,
                    nombre: "Plaza del Tossal",
                    coordenadas: { lat: 39.47636, lng: -0.37999 },
                    imagen: "imagenes/imagenes-aventuras/plaza_del_tossal.jpg",
                },

                // Tramo 8 - Plaza del Tossal → Portal de la Valldigna (Párrafos: 512, 13-C)
                {
                    id: "TR-8",
                    tipo: "tramo",
                    tramo: 8, // De mapa número 8 a mapa número 9
                    mapa_numero: "8→9",
                    nombre: "Plaza del Tossal → Portal de la Valldigna",
                    inicio: { lat: 39.47636, lng: -0.37999 },
                    waypoints:
                    [
                        { lat: 39.47652, lng: -0.37994 },
                        { lat: 39.47677, lng: -0.37983 },
                        { lat: 39.47701, lng: -0.37969 },
                        { lat: 39.47733, lng: -0.37957 },
                        { lat: 39.47756, lng: -0.37945 },
                        { lat: 39.47776, lng: -0.37915 },
                        { lat: 39.47766, lng: -0.37889 },
                    ],
                    fin: { lat: 39.47755, lng: -0.3786 },
                    imagen: "imagenes/imagenes-aventuras/plaza_del_tossal.jpg",
                    imagen2: "imagenes/imagenes-aventuras/portal-de-la_valldigna.jpg",
                    video: ""
                },

                // Parada 12 - Portal de la Valldigna (Párrafos: 513, 589, 144)
                {
                    id: "P-12",
                    tipo: "parada",
                    parada: 12, // mapa número 9
                    mapa_numero: 9,
                    nombre: "Portal de la Valldigna",
                    coordenadas: { lat: 39.47755, lng: -0.3786 },
                    imagen: "imagenes/imagenes-aventuras/portal-de-la_valldigna.jpg",
                },

                // Tramo 9 - Portal de la Valldigna → Torre del Ángel (Torre árabe) (Párrafos: 560, 514, 14-C)
                {
                    id: "TR-9",
                    tipo: "tramo",
                    tramo: 9, // De mapa número 9 a mapa número 10
                    mapa_numero: "9→10",
                    nombre: "Portal de la Valldigna → Torre del Ángel (Torre árabe)",
                    inicio: { lat: 39.47755, lng: -0.3786 },
                    waypoints:
                    [
                        { lat: 39.47747, lng: -0.37815 },
                        { lat: 39.47743, lng: -0.37798 },
                        { lat: 39.47768, lng: -0.37795 },
                        { lat: 39.47777, lng: -0.37794 },
                        { lat: 39.47801, lng: -0.37786 },
                    ],
                    fin: { lat: 39.47803, lng: -0.37791 },
                    imagen: "imagenes/imagenes-aventuras/portal-de-la_valldigna.jpg",
                    imagen2: "imagenes/imagenes-aventuras/torre-del_angel_arabe.jpg",
                    video: ""
                },

                // Parada 13 - Torre del Ángel (Torre árabe) (Reto 12) (Párrafos: 515, 516, 517, 518, 519)
                {
                    id: "P-13",
                    tipo: "parada",
                    parada: 13, // mapa número 10
                    mapa_numero: 10,
                    nombre: "Torre del Ángel (Torre árabe)",
                    coordenadas: { lat: 39.47803, lng: -0.37791 },
                    imagen: "imagenes/imagenes-aventuras/torre-del_angel_arabe.jpg",
                    video: ""
                },

                // Tramo 10 - Torre del Ángel (Torre árabe) → Plaza de la Virgen (Párrafos: 521, 522, 671, 520, 105, 15-B)
                {
                    id: "TR-10",
                    tipo: "tramo",
                    tramo: 10, // De mapa número 10 a mapa número 11
                    mapa_numero: "10→11",
                    nombre: "Torre del Ángel (Torre árabe) → Plaza de la Virgen",
                    inicio: { lat: 39.47803, lng: -0.37791 },
                    waypoints:
                    [
                        { lat: 39.47795, lng: -0.37773 },
                        { lat: 39.4781, lng: -0.37759 },
                        { lat: 39.47806, lng: -0.3773 },
                        { lat: 39.47797, lng: -0.37691 },
                        { lat: 39.47791, lng: -0.37662 },
                        { lat: 39.47775, lng: -0.37671 },
                        { lat: 39.47756, lng: -0.37679 },
                        { lat: 39.4774, lng: -0.37686 },
                        { lat: 39.4774, lng: -0.37672 },
                        { lat: 39.4773, lng: -0.37638 },
                        { lat: 39.47731, lng: -0.37632 },
                        { lat: 39.47761, lng: -0.37615 },
                        { lat: 39.47764, lng: -0.3761 },
                        { lat: 39.47758, lng: -0.3759 },
                        { lat: 39.47754, lng: -0.37575 },
                        { lat: 39.4775, lng: -0.37558 },
                        { lat: 39.47747, lng: -0.37545 },
                        { lat: 39.47741, lng: -0.37518 },
                        { lat: 39.47735, lng: -0.375 },
                        { lat: 39.47728, lng: -0.37501},
                        { lat: 39.47704, lng: -0.37507 },
                        { lat: 39.47686, lng: -0.37511 },
                        { lat: 39.47662, lng: -0.37515 },
                    ],
                    fin: { lat: 39.4766, lng: -0.37529 },
                    imagen: "imagenes/imagenes-aventuras/torre-del_angel_arabe.jpg",
                    imagen2: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
                    video: ""
                },

                // Parada 14 - Plaza de la Virgen - Introducción (Reto13Puzzle PZ-01) (Párrafos: 702, 346, 143)
                {
                    id: "P-14",
                    tipo: "parada",
                    parada: 14, // mapa número 11
                    mapa_numero: 11,
                    nombre: "Plaza de la Virgen - Introducción",
                    coordenadas: { lat: 39.4766, lng: -0.37529 },
                    imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
                },

                // Parada 15 - Plaza de la Virgen - Fuente Neptuno (Reto 14) (Párrafos: 466, 467)
                {
                    id: "P-15",
                    tipo: "parada",
                    parada: 15, // mapa número 11
                    mapa_numero: 11,
                    nombre: "Plaza de la Virgen - Fuente Neptuno",
                    coordenadas: { lat: 39.4766, lng: -0.37528 },
                    imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
                },

                // Parada 16 - Plaza de la Virgen - Ofrenda (Reto 15) (Párrafos: 469, 472, 473, 690, 468)
                {
                    id: "P-16",
                    tipo: "parada",
                    parada: 16, // mapa número 11
                    mapa_numero: 11,
                    nombre: "Plaza de la Virgen - Ofrenda",
                    coordenadas: { lat: 39.4766, lng: -0.37527 },
                    imagen: "imagenes/imagenes-aventuras/Ofrenda_Virgen_back.jpg",
                    imagen2: "imagenes/imagenes-aventuras/Ofrenda_virgen_front.jpg",
                },

                // Parada 17 - Plaza de la Virgen - Basílica (Párrafos: 146, 450, 451, 452)
                {
                    id: "P-17",
                    tipo: "parada",
                    parada: 17, // mapa número 11
                    mapa_numero: 11,
                    nombre: "Plaza de la Virgen - Basílica",
                    coordenadas: { lat: 39.4766, lng: -0.37526 },
                    imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
                },

                // Parada 18 - Plaza de la Virgen - Cimborrio Catedral de Valencia (Reto 16) (Párrafos: 476, 355, 464)
                {
                    id: "P-18",
                    tipo: "parada",
                    parada: 18, // mapa número 11
                    mapa_numero: 11,
                    nombre: "Plaza de la Virgen - Cimborrio Catedral de Valencia",
                    coordenadas: { lat: 39.4766, lng: -0.37525 },
                    imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
                },

                // Parada 19 - Plaza de la Virgen - Historia de la Catedral de Valencia (Párrafos: 147, 149, 150)
                {
                    id: "P-19",
                    tipo: "parada",
                    parada: 19, // mapa número 11
                    mapa_numero: 11,
                    nombre: "Plaza de la Virgen - Historia de la Catedral de Valencia",
                    coordenadas: { lat: 39.4766, lng: -0.37524 },
                    imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
                },

                // Tramo 11 - Plaza de la Virgen → Puerta Gótica de la Catedral de Valencia (Párrafos: 477, 478, 479)
                {
                    id: "TR-11",
                    tipo: "tramo",
                    tramo: 11, // De mapa número 11 a sin número de mapa (Puerta gótica Catedral de Valencia)
                    mapa_numero: "11→-",
                    nombre: "Plaza de la Virgen → Puerta Gótica de la Catedral de Valencia",
                    inicio: { lat: 39.4766, lng: -0.37524 },
                    waypoints:
                    [
                      { lat: 39.47649, lng: -0.37505 },
                      { lat: 39.47631, lng: -0.37506 },
                      { lat: 39.47608, lng: -0.37507 },
                    ],
                    fin: { lat: 39.47604, lng: -0.37515 },
                    imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
                    imagen2: "imagenes/imagenes-aventuras/puerta_gotica_catedral_2.jpg",
                    imagen3: "imagenes/imagenes-aventuras/Puerta_gotica_catedral.jpg",
                    video: ""
                },

                // Tramo 12 - Puerta Gótica de la Catedral de Valencia → Torre del Miguelete y Puerta de los Hierros (Barroca) de la Catedral de Valencia (Párrafos: 440, 426, 19, 695)
                {
                    id: "TR-12",
                    tipo: "tramo",
                    tramo: 12, // De mapa sin número a mapa número 12 y mapa número 13
                    mapa_numero: "-→12→13",
                    nombre: "Puerta Gótica de la Catedral de Valencia → Torre del Miguelete y Puerta de los Hierros (Barroca) de la Catedral de Valencia",
                    inicio: { lat: 39.47604, lng: -0.37515 },
                    waypoints:
                    [
                        { lat: 39.476, lng: -0.37522 },
                        { lat: 39.4758, lng: -0.37539 },
                        { lat: 39.47558, lng: -0.37556 },
                        { lat: 39.47541, lng: -0.37569 },
                        { lat: 39.47526, lng: -0.37579 },
                    ],
                    fin: { lat: 39.47522, lng: -0.37565 },
                    imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
                    video: ""
                },

                // Parada 20 - Torre del Miguelete (Reto 17) (Párrafos: 427)
                {
                    id: "P-20",
                    tipo: "parada",
                    parada: 20, // mapa número 12
                    mapa_numero: 12,
                    nombre: "Torre del Miguelete",
                    coordenadas: { lat: 39.47522, lng: -0.37565 },
                    imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
                },

                // Parada 21 - Torre del Miguelete 2 (Reto 18) (Párrafos: 428)
                {
                    id: "P-21",
                    tipo: "parada",
                    parada: 21, // mapa número 12
                    mapa_numero: 12,
                    nombre: "Torre del Miguelete 2",
                    coordenadas: { lat: 39.47523, lng: -0.37567 },
                    imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
                },

                // Parada 22 - Puerta de los Hierros (Barroca) de la Catedral de Valencia (Reto 19) (Párrafos: 430, 432, 431)
                {
                    id: "P-22",
                    tipo: "parada",
                    parada: 22, // mapa número 13
                    mapa_numero: 13,
                    nombre: "Puerta de los Hierros (Barroca) de la Catedral de Valencia",
                    coordenadas: { lat: 39.47521, lng: -0.37561 },
                    imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
                },

                // Tramo 13 - Puerta de los Hierros (Barroca) de la Catedral de Valencia → Torre Barroca de la Iglesia de Santa Catalina (Párrafos: 21-C, 694, 419)
                {
                    id: "TR-13",
                    tipo: "tramo",
                    tramo: 13, // De mapa número 13 a mapa número 14
                    mapa_numero: "13→14",
                    nombre: "Puerta de los Hierros (Barroca) de la Catedral de Valencia → Torre Barroca de la Iglesia de Santa Catalina",
                    inicio: { lat: 39.47521, lng: -0.37561 },
                    waypoints:
                    [
                        { lat: 39.47517, lng: -0.37549 },
                        { lat: 39.47496, lng: -0.37559 },
                        { lat: 39.47487, lng: -0.37563 },
                        { lat: 39.47477, lng: -0.37565 },
                        { lat: 39.4746, lng: -0.3757 },
                        { lat: 39.47437, lng: -0.37574 },
                        { lat: 39.47421, lng: -0.37573 },
                        { lat: 39.474, lng: -0.37572 },
                    ],
                    fin: { lat: 39.47383, lng: -0.37571 },
                    imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
                    imagen2: "imagenes/imagenes-aventuras/Plaza_Reina_2.jpg",
                    imagen3: "imagenes/imagenes-aventuras/torre_santa_catalina.jpg",
                    video: ""
                },

                // Parada 23 - Torre Barroca de Santa Catalina (Reto 20) (Párrafos: 425, 420, 423)
                {
                    id: "P-23",
                    tipo: "parada",
                    parada: 23, // mapa número 14
                    mapa_numero: 14,
                    nombre: "Torre Barroca de Santa Catalina",
                    coordenadas: { lat: 39.47383, lng: -0.37571 },
                    imagen: "imagenes/imagenes-aventuras/torre_santa_catalina.jpg",
                },

                // Parada 24 - Torre Barroca de Santa Catalina 2 (Reto 21) (Párrafos: 421, 422)
                {
                    id: "P-24",
                    tipo: "parada",
                    parada: 24, // mapa número 14
                    mapa_numero: 14,
                    nombre: "Torre Barroca de Santa Catalina 2",
                    coordenadas: { lat: 39.47383, lng: -0.37572 },
                    imagen: "imagenes/imagenes-aventuras/torre_santa_catalina.jpg",
                },

                // Tramo 14 - Torre Barroca de la Iglesia de Santa Catalina → Plaza Lope de Vega (Párrafos: 119, 22-B, 411, 412)
                {
                    id: "TR-14",
                    tipo: "tramo",
                    tramo: 14, // De mapa número 14 a mapa número 15
                    mapa_numero: "14→15",
                    nombre: "Torre Barroca de la Iglesia de Santa Catalina → Plaza Lope de Vega",
                    inicio: { lat: 39.47383, lng: -0.37572 },
                    waypoints:
                    [
                        { lat: 39.47386, lng: -0.37604 },
                        { lat: 39.4739, lng: -0.37639 },
                        { lat: 39.47392, lng: -0.37671 },
                    ],
                    fin: { lat: 39.47404, lng: -0.37675 },
                    imagen: "imagenes/imagenes-aventuras/torre_santa_catalina.jpg",
                    imagen2: "imagenes/imagenes-aventuras/iglesia_santa_catalina.jpg",
                    video: ""
                },

                // Parada 25 - Plaza Lope de Vega - Iglesia de Santa Catalina (Párrafos: 413, 414)
                {
                    id: "P-25",
                    tipo: "parada",
                    parada: 25, // mapa número 15
                    mapa_numero: 15,
                    nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina",
                    coordenadas: { lat: 39.47404, lng: -0.37674 },
                    imagen: "imagenes/imagenes-aventuras/iglesia_santa_catalina.jpg",
                },

                // Parada 26 - Plaza Lope de Vega - Iglesia de Santa Catalina 2 (Reto 22) (Párrafos: 417, 416)
                {
                    id: "P-26",
                    tipo: "parada",
                    parada: 26, // mapa número 15
                    mapa_numero: 15,
                    nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina 2",
                    coordenadas: { lat: 39.47404, lng: -0.37675 },
                    imagen: "imagenes/imagenes-aventuras/iglesia_santa_catalina.jpg",
                },

                // Parada 27 - Plaza Lope de Vega - Edificio estrecho (Reto 23) (Párrafos: 408, 409, 410)
                {
                    id: "P-27",
                    tipo: "parada",
                    parada: 27, // mapa número 15
                    mapa_numero: 15,
                    nombre: "Plaza Lope de Vega - Edificio estrecho",
                    coordenadas: { lat: 39.47404, lng: -0.37675 },
                    imagen: "imagenes/imagenes-aventuras/edificio_estrecho.jpg",
                },

                // Tramo 15 - Plaza Lope de Vega → Plaza Redonda (Párrafos: 405-B, 151)
                {
                    id: "TR-15",
                    tipo: "tramo",
                    tramo: 15, // De mapa número 15 a mapa número 16
                    mapa_numero: "15→16",
                    nombre: "Plaza Lope de Vega → Plaza Redonda",
                    inicio: { lat: 39.47404, lng: -0.37675 },
                    waypoints:
                    [
                        { lat: 39.47394, lng: -0.37681 },
                        { lat: 39.4738, lng: -0.37677 },
                    ],
                    fin: { lat: 39.47369, lng: -0.37668 },
                    imagen: "imagenes/imagenes-aventuras/iglesia_santa_catalina.jpg",
                    imagen2: "imagenes/imagenes-aventuras/plaza_redonda.jpg",
                    video: ""
                },

                // Parada 28 - Plaza Redonda (Reto24Puzzle PZ-07) (Párrafos: 406)
                {
                    id: "P-28",
                    tipo: "parada",
                    parada: 28, // mapa número 16
                    mapa_numero: 16,
                    nombre: "Plaza Redonda",
                    coordenadas: { lat: 39.47369, lng: -0.37668 },
                    imagen: "imagenes/imagenes-aventuras/plaza_redonda.jpg",
                },

                // Tramo 16 - Plaza Redonda → Plaza Milagro del Mocaoret (Párrafos: 24-E)
                {
                    id: "TR-16",
                    tipo: "tramo",
                    tramo: 16, // De mapa número 16 a mapa número 17
                    mapa_numero: "16→17",
                    nombre: "Plaza Redonda → Plaza Milagro del Mocaoret",
                    inicio: { lat: 39.47369, lng: -0.37668 },
                    waypoints:
                    [
                        { lat: 39.4738, lng: -0.37677 },
                        { lat: 39.47394, lng: -0.37681 },
                        { lat: 39.47409, lng: -0.37673 },
                        { lat: 39.47422, lng: -0.37677 },
                        { lat: 39.47426, lng: -0.37653 },
                        { lat: 39.47443, lng: -0.3765 },

                    ],
                    fin: { lat: 39.47441, lng: -0.37633 },
                    imagen: "imagenes/imagenes-aventuras/iglesia_santa_catalina.jpg",
                    imagen2: "imagenes/imagenes-aventuras/milagro_del_mocaoret.jpg",
                    video: ""
                },

                // Parada 29 - Plaza Milagro del Mocaoret (Párrafos: 394, 399, 152, 400, 401-B, 402)
                {
                    id: "P-29",
                    tipo: "parada",
                    parada: 29, // mapa número 17
                    mapa_numero: 17,
                    nombre: "Plaza Milagro del Mocaoret",
                    coordenadas: { lat: 39.47441, lng: -0.37633 },
                    imagen: "imagenes/imagenes-aventuras/milagro_del_mocaoret.jpg",
                },

                // Tramo 17 - Plaza Milagro del Mocaoret → Tapinería (Párrafos: 333, 424, 492)
                {
                    id: "TR-17",
                    tipo: "tramo",
                    tramo: 17, // De mapa número 17 a sin número de mapa (Tapinería)
                    mapa_numero: "17→-",
                    nombre: "Plaza Milagro del Mocaoret → Tapinería",
                    inicio: { lat: 39.47441, lng: -0.37633 },
                    waypoints:
                    [
                        { lat: 39.47456, lng: -0.37627 },
                        { lat: 39.47468, lng: -0.37623 },
                        { lat: 39.47473, lng: -0.37641 },
                        { lat: 39.47478, lng: -0.3764 },
                        { lat: 39.47482, lng: -0.37657 },

                    ],
                    fin: { lat: 39.47497, lng: -0.37668 },
                    imagen: "imagenes/imagenes-aventuras/milagro_del_mocaoret.jpg",
                    imagen2: "imagenes/imagenes-aventuras/mercado_de_tapineria.jpg",
                    video: ""
                },

                // Tramo 18 - Tapinería → Palau de la Generalitat (Párrafos: 6-C)
                {
                    id: "TR-18",
                    tipo: "tramo",
                    tramo: 18, // sin número en el mapa (Tapinería) a mapa número 3
                    mapa_numero: "-→3",
                    nombre: "Tapinería → Palau de la Generalitat",
                    inicio: { lat: 39.47497, lng: -0.37668 },
                    waypoints:
                    [
                        { lat: 39.47517, lng: -0.37664 },
                        { lat: 39.47536, lng: -0.3766 },
                        { lat: 39.47547, lng: -0.37679 },
                        { lat: 39.4757, lng: -0.37694 },
                        { lat: 39.47587, lng: -0.37697 },
                        { lat: 39.47588, lng: -0.37687 },
                        { lat: 39.4761, lng: -0.37689 },
                        { lat: 39.47643, lng: -0.37692 },
                        { lat: 39.47659, lng:  -0.37692 },
                    ],
                    fin: { lat: 39.47668, lng: -0.37678 },
                    imagen: "imagenes/imagenes-aventuras/mercado_de_tapineria.jpg",
                    video: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg"
                },

                // Tramo 19 - Palau de la Generalitat → Torres de Serranos - Final (Párrafos: 2-B)               // Parada 29 - FINAL: Torres de Serranos - Final (Reto24Puzzle PZ-05) (Párrafos: 475, 503, 507, 526)
                {
                    id: "TR-19",
                    tipo: "tramo",
                    tramo: 19,
                    mapa_numero: "3→1",
                    nombre: "Palau de la Generalitat → Torres de Serranos - Final",
                    inicio: { lat: 39.47668, lng: -0.37678 },
                    waypoints:
                    [
                            { lat: 39.47684, lng: -0.37687 },
                            { lat: 39.47727, lng: -0.37689 },
                            { lat: 39.47739, lng: -0.37687 },
                            { lat: 39.47754, lng: -0.3768 },
                    ],
                    fin: { lat: 39.47859, lng: -0.37633 },
                    imagen: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
                    imagen2: "imagenes/imagenes-aventuras/Calle_serranos.jpg",
                    imagen3: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
                },

                // Parada 30 - FINAL: Torres de Serranos Final (Reto25Puzzle PZ-05) (Párrafos: 475, 503, 507, 526,)
                {
                    id: "P-30",
                    tipo: "parada",
                    parada: 30, // mapa número 1
                    mapa_numero: 1,
                    nombre: "Torres de Serranos Final",
                    coordenadas: { lat: 39.47859, lng: -0.37633 },
                    imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg"
                },
            ]
    }
  },
  Aventura3: {
    "coordenadas-hijo2.html": {
      coordenadas:
      [

    // poner las coordenadas específicas de los puntos a visitar del mapa. dibujarReferencias() ignora automáticamente las que tengan coordenadas: null.
    {
        tipo: "referencia",
        id: "REF-2",
        mapa_numero: 2,
        coordenadas: null,
        nombre: null,
    },
    {
        tipo: "referencia",
        id: "REF-4",
        mapa_numero: 4,
        coordenadas: null,
        nombre: null,
    },
    {
        tipo: "referencia",
        id: "REF-7",
        mapa_numero: 7,
        coordenadas: null,
        nombre: null,
    },
    {
        tipo: "referencia",
        id: "REF-22",
        mapa_numero: 22,
        coordenadas: null,
        nombre: null,
    },
    // ────---------------------------------------------

    // Coordenadas completas Aventura 3
        // Parada 0 - Torres de Serranos (start) (Reto 3) (Párrafos: 223, 226, 228)
    {
        id: "P-0",
        tipo: "inicio",
        parada: 0, // mapa número 1
        mapa_numero: 1,
        nombre: "Torres de Serranos (start)",
        coordenadas: { lat: 39.47876, lng: -0.37626 },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
    },

    // Tramo 1: Torres de Serranos → Plaza de la Crída (Torres de Serranos Front)(Parrafos: 229, 5)
    {
        id: "TR-1",
        tipo: "tramo",
        tramo: 1, // De mapa número 1 a mapa número 2
        mapa_numero: "1→2",
        nombre: "Torres de Serranos → Plaza de la Crída (Torres de Serranos Front)",
        inicio: { lat: 39.47876, lng: -0.37626 },
         waypoints: [
            { lat: 39.47905, lng: -0.37613 },
            { lat: 39.479341, lng: -0.376408 },
            { lat: 39.4795, lng:  -0.37621 },
            { lat: 39.47943, lng: -0.37597 }
        ],
        fin: { lat: 39.47959, lng: -0.37583 },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
        imagen2: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        video: "",
    },
    // Parada 1: Plaza de la Crída (Torres de Serranos Front) (Reto 4) (Parrafos: 126, 233)
    {
        id: "P-1",
        tipo: "parada",
        parada: 1, // mapa número 2
        mapa_numero: 2,
        nombre: "Plaza de la Crída (Torres de Serranos Front)",
        coordenadas: { lat: 39.48062, lng: -0.37535 },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
    },
    // Tramo 2: Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos 1 (Parrafos: 230, 231)
    {
        id: "TR-2",
        tipo: "tramo",
        tramo: 2, // De mapa número 1 a sin número de mapa (Centro Puente de Serranos)
        mapa_numero: "1→2",
        nombre: "Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos",
        inicio: { lat: 39.48062, lng: -0.37535 },
        waypoints:
        [
            { lat: 39.48026, lng: -0.37553 },
        ],
        fin: { lat: 39.48062, lng: -0.37535 },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_serranos_2.jpg",
        imagen3:"imagenes/imagenes-aventuras/puente_serranos.jpg",
        video: "",
    },
    // Parada 2: Centro Puente Serranos 1 (Reto 5) (Parrafos: 608, 609, 610)
    {
        id: "P-2",
        tipo: "parada",
        parada: 2, // Sin número de mapa
        mapa_numero: null,
        nombre: "Centro Puente Serranos",
        coordenadas: { lat: 39.48062, lng: -0.37535 },
        imagen: "imagenes/imagenes-aventuras/puente_serranos.jpg",
    },
    // Parada 3: Centro Puente Serranos 2 (Parrafos: 602, 232, 234, 8, 235, 224)
    {
        id: "P-3",
        tipo: "parada",
        parada: 3, // Sin número de mapa
        mapa_numero: null,
        nombre: "Centro Puente Serranos 2",
        coordenadas: { lat: 39.48064, lng: -0.37534 },
        imagen: "",
        imagen2: "imagenes/imagenes-aventuras/museo de bellas artes.jpg",
    },
    // Tramo 3: Centro Puente de Serranos 2 → Ruinas del Jardín del Turia (Parrafos: 236, 644, 7-B)
    {
        id: "TR-3",
        tipo: "tramo",
        tramo: 3, // De sin número de mapa (Centro Puente de Serranos 2) a mapa número 6
        mapa_numero: "-→6",
        nombre: "Centro Puente de Serranos 2 → Ruinas del Jardín del Turia",
        inicio: { lat: 39.48064, lng: -0.37534 },
        waypoints:
        [
            { lat: 39.48002, lng: -0.37564 },
            { lat: 39.47957, lng: -0.37588 },
            { lat: 39.47948, lng: -0.3758 },
            { lat: 39.47927, lng: -0.37533 },
            { lat: 39.47924, lng: -0.37522 },
            { lat: 39.47917, lng: -0.37506 },
            { lat: 39.47911, lng: -0.37492 },
            { lat: 39.47906, lng: -0.37484 },
            { lat: 39.47904, lng: -0.37478 },
            { lat: 39.47898, lng: -0.37468 },
            { lat: 39.47893, lng: -0.37456 },
            { lat: 39.47887, lng: -0.37443 },
            { lat: 39.47864, lng: -0.37391 },
            { lat: 39.47849, lng: -0.37354 },
            { lat: 39.47835, lng: -0.37322 },
            { lat: 39.47815, lng: -0.37292 },
            { lat: 39.47821, lng: -0.37279 },
            { lat: 39.47792, lng: -0.37232 },
            { lat: 39.47772, lng: -0.37199 },
            { lat: 39.47772, lng: -0.37197 },
            { lat: 39.47773, lng: -0.37195 },
            { lat: 39.47779, lng: -0.37191 },
            { lat: 39.47789, lng: -0.37183 },
            { lat: 39.47796, lng: -0.37178 },
            { lat: 39.47787, lng: -0.37161 },
            { lat: 39.47779, lng: -0.37149 },
        ],
        fin: { lat: 39.47773, lng: -0.37139 },
        imagen: "imagenes/imagenes-aventuras/puente_serranos.jpg",
        imagen2: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        imagen3: "imagenes/imagenes-aventuras/pont_fusta.jpg",
        imagen4: "imagenes/imagenes-aventuras/museo de bellas artes.jpg",
        imagen5: "imagenes/imagenes-aventuras/bajada_rio_ruinas.jpg",
        imagen6: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
        video: "",
    },
    // Parada 4: Ruinas del Jardín del Turia (Parrafos: 704, 703,645, 646-A)
    {
        id: "P-4",
        tipo: "parada",
        parada: 4, // mapa número 6
        mapa_numero: 6,
        nombre: "Ruinas del Jardín del Turia",
        coordenadas: { lat: 39.47773, lng: -0.37139 },
        imagen: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
    },
    // Tramo 4: Ruinas del Jardín del Turia → Jardines del Real (Viveros) (Parrafos: 647, 11-D)
    {
        id: "TR-4",
        tipo: "tramo",
        tramo: 4, // De mapa número 6 → mapa número 7
        mapa_numero: "6→7",
        nombre: "Ruinas del Jardín del Turia → Jardines del Real (Viveros)",
        inicio: { lat: 39.47773, lng: -0.37139 },
        waypoints:
        [
            { lat: 39.47796, lng: -0.37178 },
            { lat: 39.47784, lng: -0.37187 },
            { lat: 39.47774, lng: -0.37194 },
            { lat: 39.4777, lng: -0.37186 },
            { lat: 39.47757, lng: -0.37167 },
            { lat: 39.47746, lng: -0.3715 },
            { lat: 39.4773, lng: -0.37123 },
            { lat: 39.47692, lng: -0.37067 },
            { lat: 39.47633, lng: -0.36987 },
            { lat: 39.47603, lng: -0.36947 },
            { lat: 39.47631, lng: -0.36918 },
            { lat: 39.47657, lng: -0.36888 },
            { lat: 39.4768, lng: -0.36863 },
            { lat: 39.47698, lng: -0.36844 },
            { lat: 39.47705, lng: -0.36855 },
            { lat: 39.47712, lng: -0.36868 },
            { lat: 39.47714, lng: -0.36865 },
            { lat: 39.47709, lng: -0.36855 },
            { lat: 39.47705, lng: -0.36846 },
            { lat: 39.47708, lng: -0.36844 },
            { lat: 39.47711, lng: -0.36847 },
            { lat: 39.47718, lng: -0.36841 },
            { lat: 39.47727, lng: -0.36833 },
            { lat: 39.4773, lng: -0.36833 },
            { lat: 39.47745, lng: -0.3684 },
        ],
        fin: { lat: 39.47748, lng: -0.36836 },
        imagen: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
        imagen2: "",
        imagen3: "imagenes/imagenes-aventuras/viveros-tunel_turia.jpg",
        imagen4: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        video: "",
    },
    // Parada 5: Jardines del Real (Viveros) (Reto6puzzle PZ-08) (Parrafos: 648-B, 649-B)
    {
        id: "P-5",
        tipo: "parada",
        parada: 5, // mapa número 7
        mapa_numero: 7,
        nombre: "Jardines del Real (Viveros)",
        coordenadas: { lat: 39.47748, lng: -0.36836 },
        imagen: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
    },
    // Tramo 5: Jardines del Real (Viveros) → Puente de la Exposición (Peineta) (Parrafos: 12-D)   {
    {
        id: "TR-5",
        tipo: "tramo",
        tramo: 5, // De mapa número 7 a mapa número 9
        mapa_numero: "7→9",
        nombre: "Jardines del Real (Viveros) → Puente de la Exposición",
        inicio: { lat: 39.47748, lng: -0.36836 },
        waypoints:
        [
            { lat: 39.47745, lng: -0.36841 },
            { lat: 39.47728, lng: -0.36832 },
            { lat: 39.47711, lng: -0.36847 },
            { lat: 39.47707, lng: -0.36843 },
            { lat: 39.47706, lng: -0.36846 },
            { lat: 39.47714, lng: -0.36865 },
            { lat: 39.47712, lng: -0.36869 },
            { lat: 39.47698, lng: -0.36844 },
            { lat: 39.47682, lng: -0.3686 },
            { lat: 39.47651, lng: -0.36834 },
            { lat: 39.47645, lng: -0.36775 },
            { lat: 39.47573, lng: -0.36719 },
            { lat: 39.47508, lng: -0.36669 },
            { lat: 39.47433, lng: -0.36607 },
            { lat: 39.47372, lng: -0.36557 },
            { lat: 39.47359, lng: -0.36585 },

        ],
        fin: { lat: 39.47343, lng: -0.36617 },
        imagen: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        imagen2: "",
        imagen3: "imagenes/imagenes-aventuras/pont_de_la_exposicio.jpg",
        video: "",
    },
    // Parada 6: Puente de la Exposición (Peineta) (Reto 7) (Parrafos: 237, 1 145, 239)
    {
        id: "P-6",
        tipo: "parada",
        parada: 6, // mapa número 9
        mapa_numero: 9,
        nombre: "Puente de la Exposición",
        coordenadas: { lat: 39.47343, lng: -0.36617 },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_exposicio.jpg",
    },
    // Tramo 6: Puente de la Exposición (Peineta) → Puente de las Flores (Parrafos: 225-14-B)
    {
        id: "TR-6",
        tipo: "tramo",
        tramo: 6, // De mapa número 9 a mapa número 10
        mapa_numero: "9→10",
        nombre: "Puente de la Exposición → Puente de las Flores",
        inicio: { lat: 39.47343, lng: -0.36617 },
        waypoints:
        [
            { lat: 39.4732, lng: -0.36653 },
            { lat: 39.47301, lng: -0.36691 },
            { lat: 39.47232, lng: -0.36634 },
            { lat: 39.47195, lng: -0.36603 },
            { lat: 39.47128, lng: -0.36548 },
        ],
        fin: { lat: 39.4708, lng: -0.36507 },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_exposicio.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_flores-down.jpg",
        video: "",
    },
    // Parada 7: Puente de las Flores (Parrafos: 241, 570)
    {
        id: "P-7",
        tipo: "parada",
        parada: 7, // mapa número 10
        mapa_numero: 10,
        nombre: "Puente de las Flores",
        coordenadas: { lat: 39.4708, lng: -0.36507 },
        imagen: "imagenes/imagenes-aventuras/puente-de_las_flores.jpg",
    },
    // Tramo 7: Puente de las Flores → Puente de Aragón (parte superior) (Parrafos: 242, 15, 243, 20-B)
    {
        id: "TR-7",
        tipo: "tramo",
        tramo: 7, // De mapa número 10 a mapa número 12
        mapa_numero: "10→12",
        nombre: "Puente de las Flores → Puente de Aragón (parte superior)",
        inicio: { lat: 39.4708, lng: -0.36507 },
        waypoints:
        [
            { lat: 39.47013, lng: -0.36448 },
            { lat: 39.47015, lng: -0.36414 },
            { lat: 39.46982, lng: -0.3638 },
            { lat: 39.47008, lng: -0.36309 },
            { lat: 39.47034, lng: -0.36321 },
            { lat: 39.47035, lng: -0.36286 },
            { lat: 39.47, lng: -0.36256 },
            { lat: 39.46947, lng: -0.36225 },
            { lat: 39.46949, lng: -0.3622 },
            { lat: 39.46914, lng: -0.36199 },
            { lat: 39.46896, lng: -0.36192 },
            { lat: 39.46894, lng: -0.36231 },
        ],
        fin: { lat: 39.46891, lng: -0.36286 },
        imagen: "imagenes/imagenes-aventuras/puente-de_las_flores.jpg",
        imagen2: "imagenes/imagenes-aventuras/pont_de_la_mar_down.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente_aragon_subida.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_aragon_top.jpg",
        video: "",
    },
    // Parada 8: Puente de Aragón 1 (Reto 8) (Parrafos: 244, 246)
    {
        id: "P-8",
        tipo: "parada",
        parada: 8, // mapa número 12
        mapa_numero: 12,
        nombre: "Puente de Aragón",
        coordenadas: { lat: 39.46891, lng: -0.36286 },
        imagen: "imagenes/imagenes-aventuras/puente_aragon_top.jpg",
        imagen2: "imagenes/imagenes-aventuras/Puente_de_aragon_vista.jpg",
    },
    // Parada 9: Puente de Aragón 2 (Parrafos: 339)
    {
        id: "P-9",
        tipo: "parada",
        parada: 9, // mapa número 12
        mapa_numero: 12,
        nombre: "Puente de Aragón 2",
        coordenadas: { lat: 39.46892, lng: -0.36288 },
        imagen: "imagenes/imagenes-aventuras/Puente_de_aragon_vista.jpg",
    },
    // Tramo 8: Puente de Aragón (parte superior) → Puente de la Mar (Parte Superior) (Parrafos: 247, 15)
    {
        id: "TR-8",
        tipo: "tramo",
        tramo: 8, // De mapa número 12 a mapa número 11
        mapa_numero: "12→11",
        nombre: "Puente de Aragón (parte superior) → Puente de la Mar (Parte Superior)",
        inicio: { lat: 39.46892, lng: -0.36288 },
        waypoints:
        [
            { lat: 39.46891, lng: -0.36329 },
            { lat: 39.46888, lng: -0.36398 },
            { lat: 39.46946, lng: -0.36442 },
        ],
        fin: { lat: 39.47001, lng: -0.36477 },
        imagen: "imagenes/imagenes-aventuras/puente_aragon_top.jpg",
        imagen2: "imagenes/imagenes-aventuras/pont_de_la_mar_top.jpg",
        video: "",
    },
    // Parada 10: Puente de la Mar (Parte Superior) (Reto 9) (Parrafos: 248, 249)
    {
        id: "P-10",
        tipo: "parada",
        parada: 10, // mapa número 11
        mapa_numero: 11,
        nombre: "Puente de la Mar (Parte Superior)",
        coordenadas: { lat: 39.47001, lng: -0.36477 },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_mar_top.jpg",
    },
    // Tramo 9:  Puente de la Mar (Parte Superior) → Palau de la música (Parrafos: 250, 251, 3-B)
    {
        id: "TR-9",
        tipo: "tramo",
        tramo: 9, // De mapa número 11 a mapa número 13
        mapa_numero: "11→13",
        nombre: "Puente de la Mar (Parte Superior) → Palau de la música",
        inicio: { lat: 39.47001, lng: -0.36477 },
        waypoints:
        [
            { lat: 39.46987, lng: -0.36467 },
            { lat: 39.46988, lng: -0.36453 },
            { lat: 39.46931, lng: -0.36419 },
            { lat: 39.46865, lng: -0.36358 },
            { lat: 39.46795, lng: -0.36316 },
            { lat: 39.46623, lng: -0.36209 },
            { lat: 39.46633, lng: -0.36176 },
        ],
        fin: { lat: 39.4658, lng: -0.36149 },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_mar_top.jpg",
        imagen2: "",
        imagen3:"imagenes/imagenes-aventuras/palau_de_la_musica.jpg",
        video: "",
    },
    // Parada 11: Palau de la Música (Reto 10) (Parrafos: 252, 253)
    {
        id: "P-11",
        tipo: "parada",
        parada: 11, // mapa número 13
        mapa_numero: 13,
        nombre: "Palau de la Música",
        coordenadas:  { lat: 39.4658, lng: -0.36149 },
        imagen: "imagenes/imagenes-aventuras/palau_de_la_musica.jpg",
    },
    // Tramo 10: Palau de la música → Gulliver (Parrafos: 254, 255, 21, 256, 257, 22-E)
    {
        id: "TR-10",
        tipo: "tramo",
        tramo: 10, // De mapa número 13 a mapa número 15
        mapa_numero: "13→15",
        nombre: "Palau de la música → Gulliver",
        inicio: { lat: 39.4658, lng: -0.36149 },
        waypoints:
        [
            { lat: 39.46526, lng: -0.36114 },
            { lat: 39.46546, lng: -0.36059 },
            { lat: 39.46535, lng: -0.36041 },
            { lat: 39.46499, lng: -0.35997 },
            { lat: 39.46449, lng: -0.35967 },
            { lat: 39.46398, lng: -0.35948 },
            { lat: 39.4631, lng: -0.35917 },
        ],
        fin: { lat: 39.46298, lng: -0.35972 },
        imagen: "imagenes/imagenes-aventuras/palau_de_la_musica.jpg",
        imagen2: "",
        imagen3: "imagenes/imagenes-aventuras/gulliver.jpg",
        video: "",
    },
    // Parada 12: Gulliver (Reto 11) (Parrafos: 258, 260, 259)
    {
        id: "P-12",
        tipo: "parada",
        parada: 12, // mapa número 15
        mapa_numero: 15,
        nombre: "Gulliver",
        coordenadas:  { lat: 39.46298, lng: -0.35972 },
        imagen: "imagenes/imagenes-aventuras/gulliver.jpg",
    },
    // Tramo 11: Gulliver → Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias (Parrafos: 261, 24-D, 113)
    {
        id: "TR-11",
        tipo: "tramo",
        tramo: 11, // De mapa número 15 a mapa número 17
        mapa_numero: "15→17",
        nombre: "Gulliver → Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias",
        inicio: { lat: 39.46298, lng: -0.35972 },
        waypoints:
        [
            { lat: 39.4631, lng: -0.35917 },
            { lat: 39.4633, lng: -0.35889 },
            { lat: 39.46326, lng: -0.35886 },
            { lat: 39.4629, lng: -0.35864 },
            { lat: 39.46279, lng: -0.35866 },
            { lat: 39.46246, lng: -0.35844 },
            { lat: 39.46232, lng: -0.35835 },
            { lat: 39.46216, lng: -0.3582 },
            { lat: 39.46197, lng: -0.35814 },
            { lat: 39.46097, lng: -0.35758 },
            { lat: 39.46043, lng: -0.3571 },
            { lat: 39.46033, lng: -0.35735 },
            { lat: 39.46003, lng: -0.35771 },
        ],
        fin: { lat: 39.45985, lng: -0.35759 },
        imagen: "imagenes/imagenes-aventuras/gulliver.jpg",
        imagen2: "",
        imagen3:"imagenes/imagenes-aventuras/CAC_patinaje.jpg",
        video: "",
    },
    // Parada 13: Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias (Parrafos: 262, 17-B, 264, 265, 266, 18-B, 267, 27-B)
    {
        id: "P-13",
        tipo: "parada",
        parada: 13, // mapa número 17
        mapa_numero: 17,
        nombre: "Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias",
        coordenadas:  { lat: 39.45985, lng: -0.35759 },
        imagen: "imagenes/imagenes-aventuras/CAC_patinaje.jpg",
    },
    // Tramo 12: Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe  (Parrafos: 268, 269)
    {
        id: "TR-12",
        tipo: "tramo",
        tramo: 12, // De mapa número 17 a sin número de mapa
        mapa_numero: "17→-",
        nombre: "Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe",
        inicio: { lat: 39.45985, lng: -0.35759 },
        waypoints:
        [
            { lat: 39.46003, lng: -0.35771 },
            { lat: 39.46033, lng: -0.35735 },
            { lat: 39.46043, lng: -0.3571 },
            { lat: 39.46021, lng: -0.35661 },
            { lat: 39.46011, lng: -0.35627 },
            { lat: 39.46025, lng: -0.35605 },
            { lat: 39.46025, lng: -0.35602 },
            { lat: 39.46021, lng: -0.35598 },
            { lat: 39.46023, lng: -0.35589 },
            { lat: 39.46021, lng: -0.3558 },
            { lat: 39.46024, lng: -0.35577 },
            { lat: 39.46023, lng: -0.35568 },
            { lat: 39.46028, lng: -0.35559 },
            { lat: 39.46015, lng: -0.3552 },
            { lat: 39.45989, lng: -0.35446 },
            { lat: 39.45983, lng: -0.35445 },
            { lat: 39.4598, lng: -0.35442 },
            { lat: 39.45979, lng: -0.35437 },
            { lat: 39.45975, lng: -0.35435 },
            { lat: 39.45969, lng: -0.3543 },
            { lat: 39.45948, lng: -0.35414 },
            { lat: 39.45935, lng: -0.35407 },
            { lat: 39.45922, lng: -0.35383 },
            { lat: 39.45908, lng: -0.35341 },
            { lat: 39.4591, lng: -0.35336 },
            { lat: 39.45909, lng: -0.35331 },
            { lat: 39.45899, lng: -0.353 },
            { lat: 39.45891, lng: -0.35277 },
            { lat: 39.45892, lng: -0.35274 },
            { lat: 39.4589, lng: -0.35271 },
            { lat: 39.45889, lng: -0.35267 },
            { lat: 39.45885, lng: -0.35261 },
            { lat: 39.45879, lng: -0.35253 },
            { lat: 39.45873, lng: -0.35246 },
            { lat: 39.45872, lng: -0.35238 },
            { lat: 39.45869, lng: -0.35232 },
            { lat: 39.45849, lng: -0.3522 },
            { lat: 39.45841, lng: -0.35208 },
            { lat: 39.45831, lng: -0.35201 },
            { lat: 39.4583, lng: -0.352 },
            { lat: 39.45827, lng: -0.35195 },
            { lat: 39.45822, lng: -0.3519 },
            { lat: 39.45814, lng: -0.35187 },
            { lat: 39.45811, lng: -0.35181 },
            { lat: 39.45813, lng: -0.35152 },
            { lat: 39.45807, lng: -0.3514 },
            { lat: 39.45779, lng: -0.35135 },
            { lat: 39.45758, lng: -0.35092 },
            { lat: 39.4575, lng:  -0.35059 },
            { lat: 39.45679, lng: -0.3499 },
            { lat: 39.45678, lng: -0.34986 },
        ],
        fin: { lat: 39.456730, lng: -0.349399 },
        imagen: "imagenes/imagenes-aventuras/CAC_patinaje.jpg",
        imagen2: "imagenes/imagenes-aventuras/cac_mapa.jpg",
        imagen3:"imagenes/imagenes-aventuras/pano_CAC.jpg",
        video: "",
    },
    // Parada 14: Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía (Parrafos: 270, 27-B, 271 )
    {
        id: "P-14",
        tipo: "parada",
        parada: 14, // mapa número 18
        mapa_numero: 18,
        nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía",
        coordenadas:  { lat: 39.456730, lng: -0.349399 },
        imagen: "imagenes/imagenes-aventuras/pano_CAC.jpg",
        imagen2: "imagenes/imagenes-aventuras/reina_sofia_side.jpg"
    },
    // Parada 15: Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe (Parrafos: 272, 31, 273, 275)
    {
        id: "P-15",
        tipo: "parada",
        parada: 15, // mapa número 20
        mapa_numero: 20,
        nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe",
        coordenadas:  { lat:39.456689, lng: -0.349407 },
        imagen: "imagenes/imagenes-aventuras/pano_CAC.jpg",
        imagen2: "imagenes/imagenes-aventuras/museo_principe_felipe.jpg"
    },
    // Tramo 13: Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe → Puente l'Assut de l'Or (Parrafos: 276, 32-B)
    {
        id: "TR-13",
        tipo: "tramo",
        tramo: 13, // De mapa número 20 a mapa número 21
        mapa_numero: "20→21",
        nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe → Puente l'Assut de l'Or",
        inicio: { lat:39.456689, lng: -0.349407 },
        waypoints:
        [
            { lat: 39.456661, lng: -0.349362 },
            { lat: 39.456532, lng: -0.349333 },
            { lat: 39.456457, lng: -0.349199 },
            { lat: 39.456205, lng: -0.348962 },
            { lat: 39.456353, lng: -0.348608 },
            { lat: 39.456239, lng: -0.348377 },
        ],
        fin: { lat: 39.455825, lng: -0.348149 },
        imagen: "imagenes/imagenes-aventuras/pano_CAC.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_Assut-2.jpg",
        video: "",
    },
    // Parada 16: Puente l'Assut de l'Or (Reto12puzzle PZ-09) (Parrafos: 277, 278)
    {
        id: "P-16",
        tipo: "parada",
        parada: 16, // mapa número 21
        mapa_numero: 21,
        nombre: "Puente l'Assut de l'Or",
        coordenadas:  { lat: 39.455825, lng: -0.348149 },
        imagen: "imagenes/imagenes-aventuras/puente_Assut-2.jpg",
    },
    // Tramo 14: Puente l'Assut de l'Or → Ágora y Oceanogràfic (Parrafos: 116)
    {
        id: "TR-14",
        tipo: "tramo",
        tramo: 14, // De mapa número 21 a mapa número 22 y 23
        mapa_numero: "21→22/23",
        nombre: "Puente l'Assut de l'Or → Ágora y Oceanogràfic",
        inicio: { lat:39.455825, lng: -0.348149 },
        waypoints:
        [
            { lat: 39.4559, lng: -0.34819 },
            { lat: 39.45523, lng: -0.34919 },
            { lat: 39.45432, lng: -0.35055 },
            { lat: 39.45379, lng: -0.3513 },
            { lat: 39.45362, lng: -0.35112 },
        ],
        fin: { lat: 39.45352, lng: -0.35081 },
        imagen: "imagenes/imagenes-aventuras/puente_Assut-2.jpg",
        imagen2: "imagenes/imagenes-aventuras/agora.jpg",
        imagen3:"imagenes/imagenes-aventuras/agora_oceanografic.jpg",
        video: "",
    },
    // Parada 17: Ágora y Oceanogràfic (Parrafos: 281, 33, 282, 283, 34-B, 284)
    {
        id: "P-17",
        tipo: "parada",
        parada: 17, // mapa número 22/23
        mapa_numero: "22/23",
        nombre: "Ágora y Oceanogràfic",
        coordenadas:  { lat: 39.45352, lng: -0.35081 },
        imagen: "imagenes/imagenes-aventuras/agora_oceanografic.jpg",
    },
    // Tramo 15: Ágora y Oceanogràfic → Umbracle (Parrafos: 285, 35-B)
    {
        id: "TR-15",
        tipo: "tramo",
        tramo: 15, // De mapa número 22/23 a mapa número 24
        mapa_numero: "22/23→24",
        nombre: "Ágora y Oceanogràfic → Umbracle",
        inicio: { lat: 39.45352, lng: -0.35081 },
        waypoints:
        [
            { lat: 39.45362, lng: -0.35112 },
            { lat: 39.453958, lng: -0.351566 },
            { lat: 39.454040, lng: -0.352035 },
            { lat: 39.454078, lng: -0.352015 },
            { lat: 39.454067, lng: -0.351911 },
            { lat: 39.454080, lng: -0.351803 },
            { lat: 39.454138, lng: -0.351741 },
            { lat: 39.454216, lng: -0.351765 },
            { lat: 39.454288, lng: -0.351873 },
            { lat: 39.454473, lng: -0.351941 },
            { lat: 39.45499, lng: -0.35257 },
            { lat: 39.45546, lng: -0.35327 },

        ],
        fin: { lat: 39.455635, lng: -0.353670 },
        imagen: "imagenes/imagenes-aventuras/agora_oceanografic.jpg",
        imagen2: "imagenes/imagenes-aventuras/umbracle.jpg",
        video: "",
    },
    // Parada 18: Umbracle (Reto 13) (Parrafos: 286, 292)
    {
        id: "P-18",
        tipo: "parada",
        parada: 18, // mapa número 24
        mapa_numero: "24",
        nombre: "Umbracle",
        coordenadas:  { lat: 39.455635, lng: -0.353670 },
        imagen: "imagenes/imagenes-aventuras/umbracle.jpg",

    },
    // Tramo 16: Umbracle → Hemisféric (Parrafos: 287-B, 290)
    {
        id: "TR-16",
        tipo: "tramo",
        tramo: 16, // De mapa número 24 a mapa número 25
        mapa_numero: "24→25",
        nombre: "Umbracle → Hemisféric",
        inicio: { lat: 39.455635, lng: -0.353670 },
        waypoints:
        [
            { lat: 39.456678, lng: -0.355255 },
            { lat: 39.457553, lng: -0.356357 },
            { lat: 39.458643, lng: -0.357172 },
            { lat: 39.459348, lng: -0.357818 },
            { lat: 39.459003, lng: -0.356469 },
            { lat: 39.458205, lng: -0.354901 },
        ],
        fin: { lat: 39.457675, lng: -0.353992 },
        imagen: "imagenes/imagenes-aventuras/umbracle.jpg",
        imagen2: "imagenes/imagenes-aventuras/reina_sofia_front.jpg",
        imagen3:"imagenes/imagenes-aventuras/hemisferic.jpg",
        video: "",
    },
    // Parada 19: Hemisféric (Reto 14) (Parrafos: 291, 707)
    {
        id: "P-19",
        tipo: "parada",
        parada: 19, // mapa número 25
        mapa_numero: "25",
        nombre: "Hemisféric",
        coordenadas:  { lat: 39.457675, lng: -0.353992 },
        imagen: "imagenes/imagenes-aventuras/hemisferic.jpg",
    },
    // Tramo 17: Ciudad de las Artes y las Ciencias → Puente de la Mar (Parrafos: 293, 30-B)
    {
        id: "TR-17",
        tipo: "tramo",
        tramo: 17, // De mapa número 25 a mapa número 11
        mapa_numero: "25→11",
        nombre: "Ciudad de las Artes y las Ciencias → Puente de la Mar",
        inicio: { lat: 39.457675, lng: -0.353992 },
        waypoints:
        [
            { lat: 39.457838, lng: -0.353730 },
            { lat: 39.458224, lng: -0.353780 },
            { lat: 39.458632, lng: -0.354407 },
            { lat: 39.459077, lng: -0.355962 },
            {lat: 39.459412, lng: -0.357080 },
            { lat: 39.459684, lng: -0.358352 },
            { lat: 39.460893, lng: -0.359343 },
            { lat: 39.462333, lng: -0.360201 },
            { lat: 39.463831, lng: -0.360717 },
            { lat: 39.466314, lng: -0.362187 },
            { lat: 39.467368, lng: -0.362825 },
            { lat: 39.468523, lng: -0.363562 },
            { lat: 39.469606, lng: -0.364172 },
            { lat: 39.470128, lng: -0.364533 },
            { lat: 39.470169, lng: -0.364142 },
            { lat: 39.470406, lng: -0.364173 },
        ],
        fin: { lat: 39.470617, lng: -0.363887 },
        imagen: "imagenes/imagenes-aventuras/pano_CAC.jpg",
        imagen2: "imagenes/imagenes-aventuras/pont_de_la_mar_down.jpg",
        video: "",
    },
    // Parada 20: Puente de la Mar (Reto 15) (Parrafos: 294, 295)
    {
        id: "P-20",
        tipo: "parada",
        parada: 20, // mapa número 11
        mapa_numero: "25",
        nombre: "Puente de la Mar",
        coordenadas:  { lat: 39.470617, lng: -0.363887 },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_mar_down.jpg",
    },
    // Tramo 18: Puente de la Mar → Puerta de la Mar (Parrafos: 296-C, 297, 14-B, 298, 299, 245-B, 37)
    {
        id: "TR-18",
        tipo: "tramo",
        tramo: 18, // De mapa número 11 a mapa número 26
        mapa_numero: "11→26",
        nombre: "Puente de la Mar → Puerta de la Mar",
        inicio: { lat: 39.470617, lng: -0.363887 },
        waypoints:
        [
            { lat: 39.470599, lng:-0.363375 },
            { lat: 39.470393, lng: -0.363195 },
            { lat: 39.470431, lng: -0.362907 },
            { lat: 39.471009, lng: -0.363373 },
            { lat: 39.471705, lng: -0.363960 },
            { lat: 39.471775, lng: -0.363853 },
            { lat: 39.471569, lng: -0.363694 },
            { lat: 39.471621, lng: -0.363449 },
            { lat: 39.471527, lng: -0.363495 },
            { lat: 39.471063, lng: -0.364554 },
            { lat: 39.470789, lng: -0.365355 },
            { lat: 39.470571, lng: -0.365544 },
            { lat: 39.471018, lng: -0.366466 },
            { lat: 39.471757, lng: -0.368081 },
            { lat: 39.472201, lng: -0.368001 },
            { lat: 39.472377, lng: -0.368183 },
            { lat: 39.472445, lng: -0.368513 },
            { lat: 39.472380, lng: -0.368756 },
        ],
        fin: { lat: 39.472081, lng: -0.368912 },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_mar_down.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_flores_top.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente-de_las_flores.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_flores_agua.jpg",
        imagen5: "imagenes/imagenes-aventuras/porta_d_ la_mar.jpg",
        video: "",
    },
    // Parada 21: Puerta de la Mar (Reto 16) (Parrafos: 300, 84, 301, 302)
    {
        id: "P-21",
        tipo: "parada",
        parada: 21, // mapa número 26
        mapa_numero: "26",
        nombre: "Puerta de la Mar",
        coordenadas:  { lat: 39.472081, lng: -0.368912 },
        imagen: "imagenes/imagenes-aventuras/porta_d_ la_mar.jpg",
    },

    // Tramo 19: Puerta de la Mar → Palacio de Justicia (Parrafos: 657, 658, 39, 577)
    {
        id: "TR-19",
        tipo: "tramo",
        tramo: 19, // De mapa número 26 a mapa número 27
        mapa_numero: "26→27",
        nombre: "Puerta de la Mar → Palacio de Justicia",
        inicio: { lat: 39.472081, lng: -0.368912 },
        waypoints:
        [
            { lat: 39.471862, lng: -0.368985 },
        ],
        fin: { lat: 39.472055, lng: -0.369551 },
        imagen: "imagenes/imagenes-aventuras/porta_d_ la_mar.jpg.jpg",
        imagen2: "imagenes/imagenes-aventuras/palacio_de_justicia_close_view.jpg",
        imagen3:"",
        video: "",
    },
    // Parada 22: Palacio de Justicia (Parrafos: 659)
    {
        id: "P-22",
        tipo: "parada",
        parada: 22, // mapa número 26
        mapa_numero: "26",
        nombre: "Palacio de Justicia",
        coordenadas:  { lat: 39.472055, lng: -0.369551 },
        imagen: "",
    },
    // Tramo 20: Palacio de Justicia → Fundación Bancaja 1 (Parrafos: 660, 40-B)
    {
        id: "TR-20",
        tipo: "tramo",
        tramo: 20, // De mapa número 27 a mapa número 28
        mapa_numero: "27→28",
        nombre: "Palacio de Justicia → Fundación Bancaja 1",
        inicio: { lat: 39.472055, lng: -0.369551 },
        waypoints:
        [
            { lat: 39.472202, lng: -0.370107 },
            { lat: 39.472659, lng: -0.370217 },
            { lat: 39.472840, lng: -0.370091 },
        ],
        fin: { lat: 39.473087, lng: -0.370027 },
        imagen: "",
        imagen2: "imagenes/imagenes-aventuras/edificio_bancaja.jpg",
        video: "",
    },

    // Parada 23: Fundación Bancaja 1 (Reto 17) (Parrafos: 661, 662)
    {
        id: "P-23",
        tipo: "parada",
        parada: 23, // mapa número 28
        mapa_numero: "28",
        nombre: "Fundación Bancaja 1",
        coordenadas:  { lat: 39.473087, lng: -0.370027 },
        imagen: "imagenes/imagenes-aventuras/edificio_bancaja.jpg",
    },
    // Tramo 21: Fundación Bancaja 1 → Fundación Bancaja 2 (Parrafos: 663)
    {
        id: "TR-21",
        tipo: "tramo",
        tramo: 21, // De mapa número 28 a mapa número 28
        mapa_numero: "28→28",
        nombre: "Fundación Bancaja 1 → Fundación Bancaja 2",
        inicio: { lat: 39.473087, lng: -0.370027 },
        waypoints:
        [
            { lat: 39.473759, lng: -0.369889 },
        ],
        fin: { lat: 39.473830, lng: -0.370067 },
        imagen: "imagenes/imagenes-aventuras/edificio_bancaja.jpg",
        imagen2: "",
        video: "",
    },
    // Parada 24: Fundación Bancaja 2 (Parrafos: 664)
    {
        id: "P-24",
        tipo: "parada",
        parada: 24, // mapa número 28
        mapa_numero: "28",
        nombre: "Fundación Bancaja 2",
        coordenadas:  { lat: 39.473830, lng: -0.370067 },
        imagen: "",
    },
    // Tramo 22: Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente (Parrafos: 665, 41)
    {
        id: "TR-22",
        tipo: "tramo",
        tramo: 22, // De mapa número 28 a mapa número 29
        mapa_numero: "28→29",
        nombre: "Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente",
        inicio: { lat: 39.473830, lng: -0.370067 },
        waypoints:
        [
            { lat: 39.473865, lng: -0.370408 },
            { lat: 39.473961, lng: -0.370880 },
            { lat: 39.473946, lng: -0.371786 },
            { lat: 39.473948, lng: -0.372367 },
        ],
        fin: { lat: 39.473836, lng:-0.372444},
        imagen: "",
        imagen2: "imagenes/imagenes-aventuras/iglesia_san_felipe_neri.jpg",
        video: "",
    },
    // Parada 25: Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente (Reto 18) (Parrafos: 667-B, 668)
    {
        id: "P-25",
        tipo: "parada",
        parada: 25, // mapa número 29
        mapa_numero: "29",
        nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente",
        coordenadas:  { lat: 39.473836, lng: -0.372444 },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_felipe_neri.jpg",
    },
    // Parada 26: Iglesia Santo Tomás Apostol y San Felipe Neri (Parrafos: 669)
    {
        id: "P-26",
        tipo: "parada",
        parada: 26, // mapa número 29
        mapa_numero: "29",
        nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri",
        coordenadas:  { lat: 39.473833, lng: -0.372479 },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_felipe_neri.jpg",
    },
    // Tramo 23: Iglesia Santo Tomás Apostol y San Felipe Neri → Iglesia San Juan del Hospital (Parrafos: 670-B)
    {
        id: "TR-23",
        tipo: "tramo",
        tramo: 23, // De mapa número 29 a mapa número 30
        mapa_numero: "29→30",
        nombre: "Iglesia San Vicente Ferrer y San Felipe Neri → Iglesia San Juan del Hospital",
        inicio: { lat: 39.473833, lng: -0.372479 },
        waypoints:
        [
            { lat: 39.473998, lng: -0.372704 },
          ,
        ],
        fin: { lat: 39.474454, lng: -0.372731 },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_felipe_neri.jpg",
        imagen2: "imagenes/imagenes-aventuras/iglesia_san_juan_del_hospital.jpg",
        video: "",
    },
    // Parada 27: Iglesia San Juan del Hospital (Parrafos: 671, 522, 672)
    {
        id: "P-27",
        tipo: "parada",
        parada: 27, // mapa número 30
        mapa_numero: "30",
        nombre: "Iglesia San Juan del Hospital",
        coordenadas:  { lat: 39.474454, lng: -0.372731 },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_hospital.jpg",
    },
    // Tramo 24: Iglesia San Juan del Hospital → Palacio Arzobispal (Parrafos: 453, 43-B)
    {
        id: "TR-24",
        tipo: "tramo",
        tramo: 24, // De mapa número 30 a mapa número 31
        mapa_numero: "30→31",
        nombre: "Iglesia San Juan del Hospital → Palacio Arzobispal",
        inicio: { lat: 39.474454, lng: -0.372731 },
        waypoints:
        [
            { lat: 39.474858, lng: -0.372811 },
            { lat: 39.475766, lng: -0.372641 },
            { lat: 39.475853, lng: -0.373087 },
            { lat: 39.475527, lng: -0.373459 },
            { lat: 39.475513, lng: -0.373593 },
            { lat: 39.475377, lng: -0.373665 },
        ],
        fin: { lat: 39.475577, lng: -0.374196},
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_hospital.jpg",
        imagen2: "",
        imagen3: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg",
        video: "",
    },
    // Parada 28: Palacio Arzobispal (Parrafos: 673)
    {
        id: "P-28",
        tipo: "parada",
        parada: 28, // mapa número 31
        mapa_numero: "31",
        nombre: "Palacio Arzobispal",
        coordenadas:  { lat: 39.475577, lng: -0.374196 },
        imagen: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg",
    },
    // Tramo 25: Palacio Arzobispal → Catedral de Valencia (Puerta Románica) (Parrafos: 44-B, 426-B, 141)
    {
        id: "TR-25",
        tipo: "tramo",
        tramo: 25, // De mapa número 31 a mapa número 32
        mapa_numero: "31→32",
        nombre: "Palacio Arzobispal → Catedral de Valencia (Puerta Románica)",
        inicio: { lat: 39.475577, lng: -0.374196 },
        waypoints: [],
        fin: { lat: 39.475552, lng: -0.3745566 },
        imagen: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg",
        imagen2: "imagenes/imagenes-aventuras/puerta_romanica_catedral.jpg",
        video: "",
    },
    // Parada 29: Catedral de Valencia (Puerta Románica) (reto 19) (Parrafos: 437, 439, 438)
    {
        id: "P-29",
        tipo: "parada",
        parada: 29, // mapa número 32
        mapa_numero: "32",
        nombre: "Catedral de Valencia (Puerta Románica)",
        coordenadas:  { lat: 39.475552, lng: -0.3745566 },
        imagen: "imagenes/imagenes-aventuras/puerta_romanica_catedral.jpg",
    },
    // Tramo 26: Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína) (Parrafos: 45-B)
    {
        id: "TR-26",
        tipo: "tramo",
        tramo: 26, // De mapa número 32 a mapa número 33
        mapa_numero: "32→33",
        nombre: "Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína)",
        inicio: { lat: 39.475552, lng: -0.3745566 },
        waypoints:
        [
            { lat: 39.475836, lng: -0.374397 }
        ],
        fin: { lat: 39.475986, lng: -0.374472 },
        imagen: "imagenes/imagenes-aventuras/puerta_romanica_catedral.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        video: "",
    },
    // Parada 30: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 1, Panel cerámico (reto 20) (Parrafos: 441, 442)
    {
        id: "P-30",
        tipo: "parada",
        parada: 30, // mapa número 33
        mapa_numero: "33",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia",
        coordenadas:  { lat: 39.475986, lng: -0.374472 },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/panel_ceramico_muro_norte_catedral.jpg",
    },
    // Parada 31: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 2, Capilla exterior (reto 21) (Parrafos: 443, 444)
    {
        id: "P-31",
        tipo: "parada",
        parada: 31, // mapa número 33
        mapa_numero: "33",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia",
        coordenadas:  { lat: 39.476012, lng: -0.374604 },
        imagen: "imagenes/imagenes-aventuras/capilla_exterior_catedral.jpg",
    },
    // Parada 32: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 3, Capilla exterior (reto 22) (Parrafos: 445)
    {
        id: "P-32",
        tipo: "parada",
        parada: 32, // mapa número 33
        mapa_numero: "33",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia",
        coordenadas:  { lat: 39.476025, lng: -0.374600 },
        imagen: "imagenes/imagenes-aventuras/capilla_exterior_catedral.jpg",
    },
     // Parada 33: Plaza Décimo Junio Bruto (Plaza de la Almoína) Basílica de Valencia (Parrafos: 446, 447, 46-B, 452, 45-C)
    {
        id: "P-33",
        tipo: "parada",
        parada: 33, // mapa número 33/34
        mapa_numero: "33/34",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Basílica de Valencia",
        coordenadas:  { lat: 39.476046, lng: -0.374656 },
        imagen: "imagenes/imagenes-aventuras/puerta_negra_relieve_basilica.jpg",
    },
    // Parada 34: Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de gantxo (Reto 23) (Parrafos: 45-D, 454, 455, 455-B, 456)
    {
        id: "P-34",
        tipo: "parada",
        parada: 34, // mapa número 33
        mapa_numero: "33",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de gantxo",
        coordenadas:  { lat: 39.475986, lng: -0.374472 },
        imagen: "imagenes/imagenes-aventuras/casa_del_punt_de_gantxo.jpg",
    },
    // Tramo 27: Plaza Décimo Junio Bruto (Plaza de la Almoína) →  Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico (Parrafos: 457, 45-E)
    {
        id: "TR-27",
        tipo: "tramo",
        tramo: 27, // De mapa número 33 a mapa número 33
        mapa_numero: "33→33",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) → Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico",
        inicio: { lat: 39.475986, lng: -0.374472 },
        waypoints:
        [
            { lat: 39.476078, lng: -0.374327 },
            { lat: 39.47605, lng: -0.37429 },
        ],
        fin: { lat: 39.47624, lng: -0.37427 },
        imagen: "imagenes/imagenes-aventuras/casa_del_punt_de_gantxo.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        video: "",
    },
    // Parada 35: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico (Reto 24) (Parrafos: 458)
    {
        id: "P-35",
        tipo: "parada",
        parada: 35, // mapa número 33
        mapa_numero: "33",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico",
        coordenadas:  { lat: 39.47624, lng: -0.37427 },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
    },
    // Parada 36: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico 2 (Reto25puzzle PZ-02) (Parrafos: 459, 460, 461)
    {
        id: "P-36",
        tipo: "parada",
        parada: 36, // mapa número 33
        mapa_numero: "33",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico",
        coordenadas:  { lat: 39.47624, lng: -0.37429 },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/museo_la_almoina.jpg",
    },
    // Tramo 28: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen (Parrafos: 465, 47-B)
    {
        id: "TR-28",
        tipo: "tramo",
        tramo: 28, // De mapa número 33 a mapa número 35
        mapa_numero: "33→35",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen",
        inicio: { lat: 39.47624, lng: -0.37429 },
        waypoints:
        [
            { lat: 39.4763, lng: -0.3746 },
            { lat: 39.47656, lng: -0.37454 },
            { lat: 39.47661, lng: -0.37499 },
            { lat: 39.47666, lng: -0.37518 },
        ],
        fin: { lat: 39.4766, lng: -0.37527 },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
        video: "",
    },
    // Parada 37: Plaza de la Virgen (Fuente de Neptuno) (Reto 26) (Parrafos: 466, 467)
    {
        id: "P-37",
        tipo: "parada",
        parada: 37, // mapa número 35
        mapa_numero: "35",
        nombre: "Plaza de la Virgen (Fuente de Neptuno)",
        coordenadas:  { lat: 39.4766, lng: -0.37527 },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
    },
    // Parada 38: Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia) (Reto 27) (Parrafos: 477-B, 479, 141, 468)
    {
        id: "P-38",
        tipo: "parada",
        parada: 38, // mapa número 35
        mapa_numero: "35",
        nombre: "Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia)",
        coordenadas:  { lat: 39.4766, lng: -0.37529 },
        imagen: "imagenes/imagenes-aventuras/puerta_gotica_catedral.jpgimagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
    },
    // Tramo 29: Plaza de la Virgen → Torres de Serranos (Parrafos: 443, pausa muy larga con música de al menos 2min 30seg, 2-F)
    {
        id: "TR-29",
        tipo: "tramo",
        tramo: 29, // De mapa número 35 a mapa número 1
        mapa_numero: "35→1",
        nombre: "Plaza de la Virgen → Torres de Serranos",
        inicio: { lat: 39.4766, lng: -0.37529 },
        waypoints:
        [
            { lat: 39.476710, lng: -0.375790 },
            { lat: 39.476807, lng: -0.376386 },
            { lat: 39.476881, lng: -0.376854 },
            { lat: 39.477385, lng: -0.376901 },
            { lat: 39.477833, lng: -0.376674 },
            { lat: 39.478270, lng: -0.376481 },
        ],
        fin: { lat: 39.47859, lng: -0.37633 },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
        imagen2:"imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
        imagen3: "imagenes/imagenes-aventuras/Calle_serranos.jpg",
        video: "",
    },
        // Parada 39 - FINAL: Torres de Serranos Final (Reto28Puzzle PZ-05) (Párrafos: 475, 503, 507, 526,)
                {
                    id: "P-39",
                    tipo: "parada",
                    parada: 39, // mapa número 1
                    mapa_numero: 1,
                    nombre: "Torres de Serranos Final",
                    coordenadas: { lat: 39.47859, lng: -0.37633 },
                    imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg"
                }
      ]
    }
  },
  Aventura4: {
    "coordenadas-hijo2.html": {
      coordenadas: [/* array de coordenadas hijo2 (Aventura4) */]
    }
  },
  Aventura5: {
    "coordenadas-hijo2.html": {
      coordenadas: [/* array de coordenadas hijo2 (Aventura5) */]
    }
  },
  Aventura34km: {
    "coordenadas-hijo2.html": {
      coordenadas: [/* array de coordenadas hijo2 (Aventura 34km) */]
    }
  },
  AventuraFallas: {
    "coordenadas-hijo2.html": {
      coordenadas: [
        // array de Aventura Fallas
        {
        id: "P-0",
        tipo: "inicio",
        parada: 0, // ← Parada 0 – INICIO (223, 226, 228, 229) reto 2 //
        nombre: "Torres de Serranos (start)",
        coordenadas: { lat: 39.47876, lng: -0.37626 },
        imagen: "imagenes/imagenes-aventuras/00_torres_de_serranos_back.jpg",
        video: "videos-aventuras/avfallas/parada_0.mp4",
    },
    {
        id: "TR-1",
        tipo: "tramo",
        tramo: 1, // ← tramo 1 (Torres de Serranos → Plaza de la crida) (2, 126,) //
        nombre: "Torres de Serranos → Plaza de la crida (Puente de Serranos)",
        inicio: { lat: 39.47876, lng: -0.37626 },
        waypoints: [
            { lat: 39.47905, lng: -0.37613 },
            { lat: 39.47933, lng: -0.37647 },
            { lat: 39.47943, lng: -0.37636 }
        ],
        fin: { lat: 39.47959, lng: -0.37583 },
        imagen: "imagenes/imagenes-aventuras/01_torres_de_serranos_front.jpg",
        video: "videos-aventuras/avfallas/tramo_1.mp4",
    },
    {
        id: "P-1",
        tipo: "parada",
        parada: 1, // ← Parada 1 - Plaza de la crida (Puente de Serranos) (233) Reto 3 //
        nombre: "Plaza de la crida (Puente de Serranos)",
        coordenadas: { lat: 39.47959, lng: -0.37583 },
        imagen: "imagenes/imagenes-aventuras/01_torres_de_serranos_front.jpg",
    },
    {
        id: "TR-2",
        tipo: "tramo",
        tramo: 2, // ← tramo 2 (Plaza de la crida → Calle Muro de Santa Ana) (81) //
        nombre: "Plaza de la crida → Calle Muro de Santa Ana",
        inicio: { lat: 39.47959, lng: -0.37583 },
        waypoints: [
            { lat: 39.47939, lng: -0.3752 },
            { lat: 39.47902, lng: -0.37465 },
            { lat: 39.47866, lng: -0.3747 }
        ],
        fin: { lat: 39.47866, lng: -0.3747 },
        imagen: "imagenes/imagenes-aventuras/muro de Santa ana.jpg",
        video: "videos-aventuras/avfallas/tramo 2_2.mp4",
    },
    {
        id: "P-2",
        tipo: "parada",
        parada: 2, // ← Parada 2 (Calle Muro de Santa Ana) (68) Reto 4 //
        nombre: "Calle Muro de Santa Ana",
        coordenadas: { lat: 39.47866, lng: -0.3747 },
        imagen: "imagenes/imagenes-aventuras/muro de Santa ana.jpg",
    },
    {
        id: "TR-3",
        tipo: "tramo",
        tramo: 3, // ← tramo 3 (Calle Muro de Santa Ana → Palacio de los Borgia) (52) //
        nombre: "Calle Muro de Santa Ana → Palacio de los Borgia",
        inicio: { lat: 39.47866, lng: -0.3747 },
        waypoints: [],
        fin: { lat: 39.47768, lng: -0.3749 },
        imagen: "imagenes/imagenes-aventuras/02_cortes_valencianas.jpg",
        video: "videos-aventuras/avfallas/tramo_3.mp4",
    },
    {
        id: "P-3",
        tipo: "parada",
        parada: 3, // ← Parada 3 (Iglesia de San Lorenzo) (686, 682-B, 462, 683, 684) Reto 5 //
        nombre: "Iglesia de San Lorenzo",
        coordenadas: { lat: 39.47768, lng: -0.3749 },
        imagen: "imagenes/imagenes-aventuras/03_iglesia_de_san_lorenzo.jpg",
    },
    {
        id: "TR-4",
        tipo: "tramo",
        tramo: 4, // ← tramo 4 (Iglesia de San Lorenzo → Plaza de la Virgen) (465-B) //
        nombre: "Iglesia de San Lorenzo → Plaza de la Virgen",
        inicio: { lat: 39.47768, lng: -0.3749 },
        waypoints: [],
        fin: { lat: 39.47656, lng: -0.37529 },
        imagen: "imagenes/imagenes-aventuras/04_plaza_de_la_virgen.jpg",
        video: "videos-aventuras/avfallas/tramo_4.mp4",
    },
    {
        id: "P-4",
        tipo: "parada",
        parada: 4, // ← Parada 4 (Plaza de la Virgen) (466, 467) Reto 6 //
        nombre: "Plaza de la Virgen Reto 6",
        coordenadas: { lat: 39.47656, lng: -0.37529 },
        imagen: "imagenes/imagenes-aventuras/04_plaza_de_la_virgen.jpg",
    },
    {
        id: "P-5",
        tipo: "parada",
        parada: 5, // ← Parada 5 (Plaza de la Virgen) (468) Reto 7, 8 Puzzle plaza de la virgen //
        nombre: "Plaza de la Virgen Reto 7",
        coordenadas: { lat: 39.47656, lng: -0.37529 },
        imagen: "imagenes/imagenes-aventuras/04_plaza_de_la_virgen.jpg",
    },
    {
        id: "TR-5",
        tipo: "tramo",
        tramo: 5, // ← tramo 5 (Plaza de la Virgen → Plaza de la Almoína) (477-B, 479, 141, 83, 8-C) //
        nombre: "Plaza de la Virgen → Plaza de la Almoína",
        inicio: { lat: 39.47656, lng: -0.37529 },
        waypoints: [
            { lat: 39.4766, lng: -0.37473 },
            { lat: 39.47656, lng: -0.37453 },
            { lat: 39.47606, lng: -0.3746 }
        ],
        fin: { lat: 39.47604, lng: -0.37451 },
        imagen: "imagenes/imagenes-aventuras/05_plaza_de_la_almoina.jpg",
        video: "videos-aventuras/avfallas/tramo_5.mp4",
    },
    {
        id: "P-6",
        tipo: "parada",
        parada: 6, // ← Parada 6 (Panel cerámico muro Catedral) (434, 440, 441, 442) Reto 9 //
        nombre: "Panel cerámico muro Catedral",
        coordenadas: { lat: 39.47604, lng: -0.37451 },
        imagen: "imagenes/imagenes-aventuras/06_panel_ceramico_muro_norte_catedral.jpg",
    },
    {
        id: "P-7",
        tipo: "parada",
        parada: 7, // ← Parada 7 (Capilla exterior catedral) (443, 444, 445) Reto 10 //
        nombre: "Capilla exterior catedral Reto 10",
        coordenadas: { lat: 39.47604, lng: -0.37451 },
        imagen: "imagenes/imagenes-aventuras/07!!!_capilla_exterior_catedral.jpg",
    },
    {
        id: "P-8",
        tipo: "parada",
        parada: 8, // ← Parada 8 (Capilla exterior catedral) (445) Reto 11 //
        nombre: "Capilla exterior catedral Reto 11",
        coordenadas: { lat: 39.47604, lng: -0.37451 },
        imagen: "imagenes/imagenes-aventuras/07!!!_capilla_exterior_catedral.jpg",
    },
    {
        id: "P-9",
        tipo: "parada",
        parada: 9, // ← Parada 9 (Arco Novo Catedral y Puerta Negra Basílica) (446, 355, 447, 11-B, 451, 452) //
        nombre: "Arco Novo Catedral y Puerta Negra Basílica",
        coordenadas: { lat: 39.47604, lng: -0.37451 },
        imagen: "imagenes/imagenes-aventuras/08_arco_novo_catedral.jpg",
        imagen2: "imagenes/imagenes-aventuras/09_puerta_negra_relieve_basilica.jpg",
    },
    // PARADA 10
    {
        id: "P-10",
        tipo: "parada",
        parada: 10,
        nombre: "Casa del Punt de Gantxo",
        coordenadas: { lat: 39.47604, lng: -0.37451 },
        imagen: "imagenes/imagenes-aventuras/10_casa_del_punt_de_gantxo.jpg",
    },
    {
        id: "TR-6",
        tipo: "tramo",
        tramo: 6, // ← tramo 6 (Plaza de la Almoína → Plaza Decimo Junio Bruto) (457, 10-B) //
        nombre: "Plaza de la Almoína → Plaza Decimo Junio Bruto (Museo Arqueológico de la Almoína)",
        inicio: { lat: 39.47594, lng: -0.37474 },
        waypoints: [],
        fin: { lat: 39.4762, lng: -0.37412 },
        imagen: "imagenes/imagenes-aventuras/05_plaza_de_la_almoina.jpg",
        video: "videos-aventuras/avfallas/tramo_6.mp4",
    },
    {
        id: "P-11",
        tipo: "parada",
        parada: 11, // ← Parada 11 (Museo arqueológico La Almoína) (458) Reto 13 //
        nombre: "Museo arqueológico La Almoína",
        coordenadas: { lat: 39.4762, lng: -0.37412 },
        imagen: "imagenes/imagenes-aventuras/27_museo_la_almoina.jpg",
    },
    {
        id: "P-12",
        tipo: "parada",
        parada: 12, // ← Parada 12 (Museo arqueológico La Almoína) (459, 460, 461) //
        nombre: "Museo arqueológico La Almoína",
        coordenadas: { lat: 39.4762, lng: -0.37412 },
        imagen: "imagenes/imagenes-aventuras/27_museo_la_almoina.jpg",
    },
    {
        id: "P-13",
        tipo: "parada",
        parada: 13, // ← Parada 13 (Vista de la Catedral, Cimborrio) (8-C, 464) Reto14 //
        nombre: "Vista de la Catedral, Cimborrio",
        coordenadas: { lat: 39.4762, lng: -0.37412 },
        imagen: "imagenes/imagenes-aventuras/05_plaza_de_la_almoina.jpg",
    },
    {
        id: "TR-7",
        tipo: "tramo",
        tramo: 7, // ← tramo 7 (Museo arqueológico La Almoína → Palacio Arzobispal) (85) //
        nombre: "Museo arqueológico La Almoína → Palacio Arzobispal",
        inicio: { lat: 39.47611, lng: -0.37478 },
        waypoints: [
            { lat: 39.47604, lng: -0.37442 },
            { lat: 39.47584, lng: -0.37443 },
            { lat: 39.47561, lng: -0.37451 }
        ],
        fin: { lat: 39.4755, lng: -0.37436 },
        imagen: "imagenes/imagenes-aventuras/11_palacio_arzobispal.jpg",
        video: "videos-aventuras/avfallas/parada_8.mp4",
    },
    {
        id: "P-14",
        tipo: "parada",
        parada: 14, // ← Parada 14 (Palacio Arzobispal y Puerta Románica de la Catedral) (673, 86, 426-B, 141, 437, 438) Reto 15 //
        nombre: "Palacio Arzobispal y Puerta Románica de la Catedral",
        coordenadas: { lat: 39.4755, lng: -0.37436 },
        imagen: "imagenes/imagenes-aventuras/12_puerta_romanica_catedral.jpg",
    },
    {
        id: "P-15",
        tipo: "parada",
        parada: 15, // ← Parada 15 (Puerta Románica de la Catedral) (439) //
        nombre: "Puerta Románica de la Catedral",
        coordenadas: { lat: 39.47561, lng: -0.37465 },
        imagen: "imagenes/imagenes-aventuras/12_puerta_romanica_catedral.jpg",
    },
    {
        id: "TR-8",
        tipo: "tramo",
        tramo: 8, // ← tramo 8 (Puerta Románica de la Catedral → Plaza del Ayuntamiento) (125) //
        nombre: "Puerta Románica de la Catedral → Plaza del Ayuntamiento",
        inicio: { lat: 39.47561, lng: -0.37465 },
        waypoints: [
            { lat: 39.4756, lng: -0.37466 },
            { lat: 39.47514, lng: -0.37494 },
            { lat: 39.47447, lng: -0.3754 },
            { lat: 39.47378, lng: -0.3756 },
            { lat: 39.47212, lng: -0.37676 }
        ],
        fin: { lat: 39.47056, lng: -0.37677 },
        imagen: "imagenes/imagenes-aventuras/13_plaza_del_ayuntamiento.jpg",
        video: "videos-aventuras/avfallas/tramo_8.mp4",
    },
    {
        id: "P-16",
        tipo: "parada",
        parada: 16, // ← Parada 16 (Plaza del Ayuntamiento) (13-B, 263, 332, 14-C) //
        nombre: "Plaza del Ayuntamiento",
        coordenadas: { lat: 39.47056, lng: -0.37677 },
        imagen: "imagenes/imagenes-aventuras/13_plaza_del_ayuntamiento.jpg",
    },
    {
        id: "TR-9",
        tipo: "tramo",
        tramo: 9, // ← tramo 9 (Plaza del Ayuntamiento → Edificio del Ayuntamiento) (334, 335) //
        nombre: "Plaza del Ayuntamiento → Edificio del Ayuntamiento de València",
        inicio: { lat: 39.47056, lng: -0.37677 },
        waypoints: [],
        fin: { lat: 39.46971, lng: -0.37693 },
        imagen: "imagenes/imagenes-aventuras/14_ayuntamiento.jpg",
        video: "videos-aventuras/avfallas/tramo_9.mp4",
    },
    {
        id: "P-17",
        tipo: "parada",
        parada: 17, // ← Parada 17 (Edificio del Ayuntamiento) (336, 337, 338) Reto 16 //
        nombre: "Edificio del Ayuntamiento",
        coordenadas: { lat: 39.46971, lng: -0.37693 },
        imagen: "imagenes/imagenes-aventuras/14_ayuntamiento.jpg",
    },
    {
        id: "P-18",
        tipo: "parada",
        parada: 18, // ← Parada 18 (Edificio del Ayuntamiento) (339, 340, 341, 54) //
        nombre: "Edificio del Ayuntamiento",
        coordenadas: { lat: 39.46971, lng: -0.37693 },
        imagen: "imagenes/imagenes-aventuras/14_ayuntamiento.jpg",
    },
    {
        id: "TR-10",
        tipo: "tramo",
        tramo: 10, // ← tramo 10 (Edificio del Ayuntamiento → Estación del Norte) (87, 15-C) //
        nombre: "Edificio del Ayuntamiento → Estación del Norte",
        inicio: { lat: 39.46971, lng: -0.37693 },
        waypoints: [
            { lat: 39.46795, lng: -0.37701 }
        ],
        fin: { lat: 39.46722, lng: -0.37702 },
        imagen: "imagenes/imagenes-aventuras/15_plaza_de_toros_y_estacion_del_norte.jpg",
        video: "videos-aventuras/avfallas/tramo_10.mp4",
    },
    {
        id: "P-19",
        tipo: "parada",
        parada: 19, // ← Parada 19 (Estación del Norte) (326) Reto 17, 18 Puzzle Estación del Norte//
        nombre: "Estación del Norte",
        coordenadas: { lat: 39.46722, lng: -0.37702 },
        imagen: "imagenes/imagenes-aventuras/15_plaza_de_toros_y_estacion_del_norte.jpg",
    },
    {
        id: "TR-11",
        tipo: "tramo",
        tramo: 11, // ← tramo 11 (Estación del Norte → Plaza de Toros) (20-C, 323-B, 88) //
        nombre: "Estación del Norte → Plaza de Toros de València",
        inicio: { lat: 39.46722, lng: -0.37702 },
        waypoints: [],
        fin: { lat: 39.46709, lng: -0.37595 },
        imagen: "imagenes/imagenes-aventuras/15_plaza_de_toros_y_estacion_del_norte.jpg",
        video: "videos-aventuras/avfallas/tramo_11.mp4",
    },
    {
        id: "TR-12",
        tipo: "tramo",
        tramo: 12, // ← Tramo 12 (Plaza de Toros → Casa estilo Árabe) (89, 3-D) //
        nombre: "Plaza de Toros → Casa estilo Árabe",
        inicio: { lat: 39.46709, lng: -0.37595 },
        waypoints: [
            { lat: 39.46714, lng: -0.37498 }
        ],
        fin: { lat: 39.46753, lng: -0.37511 },
        imagen: "imagenes/imagenes-aventuras/16!!!!_casa_estilo_arabe.jpg",
        video: "videos-aventuras/avfallas/parada_13.mp4",
    },
    {
        id: "P-20",
        tipo: "parada",
        parada: 20, // ← Parada 20 (Casa estilo Árabe) (99) Reto 19 //
        nombre: "Casa estilo Árabe",
        coordenadas: { lat: 39.46753, lng: -0.37511 },
        imagen: "imagenes/imagenes-aventuras/16!!!!_casa_estilo_arabe.jpg",
    },
    {
        id: "P-21",
        tipo: "parada",
        parada: 21, // ← Parada 21 (Casa estilo Árabe, mitad Aventura) (100) //
        nombre: "Casa estilo Árabe, mitad Aventura",
        coordenadas: { lat: 39.46753, lng: -0.37511 },
        imagen: "imagenes/imagenes-aventuras/16!!!!_casa_estilo_arabe.jpg",
    },
    {
        id: "TR-13",
        tipo: "tramo",
        tramo: 13, // ← tramo 13 (Casa estilo Árabe → Palacio de Comunicaciones) (21-B) //
        nombre: "Casa estilo Árabe → Palacio de Comunicaciones (Correos)",
        inicio: { lat: 39.46753, lng: -0.37511 },
        waypoints: [],
        fin: { lat: 39.46942, lng: -0.37559 },
        imagen: "imagenes/imagenes-aventuras/17_correos.jpg",
        video: "videos-aventuras/avfallas/tramo_13.mp4",
    },
    {
        id: "P-22",
        tipo: "parada",
        parada: 22, // ← Parada 22 (Palacio de Comunicaciones) (21-C) //
        nombre: "Palacio de Comunicaciones: Correos",
        coordenadas: { lat: 39.46942, lng: -0.37559 },
        imagen: "imagenes/imagenes-aventuras/17_correos.jpg",
    },
    {
        id: "P-23",
        tipo: "parada",
        parada: 23, // ← Parada 23 (Edificio Suay) (22-C) //
        nombre: "Edificio Suay",
        coordenadas: { lat: 39.46942, lng: -0.37559 },
        imagen: "imagenes/imagenes-aventuras/18_edificio_suay.jpg",
    },
    {
        id: "TR-14",
        tipo: "tramo",
        tramo: 14, // ← tramo 14 (Palacio de Comunicaciones → Banco de València) (90) //
        nombre: "Palacio de Comunicaciones → Banco de València",
        inicio: { lat: 39.46942, lng: -0.37559 },
        waypoints: [
            { lat: 39.4699, lng: -0.37573 },
            { lat: 39.4703, lng: -0.3759 },
            { lat: 39.47039, lng: -0.37505 },
            { lat: 39.47043, lng: -0.37427 }
        ],
        fin: { lat: 39.47061, lng: -0.37408 },
        imagen: "imagenes/imagenes-aventuras/19_banco_de_valencia.jpg",
        video: "videos-aventuras/avfallas/tramo_14.mp4",
    },
    {
        id: "P-24",
        tipo: "parada",
        parada: 24, // ← Parada 24 (Banco de Valencia) (23-C) //
        nombre: "Banco de Valencia",
        coordenadas: { lat: 39.47061, lng: -0.37408 },
        imagen: "imagenes/imagenes-aventuras/19_banco_de_valencia.jpg",
    },
    {
        id: "TR-15",
        tipo: "tramo",
        tramo: 15, // ← tramo 15 (Banco de València → Palacio del Marqués de Dos Aguas) (91) //
        nombre: "Banco de València → Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)",
        inicio: { lat: 39.47061, lng: -0.37408 },
        waypoints: [
            { lat: 39.47119, lng: -0.37423 },
            { lat: 39.47214, lng: -0.37446 },
            { lat: 39.47275, lng: -0.37445 }
        ],
        fin: { lat: 39.47276, lng: -0.37467 },
        imagen: "imagenes/imagenes-aventuras/20!!!!_ marques_de_dos aguas.jpg",
        video: "videos-aventuras/avfallas/parada_16.mp4",
    },
    {
        id: "P-25",
        tipo: "parada",
        parada: 25, // ← Parada 25 (Palacio del Marqués de Dos Aguas) (24-C, 25-C, 26-C, 27-C, 28-C, 29-C, 30-C, 31-C, 32-C, 33-C, 34-C, 35-C) //
        nombre: "Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)",
        coordenadas: { lat: 39.47276, lng: -0.37467 },
        imagen: "imagenes/imagenes-aventuras/20!!!!_ marques_de_dos aguas.jpg",
    },
    {
        id: "TR-16",
        tipo: "tramo",
        tramo: 16, // ← tramo 16 (Palacio del Marqués → Mercado Central) (92, 93) //
        nombre: "Palacio del Marqués → Mercado Central",
        inicio: { lat: 39.47276, lng: -0.37467 },
        waypoints: [
            { lat: 39.47315, lng: -0.37608 },
            { lat: 39.47261, lng: -0.37654 },
            { lat: 39.47225, lng: -0.37686 },
            { lat: 39.47265, lng: -0.37725 }
        ],
        fin: { lat: 39.47377, lng: -0.37832 },
        imagen: "imagenes/imagenes-aventuras/21_mercado_central.jpg",
        video: "videos-aventuras/avfallas/tramo_16.mp4",
    },
    {
        id: "P-26",
        tipo: "parada",
        parada: 26, // ← Parada 26 (Mercado central) (36-C, 37-C, 38-C, 39-C, 40-C, 41-C, 42-C, 43-C) //
        nombre: "Mercado central",
        coordenadas: { lat: 39.47377, lng: -0.37832 },
        imagen: "imagenes/imagenes-aventuras/21_mercado_central.jpg",
    },
    {
        id: "TR-17",
        tipo: "tramo",
        tramo: 17, // ← tramo 17 (Mercado Central → Iglesia de los Santos Juanes) (94) //
        nombre: "Mercado Central → Iglesia de los Santos Juanes",
        inicio: { lat: 39.47377, lng: -0.37832 },
        waypoints: [],
        fin: { lat: 39.47425, lng: -0.37895 },
        imagen: "imagenes/imagenes-aventuras/22_iglesia_san_juan_del_mercado.jpg",
        video: "videos-aventuras/avfallas/tramo_17.mp4",
    },
    {
        id: "P-27",
        tipo: "parada",
        parada: 27, // ← Parada 27 (Iglesia de los Santos Juanes) (44-C, 45-C, 46-C, 47-C, 48-C, 49-C, 50-C, 51-C, 52-C, 53-C, 54-C, 55-C, 56-C, 57-C, 58-C) //
        nombre: "Iglesia de los Santos Juanes reto 24",
        coordenadas: { lat: 39.47425, lng: -0.37895 },
        imagen: "imagenes/imagenes-aventuras/22_iglesia_san_juan_del_mercado.jpg",
    },
    {
        id: "P-28",
        tipo: "parada",
        parada: 28, // ← Parada 28 (Iglesia de los Santos Juanes) (59-C) Reto 25 //
        nombre: "Iglesia de los Santos Juanes reto 25",
        coordenadas: { lat: 39.47425, lng: -0.37895 },
        imagen: "imagenes/imagenes-aventuras/22_iglesia_san_juan_del_mercado.jpg",
    },
    {
        id: "TR-18",
        tipo: "tramo",
        tramo: 18, // ← tramo 18 (Iglesia Santos Juanes → Lonja de València) (95) //
        nombre: "Iglesia Santos Juanes → Lonja de València (Mercado de la Seda)",
        inicio: { lat: 39.47425, lng: -0.37895 },
        waypoints: [],
        fin: { lat: 39.47426, lng: -0.37862 },
        imagen: "imagenes/imagenes-aventuras/23_lonja.jpg",
        video: "videos-aventuras/avfallas/parada_19.mp4",
    },
    {
        id: "P-29",
        tipo: "parada",
        parada: 29, // ← Parada 29 (Lonja Puerta de Los Pecados barquero) (60-C) //
        nombre: "Lonja Puerta de Los Pecados barquero",
        coordenadas: { lat: 39.4742, lng: -0.37851 },
        imagen: "imagenes/imagenes-aventuras/23_lonja.jpg",
    },
    {
        id: "P-30",
        tipo: "parada",
        parada: 30, // ← Parada 30 (Lonja Puerta de Los Pecados árbol muerto) (60-C) //
        nombre: "Lonja Puerta de Los Pecados árbol muerto",
        coordenadas: { lat: 39.4742, lng: -0.37851 },
        imagen: "imagenes/imagenes-aventuras/23_lonja.jpg",
    },
    {
        id: "TR-19",
        tipo: "tramo",
        tramo: 19, // ← tramo 19 (Lonja Gárgolas) (96) //
        nombre: "Lonja Gárgolas",
        inicio: { lat: 39.4742, lng: -0.37851 },
        waypoints: [],
        fin: { lat: 39.4742, lng: -0.37881 },
        imagen: "imagenes/imagenes-aventuras/23_lonja.jpg",
    },
    {
        id: "P-31",
        tipo: "parada",
        parada: 31, // ← Parada 31 (Lonja Gárgolas ángel vasija) (61-C) //
        nombre: "Lonja Gárgolas ángel vasija",
        coordenadas: { lat: 39.4742, lng: -0.37881 },
        imagen: "imagenes/imagenes-aventuras/23_lonja.jpg",
    },
    {
        id: "P-32",
        tipo: "parada",
        parada: 32, // ← Parada 32 (Lonja Gárgolas barbudo y león) (61-C) //
        nombre: "Lonja Gárgolas barbudo y león",
        coordenadas: { lat: 39.4742, lng: -0.37881 },
        imagen: "imagenes/imagenes-aventuras/23_lonja.jpg",
    },
    {
        id: "P-33",
        tipo: "parada",
        parada: 33, // ← Parada 33 (Lonja Gárgolas fornicador ventana) (61-C) //
        nombre: "Lonja Gárgolas fornicador ventana",
        coordenadas: { lat: 39.47439, lng: -0.37887 },
        imagen: "imagenes/imagenes-aventuras/23_lonja.jpg",
    },
    {
        id: "TR-20",
        tipo: "tramo",
        tramo: 20, // ← tramo 20 (Lonja → Plaza del Doctor Collado) (97) //
        nombre: "Lonja → Plaza del Doctor Collado",
        inicio: { lat: 39.47426, lng: -0.37862 },
        waypoints: [
            { lat: 39.47445, lng: -0.37889 },
            { lat: 39.47459, lng: -0.37868 },
            { lat: 39.47475, lng: -0.37842 },
            { lat: 39.47436, lng: -0.37799 }
        ],
        fin: { lat: 39.47444, lng: -0.3779 },
        imagen: "imagenes/imagenes-aventuras/24_lonja2.jpg",
        video: "videos-aventuras/avfallas/tramo_20.mp4",
    },
    {
        id: "TR-21",
        tipo: "tramo",
        tramo: 21, // ← tramo 21 (Plaza del Doctor Collado → Plaza del Negrito) (333, 397, 41, 398, 198, 671, 522, 32-C) //
        nombre: "Plaza del Doctor Collado → Plaza del Negrito (Fuente del Negrito)",
        inicio: { lat: 39.47444, lng: -0.3779 },
        waypoints: [
            { lat: 39.47473, lng: -0.37763 },
            { lat: 39.47493, lng: -0.37761 },
            { lat: 39.47559, lng: -0.37772 }
        ],
        fin: { lat: 39.47611, lng: -0.37741 },
        imagen: "imagenes/imagenes-aventuras/25_fuente_del_negrito.jpg",
        video: "videos-aventuras/avfallas/parada_21.mp4",
    },
    {
        id: "P-34",
        tipo: "parada",
        parada: 34, // ← Parada 34 (Fuente del Negrito) (382, 501) Reto 32 //
        nombre: "Fuente del Negrito",
        coordenadas: { lat: 39.47611, lng: -0.37741 },
        imagen: "imagenes/imagenes-aventuras/25_fuente_del_negrito.jpg",
    },
    {
        id: "TR-22",
        tipo: "tramo",
        tramo: 22, // ← tramo 22 (Plaza del Negrito → Calle Caballeros) (33-B, 486, 480-B) //
        nombre: "Plaza del Negrito → Calle Caballeros",
        inicio: { lat: 39.47611, lng: -0.37741 },
        waypoints: [
            { lat: 39.47663, lng: -0.3773 },
            { lat: 39.47661, lng: -0.37685 }
        ],
        fin: { lat: 39.47668, lng: -0.37671 },
        imagen: "imagenes/imagenes-aventuras/26_palau_de_la_generalitat.jpg",
        video: "videos-aventuras/avfallas/parada_22.mp4",
    },
    {
        id: "P-35",
        tipo: "parada",
        parada: 35, // ← Parada 35 (Palau de la Generalitat) (481-B, 482-B, 2-D) //
        nombre: "Palau de la Generalitat",
        coordenadas: { lat: 39.47668, lng: -0.37671 },
        imagen: "imagenes/imagenes-aventuras/26_palau_de_la_generalitat.jpg",
    },
    {
        id: "TR-23",
        tipo: "tramo",
        tramo: 23, // ← tramo 23 (Palacio de la Generalitat → Calle de los Serranos - FINAL) //
        nombre: "Palacio de la Generalitat → Calle de los Serranos (FINAL)",
        inicio: { lat: 39.47668, lng: -0.37671 },
        waypoints: [
            { lat: 39.47661, lng: -0.37685 },
            { lat: 39.47687, lng: -0.37686 }
        ],
        fin: { lat: 39.47773, lng: -0.37671 },
        imagen: "imagenes/imagenes-aventuras/00_torres_de_serranos_back.jpg",
        video: "videos-aventuras/avfallas/parada_24.mp4"
    },
    {
        id: "P-36",
        tipo: "parada",
        parada: 36, // ← Parada 36 (Torres de Serranos Final) (audio despedida) //
        nombre: "Torres de Serranos Final",
        coordenadas: { lat: 39.47773, lng: -0.37671 },
        imagen: "imagenes/imagenes-aventuras/00_torres_de_serranos_back.jpg"
    },

    // ─── REFERENCIAS VISUALES AVENTURA 3 ──────────────────────────────────────
    // Aventura en desarrollo — añadir referencias cuando se complete el mapa del tesoro.
    // ──────────────────────────────────────────────────────────────────────────

      ]
    }
  }
};
