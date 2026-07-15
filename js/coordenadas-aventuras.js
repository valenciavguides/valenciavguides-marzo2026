// Parada 63: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico (Reto 24) (Párrafos: 458)* oxlint-disable no-zero-fractions */
/* biome-ignore-all lint/style/noZeroFractions: Coordenadas con precision decimal fija para consistencia cartografica. */
/*
 * IMPORTANTE: este archivo mantiene fracciones con cero final (por ejemplo 39.479210)
 * para preservar formato cartografico estable y trazabilidad en revisiones.
 * En SonarLint standalone se excluye del analisis para evitar falsos positivos
 * de la regla "Don't use a zero fraction in the number".
 */
/*
 * ESTRUCTURA DE ENTRADAS — tres tipos posibles dentro del array .coordenadas
 *
 * ── REFERENCIA ────────────────────────────────────────────────────────────────
 * Monumentos visibles en mapa-completo.html como marcadores numerados.
 * {
 *   tipo: 'referencia',
 *   id: 'REF-N',
 *   mapa_numero: N,
 *   coordenadas: { lat, lng },   ← coordenadas bajo .coordenadas
 *   nombre: string,
 *   imagen: string
 * }
 *
 * ── INICIO / PARADA ───────────────────────────────────────────────────────────
 * Puntos donde el usuario se detiene. 'inicio' es la parada 0 de la aventura.
 * {
 *   tipo: 'inicio' | 'parada',
 *   id: 'AvX-P-N',
 *   parada: N,
 *   mapa_numero: N,
 *   nombre: string,
 *   coordenadas: { lat, lng },   ← coordenadas bajo .coordenadas
 *   imagen: string
 * }
 *
 * ── TRAMO ─────────────────────────────────────────────────────────────────────
 * Recorrido entre dos paradas. Las coordenadas NO van bajo .coordenadas sino
 * directamente en .inicio, .fin y cada elemento de .waypoints.
 * {
 *   tipo: 'tramo',
 *   id: 'AvX-TR-N',
 *   tramo: N,
 *   mapa_numero: string,         ← p.ej. "1→2"
 *   nombre: string,
 *   inicio: { lat, lng },        ← punto de inicio del tramo
 *   waypoints: [{ lat, lng }],   ← puntos intermedios (puede ser vacío)
 *   fin: { lat, lng },           ← punto final del tramo
 *   imagen: string,
 *   video: string
 * }
 *
 * NOTA PARA NUEVAS AVENTURAS: los tramos no tienen campo .coordenadas.
 * Para obtener una coordenada representativa de un tramo usa .inicio o .fin.
 * El helper _getLatLng() en funciones-mapa.js gestiona estas diferencias.
 */
export const DATOS_AVENTURAS = {
  Aventura1: {
    "coordenadas-hijo2.html": {
      coordenadas: [
    // poner las coordenadas específicas de los puntos a visitar del mapa. dibujarReferencias() ignora automáticamente las que tengan coordenadas: null.
    {
        tipo: "referencia",
        id: "REF-1",
        mapa_numero: 1,
        coordenadas: { lat: Number('39.479210'), lng: Number('-0.376040') },
        nombre: "Torres de Serranos",
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-2",
        mapa_numero: 2,
        coordenadas: { lat: Number('39.477890'), lng: Number('-0.374690') },
        nombre: "Palacio de los Borgia (Cortes Valencianas)",
        imagen: "imagenes/imagenes-aventuras/cortes_valencianas.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-3",
        mapa_numero: 3,
        coordenadas: { lat: Number('39.476340'), lng: Number('-0.375310') },
        nombre: "Plaza de la Virgen",
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-4",
        mapa_numero: 4,
        coordenadas: { lat: Number('39.476150'), lng: Number('-0.374400') },
        nombre: "Plaza Décimo Junio Bruto (Almoína)",
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-5",
        mapa_numero: 5,
        coordenadas: { lat: Number('39.475760'), lng: Number('-0.374860') },
        nombre: "Catedral de Valencia",
        imagen: "imagenes/imagenes-aventuras/catedral_almoina.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-6",
        mapa_numero: 6,
        coordenadas: { lat: Number('39.476260'), lng: Number('-0.374160') },
        nombre: "Museo Arqueológico de la Almoína",
        imagen: "imagenes/imagenes-aventuras/museo_la_almoina.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-7",
        mapa_numero: 7,
        coordenadas: { lat: Number('39.476260'), lng: Number('-0.374840') },
        nombre: "Real Basílica de Nuestra Señora de los Desamparados",
        imagen: "imagenes/imagenes-aventuras/basilica_almoina.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-8",
        mapa_numero: 8,
        coordenadas: { lat: Number('39.475370'), lng: Number('-0.374310') },
        nombre: "Palacio Arzobispal",
        imagen: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-9",
        mapa_numero: 9,
        coordenadas: { lat: Number('39.470620'), lng: Number('-0.376840') },
        nombre: "Plaza del Ayuntamiento",
        imagen: "imagenes/imagenes-aventuras/plaza_del_ayuntamiento.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-10",
        mapa_numero: 10,
        coordenadas: { lat: Number('39.469810'), lng: Number('-0.377060') },
        nombre: "Ayuntamiento de Valencia",
        imagen: "imagenes/imagenes-aventuras/ayuntamiento.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-11",
        mapa_numero: 11,
        coordenadas: { lat: Number('39.467080'), lng: Number('-0.377190') },
        nombre: "Estación del Norte 🚂",
        imagen: "imagenes/imagenes-aventuras/Estacion_Norte.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-12",
        mapa_numero: 12,
        coordenadas: { lat: Number('39.466660'), lng: Number('-0.376140') },
        nombre: "Plaza de Toros ðŸ‚",
        imagen: "imagenes/imagenes-aventuras/Plaza_Toros.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-13",
        mapa_numero: 13,
        coordenadas: { lat: Number('39.467580'), lng: Number('-0.375150') },
        nombre: "Case estilo árabe",
        imagen: "imagenes/imagenes-aventuras/Casa_arabe.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-14",
        mapa_numero: 14,
        coordenadas: { lat: Number('39.469450'), lng: Number('-0.375540') },
        nombre: "Palacio de Comunicaciones (Correos) ðŸ“¨",
        imagen: "imagenes/imagenes-aventuras/correos.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-15",
        mapa_numero: 15,
        coordenadas: { lat: Number('39.470700'), lng: Number('-0.373910') },
        nombre: "Banco Central de Valencia",
        imagen: "imagenes/imagenes-aventuras/banco_de_valencia.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-16",
        mapa_numero: 16,
        coordenadas: { lat: Number('39.472720'), lng: Number('-0.374680') },
        nombre: "Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)",
        imagen: "imagenes/imagenes-aventuras/Marques_dos_aguas_2.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-17",
        mapa_numero: 17,
        coordenadas: { lat: Number('39.473700'), lng: Number('-0.378680') },
        nombre: "Mercado Central",
        imagen: "imagenes/imagenes-aventuras/mercado_central.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-18",
        mapa_numero: 18,
        coordenadas: { lat: Number('39.474210'), lng: Number('-0.379190') },
        nombre: "Real Parroquia de los Santos Juanes (San Juan del Mercado)",
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-19",
        mapa_numero: 19,
        coordenadas: { lat: Number('39.474380'), lng: Number('-0.378340') },
        nombre: "Lonja de la Seda",
        imagen: "imagenes/imagenes-aventuras/lonja.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-20",
        mapa_numero: 20,
        coordenadas: { lat: Number('39.474330'), lng: Number('-0.377780') },
        nombre: "Plaza del Doctor López Collado",
        imagen: "imagenes/imagenes-aventuras/Plaza_collado.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-21",
        mapa_numero: 21,
        coordenadas: { lat: Number('39.476080'), lng: Number('-0.377360') },
        nombre: "Plaza del Negrito",
        imagen: "imagenes/imagenes-aventuras/Plaza_negrito.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-22",
        mapa_numero: 22,
        coordenadas: { lat: Number('39.476620'), lng: Number('-0.377130') },
        nombre: "Calle Caballeros",
        imagen: "imagenes/imagenes-aventuras/Calle_caballeros.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-23",
        mapa_numero: 23,
        coordenadas: { lat: Number('39.476700'), lng: Number('-0.376650') },
        nombre: "Palacio de la Generalitat Valenciana",
        imagen: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg"
    },


    // ────-------------------------------------------------
// coordenadas completas hijo2 Aventura1 //

    // Parada 0 - Torres de Serranos (start) (Reto 3) (Párrafos: 223, 226, 228)
    {
        id: "Av1-P-0",
        tipo: "inicio",
        parada: 2, // mapa número 1
        mapa_numero: 1,
        nombre: "Torres de Serranos (start)",
        coordenadas: { lat: Number('39.478760'), lng: Number('-0.376260') },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
    },

    // Tramo 1: Torres de Serranos → Plaza de la crida (Puente de Serranos)(Párrafos: 229, 2)
    {
        id: "Av1-TR-1",
        tipo: "tramo",
        tramo: 1, // De mapa número 1 a mapa número 1
        mapa_numero: "1→1",
        nombre: "Torres de Serranos → Plaza de la crida (Puente de Serranos)",
        inicio: { lat: Number('39.478760'), lng: Number('-0.376260') },
        waypoints: [
            { lat: Number('39.479050'), lng: Number('-0.376130') },
            { lat: Number('39.479341'), lng: Number('-0.376408') },
            { lat: Number('39.479500'), lng: Number('-0.376210') },
            { lat: Number('39.479430'), lng: Number('-0.375970') }
        ],
        fin: { lat: Number('39.479590'), lng: Number('-0.375830') },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
        imagen2: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        video: "",
    },
    // Parada 3: Plaza de la crída (Puente de Serranos) (Reto 4) (Párrafos: 126, 233)
    {
        id: "Av1-P-1",
        tipo: "parada",
        parada: 3, // mapa número 1 (Sí, hay dos 1 en el mapa por ser el mismo monumento desde diferente perspectiva)
        mapa_numero: 1,
        nombre: "Plaza de la crida (Puente de Serranos)",
        coordenadas: { lat: Number('39.479590'), lng: Number('-0.375830') },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
    },
    // Tramo 2: Plaza de la crída → Calle Muro de Santa Ana (Párrafos: 81)
    {
        id: "Av1-TR-2",
        tipo: "tramo",
        tramo: 2, //De mapa número 1 a sin núemero en el mapa (Calle Muro de Santa Ana)
        mapa_numero: "1→-",
        nombre: "Plaza de la crída → Calle Muro de Santa Ana",
        inicio: { lat: Number('39.479590'), lng: Number('-0.375830') },
        waypoints: [
            { lat: Number('39.479390'), lng: Number('-0.375200') },
            { lat: Number('39.479130'), lng: Number('-0.374760') },
            { lat: Number('39.478860'), lng: Number('-0.374900') },
            { lat: Number('39.478860'), lng: Number('-0.374700') },
        ],
        fin: { lat: Number('39.478660'), lng: Number('-0.374700') },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        imagen2: "imagenes/imagenes-aventuras/serranos_pont_fusta.jpg",
        imagen3: "imagenes/imagenes-aventuras/Calle_Muro_Santa_Ana.jpg",
        video: "",
    },

    // Parada 4: calle Muro Santa Ana (Reto 5) (Párrafos: 68)
    {
        id: "Av1-P-2",
        tipo: "parada",
        parada: 4, // sin número en el mapa
        mapa_numero: null,
        nombre: "Calle Muro de Santa Ana",
        coordenadas: { lat: Number('39.478660'), lng: Number('-0.374700') },
        imagen: "imagenes/imagenes-aventuras/Calle_Muro_Santa_Ana.jpg",
    },

    // Tramo 3: Calle Muro de Santa Ana → Palacio de los Borgia (Párrafos: 52, 686)
    {
        id: "Av1-TR-3",
        tipo: "tramo",
        tramo: 3, // De Calle Muro Santa Ana a mapa número 2
        mapa_numero: "-→2",
        nombre: "Calle Muro de Santa Ana → Palacio de los Borgia",
        inicio: { lat: Number('39.478660'), lng: Number('-0.374700') },
        waypoints: [
            { lat: Number('39.478210'), lng: Number('-0.374790')},
        ],
        fin: { lat: Number('39.477840'), lng: Number('-0.374850') },
        imagen: "imagenes/imagenes-aventuras/Calle_Muro_Santa_Ana.jpg",
        imagen2: "imagenes/imagenes-aventuras/cortes_valencianas.jpg",
        video: "",
    },

    // Parada 5: Iglesia de San Lorenzo (Reto 6) (Párrafos: 682-B, 462, 684, 683)
    {
        id: "Av1-P-3",
        tipo: "parada",
        parada: 5, // sin número en el mapa (Iglesia de San Lorenzo)
        mapa_numero: null,
        nombre: "Iglesia de San Lorenzo",
        coordenadas: { lat: Number('39.477820'), lng: Number('-0.374870') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_lorenzo.jpg",
    },

    // Tramo 4: Iglesia de San Lorenzo → Plaza de la Virgen (Párrafos: 465-B)
    {
        id: "Av1-TR-4",
        tipo: "tramo",
        tramo: 4, // Iglesia de San Lorenzo a mapa número 3
        mapa_numero: "-→3",
        nombre: "Iglesia de San Lorenzo → Plaza de la Virgen",
        inicio: { lat: Number('39.477820'), lng: Number('-0.374870') },
        waypoints: [
            { lat: Number('39.477200'), lng: Number('-0.375030') },
        ],
        fin: { lat: Number('39.476610'), lng: Number('-0.375160') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_lorenzo.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
        video: "",
    },

    // Parada 6: Plaza de la Virgen (Reto 7) (Párrafos: 466, 467)
    {
        id: "Av1-P-4",
        tipo: "parada",
        parada: 6, // mapa número 3
        mapa_numero: 3,
        nombre: "Plaza de la Virgen",
        coordenadas: { lat: Number('39.476620'), lng: Number('-0.375240') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
        imagen2:"imagenes/imagenes-aventuras/Puerta_gotica_catedral.jpg"
    },

    // Parada 7: Plaza de la Virgen (Reto 8) (Párrafos: 477-B, 479, 141, 468)
    {
        id: "Av1-P-5",
        tipo: "parada",
        parada: 7, // mapa número 3
        mapa_numero: 3,
        nombre: "Plaza de la Virgen",
        coordenadas: { lat: Number('39.476570'), lng: Number('-0.375240') },
        imagen: "imagenes/imagenes-aventuras/Puerta_gotica_catedral.jpg",
    },

    // Parada 8: Plaza de la Virgen (Reto9Puzzle PZ-01)
    {
        id: "Av1-P-6",
        tipo: "parada",
        parada: 8, // mapa número 3
        mapa_numero: 3,
        nombre: "Plaza de la Virgen",
        coordenadas: { lat: Number('39.476560'), lng: Number('-0.375160') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
        imagen2: "imagenes/imagenes-aventuras/Puerta_gotica_catedral.jpg",
    },

    // Tramo 5: Plaza de la Virgen → Plaza Décimo Junio Bruto (Almoína) (Párrafos: 83)
    {
        id: "Av1-TR-5",
        tipo: "tramo",
        tramo: 5, //De mapa número 3 a mapa número 4
        mapa_numero: "3→4",
        nombre: "Plaza de la Virgen → Plaza Décimo Junio Bruto (Almoína)",
        inicio: { lat: Number('39.476560'), lng: Number('-0.375160') },
        waypoints: [
            { lat: Number('39.476580'), lng: Number('-0.374960') },
            { lat: Number('39.476600'), lng: Number('-0.374730') },
            { lat: Number('39.476560'), lng: Number('-0.374530') }
        ],
        fin: { lat: Number('39.476290'), lng: Number('-0.374600') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
        imagen2: "imagenes/imagenes-aventuras/Paso_Plaza_Almoina.jpg",
        imagen3: "imagenes/imagenes-aventuras/catedral_almoina.jpg",
        video: "",
    },

    // Parada 9: Panel cerámico muro Catedral (Reto 10) (Párrafos: 8-C, 434, 440, 441, 442 )
    {
        id: "Av1-P-7",
        tipo: "parada",
        parada: 9, // mapa número 5
        mapa_numero: 5,
        nombre: "Panel cerámico muro Catedral",
        coordenadas: { lat: Number('39.476000'), lng: Number('-0.374620') },
        imagen: "imagenes/imagenes-aventuras/panel_ceramico_muro_norte_catedral.jpg",
    },

    // Parada 10: Capilla exterior catedral (Reto 11) (Párrafos: 443, 444)
    {
        id: "Av1-P-8",
        tipo: "parada",
        parada: 10, // mapa número 5
        mapa_numero: 5,
        nombre: "Capilla exterior catedral",
        coordenadas: { lat: Number('39.476030'), lng: Number('-0.374760') },
        imagen: "imagenes/imagenes-aventuras/capilla_exterior_catedral.jpg",
    },

    // Parada 11: Capilla exterior catedral (Reto 12) (Párrafos: 445)
    {
        id: "Av1-P-9",
        tipo: "parada",
        parada: 11, // mapa número 5
        mapa_numero: 5,
        nombre: "Capilla exterior catedral",
        coordenadas: { lat: Number('39.476040'), lng: Number('-0.374820') },
        imagen: "imagenes/imagenes-aventuras/capilla_exterior_catedral.jpg",
    },

    // Parada 12: Arco Novo Catedral y Puerta Negra Basílica (Párrafos: 446, 355, 447, 11-B, 451, 452)
    {
        id: "Av1-P-10",
        tipo: "parada",
        parada: 12, // mapa número 5 y mapa número 9
        mapa_numero: "5,9",
        nombre: "Arco Novo Catedral y Puerta Negra Basílica",
        coordenadas: { lat: Number('39.476070'), lng: Number('-0.374900') },
        imagen: "imagenes/imagenes-aventuras/capilla_pared_catedral.jpg",
        imagen2: "imagenes/imagenes-aventuras/arco_novo_catedral.jpg",
        imagen3: "imagenes/imagenes-aventuras/puerta_negra_relieve_basilica.jpg",
    },

    // Parada 13: Casa del Punt de Gantxo (Reto 13) (Párrafos: 51-C, 454, 455, 455-B, 148, 456)
    {
        id: "Av1-P-11",
        tipo: "parada",
        parada: 13, // sin número en el mapa (Casa del Punt de Gantxo)
        mapa_numero: null,
        nombre: "Casa del Punt de Gantxo",
        coordenadas: { lat: Number('39.476050'), lng: Number('-0.374270') },
        imagen: "imagenes/imagenes-aventuras/basilica_almoina.jpg",
        imagen2:"imagenes/imagenes-aventuras/almoina_escultura.jpg",
        imagen3: "imagenes/imagenes-aventuras/casa_del_punt_de_gantxo.jpg",
    },

    // Tramo 6: Plaza de la Almoína → Museo Arqueológico (Párrafos: 457, 10-B)
    {
        id: "Av1-TR-6",
        tipo: "tramo",
        tramo: 6, // De Casa del punt de gantxo a mapa número 6
        mapa_numero: "-→6",
        nombre: "Plaza de la Almoína → Plaza Decimo Junio Bruto (Museo Arqueológico de la Almoína)",
        inicio: { lat: Number('39.476050'), lng: Number('-0.374270') },
        waypoints: [
            { lat: Number('39.476110'), lng: Number('-0.374220') },
        ],
        fin: { lat: Number('39.476240'), lng: Number('-0.374250') },
       imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/museo_la_almoina.jpg",
        video: "",
    },

    // Parada 14: Museo arqueológico La Almoína (Reto 14) (Párrafos: 458)
    {
        id: "Av1-P-12",
        tipo: "parada",
        parada: 14, // mapa número 6
        mapa_numero: 6,
        nombre: "Museo arqueológico La Almoína",
        coordenadas: { lat: Number('39.476240'), lng: Number('-0.374250') },
        imagen: "imagenes/imagenes-aventuras/museo_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/museo_almoina_2.jpg"
    },

    // Parada 15: Museo arqueológico La Almoína (segunda parte) (Reto15Puzzle: PZ-02) (Párrafos: 459, 460, 461)
    {
        id: "Av1-P-13",
        tipo: "parada",
        parada: 15, // mapa número 6
        mapa_numero: 6,
        nombre: "Museo arqueológico La Almoína",
        coordenadas: { lat: Number('39.476240'),  lng: Number('-0.374290') },
        imagen: "imagenes/imagenes-aventuras/museo_la_almoina.jpg",
    },

    // Parada 16: Vista de la Catedral, Cimborrio (Reto: 16) (Párrafos: 8-C, 464)
    {
        id: "Av1-P-14",
        tipo: "parada",
        parada: 16, // mapa número 5
        mapa_numero: 5,
        nombre: "Vista de la Catedral, Cimborrio",
        coordenadas: { lat: Number('39.476220'), lng: Number('-0.374280') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/catedral_almoina.jpg"
    },

    // Tramo 7: Museo arqueológico La Almoína → Palacio Arzobispal (Párrafos: 85)
    {
        id: "Av1-TR-7",
        tipo: "tramo",
        tramo: 7, // De mapa número 6 a mapa número 8
        mapa_numero: "6→8",
        nombre: "Museo arqueológico La Almoína → Palacio Arzobispal",
        inicio: { lat: Number('39.476220'), lng: Number('-0.374280') },
        waypoints: [
            { lat: Number('39.475970'), lng: Number('-0.374330') },
            { lat: Number('39.475750'), lng: Number('-0.374400') },
            { lat: Number('39.475610'), lng: Number('-0.374450') }
        ],
        fin: { lat: Number('39.475490'), lng: Number('-0.374270') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg",
        video: "",
    },

    // Parada 17: Palacio Arzobispal, Puerta Románica de la Catedral y Torre del Miguelete (Reto 17) (Párrafos: 673, 86, 426-B, 141, 437, 438)
    {
        id: "Av1-P-15",
        tipo: "parada",
        parada: 17, //mapa número 8
        mapa_numero: 8,
        nombre: "Palacio Arzobispal y Puerta Románica de la Catedral",
        coordenadas: { lat: Number('39.475490'), lng: Number('-0.374270') },
        imagen: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg",
        imagen2: "imagenes/imagenes-aventuras/puerta_romanica_catedral.jpg"
    },

    // Parada 18: Puerta Románica de la Catedral (Párrafos: 439)
    {
        id: "Av1-P-16",
        tipo: "parada",
        parada: 18, // mapa número 5
        mapa_numero: 5,
        nombre: "Puerta Románica de la Catedral",
        coordenadas: { lat: Number('39.475610'), lng: Number('-0.374650') },
        imagen: "imagenes/imagenes-aventuras/puerta_romanica_catedral.jpg",
    },

    // Tramo 8: Puerta Románica de la Catedral → Plaza del Ayuntamiento (Párrafos: 125)
    {
        id: "Av1-TR-8",
        tipo: "tramo",
        tramo: 8, // De mapa número 8 a mapa número 9
        mapa_numero: "8→9",
        nombre: "Puerta Románica de la Catedral → Plaza del Ayuntamiento",
        inicio: { lat: Number('39.475610'), lng: Number('-0.374650') },
        waypoints: [
            { lat: Number('39.475510'), lng: Number('-0.374720') },
            { lat: Number('39.475350'), lng: Number('-0.374860') },
            { lat: Number('39.475190'), lng: Number('-0.374910') },
            { lat: Number('39.475030'), lng: Number('-0.375050') },
            { lat: Number('39.475120'), lng: Number('-0.375310') },
            { lat: Number('39.474820'), lng: Number('-0.375350') },
            { lat: Number('39.474160'), lng: Number('-0.375420') },
            { lat: Number('39.473780'), lng: Number('-0.375470') },
            { lat: Number('39.473740'), lng: Number('-0.375660') },
            { lat: Number('39.473420'), lng: Number('-0.375920') },
            { lat: Number('39.473020'), lng: Number('-0.376220') },
            { lat: Number('39.472470'), lng: Number('-0.376630') },
            { lat: Number('39.472120'), lng: Number('-0.376760') },
            { lat: Number('39.471440'), lng: Number('-0.376890') },
        ],
        fin: { lat: Number('39.470560'), lng: Number('-0.376770') },
        imagen: "imagenes/imagenes-aventuras/puerta_romanica_catedral.jpg",
        imagen2: "imagenes/imagenes-aventuras/catedral_hacia_plaza_reina.jpg",
        imagen3: "imagenes/imagenes-aventuras/Plaza_Reina_2.jpg",
        imagen4: "imagenes/imagenes-aventuras/calle_san_Vicente_2.jpg",
        imagen5: "imagenes/imagenes-aventuras/plaza_del_ayuntamiento.jpg",
        video: "",
    },

    // Parada 19: Plaza del Ayuntamiento (Párrafos: 13-B, 263)
    {
        id: "Av1-P-17",
        tipo: "parada",
        parada: 19, // mapa número 9
        mapa_numero: 9,
        nombre: "Plaza del Ayuntamiento",
        coordenadas: { lat: Number('39.470560'), lng: Number('-0.376770') },
        imagen: "imagenes/imagenes-aventuras/plaza_del_ayuntamiento.jpg",
    },

    // Tramo 9: Plaza del Ayuntamiento → Edificio del Ayuntamiento de València (Párrafos: 332, 14-C, 334, 335)
    {
        id: "Av1-TR-9",
        tipo: "tramo",
        tramo: 9, // De mapa número 9 a mapa número 10
        mapa_numero: "9→10",
        nombre: "Plaza del Ayuntamiento → Edificio del Ayuntamiento de València",
        inicio: { lat: Number('39.470560'), lng: Number('-0.376770') },
        waypoints: [
            { lat: Number('39.470070'), lng: Number('-0.376810') },
        ],
        fin: { lat: Number('39.469710'), lng: Number('-0.376930') },
        imagen: "imagenes/imagenes-aventuras/plaza_del_ayuntamiento.jpg",
        imagen2: "imagenes/imagenes-aventuras/ayuntamiento.jpg",
        video: "",
    },

    // Parada 20: Edificio del Ayuntamiento (Reto 18) (Párrafos: 336, 337, 338)
    {
        id: "Av1-P-18",
        tipo: "parada",
        parada: 20, // mapa número 10
        mapa_numero: 10,
        nombre: "Edificio del Ayuntamiento",
        coordenadas: { lat: Number('39.469710'), lng: Number('-0.376930') },
        imagen: "imagenes/imagenes-aventuras/ayuntamiento.jpg",
    },

    // Parada 21: Edificio del Ayuntamiento (segunda parte) (Párrafos: 339, 340, 341, 54)
    {
        id: "Av1-P-19",
        tipo: "parada",
        parada: 21, // mapa número 10
        mapa_numero: 10,
        nombre: "Edificio del Ayuntamiento",
        coordenadas: { lat: Number('39.469610'), lng: Number('-0.376870') },
        imagen: "imagenes/imagenes-aventuras/ayuntamiento.jpg",
    },

    // Tramo 10: Edificio del Ayuntamiento → Estación del Norte - Tren (Párrafos: 87, 15-C)
    {
        id: "Av1-TR-10",
        tipo: "tramo",
        tramo: 10, // De mapa número 10 a mapa número 11
        mapa_numero: "10→11",
        nombre: "Edificio del Ayuntamiento → Estación del Norte",
        inicio: { lat: Number('39.469610'), lng: Number('-0.376870') },
        waypoints: [
            { lat: Number('39.468790'), lng: Number('-0.376890') },
            { lat: Number('39.467950'), lng: Number('-0.377010') },
            { lat: Number('39.467550'), lng: Number('-0.377150') },
        ],
        fin: { lat: Number('39.467220'), lng: Number('-0.377020') },
        imagen: "imagenes/imagenes-aventuras/ayuntamiento.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_de_toros_y_estacion_del_norte.jpg",
        video: "",
    },

    // Parada 22: Estación del Norte - Tren (Reto 19) (Párrafos: 326)
    {
        id: "Av1-P-20",
        tipo: "parada",
        parada: 22, // mapa número 11
        mapa_numero: 11,
        nombre: "Estación del Norte",
        coordenadas: { lat: Number('39.467220'), lng: Number('-0.377020') },
        imagen: "imagenes/imagenes-aventuras/Estacion_Norte.jpg",
        imagen2:"imagenes/imagenes-aventuras/estacion_interior_2.jpeg",
    },

    // Tramo 11: Estación del Norte - Tren → Plaza de Toros de València (Párrafos: 20-C)
    {
        id: "Av1-TR-11",
        tipo: "tramo",
        tramo: 11, // De mapa número 11 a mapa número 12
        mapa_numero: "11→12",
        nombre: "Estación del Norte → Plaza de Toros de València",
        inicio: { lat: Number('39.467220'), lng: Number('-0.377020') },
        waypoints: [
            { lat: Number('39.467220'), lng: Number('-0.376440') },
        ],
        fin: { lat: Number('39.467140'), lng: Number('-0.375930') },
        imagen: "imagenes/imagenes-aventuras/Estacion_Norte.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_de_toros_y_estacion_del_norte.jpg",
        imagen3: "imagenes/imagenes-aventuras/Plaza_Toros.jpg",
        video: "",
    },

    // Parada 23: Plaza de Toros (Reto20Puzzle: PZ-03) (Párrafos: 323-B, 88)
    {
        id: "Av1-P-21",
        tipo: "parada",
        parada: 23, // mapa número 12
        mapa_numero: 12,
        nombre: "Plaza de Toros",
        coordenadas: { lat: Number('39.467140'), lng: Number('-0.375930') },
        imagen: "imagenes/imagenes-aventuras/Plaza_Toros.jpg",
    },

    // Tramo 12: Plaza de Toros → Casa estilo Árabe (Párrafos: 89, 3-D)
    {
        id: "Av1-TR-12",
        tipo: "tramo",
        tramo: 12, // De mapa número 12 a mapa número 13
        mapa_numero: "12→13",
        nombre: "Plaza de Toros → Casa estilo Árabe",
        inicio: { lat: Number('39.467140'), lng: Number('-0.375930') },
        waypoints: [
            { lat: Number('39.467140'), lng: Number('-0.374980') },
        ],
        fin: { lat: Number('39.467520'), lng: Number('-0.375110') },
        imagen: "imagenes/imagenes-aventuras/Plaza_Toros.jpg",
        imagen2: "imagenes/imagenes-aventuras/Casa_arabe.jpg",
        video: "",
    },

    // Parada 24: Casa estilo Árabe (mitad Aventura) (Reto: 21) (Párrafos: 100, 99)
    {
        id: "Av1-P-22",
        tipo: "parada",
        parada: 24, // mapa número 13
        mapa_numero: 13,
        nombre: "Casa estilo Árabe",
        coordenadas: { lat: Number('39.467520'), lng: Number('-0.375110') },
        imagen: "imagenes/imagenes-aventuras/Casa_arabe.jpg",
    },

    // Tramo 13: Casa estilo Árabe → Palacio de Comunicaciones (Correos) (Párrafos: 21-B)
    {
        id: "Av1-TR-13",
        tipo: "tramo",
        tramo: 13, // De mapa número 13 a mapa número 14
        mapa_numero: "13→14",
        nombre: "Casa estilo Árabe → Palacio de Comunicaciones (Correos)",
        inicio: { lat: Number('39.467520'), lng: Number('-0.375110') },
        waypoints: [
            { lat: Number('39.468390'), lng: Number('-0.375280') },
            { lat: Number('39.468910'), lng: Number('-0.375420') },
        ],
        fin: { lat: Number('39.469420'), lng: Number('-0.375590') },
        imagen: "imagenes/imagenes-aventuras/Casa_arabe.jpg",
        imagen2: "imagenes/imagenes-aventuras/correos.jpg",
        video: "",
    },

    // Parada 25: Palacio de Comunicaciones (Correos) (Reto 22) (Párrafos: 700, 343, 344)
    {
        id: "Av1-P-23",
        tipo: "parada",
        parada: 25, // mapa número 14
        mapa_numero: 14,
        nombre: "Palacio de Comunicaciones: Correos",
        coordenadas: { lat: Number('39.469420'), lng: Number('-0.375590') },
        imagen: "imagenes/imagenes-aventuras/correos.jpg",
    },

    // Parada 26: Edificio Suay - La Equitativa (Reto 23) (Párrafos: 693, 693-B)
    {
        id: "Av1-P-24",
        tipo: "parada",
        parada: 26, // sin número en el mapa (Edificio Suay - La Equitativa)
        mapa_numero: null,
        nombre: "Edificio Suay - La Equitativa",
        coordenadas: { lat: Number('39.469610'), lng: Number('-0.375680') },
        imagen: "imagenes/imagenes-aventuras/edificio_suay.jpg",
    },

    // Tramo 14: Palacio de Comunicaciones (Correos) → Banco de Valencia (Párrafos: 345, 347, 348, 22)
    {
        id: "Av1-TR-14",
        tipo: "tramo",
        tramo: 14, // De mapa número 14 a mapa número 15
        mapa_numero: "14→15",
        nombre: "Palacio de Comunicaciones → Banco de València",
        inicio: { lat: Number('39.469610'), lng: Number('-0.375680') },
        waypoints: [
            { lat: Number('39.469980'), lng: Number('-0.375870') },
            { lat: Number('39.470300'), lng: Number('-0.375900') },
            { lat: Number('39.470390'), lng: Number('-0.375050') },
            { lat: Number('39.470430'), lng: Number('-0.374270') }
        ],
        fin: { lat: Number('39.470610'), lng: Number('-0.374080') },
        imagen: "imagenes/imagenes-aventuras/correos.jpg",
        imagen2: "imagenes/imagenes-aventuras/Calle_barcas.jpg",
        imagen3: "imagenes/imagenes-aventuras/banco_de_valencia.jpg",
        video: "",
    },

    // Parada 27: Banco de Valencia (Reto: 24) (Párrafos: 349, 350)
    {
        id: "Av1-P-25",
        tipo: "parada",
        parada: 27, // mapa número 15
        mapa_numero: 15,
        nombre: "Banco de Valencia",
        coordenadas: { lat: Number('39.470610'), lng: Number('-0.374080') },
        imagen: "imagenes/imagenes-aventuras/banco_de_valencia.jpg",
    },

    // Tramo 15: Banco de Valencia → Palacio del Marqués de Dos Aguas "Museo Nacional de Cerámica" (Párrafos: 351, 23-B, 352, 354)
    {
        id: "Av1-TR-15",
        tipo: "tramo",
        tramo: 15, // De mapa número 15 a mapa número 16
        mapa_numero: "15→16",
        nombre: "Banco de València → Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)",
        inicio: { lat: Number('39.470610'), lng: Number('-0.374080') },
        waypoints: [
            { lat: Number('39.471190'), lng: Number('-0.374230') },
            { lat: Number('39.472140'), lng: Number('-0.374460') },
            { lat: Number('39.472750'), lng: Number('-0.374450') }
        ],
        fin: { lat: Number('39.472760'), lng: Number('-0.374670') },
        imagen: "imagenes/imagenes-aventuras/banco_de_valencia.jpg",
        imagen2: "imagenes/imagenes-aventuras/Iglesia_San_juan_cruz.jpg",
        imagen3: "imagenes/imagenes-aventuras/Marques_dos_aguas_2.jpg",
        video: "",
    },

    // Parada 28: Palacio del Marqués de Dos Aguas "Museo Nacional de Cerámica" (Párrafos: 356, 357)
    {
        id: "Av1-P-26",
        tipo: "parada",
        parada: 28, // mapa número 16
        mapa_numero: 16,
        nombre: "Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)",
        coordenadas: { lat: Number('39.472760'), lng: Number('-0.374670') },
        imagen: "imagenes/imagenes-aventuras/Marques_dos_aguas_1.jpg",
        imagen2:"imagenes/imagenes-aventuras/museo_ceramica_9.jpg",
        imagen3: "imagenes/imagenes-aventuras/museo_ceramica_8.jpg",
    },

    // Tramo 16: Palacio del Marqués de Dos Aguas "Museo Nacional de Cerámica" → Mercado Central (Párrafos: 358, 359-B, 101)
    {
        id: "Av1-TR-16",
        tipo: "tramo",
        tramo: 16, // De mapa número 16 a mapa número 17
        mapa_numero: "16→17",
        nombre: "Palacio del Marqués → Mercado Central",
        inicio: { lat: Number('39.472760'), lng: Number('-0.374670') },
        waypoints: [
            { lat: Number('39.473030'), lng: Number('-0.375270') },
            { lat: Number('39.473080'), lng: Number('-0.375830') },
            { lat: Number('39.473150'), lng: Number('-0.376080') },
            { lat: Number('39.472610'), lng: Number('-0.376540') },
            { lat: Number('39.472160'), lng: Number('-0.376840') },
            { lat: Number('39.472400'), lng: Number('-0.377050') },
            { lat: Number('39.473190'), lng: Number('-0.377650') },
        ],
        fin: { lat: Number('39.473770'), lng: Number('-0.378320') },
        imagen: "imagenes/imagenes-aventuras/Marques_dos_aguas_1.jpg",
        imagen2: "imagenes/imagenes-aventuras/Calle_San_Vicente.jpg",
        imagen3: "imagenes/imagenes-aventuras/mercado_central.jpg",
        video: "",
    },

    // Parada 29: Mercado Central (Reto 25) (Párrafos: 701, 24-D, 361, 362, 363, 364)
    {
        id: "Av1-P-27",
        tipo: "parada",
        parada: 29, // mapa número 17
        mapa_numero: 17,
        nombre: "Mercado Central",
        coordenadas: { lat: Number('39.473770'), lng: Number('-0.378320') },
        imagen: "imagenes/imagenes-aventuras/mercado_central.jpg",
    },

    // Tramo 17: Mercado Central → Iglesia de los Santos Juanes o San Juan del Mercado (Párrafos: 274, 27-C)
    {
        id: "Av1-TR-17",
        tipo: "tramo",
        tramo: 17, // De mapa número 17 a mapa número 18
        mapa_numero: "17→18",
        nombre: "Mercado Central → Iglesia de los Santos Juanes (San Juan del Mercado)",
        inicio: { lat: Number('39.473770'), lng: Number('-0.378320') },
        waypoints: [
            { lat: Number('39.474080'), lng: Number('-0.378620') },
        ],
        fin: { lat: Number('39.474250'), lng: Number('-0.378950') },
        imagen: "imagenes/imagenes-aventuras/mercado_central.jpg",
        imagen2: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg",
        video: "",
    },

    // Parada 30: Iglesia de los Santos Juanes o San Juan del Mercado 1 (Reto 26) (Párrafos: 27-C, 365, 366)
    {
        id: "Av1-P-28",
        tipo: "parada",
        parada: 30, // mapa número 18
        mapa_numero: 18,
        nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)",
        coordenadas: { lat: Number('39.474250'), lng: Number('-0.378950') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg",
    },

    // Parada 31: Iglesia de los Santos Juanes 2 (San Juan del Mercado) (Reto 27) (Párrafos: 368, 367)
    {
        id: "Av1-P-29",
        tipo: "parada",
        parada: 31, // mapa número 18
        mapa_numero: 18,
        nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)",
        coordenadas: { lat: Number('39.474240'), lng: Number('-0.378890') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg",
    },

    // Tramo 18: Iglesia Santos Juanes (San Juan del Mercado) → Lonja de Valencia (Mercado de la Seda) (Párrafos: 369, 28)
    {
        id: "Av1-TR-18",
        tipo: "tramo",
        tramo: 18, // De mapa número 18 a mapa número 19
        mapa_numero: "18→19",
        nombre: "Iglesia Santos Juanes (San Juan del Mercado) → Lonja de València (Mercado de la Seda)",
        inicio: { lat: Number('39.474240'), lng: Number('-0.378890') },
        waypoints: [],
        fin: { lat: Number('39.474220'), lng: Number('-0.378750') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg",
        imagen2: "imagenes/imagenes-aventuras/lonja.jpg",
        video: "",
    },

    // Parada 32: Lonja (Mercado de la Seda) historia (Reto28Puzzle PZ-04) (Párrafos: 370, 371, 372, 373, 374)
    {
        id: "Av1-P-30",
        tipo: "parada",
        parada: 32, // mapa número 19
        mapa_numero: 19,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474220'), lng: Number('-0.378750') },
        imagen: "imagenes/imagenes-aventuras/lonja.jpg",
    },

    // Parada 33: Lonja (Mercado de la Seda) Puerta de Los Pecados 1 (Reto 29) (Párrafos: 375, 376, 377, 378, 379)
    {
        id: "Av1-P-31",
        tipo: "parada",
        parada: 33, // mapa número 19
        mapa_numero: 19,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474170'), lng: Number('-0.378600') },
        imagen: "imagenes/imagenes-aventuras/Lonja_puerta_pecados.jpg",
        imagen2: "imagenes/imagenes-aventuras/lonja4.jpg",
    },

    // Parada 34: Lonja (Mercado de la Seda) Puerta de Los Pecados 2 (Reto 30) (Párrafos: 380, 381)
    {
        id: "Av1-P-32",
        tipo: "parada",
        parada: 34, // mapa número 19
        mapa_numero: 19,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474160'), lng: Number('-0.378570') },
        imagen: "imagenes/imagenes-aventuras/lonja5.jpg",
    },

    // Parada 35: Lonja (Mercado de la Seda) Gárgolas 1 (Reto 31) (Párrafos: 383, 384)
    {
        id: "Av1-P-33",
        tipo: "parada",
        parada: 35, // mapa número 19
        mapa_numero: 19,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474170'), lng: Number('-0.378680') },
        imagen: "imagenes/imagenes-aventuras/lonja3.jpg",
    },

    // Parada 36: Lonja (Mercado de la Seda) Gárgolas 2 (Reto 32) (Párrafos: 385)
    {
        id: "Av1-P-34",
        tipo: "parada",
        parada: 36, // mapa número 19
        mapa_numero: 19,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474190'), lng: Number('-0.378710') },
        imagen: "imagenes/imagenes-aventuras/lonja.jpg",
    },

    // Parada 37: Lonja (Mercado de la Seda) Fornicador (Reto 33) (Párrafos: 386)
    {
        id: "Av1-P-35",
        tipo: "parada",
        parada: 37, // mapa número 19
        mapa_numero: 19,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474340'), lng: Number('-0.378780') },
        imagen: "imagenes/imagenes-aventuras/lonja6.jpg",
    },

    // Tramo 19: Rodeando la Lonja (Mercado de la Seda)(Párrafos: 388)
    {
        id: "Av1-TR-19",
        tipo: "tramo",
        tramo: 19, // De mapa número 19 a mapa número 19
        mapa_numero: "19→19",
        nombre: "Lonja (Mercado de la Seda)",
        inicio: { lat: Number('39.474340'), lng: Number('-0.378780') },
        waypoints: [
            { lat: Number('39.474450'), lng: Number('-0.378890') },
        ],
        fin: { lat: Number('39.474560'), lng: Number('-0.378700') },
        imagen: "imagenes/imagenes-aventuras/Lonja_esquina_izquierda.jpg",
        imagen2: "imagenes/imagenes-aventuras/Lonja_patio_naranjos_far_view.jpg",
        imagen3: "imagenes/imagenes-aventuras/Lonja_patio_naranjos_close_view.jpg",
        video: "",
    },

    // Parada 38: Lonja (Mercado de la Seda) - Gárgola Torre (Párrafos: 390, 391)
    {
        id: "Av1-P-36",
        tipo: "parada",
        parada: 38, // mapa número 19
        mapa_numero: 19,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474560'), lng: Number('-0.378700') },
        imagen: "imagenes/imagenes-aventuras/lonja7.jpg",
    },

    // Tramo 20: Lonja (Mercado de la Seda) - Patio de los naranjos → Lonja entrada visitantes (Párrafos: 392)
    {
        id: "Av1-TR-20",
        tipo: "tramo",
        tramo: 20, // De mapa número 19 a mapa número 19
        mapa_numero: "19→19",
        nombre: "Lonja Patio de los naranjos → Lonja entrada visitantes",
        inicio: { lat: Number('39.474560'), lng: Number('-0.378700') },
        waypoints: [
            { lat: Number('39.474750'), lng: Number('-0.378420') },
        ],
        fin: { lat: Number('39.474660'), lng: Number('-0.378340') },
        imagen: "imagenes/imagenes-aventuras/Lonja_patio_naranjos_close_view.jpg",
        imagen2: "imagenes/imagenes-aventuras/Lonja-puerta-visitante.jpg",
        video: "",
    },

    // Tramo 21: Lonja (Mercado de la Seda) -entrada visitantes →  Plaza Doctor López Collado (Párrafos: 333, 397, 31)
    {
        id: "Av1-TR-21",
        tipo: "tramo",
        tramo: 21, // De mapa número 19 a mapa número 20
        mapa_numero: "19→20",
        nombre: "Lonja entrada visitantes →  Plaza Doctor López Collado",
        inicio: { lat: Number('39.474660'), lng: Number('-0.378340') },
        waypoints: [
            { lat: Number('39.474530'), lng: Number('-0.378190') },
            { lat: Number('39.474360'), lng: Number('-0.378000') },
        ],
        fin: { lat: Number('39.474440'), lng: Number('-0.377900') },
        imagen: "imagenes/imagenes-aventuras/Lonja-puerta-visitante.jpg",
        imagen2: "imagenes/imagenes-aventuras/lonja2.jpg",
        imagen3: "imagenes/imagenes-aventuras/Plaza_collado.jpg",
        video: "",
    },

    // Parada 39: Plaza Doctor López Collado (Párrafos: 398)
    {
        id: "Av1-P-37",
        tipo: "parada",
        parada: 39, // mapa número 20
        mapa_numero: 20,
        nombre: "Plaza Doctor López Collado",
        coordenadas: { lat: Number('39.474440'), lng: Number('-0.377900') },
        imagen: "imagenes/imagenes-aventuras/lonja7.jpg",
        imagen2: "imagenes/imagenes-aventuras/Plaza_collado.jpg",
    },

    // Tramo 22: Plaza del Doctor López Collado → Plaza del Negrito (Párrafos: 198, 671, 522, 32-C)
    {
        id: "Av1-TR-22",
        tipo: "tramo",
        tramo: 22, // De mapa número 20 a mapa número 21
        mapa_numero: "20→21",
        nombre: "Plaza del Doctor Collado → Plaza del Negrito (Fuente del Negrito)",
        inicio: { lat: Number('39.474440'), lng: Number('-0.377900') },
        waypoints: [
            { lat: Number('39.474670'), lng: Number('-0.377660') },
            { lat: Number('39.474760'), lng: Number('-0.377590')},
            { lat: Number('39.474930'), lng: Number('-0.377610') },
            { lat: Number('39.475290'), lng: Number('-0.377680') },
            { lat: Number('39.475590'), lng: Number('-0.377720') },
            { lat: Number('39.475850'), lng: Number('-0.377590') },
        ],
        fin: { lat: Number('39.476110'), lng: Number('-0.377410') },
        imagen: "imagenes/imagenes-aventuras/Plaza_collado.jpg",
        imagen2: "imagenes/imagenes-aventuras/Plaza_negrito.jpg",
        imagen3: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
        video: "",
    },

    // Parada 40: Fuente del Negrito (Reto 34) (Párrafos: 382, 501)
    {
        id: "Av1-P-38",
        tipo: "parada",
        parada: 40, // mapa número 21
        mapa_numero: 21,
        nombre: "Fuente del Negrito",
        coordenadas: { lat: Number('39.476110'), lng: Number('-0.377410') },
        imagen: "imagenes/imagenes-aventuras/Plaza_negrito.jpg",
        image2: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
    },

    // Tramo 23: Plaza del Negrito → Calle Caballeros (Párrafos: 33-B, 486, 480-B)
    {
        id: "Av1-TR-23",
        tipo: "tramo",
        tramo: 23, // De mapa número 21 a mapa número 22
        mapa_numero: "21→22",
        nombre: "Plaza del Negrito → Calle Caballeros",
        inicio: { lat: Number('39.476110'), lng: Number('-0.377410') },
        waypoints: [
            { lat: Number('39.476390'), lng: Number('-0.377360') },
            { lat: Number('39.476630'), lng: Number('-0.377300') },
            { lat: Number('39.476610'), lng: Number('-0.376850') }
        ],
        fin: { lat: Number('39.476610'), lng: Number('-0.376730') },
        imagen: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
        imagen2: "imagenes/imagenes-aventuras/Calle_caballeros.jpg",
        imagen3: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
        video: "",
    },

    // Parada 41: Palau de la Generalitat (Párrafos: 481-B, 482-B)
    {
        id: "Av1-P-39",
        tipo: "parada",
        parada: 41, // mapa número 23
        mapa_numero: 23,
        nombre: "Palau de la Generalitat",
        coordenadas: { lat: Number('39.476680'), lng: Number('-0.376710') },
        imagen: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
    },

     // Tramo 24: Palacio de la Generalitat → Calle de los Serranos (Párrafos: 2-D)
    {
        id: "Av1-TR-24",
        tipo: "tramo",
        tramo: 24, // De mapa número 23 a mapa número 1
        mapa_numero: "23→1",
        nombre: "Palacio de la Generalitat → Calle de los Serranos (FINAL)",
        inicio: { lat: Number('39.476680'), lng: Number('-0.376710') },
        waypoints: [
            { lat: Number('39.476870'), lng: Number('-0.376860') },
            { lat: Number('39.477300'), lng: Number('-0.376890') },
            { lat: Number('39.477730'), lng: Number('-0.376710') },
        ],
        fin: { lat: Number('39.478590'), lng: Number('-0.376330') },
        imagen:"imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
        imagen2: "imagenes/imagenes-aventuras/Calle_serranos.jpg",
        imagen3: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
        video: ""
    },

    // Parada 40 - FINAL: Torres de Serranos Final (Reto35Puzzle PZ-05) (Párrafos: 475, 503, 507, 526,)
    {
        id: "Av1-P-40",
        tipo: "parada",
        parada: 42, // mapa número 1
        mapa_numero: 1,
        nombre: "Torres de Serranos Final",
        coordenadas: { lat: Number('39.478590'), lng: Number('-0.376330') },
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
        id: "REF-1",
        mapa_numero: 1,
        coordenadas: { lat: Number('39.479210'), lng: Number('-0.376040') },
        nombre: "Torres de Serranos",
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-2",
        mapa_numero: 2,
        coordenadas: { lat: Number('39.478310'), lng: Number('-0.376540') },
        nombre: "Refugio de la Guerra Civil 1936-39",
        imagen: "imagenes/imagenes-aventuras/refugio_guerra_civil.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-3",
        mapa_numero: 3,
         coordenadas: { lat: Number('39.476700'), lng: Number('-0.376650') },
        nombre: "Palacio de la Generalitat Valenciana",
        imagen: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg"
    },
    {
       tipo: "referencia",
        id: "REF-4",
        mapa_numero: 4,
        coordenadas: { lat: Number('39.476620'), lng: Number('-0.377130') },
        nombre: "Calle Caballeros",
        imagen: "imagenes/imagenes-aventuras/Calle_caballeros.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-5",
        mapa_numero: 5,
        coordenadas: { lat: Number('39.476550'), lng: Number('-0.378830') },
        nombre: "Parroquia de San Nicolás",
        imagen: "imagenes/imagenes-aventuras/iglesia_san_nicolas_front.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-6",
        mapa_numero: 6,
        coordenadas: { lat: Number('39.476070'), lng: Number('-0.379160') },
        nombre: "Parroquia de San Nicolás (Puerta gótica)",
        imagen: "imagenes/imagenes-aventuras/Iglesia_San_Nicolas_esquina_back.jpg",
    },
    {
       tipo: "referencia",
        id: "REF-7",
        mapa_numero: 7,
        coordenadas: { lat: Number('39.476080'), lng: Number('-0.377360') },
        nombre: "Plaza del Negrito",
        imagen: "imagenes/imagenes-aventuras/Plaza_negrito.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-8",
        mapa_numero: 8,
        coordenadas: { lat: Number('39.476280'), lng: Number('-0.380100') },
        nombre: "Plaza del Tossal",
        imagen: "imagenes/imagenes-aventuras/plaza_del_tossal.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-9",
        mapa_numero: 9,
        coordenadas: { lat: Number('39.477550'), lng: Number('-0.378600') },
        nombre: "Portal de la Valldigna",
        imagen: "imagenes/imagenes-aventuras/portal-de-la_valldigna.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-10",
        mapa_numero: 10,
        coordenadas: { lat: Number('39.478160'), lng: Number('-0.377700') },
        nombre: "Torre del Ángel (árabe)",
        imagen: "imagenes/imagenes-aventuras/torre-del_angel_arabe.jpg",
    },
    {
       tipo: "referencia",
        id: "REF-11",
        mapa_numero: 11,
        coordenadas: { lat: Number('39.476340'), lng: Number('-0.375310') },
        nombre: "Plaza de la Virgen",
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-12",
        mapa_numero: 12,
        coordenadas: { lat: Number('39.475330'), lng: Number('-0.375630') },
        nombre: "Catedral de Valencia (Torre del Miguelete)",
        imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-13",
        mapa_numero: 13,
        coordenadas: { lat: Number('39.475280'), lng: Number('-0.375470') },
        nombre: "Catedral de Valencia (Puerta Barroca)",
        imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-14",
        mapa_numero: 14,
        coordenadas: { lat: Number('39.473970'), lng: Number('-0.376220') },
        nombre: "Torre de Santa Catalina",
        imagen: "imagenes/imagenes-aventuras/torre_santa_catalina.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-15",
        mapa_numero: 15,
        coordenadas: { lat: Number('39.474100'), lng: Number('-0.376410') },
        nombre: "Iglesia de Santa Catalina",
        imagen: "imagenes/imagenes-aventuras/iglesia_santa_catalina.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-16",
        mapa_numero: 16,
        coordenadas: { lat: Number('39.473670'), lng: Number('-0.376570') },
        nombre: "Plaza Redonda",
        imagen: "imagenes/imagenes-aventuras/plaza_redonda.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-17",
        mapa_numero: 17,
        coordenadas: { lat: Number('39.474490'), lng: Number('-0.376140') },
        nombre: "Plaza Milagro del Mocadoret (Mercado de Tapinería)",
        imagen: "imagenes/imagenes-aventuras/milagro_del_mocaoret.jpg",
    },

    // ────---------------------------------------------

                // coordenadas completas hijo2 Aventura2 //
                // Parada 0 - Torres de Serranos (start) (Reto 3) (Párrafos: 223, 226, 228)
                {
                    id: "Av2-P-0",
                    tipo: "inicio",
                    parada: 2, // mapa número 1
                    mapa_numero: 1,
                    nombre: "Torres de Serranos (start)",
                    coordenadas: { lat: Number('39.478760'), lng: Number('-0.376260') },
                    imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
                },

                // Parada 1 - Torres de Serranos (Reto 4) (Reto de la Bandera) (Párrafos: 229, 233)
                {
                    id: "Av2-P-1",
                    tipo: "parada",
                    parada: 3, // mapa número 1
                    mapa_numero: 1,
                    nombre: "Torres de Serranos (Historia de la bandera)",
                    coordenadas: { lat: Number('39.478760'), lng: Number('-0.376260') },
                    imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
                },

                // Parada 2 - Torres de Serranos (Historia de la bandera) (Párrafos: 641, 642, 643)
                {
                    id: "Av2-P-2",
                    tipo: "parada",
                    parada: 4, // mapa número 1
                    mapa_numero: 1,
                    nombre: "Torres de Serranos (Historia de la bandera)",
                    coordenadas: { lat: Number('39.478760'), lng: Number('-0.376260') },
                    imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
                },

                // Tramo 1 - Torres de Serranos → Refugio Guerra Civil (Párrafos: 103)
                {
                    id: "Av2-TR-1",
                    tipo: "tramo",
                    tramo: 1, // De mapa número 1 a mapa número 2
                    mapa_numero: "1→2",
                    nombre: "Torres de Serranos → Refugio Guerra Civil",
                    inicio: { lat: Number('39.478760'), lng: Number('-0.376260') },
                    waypoints:
                    [
                        { lat: Number('39.478550'), lng: Number('-0.376350') },
                    ],
                    fin: { lat: Number('39.478310'), lng: Number('-0.376540') },
                    imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
                    imagen2: "imagenes/imagenes-aventuras/refugio_guerra_civil.jpg",
                    video: ""
                },

                // Parada 3 - Refugio Guerra Civil (Párrafos: 524, 395)
                {
                    id: "Av2-P-3",
                    tipo: "parada",
                    parada: 4, // mapa número 2
                    mapa_numero: 2,
                    nombre: "Refugio Guerra Civil",
                    coordenadas: { lat: Number('39.478310'), lng: Number('-0.376540') },
                    imagen: "imagenes/imagenes-aventuras/refugio_guerra_civil.jpg",
                },

                // Tramo 2 - Refugio Guerra Civil → Palau de la Generalitat (Párrafos: 104)
                {
                    id: "Av2-TR-2",
                    tipo: "tramo",
                    tramo: 2, // De mapa número 2 a mapa número 3
                    mapa_numero: "2→3",
                    nombre: "Refugio Guerra Civil → Palau de la Generalitat",
                    inicio: { lat: Number('39.478310'), lng: Number('-0.376540') },
                    waypoints:
                    [
                     { lat: Number('39.478080'), lng: Number('-0.376560') },
                     { lat: Number('39.477730'), lng: Number('-0.376710') },
                     { lat: Number('39.477510'), lng: Number('-0.376820') },
                     { lat: Number('39.477310'), lng: Number('-0.376880') },
                     { lat: Number('39.476880'), lng: Number('-0.376860') },
                     { lat: Number('39.476810'), lng: Number('-0.376690') },
                    ],
                    fin: { lat: Number('39.476680'), lng: Number('-0.376710') },
                    imagen: "imagenes/imagenes-aventuras/refugio_guerra_civil.jpg",
                    imagen2:"imagenes/imagenes-aventuras/Calle_serranos.jpg",
                    imagen3: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
                    video: ""
                },

                // Parada 4 - Palau de la Generalitat (Reto 5) (Párrafos: 481, 482, 482-B, 483)
                {
                    id: "Av2-P-4",
                    tipo: "parada",
                    parada: 6, // mapa número 3
                    mapa_numero: 3,
                    nombre: "Palau de la Generalitat",
                    coordenadas: { lat: Number('39.476680'), lng: Number('-0.376710') },
                    imagen: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
                },

                // Tramo 3 - Palau de la Generalitat → Calle Caballeros (Párrafos: 104)
                {
                    id: "Av2-TR-3",
                    tipo: "tramo",
                    tramo: 3, // De mapa número 3 a mapa número 4
                    mapa_numero: "3→4",
                    nombre: "Palau de la Generalitat → Calle Caballeros",
                    inicio: { lat: Number('39.476680'), lng: Number('-0.376710') },
                    waypoints: [],
                    fin: { lat: Number('39.476590'), lng: Number('-0.376940') },
                    imagen: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
                    imagen2: "imagenes/imagenes-aventuras/Calle_caballeros.jpg",
                    video: ""
                },

                // Tramo 4 - Calle Caballeros → Iglesia de San Nicolás (Párrafos: 487-B)
                {
                    id: "Av2-TR-4",
                    tipo: "tramo",
                    tramo: 4, // De mapa número 4 a mapa número 5
                    mapa_numero: "4→5",
                    nombre: "Calle Caballeros → Iglesia de San Nicolás",
                    inicio: { lat: Number('39.476590'), lng: Number('-0.376940') },
                    waypoints:
                    [
                        { lat: Number('39.476600'), lng: Number('-0.376860') },
                        { lat: Number('39.476630'), lng: Number('-0.377830') },
                        { lat: Number('39.476670'), lng: Number('-0.378380') },
                        { lat: Number('39.476620'), lng: Number('-0.378650') },
                    ],
                    fin: { lat: Number('39.476570'), lng: Number('-0.378830') },
                    imagen: "imagenes/imagenes-aventuras/Calle_caballeros.jpg",
                    imagen2: "imagenes/imagenes-aventuras/iglesia_san_nicolas_front.jpg",
                    video: ""
                },

                // Parada 5 - Iglesia de San Nicolás FRONT (Reto6puzzle PZ-06) (Párrafos: 488, 489, 490)
                {
                    id: "Av2-P-5",
                    tipo: "parada",
                    parada: 7, // mapa número 5
                    mapa_numero: 5,
                    nombre: "Iglesia de San Nicolás FRONT",
                    coordenadas: { lat: Number('39.476570'), lng: Number('-0.378830') },
                    imagen: "imagenes/imagenes-aventuras/iglesia_san_nicolas_front.jpg",
                },

                // Tramo 5 - Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK (Párrafos: 491, 10)
                {
                    id: "Av2-TR-5",
                    tipo: "tramo",
                    tramo: 5, // De mapa número 5 a mapa número 6
                    mapa_numero: "5→6",
                    nombre: "Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK",
                    inicio: { lat: Number('39.476570'), lng: Number('-0.378830') },
                    waypoints:
                    [
                        { lat: Number('39.476550'), lng: Number('-0.379180') },
                        { lat: Number('39.476320'), lng: Number('-0.379170') },
                    ],
                    fin: { lat: Number('39.476100'), lng: Number('-0.379180') },
                    imagen: "imagenes/imagenes-aventuras/iglesia_san_nicolas_front.jpg",
                    imagen2: "imagenes/imagenes-aventuras/iglesia_san_nicolas_back.jpg",
                    video: ""
                },

                // Parada 6 - Iglesia de San Nicolás BACK (Reto 7) (Párrafos: 493, 494-B, 496)
                {
                    id: "Av2-P-6",
                    tipo: "parada",
                    parada: 8, // mapa número 6
                    mapa_numero: 6,
                    nombre: "Iglesia de San Nicolás BACK",
                    coordenadas: { lat: Number('39.476100'), lng: Number('-0.379180') },
                    imagen: "imagenes/imagenes-aventuras/Iglesia_San_Nicolas_esquina_back.jpg",
                },

                // Parada 7 - Iglesia de San Nicolás BACK (Reto 8) (Párrafos: 497, 498)
                {
                    id: "Av2-P-7",
                    tipo: "parada",
                    parada: 9, // mapa número 6
                    mapa_numero: 6,
                    nombre: "Iglesia de San Nicolás BACK",
                    coordenadas: { lat: Number('39.476070'), lng: Number('-0.379180') },
                    imagen: "imagenes/imagenes-aventuras/iglesia_san_nicolas_back.jpg",
                },

                // Parada 8 - Iglesia de San Nicolás BACK (Reto 9) (Párrafos: 504, 505)
                {
                    id: "Av2-P-8",
                    tipo: "parada",
                    parada: 10, // mapa número 6
                    mapa_numero: 6,
                    nombre: "Iglesia de San Nicolás BACK",
                    coordenadas: { lat: Number('39.476050'), lng: Number('-0.379150') },
                    imagen: "imagenes/imagenes-aventuras/Iglesia_San_Nicolas_esquina_back.jpg",
                },

                // Tramo 6 - Iglesia de San Nicolás BACK → Plaza del Negrito (Párrafos: 499, 500-B)
                {
                    id: "Av2-TR-6",
                    tipo: "tramo",
                    tramo: 6, // De mapa número 6 a mapa número 7
                    mapa_numero: "6→7",
                    nombre: "Iglesia de San Nicolás BACK → Plaza del Negrito",
                    inicio: { lat: Number('39.476050'), lng: Number('-0.379150') },
                    waypoints:
                    [
                        { lat: Number('39.476030'), lng: Number('-0.378910') },
                        { lat: Number('39.475980'), lng: Number('-0.378540') },
                        { lat: Number('39.475900'), lng: Number('-0.378110') },
                        { lat: Number('39.475810'), lng: Number('-0.377680') },
                        { lat: Number('39.475950'), lng: Number('-0.377520') },


                    ],
                    fin: { lat: Number('39.476110'), lng: Number('-0.377410') },
                    imagen: "imagenes/imagenes-aventuras/Iglesia_San_Nicolas_esquina_back.jpg",
                    imagen2: "imagenes/imagenes-aventuras/iglesia_san_nicolas_3.jpg",
                    imagen3: "imagenes/imagenes-aventuras/iglesia_san_nicolas_4.jpg",
                    imagen4: "imagenes/imagenes-aventuras/Plaza_negrito.jpg",
                    imagen5: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
                    video: ""
                },

                // Parada 9 - Plaza del Negrito (Reto 10) (Párrafos: 382, 501)
                {
                    id: "Av2-P-9",
                    tipo: "parada",
                    parada: 11, // mapa número 7
                    mapa_numero: 7,
                    nombre: "Plaza del Negrito",
                    coordenadas: { lat: Number('39.476110'), lng: Number('-0.377410') },
                    imagen: "imagenes/imagenes-aventuras/Plaza_negrito.jpg",
                    imagen2: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
                },

                // Tramo 7 - Plaza del Negrito → Calle Caballeros → Plaza del Tossal (Párrafos: 502-B, 506, 12)
                {
                    id: "Av2-TR-7",
                    tipo: "tramo",
                    tramo: 7, // De mapa número 7 a mapa número 4 y mapa número 8
                    mapa_numero: "7→4→8",
                    nombre: "Plaza del Negrito → Calle Caballeros → Plaza del Tossal",
                    inicio: { lat: Number('39.476110'), lng: Number('-0.377410') },
                    waypoints:
                    [
                        { lat: Number('39.476310'), lng: Number('-0.377370') },
                        { lat: Number('39.476490'), lng: Number('-0.377340') },
                        { lat: Number('39.476620'), lng: Number('-0.377330') },
                        { lat: Number('39.476630'), lng: Number('-0.377830') },
                        { lat: Number('39.476670'), lng: Number('-0.378380') },
                        { lat: Number('39.476620'), lng: Number('-0.378650') },
                        { lat: Number('39.476560'), lng: Number('-0.379110') },
                        { lat: Number('39.476510'), lng: Number('-0.379440') },
                        { lat: Number('39.476460'), lng: Number('-0.379720') },
                    ],
                    fin: { lat: Number('39.476390'), lng: Number('-0.380010') },
                    imagen: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
                    imagen2: "imagenes/imagenes-aventuras/Calle_caballeros.jpg",
                    imagen3: "imagenes/imagenes-aventuras/iglesia_san_nicolas_front.jpg",
                    imagen4: "imagenes/imagenes-aventuras/plaza_del_tossal.jpg",
                    video: ""
                },

                // Parada 10 - Plaza del Tossal (Reto 11) (Párrafos: 12-C, 508, 509)
                {
                    id: "Av2-P-10",
                    tipo: "parada",
                    parada: 12, // mapa número 8
                    mapa_numero: 8,
                    nombre: "Plaza del Tossal",
                    coordenadas: { lat: Number('39.476390'), lng: Number('-0.380010') },
                    imagen: "imagenes/imagenes-aventuras/plaza_del_tossal.jpg",
                },

                // Parada 11 - Plaza del Tossal 2 (Párrafos: 510, 511)
                {
                    id: "Av2-P-11",
                    tipo: "parada",
                    parada: 13, // mapa número 8
                    mapa_numero: 8,
                    nombre: "Plaza del Tossal",
                    coordenadas: { lat: Number('39.476360'), lng: Number('-0.379990') },
                    imagen: "imagenes/imagenes-aventuras/plaza_del_tossal.jpg",
                },

                // Tramo 8 - Plaza del Tossal → Portal de la Valldigna (Párrafos: 512, 13-C)
                {
                    id: "Av2-TR-8",
                    tipo: "tramo",
                    tramo: 8, // De mapa número 8 a mapa número 9
                    mapa_numero: "8→9",
                    nombre: "Plaza del Tossal → Portal de la Valldigna",
                    inicio: { lat: Number('39.476360'), lng: Number('-0.379990') },
                    waypoints:
                    [
                        { lat: Number('39.476520'), lng: Number('-0.379940') },
                        { lat: Number('39.476770'), lng: Number('-0.379830') },
                        { lat: Number('39.477010'), lng: Number('-0.379690') },
                        { lat: Number('39.477330'), lng: Number('-0.379570') },
                        { lat: Number('39.477560'), lng: Number('-0.379450') },
                        { lat: Number('39.477760'), lng: Number('-0.379150') },
                        { lat: Number('39.477660'), lng: Number('-0.378890') },
                    ],
                    fin: { lat: Number('39.477550'), lng: Number('-0.378600') },
                    imagen: "imagenes/imagenes-aventuras/plaza_del_tossal.jpg",
                    imagen2: "imagenes/imagenes-aventuras/portal-de-la_valldigna.jpg",
                    video: ""
                },

                // Parada 12 - Portal de la Valldigna (Párrafos: 513, 589, 144)
                {
                    id: "Av2-P-12",
                    tipo: "parada",
                    parada: 14, // mapa número 9
                    mapa_numero: 9,
                    nombre: "Portal de la Valldigna",
                    coordenadas: { lat: Number('39.477550'), lng: Number('-0.378600') },
                    imagen: "imagenes/imagenes-aventuras/portal-de-la_valldigna.jpg",
                },

                // Tramo 9 - Portal de la Valldigna → Torre del Ángel (Torre árabe) (Párrafos: 560, 514, 14-C)
                {
                    id: "Av2-TR-9",
                    tipo: "tramo",
                    tramo: 9, // De mapa número 9 a mapa número 10
                    mapa_numero: "9→10",
                    nombre: "Portal de la Valldigna → Torre del Ángel (Torre árabe)",
                    inicio: { lat: Number('39.477550'), lng: Number('-0.378600') },
                    waypoints:
                    [
                        { lat: Number('39.477470'), lng: Number('-0.378150') },
                        { lat: Number('39.477430'), lng: Number('-0.377980') },
                        { lat: Number('39.477680'), lng: Number('-0.377950') },
                        { lat: Number('39.477770'), lng: Number('-0.377940') },
                        { lat: Number('39.478010'), lng: Number('-0.377860') },
                    ],
                    fin: { lat: Number('39.478030'), lng: Number('-0.377910') },
                    imagen: "imagenes/imagenes-aventuras/portal-de-la_valldigna.jpg",
                    imagen2: "imagenes/imagenes-aventuras/torre-del_angel_arabe.jpg",
                    video: ""
                },

                // Parada 13 - Torre del Ángel (Torre árabe) (Reto 12) (Párrafos: 515, 516, 517, 518, 519)
                {
                    id: "Av2-P-13",
                    tipo: "parada",
                    parada: 15, // mapa número 10
                    mapa_numero: 10,
                    nombre: "Torre del Ángel (Torre árabe)",
                    coordenadas: { lat: Number('39.478030'), lng: Number('-0.377910') },
                    imagen: "imagenes/imagenes-aventuras/torre-del_angel_arabe.jpg",
                    video: ""
                },

                // Tramo 10 - Torre del Ángel (Torre árabe) → Plaza de la Virgen (Párrafos: 521, 522, 671, 520, 105, 15-B)
                {
                    id: "Av2-TR-10",
                    tipo: "tramo",
                    tramo: 10, // De mapa número 10 a mapa número 11
                    mapa_numero: "10→11",
                    nombre: "Torre del Ángel (Torre árabe) → Plaza de la Virgen",
                    inicio: { lat: Number('39.478030'), lng: Number('-0.377910') },
                    waypoints:
                    [
                        { lat: Number('39.477950'), lng: Number('-0.377730') },
                        { lat: Number('39.478100'), lng: Number('-0.377590') },
                        { lat: Number('39.478060'), lng: Number('-0.377300') },
                        { lat: Number('39.477970'), lng: Number('-0.376910') },
                        { lat: Number('39.477910'), lng: Number('-0.376620') },
                        { lat: Number('39.477750'), lng: Number('-0.376710') },
                        { lat: Number('39.477560'), lng: Number('-0.376790') },
                        { lat: Number('39.477400'), lng: Number('-0.376860') },
                        { lat: Number('39.477400'), lng: Number('-0.376720') },
                        { lat: Number('39.477300'), lng: Number('-0.376380') },
                        { lat: Number('39.477310'), lng: Number('-0.376320') },
                        { lat: Number('39.477610'), lng: Number('-0.376150') },
                        { lat: Number('39.477640'), lng: Number('-0.376100') },
                        { lat: Number('39.477580'), lng: Number('-0.375900') },
                        { lat: Number('39.477540'), lng: Number('-0.375750') },
                        { lat: Number('39.477500'), lng: Number('-0.375580') },
                        { lat: Number('39.477470'), lng: Number('-0.375450') },
                        { lat: Number('39.477410'), lng: Number('-0.375180') },
                        { lat: Number('39.477350'), lng: Number('-0.375000') },
                        { lat: Number('39.477280'), lng: Number('-0.375010')},
                        { lat: Number('39.477040'), lng: Number('-0.375070') },
                        { lat: Number('39.476860'), lng: Number('-0.375110') },
                        { lat: Number('39.476620'), lng: Number('-0.375150') },
                    ],
                    fin: { lat: Number('39.476600'), lng: Number('-0.375290') },
                    imagen: "imagenes/imagenes-aventuras/torre-del_angel_arabe.jpg",
                    imagen2: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
                    video: ""
                },

                // Parada 14 - Plaza de la Virgen - Introducción (Reto13Puzzle PZ-01) (Párrafos: 702, 346, 143)
                {
                    id: "Av2-P-14",
                    tipo: "parada",
                    parada: 16, // mapa número 11
                    mapa_numero: 11,
                    nombre: "Plaza de la Virgen - Introducción",
                    coordenadas: { lat: Number('39.476600'), lng: Number('-0.375290') },
                    imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
                },

                // Parada 15 - Plaza de la Virgen - Fuente Neptuno (Reto 14) (Párrafos: 466, 467)
                {
                    id: "Av2-P-15",
                    tipo: "parada",
                    parada: 17, // mapa número 11
                    mapa_numero: 11,
                    nombre: "Plaza de la Virgen - Fuente Neptuno",
                    coordenadas: { lat: Number('39.476600'), lng: Number('-0.375280') },
                    imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
                },

                // Parada 16 - Plaza de la Virgen - Ofrenda (Reto 15) (Párrafos: 469, 472, 473, 690, 468)
                {
                    id: "Av2-P-16",
                    tipo: "parada",
                    parada: 18, // mapa número 11
                    mapa_numero: 11,
                    nombre: "Plaza de la Virgen - Ofrenda",
                    coordenadas: { lat: Number('39.476600'), lng: Number('-0.375270') },
                    imagen: "imagenes/imagenes-aventuras/Ofrenda_Virgen_back.jpg",
                    imagen2: "imagenes/imagenes-aventuras/Ofrenda_virgen_front.jpg",
                },

                // Parada 17 - Plaza de la Virgen - Basílica (Párrafos: 146, 450, 451, 452)
                {
                    id: "Av2-P-17",
                    tipo: "parada",
                    parada: 19, // mapa número 11
                    mapa_numero: 11,
                    nombre: "Plaza de la Virgen - Basílica",
                    coordenadas: { lat: Number('39.476600'), lng: Number('-0.375260') },
                    imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
                },

                // Parada 18 - Plaza de la Virgen - Cimborrio Catedral de Valencia (Reto 16) (Párrafos: 476, 355, 464)
                {
                    id: "Av2-P-18",
                    tipo: "parada",
                    parada: 20, // mapa número 11
                    mapa_numero: 11,
                    nombre: "Plaza de la Virgen - Cimborrio Catedral de Valencia",
                    coordenadas: { lat: Number('39.476600'), lng: Number('-0.375250') },
                    imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
                },

                // Parada 19 - Plaza de la Virgen - Historia de la Catedral de Valencia (Párrafos: 147, 149, 150)
                {
                    id: "Av2-P-19",
                    tipo: "parada",
                    parada: 21, // mapa número 11
                    mapa_numero: 11,
                    nombre: "Plaza de la Virgen - Historia de la Catedral de Valencia",
                    coordenadas: { lat: Number('39.476600'), lng: Number('-0.375240') },
                    imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
                },

                // Tramo 11 - Plaza de la Virgen → Puerta Gótica de la Catedral de Valencia (Párrafos: 477, 478, 479)
                {
                    id: "Av2-TR-11",
                    tipo: "tramo",
                    tramo: 11, // De mapa número 11 a sin número de mapa (Puerta gótica Catedral de Valencia)
                    mapa_numero: "11→-",
                    nombre: "Plaza de la Virgen → Puerta Gótica de la Catedral de Valencia",
                    inicio: { lat: Number('39.476600'), lng: Number('-0.375240') },
                    waypoints:
                    [
                      { lat: Number('39.476490'), lng: Number('-0.375050') },
                      { lat: Number('39.476310'), lng: Number('-0.375060') },
                      { lat: Number('39.476080'), lng: Number('-0.375070') },
                    ],
                    fin: { lat: Number('39.476040'), lng: Number('-0.375150') },
                    imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
                    imagen2: "imagenes/imagenes-aventuras/puerta_gotica_catedral_2.jpg",
                    imagen3: "imagenes/imagenes-aventuras/Puerta_gotica_catedral.jpg",
                    video: ""
                },

                // Tramo 12 - Puerta Gótica de la Catedral de Valencia → Torre del Miguelete y Puerta de los Hierros (Barroca) de la Catedral de Valencia (Párrafos: 440, 426, 19, 695)
                {
                    id: "Av2-TR-12",
                    tipo: "tramo",
                    tramo: 12, // De mapa sin número a mapa número 12 y mapa número 13
                    mapa_numero: "-→12→13",
                    nombre: "Puerta Gótica de la Catedral de Valencia → Torre del Miguelete y Puerta de los Hierros (Barroca) de la Catedral de Valencia",
                    inicio: { lat: Number('39.476040'), lng: Number('-0.375150') },
                    waypoints:
                    [
                        { lat: Number('39.476000'), lng: Number('-0.375220') },
                        { lat: Number('39.475800'), lng: Number('-0.375390') },
                        { lat: Number('39.475580'), lng: Number('-0.375560') },
                        { lat: Number('39.475410'), lng: Number('-0.375690') },
                        { lat: Number('39.475260'), lng: Number('-0.375790') },
                    ],
                    fin: { lat: Number('39.475220'), lng: Number('-0.375650') },
                    imagen: "imagenes/imagenes-aventuras/puerta_gotica_catedral_2.jpg",
                    imagen2: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
                    video: ""
                },

                // Parada 20 - Torre del Miguelete (Reto 17) (Párrafos: 427)
                {
                    id: "Av2-P-20",
                    tipo: "parada",
                    parada: 22, // mapa número 12
                    mapa_numero: 12,
                    nombre: "Torre del Miguelete",
                    coordenadas: { lat: Number('39.475220'), lng: Number('-0.375650') },
                    imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
                },

                // Parada 21 - Torre del Miguelete 2 (Reto 18) (Párrafos: 428)
                {
                    id: "Av2-P-21",
                    tipo: "parada",
                    parada: 23, // mapa número 12
                    mapa_numero: 12,
                    nombre: "Torre del Miguelete 2",
                    coordenadas: { lat: Number('39.475230'), lng: Number('-0.375670') },
                    imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
                },

                // Parada 22 - Puerta de los Hierros (Barroca) de la Catedral de Valencia (Reto 19) (Párrafos: 430, 432, 431)
                {
                    id: "Av2-P-22",
                    tipo: "parada",
                    parada: 24, // mapa número 13
                    mapa_numero: 13,
                    nombre: "Puerta de los Hierros (Barroca) de la Catedral de Valencia",
                    coordenadas: { lat: Number('39.475210'), lng: Number('-0.375610') },
                    imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
                },

                // Tramo 13 - Puerta de los Hierros (Barroca) de la Catedral de Valencia → Torre Barroca de la Iglesia de Santa Catalina (Párrafos: 21-C, 694, 419)
                {
                    id: "Av2-TR-13",
                    tipo: "tramo",
                    tramo: 13, // De mapa número 13 a mapa número 14
                    mapa_numero: "13→14",
                    nombre: "Puerta de los Hierros (Barroca) de la Catedral de Valencia → Torre Barroca de la Iglesia de Santa Catalina",
                    inicio: { lat: Number('39.475210'), lng: Number('-0.375610') },
                    waypoints:
                    [
                        { lat: Number('39.475170'), lng: Number('-0.375490') },
                        { lat: Number('39.474960'), lng: Number('-0.375590') },
                        { lat: Number('39.474870'), lng: Number('-0.375630') },
                        { lat: Number('39.474770'), lng: Number('-0.375650') },
                        { lat: Number('39.474600'), lng: Number('-0.375700') },
                        { lat: Number('39.474370'), lng: Number('-0.375740') },
                        { lat: Number('39.474210'), lng: Number('-0.375730') },
                        { lat: Number('39.474000'), lng: Number('-0.375720') },
                    ],
                    fin: { lat: Number('39.473830'), lng: Number('-0.375710') },
                    imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
                    imagen2: "imagenes/imagenes-aventuras/Plaza_Reina_2.jpg",
                    imagen3: "imagenes/imagenes-aventuras/torre_santa_catalina.jpg",
                    video: ""
                },

                // Parada 23 - Torre Barroca de Santa Catalina (Reto 20) (Párrafos: 425, 420, 423)
                {
                    id: "Av2-P-23",
                    tipo: "parada",
                    parada: 25, // mapa número 14
                    mapa_numero: 14,
                    nombre: "Torre Barroca de Santa Catalina",
                    coordenadas: { lat: Number('39.473830'), lng: Number('-0.375710') },
                    imagen: "imagenes/imagenes-aventuras/torre_santa_catalina.jpg",
                },

                // Parada 24 - Torre Barroca de Santa Catalina 2 (Reto 21) (Párrafos: 421, 422)
                {
                    id: "Av2-P-24",
                    tipo: "parada",
                    parada: 26, // mapa número 14
                    mapa_numero: 14,
                    nombre: "Torre Barroca de Santa Catalina 2",
                    coordenadas: { lat: Number('39.473830'), lng: Number('-0.375720') },
                    imagen: "imagenes/imagenes-aventuras/torre_santa_catalina.jpg",
                },

                // Tramo 14 - Torre Barroca de la Iglesia de Santa Catalina → Plaza Lope de Vega (Párrafos: 119, 22-B, 411, 412)
                {
                    id: "Av2-TR-14",
                    tipo: "tramo",
                    tramo: 14, // De mapa número 14 a mapa número 15
                    mapa_numero: "14→15",
                    nombre: "Torre Barroca de la Iglesia de Santa Catalina → Plaza Lope de Vega",
                    inicio: { lat: Number('39.473830'), lng: Number('-0.375720') },
                    waypoints:
                    [
                        { lat: Number('39.473860'), lng: Number('-0.376040') },
                        { lat: Number('39.473900'), lng: Number('-0.376390') },
                        { lat: Number('39.473920'), lng: Number('-0.376710') },
                    ],
                    fin: { lat: Number('39.474040'), lng: Number('-0.376750') },
                    imagen: "imagenes/imagenes-aventuras/torre_santa_catalina.jpg",
                    imagen2: "imagenes/imagenes-aventuras/iglesia_santa_catalina.jpg",
                    video: ""
                },

                // Parada 25 - Plaza Lope de Vega - Iglesia de Santa Catalina (Párrafos: 413, 414)
                {
                    id: "Av2-P-25",
                    tipo: "parada",
                    parada: 27, // mapa número 15
                    mapa_numero: 15,
                    nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina",
                    coordenadas: { lat: Number('39.474040'), lng: Number('-0.376740') },
                    imagen: "imagenes/imagenes-aventuras/iglesia_santa_catalina.jpg",
                },

                // Parada 26 - Plaza Lope de Vega - Iglesia de Santa Catalina 2 (Reto 22) (Párrafos: 417, 416)
                {
                    id: "Av2-P-26",
                    tipo: "parada",
                    parada: 28, // mapa número 15
                    mapa_numero: 15,
                    nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina 2",
                    coordenadas: { lat: Number('39.474040'), lng: Number('-0.376750') },
                    imagen: "imagenes/imagenes-aventuras/iglesia_santa_catalina.jpg",
                },

                // Parada 27 - Plaza Lope de Vega - Edificio estrecho (Reto 23) (Párrafos: 408, 409, 410)
                {
                    id: "Av2-P-27",
                    tipo: "parada",
                    parada: 29, // mapa número 15
                    mapa_numero: 15,
                    nombre: "Plaza Lope de Vega - Edificio estrecho",
                    coordenadas: { lat: Number('39.474040'), lng: Number('-0.376750') },
                    imagen: "imagenes/imagenes-aventuras/edificio_estrecho.jpg",
                },

                // Tramo 15 - Plaza Lope de Vega → Plaza Redonda (Párrafos: 405-B, 151)
                {
                    id: "Av2-TR-15",
                    tipo: "tramo",
                    tramo: 15, // De mapa número 15 a mapa número 16
                    mapa_numero: "15→16",
                    nombre: "Plaza Lope de Vega → Plaza Redonda",
                    inicio: { lat: Number('39.474040'), lng: Number('-0.376750') },
                    waypoints:
                    [
                        { lat: Number('39.473940'), lng: Number('-0.376810') },
                        { lat: Number('39.473800'), lng: Number('-0.376770') },
                    ],
                    fin: { lat: Number('39.473690'), lng: Number('-0.376680') },
                    imagen: "imagenes/imagenes-aventuras/iglesia_santa_catalina.jpg",
                    imagen2: "imagenes/imagenes-aventuras/plaza_redonda.jpg",
                    video: ""
                },

                // Parada 28 - Plaza Redonda (Reto24Puzzle PZ-07) (Párrafos: 406)
                {
                    id: "Av2-P-28",
                    tipo: "parada",
                    parada: 30, // mapa número 16
                    mapa_numero: 16,
                    nombre: "Plaza Redonda",
                    coordenadas: { lat: Number('39.473690'), lng: Number('-0.376680') },
                    imagen: "imagenes/imagenes-aventuras/plaza_redonda.jpg",
                },

                // Tramo 16 - Plaza Redonda → Plaza Milagro del Mocaoret (Párrafos: 24-E)
                {
                    id: "Av2-TR-16",
                    tipo: "tramo",
                    tramo: 16, // De mapa número 16 a mapa número 17
                    mapa_numero: "16→17",
                    nombre: "Plaza Redonda → Plaza Milagro del Mocaoret",
                    inicio: { lat: Number('39.473690'), lng: Number('-0.376680') },
                    waypoints:
                    [
                        { lat: Number('39.473800'), lng: Number('-0.376770') },
                        { lat: Number('39.473940'), lng: Number('-0.376810') },
                        { lat: Number('39.474090'), lng: Number('-0.376730') },
                        { lat: Number('39.474220'), lng: Number('-0.376770') },
                        { lat: Number('39.474260'), lng: Number('-0.376530') },
                        { lat: Number('39.474430'), lng: Number('-0.376500') },

                    ],
                    fin: { lat: Number('39.474410'), lng: Number('-0.376330') },
                    imagen: "imagenes/imagenes-aventuras/iglesia_santa_catalina.jpg",
                    imagen2: "imagenes/imagenes-aventuras/milagro_del_mocaoret.jpg",
                    video: ""
                },

                // Parada 29 - Plaza Milagro del Mocaoret (Párrafos: 394, 399, 152, 400, 401-B, 402)
                {
                    id: "Av2-P-29",
                    tipo: "parada",
                    parada: 31, // mapa número 17
                    mapa_numero: 17,
                    nombre: "Plaza Milagro del Mocaoret",
                    coordenadas: { lat: Number('39.474410'), lng: Number('-0.376330') },
                    imagen: "imagenes/imagenes-aventuras/milagro_del_mocaoret.jpg",
                },

                // Tramo 17 - Plaza Milagro del Mocaoret → Tapinería (Párrafos: 333, 424, 492)
                {
                    id: "Av2-TR-17",
                    tipo: "tramo",
                    tramo: 17, // De mapa número 17 a sin número de mapa (Tapinería)
                    mapa_numero: "17→-",
                    nombre: "Plaza Milagro del Mocaoret → Tapinería",
                    inicio: { lat: Number('39.474410'), lng: Number('-0.376330') },
                    waypoints:
                    [
                        { lat: Number('39.474560'), lng: Number('-0.376270') },
                        { lat: Number('39.474680'), lng: Number('-0.376230') },
                        { lat: Number('39.474730'), lng: Number('-0.376410') },
                        { lat: Number('39.474780'), lng: Number('-0.376400') },
                        { lat: Number('39.474820'), lng: Number('-0.376570') },

                    ],
                    fin: { lat: Number('39.474970'), lng: Number('-0.376680') },
                    imagen: "imagenes/imagenes-aventuras/milagro_del_mocaoret.jpg",
                    imagen2: "imagenes/imagenes-aventuras/mercado_de_tapineria.jpg",
                    video: ""
                },

                // Tramo 18 - Tapinería → Palau de la Generalitat (Párrafos: 6-C)
                {
                    id: "Av2-TR-18",
                    tipo: "tramo",
                    tramo: 18, // sin número en el mapa (Tapinería) a mapa número 3
                    mapa_numero: "-→3",
                    nombre: "Tapinería → Palau de la Generalitat",
                    inicio: { lat: Number('39.474970'), lng: Number('-0.376680') },
                    waypoints:
                    [
                        { lat: Number('39.475170'), lng: Number('-0.376640') },
                        { lat: Number('39.475360'), lng: Number('-0.376600') },
                        { lat: Number('39.475470'), lng: Number('-0.376790') },
                        { lat: Number('39.475700'), lng: Number('-0.376940') },
                        { lat: Number('39.475870'), lng: Number('-0.376970') },
                        { lat: Number('39.475880'), lng: Number('-0.376870') },
                        { lat: Number('39.476100'), lng: Number('-0.376890') },
                        { lat: Number('39.476430'), lng: Number('-0.376920') },
                        { lat: Number('39.476590'), lng: Number('-0.376920') },
                    ],
                    fin: { lat: Number('39.476680'), lng: Number('-0.376780') },
                    imagen: "imagenes/imagenes-aventuras/mercado_de_tapineria.jpg",
                    imagen2: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
                     video: ""
                },

                // Tramo 19 - Palau de la Generalitat → Torres de Serranos - Final (Párrafos: 2-B)               // Parada 29 - FINAL: Torres de Serranos - Final (Reto24Puzzle PZ-05) (Párrafos: 475, 503, 507, 526)
                {
                    id: "Av2-TR-19",
                    tipo: "tramo",
                    tramo: 19,
                    mapa_numero: "3→1",
                    nombre: "Palau de la Generalitat → Torres de Serranos - Final",
                    inicio: { lat: Number('39.476680'), lng: Number('-0.376780') },
                    waypoints:
                    [
                            { lat: Number('39.476840'), lng: Number('-0.376870') },
                            { lat: Number('39.477270'), lng: Number('-0.376890') },
                            { lat: Number('39.477390'), lng: Number('-0.376870') },
                            { lat: Number('39.477540'), lng: Number('-0.376800') },
                    ],
                    fin: { lat: Number('39.478590'), lng: Number('-0.376330') },
                    imagen: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
                    imagen2: "imagenes/imagenes-aventuras/Calle_serranos.jpg",
                    imagen3: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
                    video: ""
                },

                // Parada 30 - FINAL: Torres de Serranos - Final (Reto25Puzzle PZ-05) (Párrafos: 475, 503, 507, 526)
                {
                    id: "Av2-P-30",
                    tipo: "parada",
                    parada: 32, // mapa número 1
                    mapa_numero: 1,
                    nombre: "Torres de Serranos Final",
                    coordenadas: { lat: Number('39.478590'), lng: Number('-0.376330') },
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
        id: "REF-1",
        mapa_numero: 1,
        coordenadas: { lat: Number('39.479210'), lng: Number('-0.376040') },
        nombre: "Torres de Serranos",
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-2",
        mapa_numero: 2,
        coordenadas: { lat: Number('39.480662'), lng: Number('-0.375352') },
        nombre: "Puente de Serranos",
        imagen: "imagenes/imagenes-aventuras/puente_serranos.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-3",
        mapa_numero: 3,
        coordenadas: { lat: Number('39.479922'), lng: Number('-0.374242') },
        nombre: "Puente de Madera",
        imagen: "imagenes/imagenes-aventuras/pont_fusta.jpg",

    },
    {
        tipo: "referencia",
        id: "REF-4",
        mapa_numero: 4,
        coordenadas: { lat: Number('39.479116'), lng: Number('-0.372620') },
        nombre: "Puente de la Trinidad",
        imagen: "imagenes/imagenes-aventuras/museo_bellas_artes.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-5",
        mapa_numero: 5,
        coordenadas: { lat: Number('39.479020'), lng: Number('-0.371170') },
        nombre: "Museo de Bellas Artes",
        imagen: "imagenes/imagenes-aventuras/museo_bellas_artes.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-6",
        mapa_numero: 6,
        coordenadas: { lat: Number('39.477850'), lng: Number('-0.371290') },
        nombre: "Ruinas en el Jardín del Turia",
        imagen: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-7",
        mapa_numero: 7,
        coordenadas: { lat: Number('39.477473'), lng: Number('-0.368361') },
        nombre: "Jardines del Real (Viveros)",
        imagen: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-8",
        mapa_numero: 8,
        coordenadas: { lat: Number('39.476500'), lng: Number('-0.368760') },
        nombre: "Puente del Real",
        imagen: "imagenes/imagenes-aventuras/puente_real.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-9",
        mapa_numero: 9,
        coordenadas: { lat: Number('39.473200'), lng: Number('-0.365830') },
        nombre: "Puente de la Exposición",
        imagen: "imagenes/imagenes-aventuras/pont_de_la_exposicio.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-10",
        mapa_numero: 10,
        coordenadas: { lat: Number('39.471100'), lng: Number('-0.364240') },
        nombre: "Puente de las Flores",
        imagen: "imagenes/imagenes-aventuras/puente_flores-down.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-11",
        mapa_numero: 11,
        coordenadas: { lat: Number('39.470260'), lng: Number('-0.363700') },
        nombre: "Puente del Mar",
        imagen: "imagenes/imagenes-aventuras/pont_de_la_mar_down.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-12",
        mapa_numero: 12,
        coordenadas: { lat: Number('39.468880'), lng: Number('-0.362800') },
        nombre: "Puente de Aragón",
        imagen: "imagenes/imagenes-aventuras/puente_aragon-down.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-13",
        mapa_numero: 13,
        coordenadas: { lat: Number('39.466160'), lng: Number('-0.360420') },
        nombre: "Palacio de la Música",
        imagen: "imagenes/imagenes-aventuras/palau_de_la_musica.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-14",
        mapa_numero: 14,
        coordenadas: { lat: Number('39.463440'), lng: Number('-0.359850') },
        nombre: "Puente del Ángel Custodio",
        imagen: "imagenes/imagenes-aventuras/puente_angel_custodio.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-15",
        mapa_numero: 15,
        coordenadas: { lat: Number('39.462560'), lng: Number('-0.359410') },
        nombre: "Gulliver",
        imagen: "imagenes/imagenes-aventuras/gulliver_maqueta.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-16",
        mapa_numero: 16,
        coordenadas: { lat: Number('39.461800'), lng: Number('-0.358900') },
        nombre: "Puente del Reino",
        imagen: "imagenes/imagenes-aventuras/puente_reino.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-17",
        mapa_numero: 17,
        coordenadas: { lat: Number('39.459980'), lng: Number('-0.357500') },
        nombre: "Pistas de Patinaje",
        imagen: "imagenes/imagenes-aventuras/CAC_patinaje.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-18",
        mapa_numero: 18,
        coordenadas: { lat: Number('39.458050'), lng: Number('-0.355940') },
        nombre: "Opera Reina Sofía",
        imagen: "imagenes/imagenes-aventuras/reina_sofia_side.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-19",
        mapa_numero: 19,
        coordenadas: { lat: Number('39.457300'), lng: Number('-0.354830') },
        nombre: "Puente de Monteolivete",
        imagen: "imagenes/imagenes-aventuras/puente_monteolivete.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-20",
        mapa_numero: 20,
        coordenadas: { lat: Number('39.456100'), lng: Number('-0.352090') },
        nombre: "Mueseo de las Ciencias Príncipe Felipe",
        imagen: "imagenes/imagenes-aventuras/museo_principe_felipe.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-21",
        mapa_numero: 21,
        coordenadas: { lat: Number('39.454720'), lng: Number('-0.349810') },
        nombre: "Puente l'Assut de l'Or",
        imagen: "imagenes/imagenes-aventuras/puente_assut.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-22",
        mapa_numero: 22,
        coordenadas: { lat: Number('39.453880'), lng: Number('-0.349800') },
        nombre: "Ágora",
        imagen: "imagenes/imagenes-aventuras/agora.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-23",
        mapa_numero: 23,
        coordenadas: { lat: Number('39.452820'), lng: Number('-0.348120') },
        nombre: "Oceanogràfic (Acuario)",
        imagen: "imagenes/imagenes-aventuras/oceanografic.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-24",
        mapa_numero: 24,
        coordenadas: { lat: Number('39.454960'), lng: Number('-0.353180') },
        nombre: "Umbracle",
        imagen: "imagenes/imagenes-aventuras/umbracle.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-25",
        mapa_numero: 25,
        coordenadas: { lat: Number('39.456640'), lng: Number('-0.353860') },
        nombre: "Hemisfèric",
        imagen: "imagenes/imagenes-aventuras/hemisferic.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-26",
        mapa_numero: 26,
        coordenadas: { lat: Number('39.472110'), lng: Number('-0.368480') },
        nombre: "Puerta del Mar",
        imagen: "imagenes/imagenes-aventuras/puerta_mar.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-27",
        mapa_numero: 27,
        coordenadas: { lat: Number('39.472030'), lng: Number('-0.369600') },
        nombre: "Palacio de Justicia",
        imagen: "imagenes/imagenes-aventuras/palacio_justicia.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-28",
        mapa_numero: 28,
        coordenadas: { lat: Number('39.473430'), lng: Number('-0.370190') },
        nombre: "Fundación Bancaja",
        imagen: "imagenes/imagenes-aventuras/edificio_bancaja_2.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-29",
        mapa_numero: 29,
        coordenadas: { lat: Number('39.474120'), lng: Number('-0.372490') },
        nombre: "Parroquia de Santo Tomás Apostol y San Felipe Neri",
        imagen: "imagenes/imagenes-aventuras/iglesia_san_felipe_neri.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-30",
        mapa_numero: 30,
        coordenadas: { lat: Number('39.474380'), lng: Number('-0.372820') },
        nombre: "Iglesia de San Juan del Hospital",
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_hospital.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-31",
        mapa_numero: 31,
        coordenadas: { lat: Number('39.475370'), lng: Number('-0.374310') },
        nombre: "Palacio Arzobispal",
        imagen: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-32",
        mapa_numero: 32,
        coordenadas: { lat: Number('39.475760'), lng: Number('-0.374860') },
        nombre: "Catedral de Valencia",
        imagen: "imagenes/imagenes-aventuras/catedral_almoina.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-33",
        mapa_numero: 33,
        coordenadas: { lat: Number('39.476150'), lng: Number('-0.374400') },
        nombre: "Plaza Décimo Junio Bruto (Almoína)",
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-34",
        mapa_numero: 34,
        coordenadas: { lat: Number('39.475930'), lng: Number('-0.374290') },
        nombre: "Casa del Punto de Gancho",
        imagen: "imagenes/imagenes-aventuras/casa_del_punt_de_gantxo.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-35",
        mapa_numero: 35,
        coordenadas: { lat: Number('39.476340'), lng: Number('-0.375310') },
        nombre: "Plaza de la Virgen",
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
    },
    // ────---------------------------------------------

    // Coordenadas completas Aventura 3
        // Parada 0 - Torres de Serranos (start) (Reto 3) (Párrafos: 223, 226, 228)
    {
        id: "Av3-P-0",
        tipo: "inicio",
        parada: 2, // mapa número 1
        mapa_numero: 1,
        nombre: "Torres de Serranos (start)",
        coordenadas: { lat: Number('39.478760'), lng: Number('-0.376260') },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
    },

    // Tramo 1: Torres de Serranos → Plaza de la Crída (Torres de Serranos Front)(Párrafos: 229, 5)
    {
        id: "Av3-TR-1",
        tipo: "tramo",
        tramo: 1, // De mapa número 1 a mapa número 2
        mapa_numero: "1→2",
        nombre: "Torres de Serranos → Plaza de la Crída",
        inicio: { lat: Number('39.478760'), lng: Number('-0.376260') },
         waypoints: [
            { lat: Number('39.479050'), lng: Number('-0.376130') },
            { lat: Number('39.479341'), lng: Number('-0.376408') },
            { lat: Number('39.479500'), lng: Number('-0.376210') },
            { lat: Number('39.479430'), lng: Number('-0.375970') }
        ],
        fin: { lat: Number('39.479590'), lng: Number('-0.375830') },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
        imagen2: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        video: "",
    },
    // Parada 3: Plaza de la Crída (Torres de Serranos Front) (Reto 4) (Párrafos: 126, 233)
    {
        id: "Av3-P-1",
        tipo: "parada",
        parada: 3, // mapa número 2
        mapa_numero: 2,
        nombre: "Plaza de la Crída",
        coordenadas: { lat: Number('39.480620'), lng: Number('-0.375350') },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
    },
    // Tramo 2: Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos 1 (Párrafos: 230, 231)
    {
        id: "Av3-TR-2",
        tipo: "tramo",
        tramo: 2, // De mapa número 1 a sin número de mapa (Centro Puente de Serranos)
        mapa_numero: "1→2",
        nombre: "Plaza de la Crída → Centro Puente de Serranos",
        inicio: { lat: Number('39.480620'), lng: Number('-0.375350') },
        waypoints:
        [
            { lat: Number('39.480260'), lng: Number('-0.375530') },
        ],
        fin: { lat: Number('39.480620'), lng: Number('-0.375350') },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_serranos_2.jpg",
        imagen3:"imagenes/imagenes-aventuras/puente_serranos.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_serranos_3.jpg",
        video: "",
    },
    // Parada 4: Centro Puente Serranos 1 (Reto 5) (Párrafos: 608, 609, 610)
    {
        id: "Av3-P-2",
        tipo: "parada",
        parada: 4, // Sin número de mapa
        mapa_numero: null,
        nombre: "Centro Puente Serranos",
        coordenadas: { lat: Number('39.480620'), lng: Number('-0.375350') },
        imagen: "imagenes/imagenes-aventuras/puente_serranos_3.jpg",
    },
    // Parada 5: Centro Puente Serranos 2 (Párrafos: 602, 232, 234, 8, 235, 224)
    {
        id: "Av3-P-3",
        tipo: "parada",
        parada: 5, // Sin número de mapa
        mapa_numero: null,
        nombre: "Centro Puente Serranos 2",
        coordenadas: { lat: Number('39.480640'), lng: Number('-0.375340') },
        imagen: "imagenes/imagenes-aventuras/museo_bellas_artes.jpg",
    },
    // Tramo 3: Centro Puente de Serranos 2 → Ruinas del Jardín del Turia (Párrafos: 236, 644, 7-B)
    {
        id: "Av3-TR-3",
        tipo: "tramo",
        tramo: 3, // De sin número de mapa (Centro Puente de Serranos 2) a mapa número 6
        mapa_numero: "-→6",
        nombre: "Centro Puente de Serranos 2 → Ruinas del Jardín del Turia",
        inicio: { lat: Number('39.480640'), lng: Number('-0.375340') },
        waypoints:
        [
            { lat: Number('39.480020'), lng: Number('-0.375640') },
            { lat: Number('39.479570'), lng: Number('-0.375880') },
            { lat: Number('39.479480'), lng: Number('-0.375800') },
            { lat: Number('39.479270'), lng: Number('-0.375330') },
            { lat: Number('39.479240'), lng: Number('-0.375220') },
            { lat: Number('39.479170'), lng: Number('-0.375060') },
            { lat: Number('39.479110'), lng: Number('-0.374920') },
            { lat: Number('39.479060'), lng: Number('-0.374840') },
            { lat: Number('39.479040'), lng: Number('-0.374780') },
            { lat: Number('39.478980'), lng: Number('-0.374680') },
            { lat: Number('39.478930'), lng: Number('-0.374560') },
            { lat: Number('39.478870'), lng: Number('-0.374430') },
            { lat: Number('39.478640'), lng: Number('-0.373910') },
            { lat: Number('39.478490'), lng: Number('-0.373540') },
            { lat: Number('39.478350'), lng: Number('-0.373220') },
            { lat: Number('39.478150'), lng: Number('-0.372920') },
            { lat: Number('39.478210'), lng: Number('-0.372790') },
            { lat: Number('39.477920'), lng: Number('-0.372320') },
            { lat: Number('39.477720'), lng: Number('-0.371990') },
            { lat: Number('39.477720'), lng: Number('-0.371970') },
            { lat: Number('39.477730'), lng: Number('-0.371950') },
            { lat: Number('39.477790'), lng: Number('-0.371910') },
            { lat: Number('39.477890'), lng: Number('-0.371830') },
            { lat: Number('39.477960'), lng: Number('-0.371780') },
            { lat: Number('39.477870'), lng: Number('-0.371610') },
            { lat: Number('39.477790'), lng: Number('-0.371490') },
        ],
        fin: { lat: Number('39.477730'), lng: Number('-0.371390') },
        imagen: "imagenes/imagenes-aventuras/puente_serranos_3.jpg",
        imagen2: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        imagen3: "imagenes/imagenes-aventuras/serranos_pont_fusta.jpg",
        imagen4: "imagenes/imagenes-aventuras/pont_fusta.jpg",
        imagen5: "imagenes/imagenes-aventuras/museo_bellas_artes.jpg",
        imagen6: "imagenes/imagenes-aventuras/bajada_rio_ruinas.jpg",
        imagen7: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
        video: "",
    },
    // Parada 6: Ruinas del Jardín del Turia (Párrafos: 704, 703, 645, 646-A)
    {
        id: "Av3-P-4",
        tipo: "parada",
        parada: 6, // mapa número 6
        mapa_numero: 6,
        nombre: "Ruinas del Jardín del Turia",
        coordenadas: { lat: Number('39.477730'), lng: Number('-0.371390') },
        imagen: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
    },
    // Tramo 4: Ruinas del Jardín del Turia → Jardines del Real (Viveros) (Párrafos: 647, 11-D)
    {
        id: "Av3-TR-4",
        tipo: "tramo",
        tramo: 4, // De mapa número 6 → mapa número 7
        mapa_numero: "6→7",
        nombre: "Ruinas del Jardín del Turia → Jardines del Real (Viveros)",
        inicio: { lat: Number('39.477730'), lng: Number('-0.371390') },
        waypoints:
        [
            { lat: Number('39.477960'), lng: Number('-0.371780') },
            { lat: Number('39.477840'), lng: Number('-0.371870') },
            { lat: Number('39.477740'), lng: Number('-0.371940') },
            { lat: Number('39.477700'), lng: Number('-0.371860') },
            { lat: Number('39.477570'), lng: Number('-0.371670') },
            { lat: Number('39.477460'), lng: Number('-0.371500') },
            { lat: Number('39.477300'), lng: Number('-0.371230') },
            { lat: Number('39.476920'), lng: Number('-0.370670') },
            { lat: Number('39.476330'), lng: Number('-0.369870') },
            { lat: Number('39.476030'), lng: Number('-0.369470') },
            { lat: Number('39.476310'), lng: Number('-0.369180') },
            { lat: Number('39.476570'), lng: Number('-0.368880') },
            { lat: Number('39.476800'), lng: Number('-0.368630') },
            { lat: Number('39.476980'), lng: Number('-0.368440') },
            { lat: Number('39.477050'), lng: Number('-0.368550') },
            { lat: Number('39.477120'), lng: Number('-0.368680') },
            { lat: Number('39.477140'), lng: Number('-0.368650') },
            { lat: Number('39.477090'), lng: Number('-0.368550') },
            { lat: Number('39.477050'), lng: Number('-0.368460') },
            { lat: Number('39.477080'), lng: Number('-0.368440') },
            { lat: Number('39.477110'), lng: Number('-0.368470') },
            { lat: Number('39.477180'), lng: Number('-0.368410') },
            { lat: Number('39.477270'), lng: Number('-0.368330') },
            { lat: Number('39.477300'), lng: Number('-0.368330') },
            { lat: Number('39.477450'), lng: Number('-0.368400') },
        ],
        fin: { lat: Number('39.477480'), lng: Number('-0.368360') },
        imagen: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_real.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente_real_down.jpg",
        imagen4: "imagenes/imagenes-aventuras/viveros-tunel_turia.jpg",
        imagen5: "imagenes/imagenes-aventuras/viveros_tunel_2.jpg",
        imagen6: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        video: "",
    },
    // Parada 7: Jardines del Real (Viveros) (Reto6puzzle PZ-08) (Párrafos: 648-B, 649-B)
    {
        id: "Av3-P-5",
        tipo: "parada",
        parada: 7, // mapa número 7
        mapa_numero: 7,
        nombre: "Jardines del Real (Viveros)",
        coordenadas: { lat: Number('39.477480'), lng: Number('-0.368360') },
        imagen: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_ paseo_palmeras.jpg",
        imagen3: "imagenes/imagenes-aventuras/viveros_libre_6.jpg",
        imagen4: "imagenes/imagenes-aventuras/viveros_rosaleda.jpg",
    },
    // Tramo 5: Jardines del Real (Viveros) → Puente de la Exposición (Peineta) (Párrafos: 12-D)
    {
        id: "Av3-TR-5",
        tipo: "tramo",
        tramo: 5, // De mapa número 7 a mapa número 9
        mapa_numero: "7→9",
        nombre: "Jardines del Real (Viveros) → Puente de la Exposición",
        inicio: { lat: Number('39.477480'), lng: Number('-0.368360') },
        waypoints:
        [
            { lat: Number('39.477450'), lng: Number('-0.368410') },
            { lat: Number('39.477280'), lng: Number('-0.368320') },
            { lat: Number('39.477110'), lng: Number('-0.368470') },
            { lat: Number('39.477070'), lng: Number('-0.368430') },
            { lat: Number('39.477060'), lng: Number('-0.368460') },
            { lat: Number('39.477140'), lng: Number('-0.368650') },
            { lat: Number('39.477120'), lng: Number('-0.368690') },
            { lat: Number('39.476980'), lng: Number('-0.368440') },
            { lat: Number('39.476820'), lng: Number('-0.368600') },
            { lat: Number('39.476510'), lng: Number('-0.368340') },
            { lat: Number('39.476450'), lng: Number('-0.367750') },
            { lat: Number('39.475730'), lng: Number('-0.367190') },
            { lat: Number('39.475080'), lng: Number('-0.366690') },
            { lat: Number('39.474330'), lng: Number('-0.366070') },
            { lat: Number('39.473720'), lng: Number('-0.365570') },
            { lat: Number('39.473590'), lng: Number('-0.365850') },

        ],
        fin: { lat: Number('39.473430'), lng: Number('-0.366170') },
        imagen: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_real_down.jpg",
        imagen3: "imagenes/imagenes-aventuras/pont_de_la_exposicio.jpg",
        video: "",
    },
    // Parada 8: Puente de la Exposición (Peineta) (Reto 7) (Párrafos: 237, 1, 145, 239)
    {
        id: "Av3-P-6",
        tipo: "parada",
        parada: 8, // mapa número 9
        mapa_numero: 9,
        nombre: "Puente de la Exposición",
        coordenadas: { lat: Number('39.473430'), lng: Number('-0.366170') },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_exposicio.jpg",
    },
    // Tramo 6: Puente de la Exposición (Peineta) → Puente de las Flores (Párrafos: 225, 14-B)
    {
        id: "Av3-TR-6",
        tipo: "tramo",
        tramo: 6, // De mapa número 9 a mapa número 10
        mapa_numero: "9→10",
        nombre: "Puente de la Exposición → Puente de las Flores",
        inicio: { lat: Number('39.473430'), lng: Number('-0.366170') },
        waypoints:
        [
            { lat: Number('39.473200'), lng: Number('-0.366530') },
            { lat: Number('39.473010'), lng: Number('-0.366910') },
            { lat: Number('39.472320'), lng: Number('-0.366340') },
            { lat: Number('39.471950'), lng: Number('-0.366030') },
            { lat: Number('39.471280'), lng: Number('-0.365480') },
        ],
        fin: { lat: Number('39.470800'), lng: Number('-0.365070') },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_exposicio.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_flores-down.jpg",
        video: "",
    },
    // Parada 9: Puente de las Flores (Párrafos: 241, 570)
    {
        id: "Av3-P-7",
        tipo: "parada",
        parada: 9, // mapa número 10
        mapa_numero: 10,
        nombre: "Puente de las Flores",
        coordenadas: { lat: Number('39.470800'), lng: Number('-0.365070') },
        imagen: "imagenes/imagenes-aventuras/puente-de_las_flores.jpg",
    },
    // Tramo 7: Puente de las Flores → Puente de Aragón (parte superior) (Párrafos: 242, 15, 243, 20-B)
    {
        id: "Av3-TR-7",
        tipo: "tramo",
        tramo: 7, // De mapa número 10 a mapa número 12
        mapa_numero: "10→12",
        nombre: "Puente de las Flores → Puente de Aragón (parte superior)",
        inicio: { lat: Number('39.470800'), lng: Number('-0.365070') },
        waypoints:
        [
            { lat: Number('39.470130'), lng: Number('-0.364480') },
            { lat: Number('39.470150'), lng: Number('-0.364140') },
            { lat: Number('39.469820'), lng: Number('-0.363800') },
            { lat: Number('39.470080'), lng: Number('-0.363090') },
            { lat: Number('39.470340'), lng: Number('-0.363210') },
            { lat: Number('39.470350'), lng: Number('-0.362860') },
            { lat: Number('39.470000'), lng: Number('-0.362560') },
            { lat: Number('39.469470'), lng: Number('-0.362250') },
            { lat: Number('39.469490'), lng: Number('-0.362200') },
            { lat: Number('39.469140'), lng: Number('-0.361990') },
            { lat: Number('39.468960'), lng: Number('-0.361920') },
            { lat: Number('39.468940'), lng: Number('-0.362310') },
        ],
        fin: { lat: Number('39.468910'), lng: Number('-0.362860') },
        imagen: "imagenes/imagenes-aventuras/puente-de_las_flores.jpg",
        imagen2: "imagenes/imagenes-aventuras/pont_de_la_mar_down.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente_aragon_subida.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_aragon_top.jpg",
        video: "",
    },
    // Parada 10: Puente de Aragón 1 (Reto 8) (Párrafos: 244, 246)
    {
        id: "Av3-P-8",
        tipo: "parada",
        parada: 10, // mapa número 12
        mapa_numero: 12,
        nombre: "Puente de Aragón",
        coordenadas: { lat: Number('39.468910'), lng: Number('-0.362860') },
        imagen: "imagenes/imagenes-aventuras/puente_aragon_top.jpg",
        imagen2: "imagenes/imagenes-aventuras/Puente_de_aragon_vista.jpg",
    },
    // Parada 11: Puente de Aragón 2 (Párrafos: 339)
    {
        id: "Av3-P-9",
        tipo: "parada",
        parada: 11, // mapa número 12
        mapa_numero: 12,
        nombre: "Puente de Aragón 2",
        coordenadas: { lat: Number('39.468920'), lng: Number('-0.362880') },
        imagen: "imagenes/imagenes-aventuras/Puente_de_aragon_vista.jpg",
    },
    // Tramo 8: Puente de Aragón (parte superior) → Puente de la Mar (Parte Superior) (Párrafos: 247, 15)
    {
        id: "Av3-TR-8",
        tipo: "tramo",
        tramo: 8, // De mapa número 12 a mapa número 11
        mapa_numero: "12→11",
        nombre: "Puente de Aragón (parte superior) → Puente de la Mar (Parte Superior)",
        inicio: { lat: Number('39.468920'), lng: Number('-0.362880') },
        waypoints:
        [
            { lat: Number('39.468910'), lng: Number('-0.363290') },
            { lat: Number('39.468880'), lng: Number('-0.363980') },
            { lat: Number('39.469460'), lng: Number('-0.364420') },
        ],
        fin: { lat: Number('39.470010'), lng: Number('-0.364770') },
        imagen: "imagenes/imagenes-aventuras/puente_aragon_top.jpg",
        imagen2: "imagenes/imagenes-aventuras/pont_de_la_mar_top.jpg",
        video: "",
    },
    // Parada 12: Puente de la Mar (Parte Superior) (Reto 9) (Párrafos: 248, 249)
    {
        id: "Av3-P-10",
        tipo: "parada",
        parada: 12, // mapa número 11
        mapa_numero: 11,
        nombre: "Puente de la Mar (Parte Superior)",
        coordenadas: { lat: Number('39.470010'), lng: Number('-0.364770') },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_mar_top.jpg",
    },
    // Tramo 9: Puente de la Mar (Parte Superior) → Palacio de la Música (Párrafos: 250, 251, 3-B)
    {
        id: "Av3-TR-9",
        tipo: "tramo",
        tramo: 9, // De mapa número 11 a mapa número 13
        mapa_numero: "11→13",
        nombre: "Puente de la Mar → Palacio de la Música",
        inicio: { lat: Number('39.470010'), lng: Number('-0.364770') },
        waypoints:
        [
            { lat: Number('39.469870'), lng: Number('-0.364670') },
            { lat: Number('39.469880'), lng: Number('-0.364530') },
            { lat: Number('39.469310'), lng: Number('-0.364190') },
            { lat: Number('39.468650'), lng: Number('-0.363580') },
            { lat: Number('39.467950'), lng: Number('-0.363160') },
            { lat: Number('39.466230'), lng: Number('-0.362090') },
            { lat: Number('39.466330'), lng: Number('-0.361760') },
        ],
        fin: { lat: Number('39.465800'), lng: Number('-0.361490') },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_mar_top.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_mar_bajada.jpg",
        imagen3:"imagenes/imagenes-aventuras/palau_de_la_musica.jpg",
        video: "",
    },
    // Parada 13: Palacio de la Música (Reto 10) (Párrafos: 252, 253)
    {
        id: "Av3-P-11",
        tipo: "parada",
        parada: 13, // mapa número 13
        mapa_numero: 13,
        nombre: "Palacio de la Música",
        coordenadas:  { lat: Number('39.465800'), lng: Number('-0.361490') },
        imagen: "imagenes/imagenes-aventuras/palau_de_la_musica.jpg",
    },
    // Tramo 10: Palacio de la Música → Gulliver (Párrafos: 254, 255, 21, 256, 257, 22-E)
    {
        id: "Av3-TR-10",
        tipo: "tramo",
        tramo: 10, // De mapa número 13 a mapa número 15
        mapa_numero: "13→15",
        nombre: "Palacio de la Música → Gulliver",
        inicio: { lat: Number('39.465800'), lng: Number('-0.361490') },
        waypoints:
        [
            { lat: Number('39.465260'), lng: Number('-0.361140') },
            { lat: Number('39.465460'), lng: Number('-0.360590') },
            { lat: Number('39.465350'), lng: Number('-0.360410') },
            { lat: Number('39.464990'), lng: Number('-0.359970') },
            { lat: Number('39.464490'), lng: Number('-0.359670') },
            { lat: Number('39.463980'), lng: Number('-0.359480') },
            { lat: Number('39.463100'), lng: Number('-0.359170') },
        ],
        fin: { lat: Number('39.462980'), lng: Number('-0.359720') },
        imagen: "imagenes/imagenes-aventuras/palau_de_la_musica.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_angel_custodio.jpg",
        imagen3: "imagenes/imagenes-aventuras/gulliver.jpg",
        video: "",
    },
    // Parada 14: Gulliver (Reto 11) (Párrafos: 258, 260, 259)
    {
        id: "Av3-P-12",
        tipo: "parada",
        parada: 14, // mapa número 15
        mapa_numero: 15,
        nombre: "Gulliver",
        coordenadas:  { lat: Number('39.462980'), lng: Number('-0.359720') },
        imagen: "imagenes/imagenes-aventuras/gulliver.jpg",
        imagen2: "imagenes/imagenes-aventuras/gulliver_maqueta.jpg",
        imagen3: "imagenes/imagenes-aventuras/gulliver_dentro.jpg",
    },
    // Tramo 11: Gulliver → Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias (Párrafos: 261, 24-D, 113)
    {
        id: "Av3-TR-11",
        tipo: "tramo",
        tramo: 11, // De mapa número 15 a mapa número 17
        mapa_numero: "15→17",
        nombre: "Gulliver → Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias",
        inicio: { lat: Number('39.462980'), lng: Number('-0.359720') },
        waypoints:
        [
            { lat: Number('39.463100'), lng: Number('-0.359170') },
            { lat: Number('39.463300'), lng: Number('-0.358890') },
            { lat: Number('39.463260'), lng: Number('-0.358860') },
            { lat: Number('39.462900'), lng: Number('-0.358640') },
            { lat: Number('39.462790'), lng: Number('-0.358660') },
            { lat: Number('39.462460'), lng: Number('-0.358440') },
            { lat: Number('39.462320'), lng: Number('-0.358350') },
            { lat: Number('39.462160'), lng: Number('-0.358200') },
            { lat: Number('39.461970'), lng: Number('-0.358140') },
            { lat: Number('39.460970'), lng: Number('-0.357580') },
            { lat: Number('39.460430'), lng: Number('-0.357100') },
            { lat: Number('39.460330'), lng: Number('-0.357350') },
            { lat: Number('39.460030'), lng: Number('-0.357710') },
        ],
        fin: { lat: Number('39.459850'), lng: Number('-0.357590') },
        imagen: "imagenes/imagenes-aventuras/gulliver.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_reino.jpg",
        imagen3:"imagenes/imagenes-aventuras/puente_reino_gargola.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_reino_gargola_down.jpg",
        imagen5:"imagenes/imagenes-aventuras/CAC_patinaje.jpg",
        video: "",
    },
    // Parada 15: Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias (Párrafos: 262, 17-B, 264, 265, 266, 18-B, 267, 27-B)
    {
        id: "Av3-P-13",
        tipo: "parada",
        parada: 15, // mapa número 17
        mapa_numero: 17,
        nombre: "Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias",
        coordenadas:  { lat: Number('39.459850'), lng: Number('-0.357590') },
        imagen: "imagenes/imagenes-aventuras/CAC_patinaje.jpg",
    },
    // Tramo 12: Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe (Párrafos: 268, 269)
    {
        id: "Av3-TR-12",
        tipo: "tramo",
        tramo: 12, // De mapa número 17 a sin número de mapa
        mapa_numero: "17→-",
        nombre: "Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe",
        inicio: { lat: Number('39.459850'), lng: Number('-0.357590') },
        waypoints:
        [
            //comentadas porque la ruta ha cambiado pero aún pueden ser útiles en el futuro//
            //{ lat: Number('39.460030'), lng: Number('-0.357710') },
            //{ lat: Number('39.460330'), lng: Number('-0.357350') },
            //{ lat: Number('39.460430'), lng: Number('-0.357100') },
            //{ lat: Number('39.460210'), lng: Number('-0.356610') },
            //{ lat: Number('39.460110'), lng: Number('-0.356270') },
            //{ lat: Number('39.460250'), lng: Number('-0.356050') },
            //{ lat: Number('39.460250'), lng: Number('-0.356020') },
            //{ lat: Number('39.460210'), lng: Number('-0.355980') },
            //{ lat: Number('39.460230'), lng: Number('-0.355890') },
            //{ lat: Number('39.460210'), lng: Number('-0.355800') },
            //{ lat: Number('39.460240'), lng: Number('-0.355770') },
            //{ lat: Number('39.460230'), lng: Number('-0.355680') },
            //{ lat: Number('39.460280'), lng: Number('-0.355590') },
            //{ lat: Number('39.460150'), lng: Number('-0.355200') },
            //{ lat: Number('39.459890'), lng: Number('-0.354460') },
            //{ lat: Number('39.459830'), lng: Number('-0.354450') },
            //{ lat: Number('39.459800'), lng: Number('-0.354420') },
            //{ lat: Number('39.459790'), lng: Number('-0.354370') },
            //{ lat: Number('39.459750'), lng: Number('-0.354350') },
            //{ lat: Number('39.459690'), lng: Number('-0.354300') },
            //{ lat: Number('39.459480'), lng: Number('-0.354140') },
            //{ lat: Number('39.459350'), lng: Number('-0.354070') },
            //{ lat: Number('39.459220'), lng: Number('-0.353830') },
            //{ lat: Number('39.459080'), lng: Number('-0.353410') },
            //{ lat: Number('39.459100'), lng: Number('-0.353360') },
            //{ lat: Number('39.459090'), lng: Number('-0.353310') },
            //{ lat: Number('39.458990'), lng: Number('-0.353000') },
            //{ lat: Number('39.458910'), lng: Number('-0.352770') },
            //{ lat: Number('39.458920'), lng: Number('-0.352740') },
            //{ lat: Number('39.458900'), lng: Number('-0.352710') },
            //{ lat: Number('39.458890'), lng: Number('-0.352670') },
            //{ lat: Number('39.458850'), lng: Number('-0.352610') },
            //{ lat: Number('39.458790'), lng: Number('-0.352530') },
            //{ lat: Number('39.458730'), lng: Number('-0.352460') },
            //{ lat: Number('39.458720'), lng: Number('-0.352380') },
            //{ lat: Number('39.458690'), lng: Number('-0.352320') },
            //{ lat: Number('39.458490'), lng: Number('-0.352200') },
            //{ lat: Number('39.458410'), lng: Number('-0.352080') },
            //{ lat: Number('39.458310'), lng: Number('-0.352010') },
            //{ lat: Number('39.458300'), lng: Number('-0.352000') },
            //{ lat: Number('39.458270'), lng: Number('-0.351950') },
            //{ lat: Number('39.458220'), lng: Number('-0.351900') },
            //{ lat: Number('39.458140'), lng: Number('-0.351870') },
            //{ lat: Number('39.458110'), lng: Number('-0.351810') },
            //{ lat: Number('39.458130'), lng: Number('-0.351520') },
            //{ lat: Number('39.458070'), lng: Number('-0.351400') },
            //{ lat: Number('39.457790'), lng: Number('-0.351350') },
            //{ lat: Number('39.457580'), lng: Number('-0.350920') },
            //{ lat: Number('39.457500'), lng: Number('-0.350590') },
            //{ lat: Number('39.456790'), lng: Number('-0.349900') },
            //{ lat: Number('39.456780'), lng: Number('-0.349860') },
            //FIN comentadas porque la ruta ha cambiado pero aún pueden ser útiles en el futuro//
            { lat: Number('39.460116'), lng: Number('-0.357540') },
            { lat: Number('39.460265'), lng: Number('-0.357193') },
            { lat: Number('39.460428'), lng: Number('-0.357201') },
            { lat: Number('39.460470'), lng: Number('-0.357087') },
            { lat: Number('39.460452'), lng: Number('-0.356951') },
            { lat: Number('39.460553'), lng: Number('-0.357151') },
            { lat: Number('39.460563'), lng: Number('-0.356952') },
            { lat: Number('39.460629'), lng: Number('-0.357030') },
            { lat: Number('39.460671'), lng: Number('-0.357144') },
            { lat: Number('39.460722'), lng: Number('-0.357177') },
            { lat: Number('39.460833'), lng: Number('-0.356953') },
            { lat: Number('39.461012'), lng: Number('-0.356876') },
            { lat: Number('39.460865'), lng: Number('-0.356629') },
            { lat: Number('39.460686'), lng: Number('-0.356303') },
            { lat: Number('39.460497'), lng: Number('-0.355896') },
            { lat: Number('39.460275'), lng: Number('-0.355261') },
            { lat: Number('39.460086'), lng: Number('-0.354500') },
            { lat: Number('39.459989'), lng: Number('-0.354198') },
            { lat: Number('39.459673'), lng: Number('-0.353900') },
            { lat: Number('39.459559'), lng: Number('-0.353458') },
            { lat: Number('39.459588'), lng: Number('-0.353269') },
            { lat: Number('39.459549'), lng: Number('-0.353235') },
            { lat: Number('39.459366'), lng: Number('-0.352965') },
            { lat: Number('39.459168'), lng: Number('-0.352681') },
            { lat: Number('39.458844'), lng: Number('-0.352215') },
            { lat: Number('39.458546'), lng: Number('-0.351780') },
            { lat: Number('39.457785'), lng: Number('-0.350672') },
            { lat: Number('39.457337'), lng: Number('-0.350028') },
            { lat: Number('39.457059'), lng: Number('-0.349621') },
            { lat: Number('39.456843'), lng: Number('-0.349310') },
        ],
        fin: { lat: Number('39.456730'), lng: Number('-0.349399') },
        imagen: "imagenes/imagenes-aventuras/CAC_patinaje.jpg",
        imagen2: "imagenes/imagenes-aventuras/cac_mapa.jpg",
        imagen3:"imagenes/imagenes-aventuras/pano_CAC.jpg",
        video: "",
    },
    // Parada 16: Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía (Párrafos: 270, 27-B, 271)
    {
        id: "Av3-P-14",
        tipo: "parada",
        parada: 16, // mapa número 18
        mapa_numero: 18,
        nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía",
        coordenadas:  { lat: Number('39.456730'), lng: Number('-0.349399') },
        imagen: "imagenes/imagenes-aventuras/pano_CAC.jpg",
        imagen2: "imagenes/imagenes-aventuras/reina_sofia_side.jpg"
    },
    // Parada 17: Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe (Párrafos: 272, 31, 273, 275)
    {
        id: "Av3-P-15",
        tipo: "parada",
        parada: 17, // mapa número 20
        mapa_numero: 20,
        nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe",
        coordenadas:  { lat: Number('39.456689'), lng: Number('-0.349407') },
        imagen: "imagenes/imagenes-aventuras/pano_CAC.jpg",
        imagen2: "imagenes/imagenes-aventuras/museo_principe_felipe.jpg",
        imagen3: "imagenes/imagenes-aventuras/CAC-6.jpg",
    },
    // Tramo 13: Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe → Puente l'Assut de l'Or (Párrafos: 276, 32-B)
    {
        id: "Av3-TR-13",
        tipo: "tramo",
        tramo: 13, // De sin número de mapa a mapa número 21
        mapa_numero: "-→21",
        nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe → Puente l'Assut de l'Or",
        inicio: { lat: Number('39.456689'), lng: Number('-0.349407') },
        waypoints:
        [
            //comentadas porque la ruta ha cambiado pero aún pueden ser útiles en el futuro//
            //{ lat: Number('39.456661'), lng: Number('-0.349362') },
            //{ lat: Number('39.456532'), lng: Number('-0.349333') },
            //{ lat: Number('39.456457'), lng: Number('-0.349199') },
            //{ lat: Number('39.456205'), lng: Number('-0.348962') },
            //{ lat: Number('39.456353'), lng: Number('-0.348608') },
            //{ lat: Number('39.456239'), lng: Number('-0.348377') },
            //FIN comentadas porque la ruta ha cambiado pero aún pueden ser útiles en el futuro//
            { lat: Number('39.456800'), lng: Number('-0.349252') },
            { lat: Number('39.456484'), lng: Number('-0.348792') },
            { lat: Number('39.456243'), lng: Number('-0.348433') },
            { lat: Number('39.456257'), lng: Number('-0.348392') },
            { lat: Number('39.455986'), lng: Number('-0.348276') },
        ],
        fin: { lat: Number('39.455825'), lng: Number('-0.348149') },
        imagen: "imagenes/imagenes-aventuras/pano_CAC.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_Assut_2.jpg",
        video: "",
    },
    // Parada 18: Puente l'Assut de l'Or (Reto12puzzle PZ-09) (Párrafos: 277, 278)
    {
        id: "Av3-P-16",
        tipo: "parada",
        parada: 18, // mapa número 21
        mapa_numero: 21,
        nombre: "Puente l'Assut de l'Or",
        coordenadas:  { lat: Number('39.455825'), lng: Number('-0.348149') },
        imagen: "imagenes/imagenes-aventuras/puente_Assut_2.jpg",
    },
    // Tramo 14: Puente l'Assut de l'Or → Ágora y Oceanogràfic (Párrafos: 116)
    {
        id: "Av3-TR-14",
        tipo: "tramo",
        tramo: 14, // De mapa número 21 a mapa número 22 y 23
        mapa_numero: "21→22/23",
        nombre: "Puente l'Assut de l'Or → Ágora y Oceanogràfic",
        inicio: { lat: Number('39.455825'), lng: Number('-0.348149') },
        waypoints:
        [
            { lat: Number('39.455900'), lng: Number('-0.348190') },
            { lat: Number('39.455230'), lng: Number('-0.349190') },
            { lat: Number('39.454320'), lng: Number('-0.350550') },
            { lat: Number('39.453790'), lng: Number('-0.351300') },
            { lat: Number('39.453620'), lng: Number('-0.351120') },
        ],
        fin: { lat: Number('39.453520'), lng: Number('-0.350810') },
        imagen: "imagenes/imagenes-aventuras/puente_Assut_2.jpg",
        imagen2: "imagenes/imagenes-aventuras/agora.jpg",
        imagen3: "imagenes/imagenes-aventuras/oceanografic.jpg",
        imagen4:"imagenes/imagenes-aventuras/agora_oceanografic.jpg",
        video: "",
    },
    // Parada 19: Ágora y Oceanogràfic (Párrafos: 281, 33, 282, 283, 34-B, 284)
    {
        id: "Av3-P-17",
        tipo: "parada",
        parada: 19, // mapa número 22/23
        mapa_numero: "22/23",
        nombre: "Ágora y Oceanogràfic",
        coordenadas:  { lat: Number('39.453520'), lng: Number('-0.350810') },
        imagen: "imagenes/imagenes-aventuras/agora_oceanografic.jpg",
    },
    // Tramo 15: Ágora y Oceanogràfic → Umbracle (Párrafos: 285, 35-B)
    {
        id: "Av3-TR-15",
        tipo: "tramo",
        tramo: 15, // De mapa número 22/23 a mapa número 24
        mapa_numero: "22/23→24",
        nombre: "Ágora y Oceanogràfic → Umbracle",
        inicio: { lat: Number('39.453520'), lng: Number('-0.350810') },
        waypoints:
        [
            { lat: Number('39.453620'), lng: Number('-0.351120') },
            { lat: Number('39.453958'), lng: Number('-0.351566') },
            { lat: Number('39.454040'), lng: Number('-0.352035') },
            { lat: Number('39.454078'), lng: Number('-0.352015') },
            { lat: Number('39.454067'), lng: Number('-0.351911') },
            { lat: Number('39.454080'), lng: Number('-0.351803') },
            { lat: Number('39.454138'), lng: Number('-0.351741') },
            { lat: Number('39.454216'), lng: Number('-0.351765') },
            { lat: Number('39.454288'), lng: Number('-0.351873') },
            { lat: Number('39.454473'), lng: Number('-0.351941') },
            { lat: Number('39.454990'), lng: Number('-0.352570') },
            { lat: Number('39.455460'), lng: Number('-0.353270') },

        ],
        fin: { lat: Number('39.455635'), lng: Number('-0.353670') },
        imagen: "imagenes/imagenes-aventuras/agora_oceanografic.jpg",
        imagen2: "imagenes/imagenes-aventuras/umbracle.jpg",
        video: "",
    },
    // Parada 20: Umbracle (Reto 13) (Párrafos: 286, 292)
    {
        id: "Av3-P-18",
        tipo: "parada",
        parada: 20, // mapa número 24
        mapa_numero: "24",
        nombre: "Umbracle",
        coordenadas:  { lat: Number('39.455635'), lng: Number('-0.353670') },
        imagen: "imagenes/imagenes-aventuras/umbracle.jpg",

    },
    // Tramo 16: Umbracle → Hemisféric (Párrafos: 287-B, 290)
    {
        id: "Av3-TR-16",
        tipo: "tramo",
        tramo: 16, // De mapa número 24 a mapa número 25
        mapa_numero: "24→25",
        nombre: "Umbracle → Hemisféric",
        inicio: { lat: Number('39.455635'), lng: Number('-0.353670') },
        waypoints:
        [
            { lat: Number('39.456678'), lng: Number('-0.355255') },
            { lat: Number('39.457553'), lng: Number('-0.356357') },
            { lat: Number('39.458643'), lng: Number('-0.357172') },
            { lat: Number('39.459348'), lng: Number('-0.357818') },
            { lat: Number('39.459003'), lng: Number('-0.356469') },
            { lat: Number('39.458205'), lng: Number('-0.354901') },
        ],
        fin: { lat: Number('39.457675'), lng: Number('-0.353992') },
        imagen: "imagenes/imagenes-aventuras/umbracle.jpg",
        imagen2: "imagenes/imagenes-aventuras/reina_sofia_front.jpg",
        imagen3:"imagenes/imagenes-aventuras/hemisferic.jpg",
        video: "",
    },
    // Parada 21: Hemisféric (Reto 14) (Párrafos: 291, 707)
    {
        id: "Av3-P-19",
        tipo: "parada",
        parada: 21, // mapa número 25
        mapa_numero: "25",
        nombre: "Hemisféric",
        coordenadas:  { lat: Number('39.457675'), lng: Number('-0.353992') },
        imagen: "imagenes/imagenes-aventuras/hemisferic.jpg",
    },
    // Tramo 17: Ciudad de las Artes y las Ciencias → Puente de la Mar (Párrafos: 293, 30-B)
    {
        id: "Av3-TR-17",
        tipo: "tramo",
        tramo: 17, // De mapa número 25 a mapa número 11
        mapa_numero: "25→11",
        nombre: "Ciudad de las Artes y las Ciencias → Puente de la Mar",
        inicio: { lat: Number('39.457675'), lng: Number('-0.353992') },
        waypoints:
        [
            { lat: Number('39.457838'), lng: Number('-0.353730') },
            { lat: Number('39.458224'), lng: Number('-0.353780') },
            { lat: Number('39.458632'), lng: Number('-0.354407') },
            { lat: Number('39.459077'), lng: Number('-0.355962') },
            { lat: Number('39.459412'), lng: Number('-0.357080') },
            { lat: Number('39.459684'), lng: Number('-0.358352') },
            { lat: Number('39.460893'), lng: Number('-0.359343') },
            { lat: Number('39.462333'), lng: Number('-0.360201') },
            { lat: Number('39.463831'), lng: Number('-0.360717') },
            { lat: Number('39.466314'), lng: Number('-0.362187') },
            { lat: Number('39.467368'), lng: Number('-0.362825') },
            { lat: Number('39.468523'), lng: Number('-0.363562') },
            { lat: Number('39.469606'), lng: Number('-0.364172') },
            { lat: Number('39.470128'), lng: Number('-0.364533') },
            { lat: Number('39.470169'), lng: Number('-0.364142') },
            { lat: Number('39.470406'), lng: Number('-0.364173') },
        ],
        fin: { lat: Number('39.470617'), lng: Number('-0.363887') },
        imagen: "imagenes/imagenes-aventuras/pano_CAC.jpg",
        imagen2: "imagenes/imagenes-aventuras/hemisferic.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente_reino_gargola.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_reino_gargola_down.jpg",
        imagen5: "imagenes/imagenes-aventuras/puente_angel_custodio.jpg",
        imagen6: "imagenes/imagenes-aventuras/palau_de_la_musica.jpg",
        imagen7: "imagenes/imagenes-aventuras/puente_aragon-down.jpg",
        imagen8: "imagenes/imagenes-aventuras/pont_de_la_mar_down.jpg",
        video: "",
    },
    // Parada 22: Puente de la Mar (Reto 15) (Párrafos: 294, 295)
    {
        id: "Av3-P-20",
        tipo: "parada",
        parada: 22, // mapa número 11
        mapa_numero: "25",
        nombre: "Puente de la Mar",
        coordenadas:  { lat: Number('39.470617'), lng: Number('-0.363887') },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_mar_down.jpg",
    },
    // Tramo 18: Puente de la Mar → Puerta de la Mar (Párrafos: 296-C, 297, 14-B, 298, 299, 245-B, 37)
    {
        id: "Av3-TR-18",
        tipo: "tramo",
        tramo: 18, // De mapa número 11 a mapa número 26
        mapa_numero: "11→26",
        nombre: "Puente de la Mar → Puerta de la Mar",
        inicio: { lat: Number('39.470617'), lng: Number('-0.363887') },
        waypoints:
        [
            { lat: Number('39.470599'), lng: Number('-0.363375') },
            { lat: Number('39.470393'), lng: Number('-0.363195') },
            { lat: Number('39.470431'), lng: Number('-0.362907') },
            { lat: Number('39.471009'), lng: Number('-0.363373') },
            { lat: Number('39.471705'), lng: Number('-0.363960') },
            { lat: Number('39.471775'), lng: Number('-0.363853') },
            { lat: Number('39.471569'), lng: Number('-0.363694') },
            { lat: Number('39.471621'), lng: Number('-0.363449') },
            { lat: Number('39.471527'), lng: Number('-0.363495') },
            { lat: Number('39.471063'), lng: Number('-0.364554') },
            { lat: Number('39.470789'), lng: Number('-0.365355') },
            { lat: Number('39.470571'), lng: Number('-0.365544') },
            { lat: Number('39.471018'), lng: Number('-0.366466') },
            { lat: Number('39.471757'), lng: Number('-0.368081') },
            { lat: Number('39.472201'), lng: Number('-0.368001') },
            { lat: Number('39.472377'), lng: Number('-0.368183') },
            { lat: Number('39.472445'), lng: Number('-0.368513') },
            { lat: Number('39.472380'), lng: Number('-0.368756') },
        ],
        fin: { lat: Number('39.472081'), lng: Number('-0.368912') },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_mar_down.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_flores_subida.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente_flores_subida_2.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente-de_las_flores.jpg",
        imagen5: "imagenes/imagenes-aventuras/puente_flores_top.jpg",
        imagen6: "imagenes/imagenes-aventuras/puente_flores_agua.jpg",
        imagen7: "imagenes/imagenes-aventuras/puerta_mar.jpg",
        video: "",
    },
    // Parada 23: Puerta de la Mar (Reto 16) (Párrafos: 300, 84, 301, 302)
    {
        id: "Av3-P-21",
        tipo: "parada",
        parada: 23, // mapa número 26
        mapa_numero: "26",
        nombre: "Puerta de la Mar",
        coordenadas:  { lat: Number('39.472081'), lng: Number('-0.368912') },
        imagen: "imagenes/imagenes-aventuras/puerta_mar.jpg",
    },

    // Tramo 19: Puerta de la Mar → Palacio de Justicia (Párrafos: 657, 658, 39, 577)
    {
        id: "Av3-TR-19",
        tipo: "tramo",
        tramo: 19, // De mapa número 26 a mapa número 27
        mapa_numero: "26→27",
        nombre: "Puerta de la Mar → Palacio de Justicia",
        inicio: { lat: Number('39.472081'), lng: Number('-0.368912') },
        waypoints:
        [
            { lat: Number('39.471862'), lng: Number('-0.368985') },
        ],
        fin: { lat: Number('39.472055'), lng: Number('-0.369551') },
        imagen: "imagenes/imagenes-aventuras/puerta_mar.jpg",
        imagen2: "imagenes/imagenes-aventuras/calle_colon.jpg",
        imagen3: "imagenes/imagenes-aventuras/palacio_justicia.jpg",

        video: "",
    },
    // Parada 24: Palacio de Justicia (Párrafos: 659)
    {
        id: "Av3-P-22",
        tipo: "parada",
        parada: 24, // mapa número 26
        mapa_numero: "26",
        nombre: "Palacio de Justicia",
        coordenadas:  { lat: Number('39.472055'), lng: Number('-0.369551') },
        imagen: "imagenes/imagenes-aventuras/palacio_justicia.jpg",
        imagen2: "imagenes/imagenes-aventuras/palacio_justicia_3.jpg",
    },
    // Tramo 20: Palacio de Justicia → Fundación Bancaja 1 (Párrafos: 660, 40-B)
    {
        id: "Av3-TR-20",
        tipo: "tramo",
        tramo: 20, // De mapa número 27 a mapa número 28
        mapa_numero: "27→28",
        nombre: "Palacio de Justicia → Fundación Bancaja 1",
        inicio: { lat: Number('39.472055'), lng: Number('-0.369551') },
        waypoints:
        [
            { lat: Number('39.472202'), lng: Number('-0.370107') },
            { lat: Number('39.472659'), lng: Number('-0.370217') },
            { lat: Number('39.472840'), lng: Number('-0.370091') },
        ],
        fin: { lat: Number('39.473087'), lng: Number('-0.370027') },
        imagen: "imagenes/imagenes-aventuras/palacio_justicia.jpg",
        imagen2: "imagenes/imagenes-aventuras/edificio_bancaja.jpg",
        video: "",
    },

    // Parada 25: Fundación Bancaja 1 (Reto 17) (Párrafos: 661, 662)
    {
        id: "Av3-P-23",
        tipo: "parada",
        parada: 25, // mapa número 28
        mapa_numero: "28",
        nombre: "Fundación Bancaja 1",
        coordenadas:  { lat: Number('39.473087'), lng: Number('-0.370027') },
        imagen: "imagenes/imagenes-aventuras/edificio_bancaja.jpg",
    },
    // Tramo 21: Fundación Bancaja 1 → Fundación Bancaja 2 (Párrafos: 663)
    {
        id: "Av3-TR-21",
        tipo: "tramo",
        tramo: 21, // De mapa número 28 a mapa número 28
        mapa_numero: "28→28",
        nombre: "Fundación Bancaja 1 → Fundación Bancaja 2",
        inicio: { lat: Number('39.473087'), lng: Number('-0.370027') },
        waypoints:
        [
            { lat: Number('39.473759'), lng: Number('-0.369889') },
        ],
        fin: { lat: Number('39.473830'), lng: Number('-0.370067') },
        imagen: "imagenes/imagenes-aventuras/edificio_bancaja.jpg",
        imagen2: "imagenes/imagenes-aventuras/edificio_bancaja_2.jpg",
        video: "",
    },
    // Parada 26: Fundación Bancaja 2 (Párrafos: 664)
    {
        id: "Av3-P-24",
        tipo: "parada",
        parada: 26, // mapa número 28
        mapa_numero: "28",
        nombre: "Fundación Bancaja 2",
        coordenadas:  { lat: Number('39.473830'), lng: Number('-0.370067') },
        imagen: "imagenes/imagenes-aventuras/edificio_bancaja_2.jpg",
    },
    // Tramo 22: Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente (Párrafos: 665, 41)
    {
        id: "Av3-TR-22",
        tipo: "tramo",
        tramo: 22, // De mapa número 28 a mapa número 29
        mapa_numero: "28→29",
        nombre: "Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente",
        inicio: { lat: Number('39.473830'), lng: Number('-0.370067') },
        waypoints:
        [
            { lat: Number('39.473865'), lng: Number('-0.370408') },
            { lat: Number('39.473961'), lng: Number('-0.370880') },
            { lat: Number('39.473946'), lng: Number('-0.371786') },
            { lat: Number('39.473948'), lng: Number('-0.372367') },
        ],
        fin: { lat: Number('39.473836'), lng: Number('-0.372444')},
        imagen: "imagenes/imagenes-aventuras/edificio_bancaja_2.jpg",
        imagen2: "imagenes/imagenes-aventuras/iglesia_san_felipe_neri.jpg",
        video: "",
    },
    // Parada 27: Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente (Reto 18) (Párrafos: 667-B, 668)
    {
        id: "Av3-P-25",
        tipo: "parada",
        parada: 27, // mapa número 29
        mapa_numero: "29",
        nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente",
        coordenadas:  { lat: Number('39.473836'), lng: Number('-0.372444') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_felipe_neri.jpg",
    },
    // Parada 28: Iglesia Santo Tomás Apostol y San Felipe Neri (Párrafos: 669)
    {
        id: "Av3-P-26",
        tipo: "parada",
        parada: 28, // mapa número 29
        mapa_numero: "29",
        nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri",
        coordenadas:  { lat: Number('39.473833'), lng: Number('-0.372479') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_felipe_neri.jpg",
    },
    // Tramo 23: Iglesia Santo Tomás Apostol y San Felipe Neri → Iglesia San Juan del Hospital (Párrafos: 670-B)
    {
        id: "Av3-TR-23",
        tipo: "tramo",
        tramo: 23, // De mapa número 29 a mapa número 30
        mapa_numero: "29→30",
        nombre: "Iglesia San Vicente Ferrer y San Felipe Neri → Iglesia San Juan del Hospital",
        inicio: { lat: Number('39.473833'), lng: Number('-0.372479') },
        waypoints:
        [
            { lat: Number('39.473998'), lng: Number('-0.372704') }
        ],
        fin: { lat: Number('39.474454'), lng: Number('-0.372731') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_felipe_neri.jpg",
        imagen2: "imagenes/imagenes-aventuras/iglesia_san_juan_del_hospital.jpg",
        video: "",
    },
    // Parada 29: Iglesia San Juan del Hospital (Párrafos: 671, 522, 672)
    {
        id: "Av3-P-27",
        tipo: "parada",
        parada: 29, // mapa número 30
        mapa_numero: "30",
        nombre: "Iglesia San Juan del Hospital",
        coordenadas:  { lat: Number('39.474454'), lng: Number('-0.372731') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_hospital.jpg",
    },
    // Tramo 24: Iglesia San Juan del Hospital → Palacio Arzobispal (Párrafos: 453, 43-B)
    {
        id: "Av3-TR-24",
        tipo: "tramo",
        tramo: 24, // De mapa número 30 a mapa número 31
        mapa_numero: "30→31",
        nombre: "Iglesia San Juan del Hospital → Palacio Arzobispal",
        inicio: { lat: Number('39.474454'), lng: Number('-0.372731') },
        waypoints:
        [
            { lat: Number('39.474858'), lng: Number('-0.372811') },
            { lat: Number('39.475766'), lng: Number('-0.372641') },
            { lat: Number('39.475853'), lng: Number('-0.373087') },
            { lat: Number('39.475527'), lng: Number('-0.373459') },
            { lat: Number('39.475513'), lng: Number('-0.373593') },
            { lat: Number('39.475377'), lng: Number('-0.373665') },
        ],
        fin: { lat: Number('39.475577'), lng: Number('-0.374196')},
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_hospital.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_napones_y_sicilia.jpg",
        imagen3: "imagenes/imagenes-aventuras/plaza_napones_y_sicilia_2.jpg",
        imagen4: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg",
        video: "",
    },
    // Parada 30: Palacio Arzobispal (Párrafos: 673)
    {
        id: "Av3-P-28",
        tipo: "parada",
        parada: 30, // mapa número 31
        mapa_numero: "31",
        nombre: "Palacio Arzobispal",
        coordenadas:  { lat: Number('39.475577'), lng: Number('-0.374196') },
        imagen: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg",
    },
    // Tramo 25: Palacio Arzobispal → Catedral de Valencia (Puerta Románica) (Párrafos: 44-B, 426-B, 141)
    {
        id: "Av3-TR-25",
        tipo: "tramo",
        tramo: 25, // De mapa número 31 a mapa número 32
        mapa_numero: "31→32",
        nombre: "Palacio Arzobispal → Catedral de Valencia (Puerta Románica)",
        inicio: { lat: Number('39.475577'), lng: Number('-0.374196') },
        waypoints: [],
        fin: { lat: Number('39.475552'), lng: Number('-0.374557') },
        imagen: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg",
        imagen2: "imagenes/imagenes-aventuras/puerta_romanica_catedral.jpg",
        video: "",
    },
    // Parada 31: Catedral de Valencia (Puerta Románica) (Reto 19) (Párrafos: 437, 439, 438)
    {
        id: "Av3-P-29",
        tipo: "parada",
        parada: 31, // mapa número 32
        mapa_numero: "32",
        nombre: "Catedral de Valencia (Puerta Románica)",
        coordenadas:  { lat: Number('39.475552'), lng: Number('-0.374557') },
        imagen: "imagenes/imagenes-aventuras/puerta_romanica_catedral.jpg",
    },
    // Tramo 26: Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína) (Párrafos: 45-B)
    {
        id: "Av3-TR-26",
        tipo: "tramo",
        tramo: 26, // De mapa número 32 a mapa número 33
        mapa_numero: "32→33",
        nombre: "Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína)",
        inicio: { lat: Number('39.475552'), lng: Number('-0.374557') },
        waypoints:
        [
            { lat: Number('39.475836'), lng: Number('-0.374397') }
        ],
        fin: { lat: Number('39.475986'), lng: Number('-0.374472') },
        imagen: "imagenes/imagenes-aventuras/puerta_romanica_catedral.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        video: "",
    },
    // Parada 32: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 1, Panel cerámico (reto 20) (Párrafos: 441, 442)
    {
        id: "Av3-P-30",
        tipo: "parada",
        parada: 32, // mapa número 33
        mapa_numero: "33",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia",
        coordenadas:  { lat: Number('39.475986'), lng: Number('-0.374472') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/catedral_almoina.jpg",
        imagen3: "imagenes/imagenes-aventuras/panel_ceramico_muro_norte_catedral.jpg",
    },
    // Parada 33: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 2, Capilla exterior (reto 21) (Párrafos: 443, 444)
    {
        id: "Av3-P-31",
        tipo: "parada",
        parada: 33, // mapa número 33
        mapa_numero: "33",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia",
        coordenadas:  { lat: Number('39.476012'), lng: Number('-0.374604') },
        imagen: "imagenes/imagenes-aventuras/capilla_exterior_catedral.jpg",
    },
    // Parada 34: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 3, Capilla exterior (reto 22) (Párrafos: 445)
    {
        id: "Av3-P-32",
        tipo: "parada",
        parada: 34, // mapa número 33
        mapa_numero: "33",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia",
        coordenadas:  { lat: Number('39.476025'), lng: Number('-0.374600') },
        imagen: "imagenes/imagenes-aventuras/capilla_exterior_catedral.jpg",
    },
     // Parada 35: Plaza Décimo Junio Bruto (Plaza de la Almoína) Basílica de Valencia (Párrafos: 446, 447, 46-B, 452, 45-C)
    {
        id: "Av3-P-33",
        tipo: "parada",
        parada: 35, // mapa número 33/34
        mapa_numero: "33/34",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Basílica de Valencia",
        coordenadas:  { lat: Number('39.476046'), lng: Number('-0.374656') },
        imagen: "imagenes/imagenes-aventuras/capilla_pared_catedral.jpg",
        imagen2: "imagenes/imagenes-aventuras/puerta_negra_relieve_basilica.jpg",
        imagen3: "imagenes/imagenes-aventuras/basilica_almoina.jpg",
    },
    // Parada 36: Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de gantxo (Reto 23) (Párrafos: 45-D, 454, 455, 455-B, 456)
    {
        id: "Av3-P-34",
        tipo: "parada",
        parada: 36, // mapa número 33
        mapa_numero: "33",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de gantxo",
        coordenadas:  { lat: Number('39.475986'), lng: Number('-0.374472') },
        imagen: "imagenes/imagenes-aventuras/casa_del_punt_de_gantxo.jpg",
    },
    // Tramo 27: Plaza Décimo Junio Bruto (Plaza de la Almoína) → Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico (Párrafos: 457, 45-E)
    {
        id: "Av3-TR-27",
        tipo: "tramo",
        tramo: 27, // De mapa número 33 a mapa número 33
        mapa_numero: "33→33",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) → Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico",
        inicio: { lat: Number('39.475986'), lng: Number('-0.374472') },
        waypoints:
        [
            { lat: Number('39.476078'), lng: Number('-0.374327') },
            { lat: Number('39.476050'), lng: Number('-0.374290') },
        ],
        fin: { lat: Number('39.476240'), lng: Number('-0.374270') },
        imagen: "imagenes/imagenes-aventuras/casa_del_punt_de_gantxo.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen3: "imagenes/imagenes-aventuras/museo_la_almoina.jpg",
        video: "",
    },
    // Parada 37: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico (Reto 24) (Párrafos: 458)
    {
        id: "Av3-P-35",
        tipo: "parada",
        parada: 37, // mapa número 33
        mapa_numero: "33",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico",
        coordenadas:  { lat: Number('39.476240'), lng: Number('-0.374270') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/museo_almoina_2.jpg",
    },
    // Parada 38: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico 2 (Reto25puzzle PZ-02) (Párrafos: 459, 460, 461)
    {
        id: "Av3-P-36",
        tipo: "parada",
        parada: 38, // mapa número 33
        mapa_numero: "33",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico",
        coordenadas:  { lat: Number('39.476240'), lng: Number('-0.374290') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/museo_la_almoina.jpg",
    },
    // Tramo 28: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen (Párrafos: 465, 47-B)
    {
        id: "Av3-TR-28",
        tipo: "tramo",
        tramo: 28, // De mapa número 33 a mapa número 35
        mapa_numero: "33→35",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen",
        inicio: { lat: Number('39.476240'), lng: Number('-0.374290') },
        waypoints:
        [
            { lat: Number('39.476300'), lng: Number('-0.374600') },
            { lat: Number('39.476560'), lng: Number('-0.374540') },
            { lat: Number('39.476610'), lng: Number('-0.374990') },
            { lat: Number('39.476660'), lng: Number('-0.375180') },
        ],
        fin: { lat: Number('39.476600'), lng: Number('-0.375270') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/Paso_Plaza_Almoina.jpg",
        video: "",
    },
    // Parada 39: Plaza de la Virgen (Fuente de Neptuno) (Reto 26) (Párrafos: 466, 467)
    {
        id: "Av3-P-37",
        tipo: "parada",
        parada: 39, // mapa número 35
        mapa_numero: "35",
        nombre: "Plaza de la Virgen (Fuente de Neptuno)",
        coordenadas:  { lat: Number('39.476600'), lng: Number('-0.375270') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
    },
    // Parada 40: Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia) (Reto 27) (Párrafos: 477-B, 479, 141, 468)
    {
        id: "Av3-P-38",
        tipo: "parada",
        parada: 40, // mapa número 35
        mapa_numero: "35",
        nombre: "Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia)",
        coordenadas:  { lat: Number('39.476600'), lng: Number('-0.375290') },
        imagen: "imagenes/imagenes-aventuras/puerta_gotica_catedral_2.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
    },
    // Tramo 29: Plaza de la Virgen → Torres de Serranos (Párrafos: 443, 2-F) (pausa muy larga con música de al menos 2min 30seg)
    {
        id: "Av3-TR-29",
        tipo: "tramo",
        tramo: 29, // De mapa número 35 a mapa número 1
        mapa_numero: "35→1",
        nombre: "Plaza de la Virgen → Torres de Serranos",
        inicio: { lat: Number('39.476600'), lng: Number('-0.375290') },
        waypoints:
        [
            { lat: Number('39.476710'), lng: Number('-0.375790') },
            { lat: Number('39.476807'), lng: Number('-0.376386') },
            { lat: Number('39.476881'), lng: Number('-0.376854') },
            { lat: Number('39.477385'), lng: Number('-0.376901') },
            { lat: Number('39.477833'), lng: Number('-0.376674') },
            { lat: Number('39.478270'), lng: Number('-0.376481') },
        ],
        fin: { lat: Number('39.478590'), lng: Number('-0.376330') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
        imagen2:"imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
        imagen3: "imagenes/imagenes-aventuras/Calle_serranos.jpg",
        imagen4: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
        video: "",
    },
        // Parada 39 - FINAL: Torres de Serranos Final (Reto28Puzzle PZ-05) (Párrafos: 475, 503, 507, 526)
                {
                    id: "Av3-P-39",
                    tipo: "parada",
                    parada: 41, // mapa número 1
                    mapa_numero: 1,
                    nombre: "Torres de Serranos Final",
                    coordenadas: { lat: Number('39.478590'), lng: Number('-0.376330') },
                    imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg"
                }
      ]
    }
  },
  Aventura4: {
    "coordenadas-hijo2.html": {
      coordenadas: [
    // poner las coordenadas específicas de los puntos a visitar del mapa. dibujarReferencias() ignora automáticamente las que tengan coordenadas: null.
    {
        tipo: "referencia",
        id: "REF-1",
        mapa_numero: 1,
        coordenadas: { lat: Number('39.479210'), lng: Number('-0.376040') },
        nombre: "Torres de Serranos",
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-2",
        mapa_numero: 2,
        coordenadas: { lat: Number('39.479050'), lng: Number('-0.376880') },
        nombre: "Museo Corpus Christi (Museo de las Rocas) ðŸ›ž",
        imagen: "imagenes/imagenes-aventuras/casa_rocas.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-3",
        mapa_numero: 3,
        coordenadas: { lat: Number('39.479260'), lng: Number('-0.378620') },
        nombre: "Parroquia de la Santísima Cruz (Carmen)",
        imagen: "imagenes/imagenes-aventuras/iglesia_del_carmen.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-4",
        mapa_numero: 4,
        coordenadas: { lat: Number('39.479370'), lng: Number('-0.378830') },
        nombre: "Centro Cultural Contemporáneo “El Carmen”",
        imagen: "imagenes/imagenes-aventuras/centro_cultural_el_carmen.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-5",
        mapa_numero: 5,
        coordenadas: { lat: Number('39.479700'), lng: Number('-0.379520') },
        nombre: "Casa de los Gatos ðŸ˜¸",
        imagen: "imagenes/imagenes-aventuras/casa_de_los_gatos.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-6",
        mapa_numero: 6,
        coordenadas: { lat: Number('39.479880'), lng: Number('-0.383060') },
        nombre: "Museo IVAM",
        imagen: "imagenes/imagenes-aventuras/ivam.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-7",
        mapa_numero: 7,
        coordenadas: { lat: Number('39.481010'), lng: Number('-0.383600') },
        nombre: "Puente de las Artes",
        imagen: "imagenes/imagenes-aventuras/puente_de_las_artes.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-8",
        mapa_numero: 8,
        coordenadas: { lat: Number('39.478120'), lng: Number('-0.390470') },
        nombre: "Puente de las Glorias Valencianas",
        imagen: "imagenes/imagenes-aventuras/puente_glorias_valencianas.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-9",
        mapa_numero: 9,
        coordenadas: { lat: Number('39.477200'), lng: Number('-0.393140') },
        nombre: "Estadio de Atletismo",
        imagen: "imagenes/imagenes-aventuras/estadio_atletismo.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-10",
        mapa_numero: 10,
        coordenadas: { lat: Number('39.475740'), lng: Number('-0.396240') },
        nombre: "Puente de Campanar",
        imagen: "imagenes/imagenes-aventuras/puente_campanar.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-11",
        mapa_numero: 11,
        coordenadas: { lat: Number('39.475330'), lng: Number('-0.397600') },
        nombre: "Na Turia",
        imagen: "imagenes/imagenes-aventuras/naturia_front.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-12",
        mapa_numero: 12,
        coordenadas: { lat: Number('39.474270'), lng: Number('-0.402750') },
        nombre: "Puente Amarillo (Casa del Agua)",
        imagen: "imagenes/imagenes-aventuras/puente_amarillo.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-13",
        mapa_numero: 13,
        coordenadas: { lat: Number('39.473910'), lng: Number('-0.405600') },
        nombre: "Puente 9 de Octubre",
        imagen: "imagenes/imagenes-aventuras/puente_campanar.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-14",
        mapa_numero: 14,
        coordenadas: { lat: Number('39.475716'), lng: Number('-0.408403') },
        nombre: "Parque de Cabecera",
        imagen: "imagenes/imagenes-aventuras/parque_de_cabecera_el_morro_middle.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-15",
        mapa_numero: 15,
        coordenadas: { lat: Number('39.477981'), lng: Number('-0.407598') },
        nombre: "Bioparc (tickets)",
        imagen: "imagenes/imagenes-aventuras/bioparc.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-16",
        mapa_numero: 15,
        coordenadas: { lat: Number('39.478406'), lng: Number('-0.410455') },
        nombre: "Bioparc (Zoo)",
        imagen: "imagenes/imagenes-aventuras/bioparc.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-17",
        mapa_numero: 16,
        coordenadas: { lat: Number('39.481463'), lng: Number('-0.410306') },
        nombre: "Azud Molino del Sol",
        imagen: "imagenes/imagenes-aventuras/parque_cabecera.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-18",
        mapa_numero: 17,
        coordenadas: { lat: Number('39.472870'), lng: Number('-0.408270') },
        nombre: "Museo de Historia de Valencia",
        imagen: "imagenes/imagenes-aventuras/museo_de_historia.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-19",
        mapa_numero: 18,
        coordenadas: { lat: Number('39.478456'), lng: Number('-0.387692') },
        nombre: "Petxina en el Turia",
        imagen: "imagenes/imagenes-aventuras/petxina_en_el_rio.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-20",
        mapa_numero: 19,
        coordenadas: { lat: Number('39.482209'), lng: Number('-0.380320') },
        nombre: "Puente de San José",
        imagen: "imagenes/imagenes-aventuras/puente_san_jose.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-21",
        mapa_numero: 20,
        coordenadas: { lat: Number('39.479770'), lng: Number('-0.375780') },
        nombre: "Puente de Serranos (Plaza de la Crída)",
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-22",
        mapa_numero: 21,
        coordenadas: { lat: Number('39.479922'), lng: Number('-0.374242') },
        nombre: "Puente de Madera",
        imagen: "imagenes/imagenes-aventuras/pont_fusta.jpg",

    },
    {
        tipo: "referencia",
        id: "REF-23",
        mapa_numero: 22,
        coordenadas: { lat: Number('39.479116'), lng: Number('-0.372620') },
        nombre: "Puente de la Trinidad",
        imagen: "imagenes/imagenes-aventuras/museo_bellas_artes.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-24",
        mapa_numero: 23,
        coordenadas: { lat: Number('39.479020'), lng: Number('-0.371170') },
        nombre: "Museo de Bellas Artes",
        imagen: "imagenes/imagenes-aventuras/museo_bellas_artes.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-25",
        mapa_numero: 24,
        coordenadas: { lat: Number('39.477850'), lng: Number('-0.371290') },
        nombre: "Ruinas en el Jardín del Turia",
        imagen: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-26",
        mapa_numero: 25,
        coordenadas: { lat: Number('39.477473'), lng: Number('-0.368361') },
        nombre: "Jardines del Real (Viveros)",
        imagen: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
    },

    // INICIO Numeración individual de los Jardines del Real (viveros)//
    {
        tipo: "referencia",
        id: "REF-27",
        mapa_numero: "v1",
        coordenadas: { lat: Number('39.477710'), lng: Number('-0.368240') },
        nombre: "Paseo de las Palmeras",
        imagen: "imagenes/imagenes-aventuras/viveros_ paseo_palmeras.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-28",
        mapa_numero: "v2",
        coordenadas: { lat: Number('39.478080'), lng: Number('-0.367730') },
        nombre: "Ruinas del Palacio del Real",
        imagen: "imagenes/imagenes-aventuras/viveros_restos_palacio.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-29",
        mapa_numero: "v3",
        coordenadas: { lat: Number('39.478210'), lng: Number('-0.367410') },
        nombre: "Montículo de Elio",
        imagen: "imagenes/imagenes-aventuras/viveros_monte_elio.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-30",
        mapa_numero: "v4",
        coordenadas: { lat: Number('39.478910'), lng: Number('-0.367780') },
        nombre: "Casa del Jardinero Mayor",
        imagen: "imagenes/imagenes-aventuras/viveros_casa_jardinero.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-31",
        mapa_numero: "v5",
        coordenadas: { lat: Number('39.479790'), lng: Number('-0.367200') },
        nombre: "Circuito Vial Urbano",
        imagen: "imagenes/imagenes-aventuras/viveros_ circuito_vial.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-32",
        mapa_numero: "v6",
        coordenadas: { lat: Number('39.479490'), lng: Number('-0.367840') },
        nombre: "Calle de los Jardineros Mayores",
        imagen: ""
    },
    {
        tipo: "referencia",
        id: "REF-33",
        mapa_numero: "v7",
        coordenadas: { lat: Number('39.479350'), lng: Number('-0.368340') },
        nombre: "Antigua Alquería de Canet",
        imagen: "imagenes/imagenes-aventuras/viveros_alqueria_canet.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-34",
        mapa_numero: "v8",
        coordenadas: { lat: Number('39.479330'), lng: Number('-0.368740') },
        nombre: "Museo de Ciencias Naturales",
        imagen: "imagenes/imagenes-aventuras/viveros_museo_ciencias_naturales.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-35",
        mapa_numero: "v9",
        coordenadas: { lat: Number('39.480270'), lng: Number('-0.368550') },
        nombre: "Pequeños Jardines de Versalles",
        imagen: "imagenes/imagenes-aventuras/viveros_jardines_versalles.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-36",
        mapa_numero: "v10",
        coordenadas: { lat: Number('39.481280'), lng: Number('-0.368530') },
        nombre: "Rosaleda",
        imagen: "imagenes/imagenes-aventuras/viveros_rosaleda.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-37",
        mapa_numero: "v11",
        coordenadas: { lat: Number('39.478980'), lng: Number('-0.369390') },
        nombre: "Estanque de los Patos",
        imagen: "imagenes/imagenes-aventuras/viveros_patos.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-38",
        mapa_numero: "v13",
        coordenadas: { lat: Number('39.478620'), lng: Number('-0.369840') },
        nombre: "Portón del Convento de San Julián",
        imagen: "imagenes/imagenes-aventuras/viveros_san_julian.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-39",
        mapa_numero: "v13",
        coordenadas: { lat: Number('39.482985'), lng: Number('-0.366368') },
        nombre: "👣​",
        imagen: "imagenes/imagenes-aventuras/viveros_libre_4.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-40",
        mapa_numero: "v13",
        coordenadas: { lat: Number('39.481577'), lng: Number('-0.366261') },
        nombre: "👣​",
        imagen: "imagenes/imagenes-aventuras/viveros_libre_6.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-41",
        mapa_numero: "v13",
        coordenadas: { lat: Number('39.478844'), lng: Number('-0.370196') },
        nombre: "👣​",
        imagen: "imagenes/imagenes-aventuras/viveros_libre_7.jpg"
    },{
        tipo: "referencia",
        id: "REF-42",
        mapa_numero: "v13",
        coordenadas: { lat: Number('39.478119'), lng: Number('-0.368530') },
        nombre: "👣​",
        imagen: "imagenes/imagenes-aventuras/viveros_paseo_poetas.jpg"
    },
    // FIN Numeración individual de los Jardines del Real (viveros)//
    {
        tipo: "referencia",
        id: "REF-43",
        mapa_numero: 26,
        coordenadas: { lat: Number('39.476500'), lng: Number('-0.368760') },
        nombre: "Puente del Real",
        imagen: "imagenes/imagenes-aventuras/puente_real_up.jpg",
    },

    // Coordenadas completas Aventura 4
        // Parada 0 - Torres de Serranos (start) (Reto 3) (Párrafos: 223, 226, 228)
    {
        id: "Av4-P-0",
        tipo: "inicio",
        parada: 2, // mapa número 1
        mapa_numero: 1,
        nombre: "Torres de Serranos (start)",
        coordenadas: { lat: Number('39.478760'), lng: Number('-0.376260') },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
    },
    // Tramo 1: Torres de Serranos → Museo de Corpus Christi (Casa de las Rocas) (Párrafos: 229, 525-B, 527, 528, 529)
    {
        id: "Av4-TR-1",
        tipo: "tramo",
        tramo: 1, // De mapa número 1 a mapa número 2
        mapa_numero: "1→2",
        nombre: "Torres de Serranos → Museo de Corpus Christi (Casa de las Rocas)",
        inicio: { lat: Number('39.478760'), lng: Number('-0.376260') },
         waypoints: [
            { lat: Number('39.478900'), lng: Number('-0.376190') },
            { lat: Number('39.478750'), lng: Number('-0.376260') },
            { lat: Number('39.478850'), lng: Number('-0.376570') },
            { lat: Number('39.478920'), lng: Number('-0.376770') },
         ],
        fin: { lat: Number('39.478960'), lng: Number('-0.376920') },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
        imagen2: "imagenes/imagenes-aventuras/casa_rocas.jpg",
        video: "",
    },
    // Parada 1 - Museo de Corpus Christi (Casa de las Rocas) (Reto4Puzzle PZ-18) (Párrafos: 5-B, 530, 531, 532, 396)
    {
        id: "Av4-P-1",
        tipo: "parada",
        parada: 3, // mapa número 2
        mapa_numero: 1,
        nombre: "Museo de Corpus Christi (Casa de las Rocas)",
        coordenadas: { lat: Number('39.478960'), lng: Number('-0.376920') },
        imagen: "imagenes/imagenes-aventuras/casa_rocas.jpg",
    },
    // Tramo 2: Museo de Corpus Christi (Casa de las Rocas) → Parroquia de la Santísima Cruz (Iglesia del Carmen) (Párrafos: 533, 6-B)
    {
        id: "Av4-TR-2",
        tipo: "tramo",
        tramo: 2, // De mapa número 2 a mapa número 3
        mapa_numero: "2→3",
        nombre: "Museo de Corpus Christi (Casa de las Rocas) → Parroquia de la Santísima Cruz (Iglesia del Carmen)",
        inicio: { lat: Number('39.478960'), lng: Number('-0.376920') },
         waypoints: [
            { lat: Number('39.479010'), lng: Number('-0.377120') },
            { lat: Number('39.479020'), lng: Number('-0.377420') },
            { lat: Number('39.478990'), lng: Number('-0.377800') },
            { lat: Number('39.479040'), lng: Number('-0.378190') },
            { lat: Number('39.479130'), lng: Number('-0.378380') },
         ],
        fin: {lat: Number('39.479210'), lng: Number('-0.378590') },
        imagen: "imagenes/imagenes-aventuras/casa_rocas.jpg",
        imagen2: "imagenes/imagenes-aventuras/iglesia_del_carmen.jpg",
        video: "",
    },
    // Parada 2 - Parroquia de la Santísima Cruz (Iglesia del Carmen) (Reto 5) (Párrafos: 534, 535, 536, 537, 538)
    {
        id: "Av4-P-2",
        tipo: "parada",
        parada: 4, // mapa número 3
        mapa_numero: 3,
        nombre: "Parroquia de la Santísima Cruz (Iglesia del Carmen)",
        coordenadas: { lat: Number('39.479210'), lng: Number('-0.378590') },
        imagen: "imagenes/imagenes-aventuras/iglesia_del_carmen.jpg",
    },
    // Parada 3 - Parroquia de la Santísima Cruz (Iglesia del Carmen) 2 (Reto 6) (Párrafos: 539, 540, 541)
    {
        id: "Av4-P-3",
        tipo: "parada",
        parada: 5, // mapa número 3
        mapa_numero: 3,
        nombre: "Parroquia de la Santísima Cruz (Iglesia del Carmen)",
        coordenadas: { lat: Number('39.479210'), lng: Number('-0.378600') },
        imagen: "imagenes/imagenes-aventuras/iglesia_del_carmen.jpg",
    },
    // Tramo 3: Parroquia de la Santísima Cruz (Iglesia del Carmen) → Centro Cultural Contemporáneo "El Carmen" (Párrafos: 542, 7)
    {
        id: "Av4-TR-3",
        tipo: "tramo",
        tramo: 3, // De mapa número 3 a mapa número 4
        mapa_numero: "3→4",
        nombre: "Parroquia de la Santísima Cruz (Iglesia del Carmen) → Centro Cultural Contemporáneo: El Carmen",
        inicio: { lat: Number('39.479210'), lng: Number('-0.378600') },
         waypoints: [
            { lat: Number('39.479270'), lng: Number('-0.378760') },
         ],
        fin: {lat: Number('39.479340'), lng: Number('-0.378850') },
        imagen: "imagenes/imagenes-aventuras/iglesia_del_carmen.jpg",
        imagen2: "imagenes/imagenes-aventuras/centro_cultural_el_carmen.jpg",
        video: "",
    },
    // Parada 4 - Centro Cultural Contemporáneo "El Carmen" (Reto 7) (Párrafos: 543, 544-B, 545, 546)
    {
        id: "Av4-P-4",
        tipo: "parada",
        parada: 6, // mapa número 4
        mapa_numero: 4,
        nombre: "Centro Cultural Contemporáneo: El Carmen",
        coordenadas: { lat: Number('39.479340'), lng: Number('-0.378850') },
        imagen: "imagenes/imagenes-aventuras/centro_cultural_el_carmen.jpg",
    },
    // Parada 5 - Centro Cultural Contemporáneo "El Carmen" 2 (Reto 8) (Párrafos: 547, 548, 549, 550)
    {
        id: "Av4-P-5",
        tipo: "parada",
        parada: 7, // mapa número 4
        mapa_numero: 4,
        nombre: "Centro Cultural Contemporáneo: El Carmen",
        coordenadas: { lat: Number('39.479360'), lng: Number('-0.378880') },
        imagen: "imagenes/imagenes-aventuras/centro_cultural_el_carmen.jpg",
    },
    // Tramo 4: Centro Cultural Contemporáneo: El Carmen → Casa de los Gatos (Párrafos: 551, 8-B, 552)
    {
        id: "Av4-TR-4",
        tipo: "tramo",
        tramo: 4, // De mapa número 4 a mapa número 5
        mapa_numero: "4→5",
        nombre: "Centro Cultural Contemporáneo: El Carmen → Casa de los Gatos",
        inicio: { lat: Number('39.479360'), lng: Number('-0.378880') },
         waypoints: [
            { lat: Number('39.479360'), lng: Number('-0.378880') },
            { lat: Number('39.479630'), lng: Number('-0.379290') }
         ],
        fin: {lat: Number('39.479740'), lng: Number('-0.379500') },
        imagen: "imagenes/imagenes-aventuras/centro_cultural_el_carmen.jpg",
        imagen2: "imagenes/imagenes-aventuras/casa_de_los_gatos.jpg",
        video: "",
    },
    // Parada 6 - Casa de los Gatos (Reto 9) (Párrafos: 553, 554)
    {
        id: "Av4-P-6",
        tipo: "parada",
        parada: 8, // mapa número 5
        mapa_numero: 5,
        nombre: "Casa de los Gatos ðŸ˜¸",
        coordenadas: { lat: Number('39.479740'), lng: Number('-0.379500') },
        imagen: "imagenes/imagenes-aventuras/casa_de_los_gatos.jpg",
    },
    // Parada 7 - Casa de los Gatos 2 (Párrafos: 555, 556)
    {
        id: "Av4-P-7",
        tipo: "parada",
        parada: 9, // mapa número 5
        mapa_numero: 5,
        nombre: "Casa de los Gatos ðŸ˜¸",
        coordenadas: { lat: Number('39.479750'), lng: Number('-0.379510') },
        imagen: "imagenes/imagenes-aventuras/casa_de_los_gatos.jpg",
    },
    // Parada 8 - Casa de los Gatos 3 (Reto 10) (Párrafos: 557, 558)
    {
        id: "Av4-P-8",
        tipo: "parada",
        parada: 10, // mapa número 5
        mapa_numero: 5,
        nombre: "Casa de los Gatos ðŸ˜¸",
        coordenadas: { lat: Number('39.479750'), lng: Number('-0.379500') },
        imagen: "imagenes/imagenes-aventuras/casa_de_los_gatos.jpg",
    },
    // Parada 9 - Casa de los Gatos 4 (Reto 11) (Párrafos: 559)
    {
        id: "Av4-P-9",
        tipo: "parada",
        parada: 11, // mapa número 5
        mapa_numero: 5,
        nombre: "Casa de los Gatos ðŸ˜¸",
        coordenadas: { lat: Number('39.479740'), lng: Number('-0.379510') },
        imagen: "imagenes/imagenes-aventuras/casa_de_los_gatos.jpg",
    },
    // Tramo 5: Casa de los Gatos → Instituto Valenciano de Arte Moderno (IVAM) (Párrafos: 561, 10-C)
    {
        id: "Av4-TR-5",
        tipo: "tramo",
        tramo: 5, // De mapa número 5 a mapa número 6
        mapa_numero: "5→6",
        nombre: "Casa de los Gatos → Instituto Valenciano de Arte Moderno (IVAM)",
        inicio: { lat: Number('39.479740'), lng: Number('-0.379510') },
         waypoints: [
            { lat: Number('39.479780'), lng: Number('-0.379860')},
            { lat: Number('39.479670'), lng: Number('-0.379840') },
            { lat: Number('39.479590'), lng: Number('-0.379860') },
            { lat: Number('39.479760'), lng: Number('-0.380620') },
            { lat: Number('39.480010'), lng: Number('-0.381750') },
            { lat: Number('39.480140'), lng: Number('-0.382410') },
            { lat: Number('39.480250'), lng: Number('-0.382920') },
            { lat: Number('39.479880'), lng: Number('-0.383070') },
         ],
        fin: { lat: Number('39.479580'), lng: Number('-0.383190') },
        imagen: "imagenes/imagenes-aventuras/casa_de_los_gatos.jpg",
        imagen2: "imagenes/imagenes-aventuras/ivam.jpg",
        video: "",
    },
    // Parada 12: Instituto Valenciano de Arte Moderno (IVAM): Trazado de las Murallas (Párrafos: 562, 562-B)
    {
        id: "Av4-P-10",
        tipo: "parada",
        parada: 12, // mapa número 6
        mapa_numero: 6,
        nombre: "Instituto Valenciano de Arte Moderno (IVAM)",
        coordenadas: { lat: Number('39.479580'), lng: Number('-0.383190') },
        imagen: "imagenes/imagenes-aventuras/ivam.jpg",
        imagen2:"imagenes/imagenes-aventuras/torres_de_quart.jpg",
    },
    // Parada 13: Instituto Valenciano de Arte Moderno (IVAM): Museo (Párrafos: 563-C)
    {
        id: "Av4-P-11",
        tipo: "parada",
        parada: 13, // mapa número 6
        mapa_numero: 6,
        nombre: "Instituto Valenciano de Arte Moderno (IVAM)",
        coordenadas: { lat: Number('39.479600'), lng: Number('-0.383180') },
        imagen: "imagenes/imagenes-aventuras/ivam.jpg",
    },
    // Tramo 6: Instituto Valenciano de Arte Moderno (IVAM) → Estadio de Atletismo (Párrafos: 11-E, 232)
    {
        id: "Av4-TR-6",
        tipo: "tramo",
        tramo: 6, // De mapa número 6 a mapa número 9
        mapa_numero: "6→9",
        nombre: "Instituto Valenciano de Arte Moderno (IVAM) → Estadio de Atletismo",
        inicio: { lat: Number('39.479600'), lng: Number('-0.383180') },
         waypoints: [
            { lat: Number('39.479950'), lng: Number('-0.383040') },
            { lat: Number('39.480120'), lng: Number('-0.382990') },
            { lat: Number('39.480150'), lng: Number('-0.383120') },
            { lat: Number('39.480330'), lng: Number('-0.383070') },
            { lat: Number('39.480370'), lng: Number('-0.383180') },
            { lat: Number('39.480420'), lng: Number('-0.383230') },
            { lat: Number('39.480810'), lng: Number('-0.383510') },
            { lat: Number('39.481320'), lng: Number('-0.383880') },
            { lat: Number('39.481590'), lng: Number('-0.384090') },
            { lat: Number('39.481490'), lng: Number('-0.384250') },
            { lat: Number('39.481430'), lng: Number('-0.384410') },
            { lat: Number('39.481380'), lng: Number('-0.384410') },
            { lat: Number('39.481230'), lng: Number('-0.384730') },
            { lat: Number('39.481230'), lng: Number('-0.384730') },
            { lat: Number('39.481040'), lng: Number('-0.384970') },
            { lat: Number('39.480660'), lng: Number('-0.385790') },
            { lat: Number('39.480130'), lng: Number('-0.386850') },
            { lat: Number('39.479550'), lng: Number('-0.388160') },
            { lat: Number('39.479100'), lng: Number('-0.389500') },
            { lat: Number('39.478580'), lng: Number('-0.390640') },
            { lat: Number('39.478310'), lng: Number('-0.391650') },
            { lat: Number('39.478220'), lng: Number('-0.392330') },
            { lat: Number('39.477660'), lng: Number('-0.393550') },
            { lat: Number('39.477170'), lng: Number('-0.394650') },
            { lat: Number('39.476920'), lng: Number('-0.394470') },
        ],
        fin: {lat: Number('39.476680'), lng: Number('-0.394290')},
        imagen: "imagenes/imagenes-aventuras/ivam.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_de_las_artes.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente_artes_subida.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_glorias_valencianas.jpg",
        imagen5: "imagenes/imagenes-aventuras/estadio_atletismo.jpg",
        video: "",
    },
    // Parada 14: Estadio de Atletismo (Reto12puzzle PZ-10) (Párrafos: 603)
    {
        id: "Av4-P-12",
        tipo: "parada",
        parada: 14, // mapa número 9
        mapa_numero: 9,
        nombre: "Estadio de Atletismo",
        coordenadas: { lat: Number('39.476680'), lng: Number('-0.394290') },
        imagen: "imagenes/imagenes-aventuras/estadio_atletismo.jpg",
    },
    // Tramo 7: Estadio de Atletismo → Na Turia (Plataforma elevada) (Párrafos: 604-B)
    {
        id: "Av4-TR-7",
        tipo: "tramo",
        tramo: 7, // De mapa número 9 a mapa número 11
        mapa_numero: "9→11",
        nombre: "Estadio de Atletismo → Na Turia",
        inicio: { lat: Number('39.476680'), lng: Number('-0.394290') },
         waypoints: [
            { lat: Number('39.476920'), lng: Number('-0.394470') },
            { lat: Number('39.477170'), lng: Number('-0.394650') },
            { lat: Number('39.476870'), lng: Number('-0.395290') },
            { lat: Number('39.476520'), lng: Number('-0.396070') },
            { lat: Number('39.476170'), lng: Number('-0.396850') },
            { lat: Number('39.475960'), lng: Number('-0.397480') },
            { lat: Number('39.475850'), lng: Number('-0.397430') },
         ],
        fin: { lat: Number('39.475770'), lng: Number('-0.397480') },
        imagen: "imagenes/imagenes-aventuras/estadio_atletismo.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_campanar.jpg",
        imagen3: "imagenes/imagenes-aventuras/naturia_plataforma.jpg",
        video: "",
    },
    // Parada 15: Na Turia (Plataforma elevada) (Reto 13) (Párrafos: 606, 231, 608, 609, 602, 610)
    {
        id: "Av4-P-13",
        tipo: "parada",
        parada: 15, // mapa número 11
        mapa_numero: 11,
        nombre: "Na Turia",
        coordenadas: { lat: Number('39.475770'), lng: Number('-0.397480') },
        imagen: "imagenes/imagenes-aventuras/naturia_plataforma.jpg",
        imagen2: "",
    },
    // Tramo 8: Na Turia (Plataforma elevada) → Na Turia (Museo) (Párrafos: 711, 21)
    {
        id: "Av4-TR-8",
        tipo: "tramo",
        tramo: 8, // De mapa número 11 a mapa número 11
        mapa_numero: "11→11",
        nombre: "Na Turia (Plataforma elevada) → Na Turia (Museo)",
        inicio: { lat: Number('39.475770'), lng: Number('-0.397480') },
         waypoints: [
            { lat: Number('39.475850'), lng: Number('-0.397430') },
            { lat: Number('39.475960'), lng: Number('-0.397460') },
            { lat: Number('39.475890'), lng: Number('-0.397830') },
            { lat: Number('39.475800'), lng: Number('-0.398270') },
            { lat: Number('39.475750'), lng: Number('-0.398540') },
            { lat: Number('39.475470'), lng: Number('-0.398450') },
            { lat: Number('39.475190'), lng: Number('-0.398360') },

         ],
        fin: {lat: Number('39.475230'), lng: Number('-0.398120') },
        imagen: "imagenes/imagenes-aventuras/naturia_plataforma.jpg",
        imagen2: "imagenes/imagenes-aventuras/naturia_front.jpg",
        video: "",
    },

    // Parada 16: Na Turia (Museo) (Párrafos: 713, 54)
    {
        id: "Av4-P-14",
        tipo: "parada",
        parada: 16, // mapa número 11
        mapa_numero: 11,
        nombre: "Na Turia",
        coordenadas: { lat: Number('39.475230'), lng: Number('-0.398120') },
        imagen: "imagenes/imagenes-aventuras/naturia_front.jpg",
        imagen2: "imagenes/imagenes-aventuras/naturia_2.jpg",
        imagen3: "imagenes/imagenes-aventuras/naturia_3.jpg",
    },
    // Tramo 9: Na Turia → Puente Amarillo (Párrafos: 611, 20)
    {
        id: "Av4-TR-9",
        tipo: "tramo",
        tramo: 9, // De mapa número 11 a mapa número 12
        mapa_numero: "11→12",
        nombre: "Na Turia → Puente Amarillo",
        inicio: { lat: Number('39.475230'), lng: Number('-0.398120') },
         waypoints: [
            { lat: Number('39.475180'), lng: Number('-0.398370') },
            { lat: Number('39.475470'), lng: Number('-0.398450') },
            { lat: Number('39.475750'), lng: Number('-0.398540') },
            { lat: Number('39.475660'), lng: Number('-0.398980') },
            { lat: Number('39.475520'), lng: Number('-0.399720') },
            { lat: Number('39.475120'), lng: Number('-0.401840') },
         ],
        fin: {lat: Number('39.474940'), lng: Number('-0.402800') },
        imagen: "imagenes/imagenes-aventuras/naturia_front.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_amarillo.jpg",
        video: "",
    },
    // Parada 17: Puente Amarillo (Párrafos: 128, 312, 613, 614, 615)
    {
        id: "Av4-P-15",
        tipo: "parada",
        parada: 17, // mapa número 12
        mapa_numero: 12,
        nombre: "Puente Amarillo",
        coordenadas: { lat: Number('39.474940'), lng: Number('-0.402800') },
        imagen: "imagenes/imagenes-aventuras/puente_amarillo.jpg",
    },
    // Tramo 10: Puente Amarillo → Puente 9 de Octubre  (Párrafos: 3)
    {
        id: "Av4-TR-10",
        tipo: "tramo",
        tramo: 10, // De mapa número 12 a mapa número 13
        mapa_numero: "12→13",
        nombre: "Puente Amarillo → Puente 9 de Octubre",
        inicio: { lat: Number('39.474940'), lng: Number('-0.402800') },
         waypoints: [
            { lat: Number('39.474960'), lng: Number('-0.402900') },
            { lat: Number('39.474841'), lng: Number('-0.403309') },
            { lat: Number('39.474676'), lng: Number('-0.403726') },
            { lat: Number('39.474700'), lng: Number('-0.403942') },
            { lat: Number('39.474509'), lng: Number('-0.404457') },
            { lat: Number('39.474516'), lng: Number('-0.404712') },
            { lat: Number('39.474338'), lng: Number('-0.405193') },
         ],
        fin: {lat: Number('39.474386'), lng: Number('-0.405568') },
        imagen: "imagenes/imagenes-aventuras/puente_amarillo.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_9_octubre_close.jpg",
        video: "",
    },
    // Parada 18: Puente 9 de Octubre (Párrafos: 616, 616-B, 617)
    {
        id: "Av4-P-16",
        tipo: "parada",
        parada: 18, // mapa número 13
        mapa_numero: 13,
        nombre: "Puente 9 de Octubre",
        coordenadas: { lat: Number('39.474386'), lng: Number('-0.405568')  },
        imagen: "imagenes/imagenes-aventuras/puente_9_octubre_close.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_9_octubre_far.jpg",
    },
    // Tramo 11: Puente 9 de Octubre → Parque de Cabecera (El Morro) (Párrafos: 618, 21, 619)
    {
        id: "Av4-TR-11",
        tipo: "tramo",
        tramo: 11, // De mapa número 13 a mapa número 14
        mapa_numero: "13→14",
        nombre: "Puente 9 de Octubre → Parque de Cabecera (El Morro)",
        inicio: { lat: Number('39.474386'), lng: Number('-0.405568') },
         waypoints: [
            { lat: Number('39.474295'), lng: Number('-0.406398') },
            { lat: Number('39.474159'), lng: Number('-0.406864') },
            { lat: Number('39.474665'), lng: Number('-0.407867') },
            { lat: Number('39.475110'), lng: Number('-0.408124') },
            { lat: Number('39.475501'), lng: Number('-0.408085') },
            { lat: Number('39.475722'), lng: Number('-0.407743') },
            { lat: Number('39.475826'), lng: Number('-0.407644') },
            { lat: Number('39.475710'), lng: Number('-0.407134') },
            { lat: Number('39.475575'), lng: Number('-0.406996') },
            { lat: Number('39.475384'), lng: Number('-0.407068') },
            { lat: Number('39.475347'), lng: Number('-0.407255') },
            { lat: Number('39.475539'), lng: Number('-0.407697') },
            { lat: Number('39.475424'), lng: Number('-0.407915') },
            { lat: Number('39.475045'), lng: Number('-0.407811') },
            { lat: Number('39.474850'), lng: Number('-0.407565') },
            { lat: Number('39.474887'), lng: Number('-0.407365') },
            { lat: Number('39.475010'), lng: Number('-0.407285') },
            { lat: Number('39.475157'), lng: Number('-0.407328') },
            { lat: Number('39.475329'), lng: Number('-0.407478') },
            { lat: Number('39.475362'), lng: Number('-0.407649') },
            { lat: Number('39.475283'), lng: Number('-0.407675') },
                { lat: Number('39.475214'), lng: Number('-0.407603') },
         ],
        fin: {lat: Number('39.475316'), lng: Number('-0.407615')},
        imagen: "imagenes/imagenes-aventuras/puente_9_octubre_far.jpg",
        imagen2: "imagenes/imagenes-aventuras/parque_de_cabecera_el_morro_middle.jpg",
        video: "",
    },
    // Parada 19: Parque de Cabecera (El Morro) (Reto14puzzle PZ-11 ) (Párrafos: 621, 622)
    {
        id: "Av4-P-17",
        tipo: "parada",
        parada: 19, // mapa número 14
        mapa_numero: 14,
        nombre: "Parque de Cabecera (El Morro)",
        coordenadas: { lat: Number('39.475316'), lng: Number('-0.407615') },
        imagen: "imagenes/imagenes-aventuras/parque_de_cabecera_el_morro_down.jpg",
        imagen2: "imagenes/imagenes-aventuras/parque_de_cabecera_el_morro_middle.jpg",
        imagen3: "imagenes/imagenes-aventuras/parque_de_cabecera_el_morro_top.jpg",
    },
    // Parada 20: Parque de Cabecera (El Morro) (Párrafos: 623, 624, 625)
    {
        id: "Av4-P-18",
        tipo: "parada",
        parada: 20, // mapa número 14
        mapa_numero: 14,
        nombre: "Parque de Cabecera (El Morro)",
        coordenadas: { lat: Number('39.475329'), lng: Number('-0.407602') },
        imagen: "imagenes/imagenes-aventuras/parque_de_cabecera_el_morro_middle.jpg",
    },
    // Tramo 12: Parque de Cabecera (El Morro) → Bioparc (Párrafos: 22-E, 628-B)
    {
        id: "Av4-TR-12",
        tipo: "tramo",
        tramo: 12, // De mapa número 14 a mapa número 15
        mapa_numero: "14→15",
        nombre: "Parque de Cabecera (El Morro) → Bioparc",
        inicio: { lat: Number('39.475329'), lng: Number('-0.407602')  },
         waypoints: [
            { lat: Number('39.475198'), lng: Number('-0.407590') },
            { lat: Number('39.475270'), lng: Number('-0.407674') },
            { lat: Number('39.475353'), lng: Number('-0.407667') },
            { lat: Number('39.475370'), lng: Number('-0.407579') },
            { lat: Number('39.475263'), lng: Number('-0.407406') },
            { lat: Number('39.475101'), lng: Number('-0.407295') },
            { lat: Number('39.474920'), lng: Number('-0.407307') },
            { lat: Number('39.474838'), lng: Number('-0.407422') },
            { lat: Number('39.474853'), lng: Number('-0.407608') },
            { lat: Number('39.474766'), lng: Number('-0.407352') },
            { lat: Number('39.474811'), lng: Number('-0.407048') },
            { lat: Number('39.474955'), lng: Number('-0.406749') },
            { lat: Number('39.475186'), lng: Number('-0.406555') },
            { lat: Number('39.475464'), lng: Number('-0.406479') },
            { lat: Number('39.475490'), lng: Number('-0.406421') },
            { lat: Number('39.475923'), lng: Number('-0.406513') },
            { lat: Number('39.476257'), lng: Number('-0.406581') },
            { lat: Number('39.476591'), lng: Number('-0.406646') },
            { lat: Number('39.477045'), lng: Number('-0.406731') },
            { lat: Number('39.477563'), lng: Number('-0.406862') },
         ],
        fin: {lat: Number('39.478020'), lng: Number('-0.406962') },
        imagen: "imagenes/imagenes-aventuras/parque_de_cabecera_el_morro_middle.jpg",
        imagen2: "imagenes/imagenes-aventuras/bioparc.jpg",
        video: "",
    },
    // Parada 21: Bioparc (Reto15puzzle PZ-12) (Párrafos: 627, 628)
    {
        id: "Av4-P-19",
        tipo: "parada",
        parada: 21, // mapa número 15
        mapa_numero: 15,
        nombre: "Bioparc",
        coordenadas: { lat: Number('39.478020'), lng: Number('-0.406962') },
        imagen: "imagenes/imagenes-aventuras/bioparc.jpg",
    },
    // Tramo 13: Bioparc → Molino del Sol (Párrafos: 708, 23-C)
    {
        id: "Av4-TR-13",
        tipo: "tramo",
        tramo: 13, // De mapa número 15 a mapa número 16
        mapa_numero: "15→16",
        nombre: "Bioparc → Molino del Sol",
        inicio: { lat: Number('39.478020'), lng: Number('-0.406962') },
         waypoints: [
            { lat: Number('39.477242'), lng: Number('-0.406792') },
            { lat: Number('39.476581'), lng: Number('-0.406645') },
            { lat: Number('39.476385'), lng: Number('-0.406615') },
            { lat: Number('39.476112'), lng: Number('-0.406554') },
            { lat: Number('39.476067'), lng: Number('-0.407099') },
            { lat: Number('39.475973'), lng: Number('-0.407644') },
            { lat: Number('39.476714'), lng: Number('-0.408012') },
            { lat: Number('39.477405'), lng: Number('-0.408416') },
            { lat: Number('39.478151'), lng: Number('-0.408627') },
            { lat: Number('39.478589'), lng: Number('-0.408844') },
            { lat: Number('39.478963'), lng: Number('-0.409175') },
            { lat: Number('39.479150'), lng: Number('-0.409226') },
            { lat: Number('39.479874'), lng: Number('-0.409130') },
            { lat: Number('39.480465'), lng: Number('-0.409224') },
            { lat: Number('39.481059'), lng: Number('-0.409784') },
            { lat: Number('39.481439'), lng: Number('-0.410131') },
         ],
        fin: {lat: Number('39.481476'), lng: Number('-0.410299') },
        imagen: "imagenes/imagenes-aventuras/bioparc.jpg",
        imagen2: "imagenes/imagenes-aventuras/parque_cabecera.jpg",
        imagen3: "imagenes/imagenes-aventuras/parque_de_cabecera_end_side.jpg",
        imagen4: "imagenes/imagenes-aventuras/parque_de_cabecera_end_park.jpg",
        video: "",
    },
    // Parada 22: Molino del Sol (Párrafos: 709)
    {
        id: "Av4-P-20",
        tipo: "parada",
        parada: 22, // mapa número 16
        mapa_numero: 16,
        nombre: "Molino del Sol",
        coordenadas: { lat: Number('39.481476'), lng: Number('-0.410299') },
        imagen: "imagenes/imagenes-aventuras/parque_de_cabecera_end_park.jpg",
    },
    // Tramo 14: Molino de Sol → Museo de Historia (Párrafos: 710, 24-D)
    {
        id: "Av4-TR-14",
        tipo: "tramo",
        tramo: 14, // De mapa número 16 a mapa número 17
        mapa_numero: "16→17",
        nombre: "Molino de Sol → Museo de Historia",
        inicio: { lat: Number('39.481476'), lng: Number('-0.410299') },
         waypoints: [
            { lat: Number('39.481189'), lng: Number('-0.410518') },
            { lat: Number('39.480787'), lng: Number('-0.410196') },
            { lat: Number('39.480254'), lng: Number('-0.409787') },
            { lat: Number('39.479866'), lng: Number('-0.409631') },
            { lat: Number('39.479382'), lng: Number('-0.409689') },
            { lat: Number('39.479148'), lng: Number('-0.409734') },
            { lat: Number('39.478857'), lng: Number('-0.409728') },
            { lat: Number('39.478233'), lng: Number('-0.409565') },
            { lat: Number('39.477862'), lng: Number('-0.409327') },
            { lat: Number('39.477527'), lng: Number('-0.409289') },
            { lat: Number('39.477181'), lng: Number('-0.409605') },
            { lat: Number('39.476759'), lng: Number('-0.409442') },
            { lat: Number('39.476289'), lng: Number('-0.409259') },
            { lat: Number('39.476073'), lng: Number('-0.409310') },
            { lat: Number('39.475800'), lng: Number('-0.409505') },
            { lat: Number('39.475573'), lng: Number('-0.409676') },
            { lat: Number('39.475409'), lng: Number('-0.409775') },
            { lat: Number('39.474960'), lng: Number('-0.409842') },
            { lat: Number('39.474716'), lng: Number('-0.409607') },
            { lat: Number('39.474463'), lng: Number('-0.409194') },
            { lat: Number('39.474161'), lng: Number('-0.408666') },
            { lat: Number('39.474014'), lng: Number('-0.407791') },
            { lat: Number('39.473807'), lng: Number('-0.407420') },
            { lat: Number('39.473492'), lng: Number('-0.406986') },
            { lat: Number('39.473357'), lng: Number('-0.407035') },
            { lat: Number('39.473227'), lng: Number('-0.407334') },
            { lat: Number('39.473090'), lng: Number('-0.407515') },
            { lat: Number('39.472887'), lng: Number('-0.407471') },
            { lat: Number('39.472836'), lng: Number('-0.407840') },
            { lat: Number('39.472845'), lng: Number('-0.407965') },
            { lat: Number('39.472932'), lng: Number('-0.408327') },
                    ],
        fin: {lat: Number('39.472788'), lng: Number('-0.408349') },
        imagen: "imagenes/imagenes-aventuras/parque_de_cabecera_end_park.jpg",
        imagen2: "imagenes/imagenes-aventuras/cabecera_izquierda.jpg",
        imagen3: "imagenes/imagenes-aventuras/parque_de_ cabecera_lake_side.jpg",
        imagen4: "imagenes/imagenes-aventuras/museo_de_historia.jpg",
        video: "",
    },
    // Parada 23: Museo de Historia (Párrafos: 630, 631, 632)
    {
        id: "Av4-P-21",
        tipo: "parada",
        parada: 23, // mapa número 17
        mapa_numero: 17,
        nombre: "Museo de Historia",
        coordenadas: { lat: Number('39.472788'), lng: Number('-0.408349') },
        imagen: "imagenes/imagenes-aventuras/museo_de_historia.jpg",
    },
    // Tramo 15: Museo de Historia → Pechina en el Turia (Párrafos: 633, 28-B, 415, 27-B)
    {
        id: "Av4-TR-15",
        tipo: "tramo",
        tramo: 15, // De mapa número 17 a mapa número 18
        mapa_numero: "17→18",
        nombre: "Museo de Historia → Pechina en el Turia",
        inicio: { lat: Number('39.472788'), lng: Number('-0.408349') },
         waypoints: [
            { lat: Number('39.472768'), lng: Number('-0.407962') },
            { lat: Number('39.472858'), lng: Number('-0.407629') },
            { lat: Number('39.472891'), lng: Number('-0.407468') },
            { lat: Number('39.473026'), lng: Number('-0.407492') },
            { lat: Number('39.473048'), lng: Number('-0.407202') },
            { lat: Number('39.473086'), lng: Number('-0.406919') },
            { lat: Number('39.473212'), lng: Number('-0.406418') },
            { lat: Number('39.473307'), lng: Number('-0.405727') },
            { lat: Number('39.473483'), lng: Number('-0.405065') },
            { lat: Number('39.473483'), lng: Number('-0.405065') },
            { lat: Number('39.473526'), lng: Number('-0.404125') },
            { lat: Number('39.473691'), lng: Number('-0.403656') },
            { lat: Number('39.473642'), lng: Number('-0.403215') },
            { lat: Number('39.473768'), lng: Number('-0.402547') },
            { lat: Number('39.473917'), lng: Number('-0.401835') },
            { lat: Number('39.474056'), lng: Number('-0.401120') },
            { lat: Number('39.474223'), lng: Number('-0.400289') },
            { lat: Number('39.474321'), lng: Number('-0.399684') },
            { lat: Number('39.474416'), lng: Number('-0.399264') },
            { lat: Number('39.474558'), lng: Number('-0.398619') },
            { lat: Number('39.474859'), lng: Number('-0.397199') },
            { lat: Number('39.475142'), lng: Number('-0.396440') },
            { lat: Number('39.475476'), lng: Number('-0.395321') },
            { lat: Number('39.476455'), lng: Number('-0.393164') },
            { lat: Number('39.477282'), lng: Number('-0.391149') },
            { lat: Number('39.477911'), lng: Number('-0.389085') },
            { lat: Number('39.478193'), lng: Number('-0.388239') },
         ],
        fin: { lat: Number('39.478455'), lng: Number('-0.387677')},
        imagen: "imagenes/imagenes-aventuras/museo_de_historia.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_9_octubre.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente_amarillo.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_campanar.jpg",
        imagen5: "imagenes/imagenes-aventuras/estadio_atletismo.jpg",
        imagen6: "imagenes/imagenes-aventuras/puente_glorias_valencianas.jpg",
        imagen7: "imagenes/imagenes-aventuras/petxina_en_el_rio.jpg",
        video: "",
    },
    // Parada 24: Pechina en el Turia (Reto 16) (Párrafos: 634, 635)
    {
        id: "Av4-P-22",
        tipo: "parada",
        parada: 24, // mapa número 18
        mapa_numero: 18,
        nombre: "Pechina en el Turia",
        coordenadas: { lat: Number('39.478455'), lng: Number('-0.387677') },
        imagen: "imagenes/imagenes-aventuras/petxina_en_el_rio.jpg",
    },
    // Tramo 16: Pechina en el Turia → Puente de San José (Párrafos: 636, 28-B)
    {
        id: "Av4-TR-16",
        tipo: "tramo",
        tramo: 16, // De mapa número 18 a mapa número 19
        mapa_numero: "18→19",
        nombre: "Pechina en el Turia → Puente de San José",
        inicio: { lat: Number('39.478455'), lng: Number('-0.387677') },
         waypoints: [
            { lat: Number('39.478656'), lng: Number('-0.387023') },
            { lat: Number('39.478830'), lng: Number('-0.386554') },
            { lat: Number('39.479107'), lng: Number('-0.385908') },
            { lat: Number('39.479310'), lng: Number('-0.385449') },
            { lat: Number('39.479572'), lng: Number('-0.384894') },
            { lat: Number('39.479838'), lng: Number('-0.384380') },
            { lat: Number('39.480193'), lng: Number('-0.383746') },
            { lat: Number('39.480415'), lng: Number('-0.383351') },
            { lat: Number('39.480746'), lng: Number('-0.382726') },
            { lat: Number('39.481005'), lng: Number('-0.382011') },
            { lat: Number('39.481262'), lng: Number('-0.381323') },
            { lat: Number('39.481224'), lng: Number('-0.381227') },
            { lat: Number('39.481391'), lng: Number('-0.380749') },
            { lat: Number('39.481351'), lng: Number('-0.380740') },
            { lat: Number('39.481457'), lng: Number('-0.380332') },
            { lat: Number('39.481529'), lng: Number('-0.380252') },
            { lat: Number('39.481718'), lng: Number('-0.380281') },
         ],
        fin: {lat: Number('39.481833'), lng: Number('-0.380310')},
        imagen: "imagenes/imagenes-aventuras/petxina_en_el_rio.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_artes_down.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente_san_jose_subida.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_san_jose_subida_2.jpg",
        imagen5: "imagenes/imagenes-aventuras/puente_san_jose.jpg",
        imagen6: "imagenes/imagenes-aventuras/puente_san_jose_close.jpg",
        video: "",
    },
    // Parada 25: Puente de San José (Párrafos: 637, 638, 472)
    {
        id: "Av4-P-23",
        tipo: "parada",
        parada: 25, // mapa número 19
        mapa_numero: 19,
        nombre: "Puente de San José",
        coordenadas: { lat: Number('39.481833'), lng: Number('-0.380310') },
        imagen: "imagenes/imagenes-aventuras/puente_san_jose_close.jpg",
    },
    // Tramo 17: Puente de San José → Torres de Serranos (Párrafos: 639)
    {
        id: "Av4-TR-17",
        tipo: "tramo",
        tramo: 17, // De mapa número 19 a mapa número 1
        mapa_numero: "19→1",
        nombre: "Puente de San José → Torres de Serranos",
        inicio: { lat: Number('39.481833'), lng: Number('-0.380310') },
         waypoints: [
            { lat: Number('39.481700'), lng: Number('-0.380243') },
            { lat: Number('39.481522'), lng: Number('-0.380226') },
            { lat: Number('39.481451'), lng: Number('-0.379918') },
            { lat: Number('39.481368'), lng: Number('-0.379606') },
            { lat: Number('39.481290'), lng: Number('-0.379375') },
            { lat: Number('39.481268'), lng: Number('-0.379108') },
            { lat: Number('39.481158'), lng: Number('-0.378914') },
            { lat: Number('39.481056'), lng: Number('-0.378862') },
            { lat: Number('39.480855'), lng: Number('-0.378313') },
            { lat: Number('39.480595'), lng: Number('-0.377843') },
            { lat: Number('39.480194'), lng: Number('-0.377140') },
            { lat: Number('39.479709'), lng: Number('-0.376291') },
         ],
        fin: {lat: Number('39.479635'), lng: Number('-0.375845') },
        imagen: "imagenes/imagenes-aventuras/puente_san_jose.jpg",
        imagen2: "imagenes/imagenes-aventuras/ivam_serranos_2.jpg",
        imagen3: "imagenes/imagenes-aventuras/ivam_serranos_3.jpg",
        imagen4: "imagenes/imagenes-aventuras/ivam_serranos_4.jpg",
        imagen5: "imagenes/imagenes-aventuras/ivam_serranos_5.jpg",
        imagen6: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        video: "",
    },
    // Parada 26: Torres de Serranos Front (Reto 17) (Párrafos: 471, 687, 145, 126, 233 )
    {
        id: "Av4-P-24",
        tipo: "parada",
        parada: 26, // mapa número 1
        mapa_numero: 1,
        nombre: "Torres de Serranos",
        coordenadas: { lat: Number('39.479635'), lng: Number('-0.375845') },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
    },
    // Tramo 18: Torres de Serranos Front → Centro Puente de Serranos 1 (Párrafos: 688)
    {
        id: "Av4-TR-18",
        tipo: "tramo",
        tramo: 18, // De mapa número 1 a sin número de mapa (Centro Puente de Serranos)
        mapa_numero: "1→-",
        nombre: "Torres de Serranos → Centro Puente de Serranos",
        inicio: { lat: Number('39.479635'), lng: Number('-0.375845') },
        waypoints:
        [
            { lat: Number('39.480260'), lng: Number('-0.375530') },
        ],
        fin: { lat: Number('39.480640'), lng: Number('-0.375340') },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_serranos_2.jpg",
        imagen3:"imagenes/imagenes-aventuras/puente_serranos.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_serranos_3.jpg",
        video: "",
    },
    // Parada 27: Centro Puente Serranos (Párrafos: 234, 34-B, 235)
    {
        id: "Av4-P-25",
        tipo: "parada",
        parada: 27, // Sin número de mapa
        mapa_numero: null,
        nombre: "Centro Puente Serranos",
        coordenadas: { lat: Number('39.480640'), lng: Number('-0.375340') },
        imagen: "imagenes/imagenes-aventuras/museo_bellas_artes.jpg",
    },
    // Tramo 19: Centro Puente de Serranos → Ruinas del Jardín del Turia (Párrafos: 644, 33-C)
    {
        id: "Av4-TR-19",
        tipo: "tramo",
        tramo: 19, // De sin número de mapa (Centro Puente de Serranos) a mapa número 24
        mapa_numero: "-→24",
        nombre: "Centro Puente de Serranos → Ruinas del Jardín del Turia",
        inicio: { lat: Number('39.480640'), lng: Number('-0.375340') },
        waypoints:
        [
            { lat: Number('39.480020'), lng: Number('-0.375640') },
            { lat: Number('39.479570'), lng: Number('-0.375880') },
            { lat: Number('39.479480'), lng: Number('-0.375800') },
            { lat: Number('39.479270'), lng: Number('-0.375330') },
            { lat: Number('39.479240'), lng: Number('-0.375220') },
            { lat: Number('39.479170'), lng: Number('-0.375060') },
            { lat: Number('39.479110'), lng: Number('-0.374920') },
            { lat: Number('39.479060'), lng: Number('-0.374840') },
            { lat: Number('39.479040'), lng: Number('-0.374780') },
            { lat: Number('39.478980'), lng: Number('-0.374680') },
            { lat: Number('39.478930'), lng: Number('-0.374560') },
            { lat: Number('39.478870'), lng: Number('-0.374430') },
            { lat: Number('39.478640'), lng: Number('-0.373910') },
            { lat: Number('39.478490'), lng: Number('-0.373540') },
            { lat: Number('39.478350'), lng: Number('-0.373220') },
            { lat: Number('39.478150'), lng: Number('-0.372920') },
            { lat: Number('39.478210'), lng: Number('-0.372790') },
            { lat: Number('39.477920'), lng: Number('-0.372320') },
            { lat: Number('39.477720'), lng: Number('-0.371990') },
            { lat: Number('39.477720'), lng: Number('-0.371970') },
            { lat: Number('39.477730'), lng: Number('-0.371950') },
            { lat: Number('39.477790'), lng: Number('-0.371910') },
            { lat: Number('39.477890'), lng: Number('-0.371830') },
            { lat: Number('39.477960'), lng: Number('-0.371780') },
            { lat: Number('39.477870'), lng: Number('-0.371610') },
            { lat: Number('39.477790'), lng: Number('-0.371490') },
        ],
        fin: { lat: Number('39.477730'), lng: Number('-0.371390') },
        imagen: "imagenes/imagenes-aventuras/puente_serranos_3.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_serranos.jpg",
        imagen3: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        imagen4: "imagenes/imagenes-aventuras/serranos_pont_fusta.jpg",
        imagen5: "imagenes/imagenes-aventuras/pont_fusta.jpg",
        imagen6: "imagenes/imagenes-aventuras/museo_bellas_artes.jpg",
        imagen7: "imagenes/imagenes-aventuras/bajada_rio_ruinas.jpg",
        imagen8: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
        video: "",
    },
    // Parada 28: Ruinas del Jardín del Turia (Reto18puzzle PZ-13) (Párrafos: 705, 703, 645, 646)
    {
        id: "Av4-P-26",
        tipo: "parada",
        parada: 28, // mapa número 24
        mapa_numero: 24,
        nombre: "Ruinas del Jardín del Turia",
        coordenadas: { lat: Number('39.477730'), lng: Number('-0.371390') },
        imagen: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
    },
    // Tramo 20: Ruinas del Jardín del Turia → Jardines del Real (Viveros) (Párrafos: 647, 36)
    {
        id: "Av4-TR-20",
        tipo: "tramo",
        tramo: 20, // De mapa número 24 → mapa número 25
        mapa_numero: "24→25",
        nombre: "Ruinas del Jardín del Turia → Jardines del Real (Viveros)",
        inicio: { lat: Number('39.477730'), lng: Number('-0.371390') },
        waypoints:
        [
            { lat: Number('39.477960'), lng: Number('-0.371780') },
            { lat: Number('39.477840'), lng: Number('-0.371870') },
            { lat: Number('39.477740'), lng: Number('-0.371940') },
            { lat: Number('39.477700'), lng: Number('-0.371860') },
            { lat: Number('39.477570'), lng: Number('-0.371670') },
            { lat: Number('39.477460'), lng: Number('-0.371500') },
            { lat: Number('39.477300'), lng: Number('-0.371230') },
            { lat: Number('39.476920'), lng: Number('-0.370670') },
            { lat: Number('39.476330'), lng: Number('-0.369870') },
            { lat: Number('39.476030'), lng: Number('-0.369470') },
            { lat: Number('39.476310'), lng: Number('-0.369180') },
            { lat: Number('39.476570'), lng: Number('-0.368880') },
            { lat: Number('39.476800'), lng: Number('-0.368630') },
            { lat: Number('39.476980'), lng: Number('-0.368440') },
            { lat: Number('39.477050'), lng: Number('-0.368550') },
            { lat: Number('39.477120'), lng: Number('-0.368680') },
            { lat: Number('39.477140'), lng: Number('-0.368650') },
            { lat: Number('39.477090'), lng: Number('-0.368550') },
            { lat: Number('39.477050'), lng: Number('-0.368460') },
            { lat: Number('39.477080'), lng: Number('-0.368440') },
            { lat: Number('39.477110'), lng: Number('-0.368470') },
            { lat: Number('39.477180'), lng: Number('-0.368410') },
            { lat: Number('39.477270'), lng: Number('-0.368330') },
            { lat: Number('39.477300'), lng: Number('-0.368330') },
            { lat: Number('39.477450'), lng: Number('-0.368400') },
        ],
        fin: { lat: Number('39.477480'), lng: Number('-0.368360') },
        imagen: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_real.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente_real_down.jpg",
        imagen4: "imagenes/imagenes-aventuras/viveros-tunel_turia.jpg",
        imagen5: "imagenes/imagenes-aventuras/viveros_tunel_2.jpg",
        imagen6: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        video: "",
    },
    // Parada 29: Jardines del Real (Viveros) (Párrafos: 648)
    {
        id: "Av4-P-27",
        tipo: "parada",
        parada: 29, // mapa número 25
        mapa_numero: 25,
        nombre: "Jardines del Real (Viveros)",
        coordenadas: { lat: Number('39.477480'), lng: Number('-0.368360') },
        imagen: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        imagen2: "imagenes/imagenes-aventuras/mapa_rosaleda_viveros.png",
        imagen3: "imagenes/imagenes-aventuras/viveros_plano.png",
    },
    // Tramo 21: Jardines del Real (Viveros) → Paseo de las Palmeras (Párrafos:649 )
    {
        id: "Av4-TR-21",
        tipo: "tramo",
        tramo: 21, // De mapa número 25 a mapa número v1
        mapa_numero: "25→v1",
        nombre: "Jardines del Real (Viveros) → Paseo de las Palmeras",
        inicio: { lat: Number('39.477480'), lng: Number('-0.368360') },
         waypoints: [
            { lat: Number('39.477930'), lng: Number('-0.368126') },
         ],
        fin: {lat: Number('39.478239'), lng: Number('-0.367925') },
        imagen: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
        imagen3: "imagenes/imagenes-aventuras/viveros_ paseo_palmeras.jpg",
        video: "",
    },
    // Parada 30: Ruinas del Palacio real de Valencia y Montículo del General Javier Elio (Párrafos: viv1, viv2)
    {
        id: "Av4-P-28",
        tipo: "parada",
        parada: 30, // mapa número v2-v3
        mapa_numero: "v2→v3",
        nombre: "Ruinas del Palacio real de Valencia y Montículo del General Javier Elio",
        coordenadas: { lat: Number('39.478239'), lng: Number('-0.367925') },
        imagen: "imagenes/imagenes-aventuras/viveros_maqueta_palacio.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_restos_palacio.jpg",
        imagen3: "imagenes/imagenes-aventuras/viveros_monte_elio.jpg",
        imagen4: "imagenes/imagenes-aventuras/viveros_plano.png",
    },
    // Tramo 22: Ruinas del Palacio real de Valencia y Montículo del General Javier Elio → Circuito urbano de educación vial (Párrafos: viv3)
    {
        id: "Av4-TR-22",
        tipo: "tramo",
        tramo: 22, // De mapa número v3 a mapa número v5
        mapa_numero: "v3→v5",
        nombre: "Ruinas del Palacio real de Valencia y Montículo del General Javier Elio → Circuito urbano de educación vial",
        inicio: { lat: Number('39.478239'), lng: Number('-0.367925') },
         waypoints: [
            { lat: Number('39.478744'), lng: Number('-0.367728') },
            { lat: Number('39.479185'), lng: Number('-0.367502') },
            { lat: Number('39.479598'), lng: Number('-0.367292') },
         ],
        fin: {lat: Number('39.479742'), lng: Number('-0.367276') },
        imagen: "imagenes/imagenes-aventuras/viveros_monte_elio.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_casa_jardinero.jpg",
        imagen3: "imagenes/imagenes-aventuras/viveros_libre_4.jpg",
        imagen4: "imagenes/imagenes-aventuras/viveros_libre_2.jpg",
        imagen5: "imagenes/imagenes-aventuras/viveros_ circuito_vial.jpg",
        video: "",
    },
    // Tramo 23: Circuito urbano de educación vial → Museo de Ciencias Naturales (Párrafos: viv4)
    {
        id: "Av4-TR-23",
        tipo: "tramo",
        tramo: 23, // De mapa número v5 a mapa número v8
        mapa_numero: "v5→v8",
        nombre: "Circuito urbano de educación vial → Museo de Ciencias Naturales",
        inicio: { lat: Number('39.479742'), lng: Number('-0.367276') },
         waypoints: [
            { lat: Number('39.479742'), lng: Number('-0.367276') },
            { lat: Number('39.479497'), lng: Number('-0.367881') },
         ],
        fin: { lat: Number('39.479455'), lng: Number('-0.368610') },
        imagen: "imagenes/imagenes-aventuras/viveros_ circuito_vial.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_paseo_poetas_2.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_pajarera.jpg",
        imagen3: "imagenes/imagenes-aventuras/viveros_plano.png",
        imagen4: "imagenes/imagenes-aventuras/viveros_alqueria_canet.jpg",
        imagen5: "imagenes/imagenes-aventuras/viveros_museo_ciencias_naturales.jpg",
        video: "",
    },
    // Parada 31: Museo de Ciencias Naturales (Reto 19) (Párrafos: viv6, viv5)
    {
        id: "Av4-P-29",
        tipo: "parada",
        parada: 31, // mapa número v8
        mapa_numero: "v8",
        nombre: "Museo de Ciencias Naturales",
        coordenadas: { lat: Number('39.479455'), lng: Number('-0.368610') },
        imagen: "imagenes/imagenes-aventuras/viveros_museo_ciencias_naturales.jpg",
    },
    // Tramo 24: Museo de Ciencias Naturales → Jardín de la Rosaleda (Párrafos: viv7)
    {
        id: "Av4-TR-24",
        tipo: "tramo",
        tramo: 24, // De mapa número v8 a mapa número v10
        mapa_numero: "v8→v10",
        nombre: "Museo de Ciencias Naturales → Jardín de la Rosaleda",
        inicio: { lat: Number('39.479455'), lng: Number('-0.368610') },
         waypoints: [
            { lat: Number('39.480270'), lng: Number('-0.368565') },
            { lat: Number('39.480353'), lng: Number('-0.368423') },
            { lat: Number('39.480822'), lng: Number('-0.368408') },
         ],
        fin: { lat: Number('39.480912'), lng: Number('-0.368572') },
        imagen: "imagenes/imagenes-aventuras/viveros_museo_ciencias_naturales.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
        imagen3: "imagenes/imagenes-aventuras/viveros_jardines_versalles.jpg",
        imagen4: "imagenes/imagenes-aventuras/mapa_rosaleda_viveros.png",
        imagen5: "imagenes/imagenes-aventuras/viveros_rosaleda.jpg",
        video: "",
    },
    // Parada 32: Jardín de la Rosaleda (Párrafos: viv9, viv10)
    {
        id: "Av4-P-30",
        tipo: "parada",
        parada: 32, // mapa número v10
        mapa_numero: "v10",
        nombre: "Jardín de la Rosaleda",
        coordenadas: { lat: Number('39.480912'), lng: Number('-0.368572') },
        imagen: "imagenes/imagenes-aventuras/viveros_rosaleda.jpg",
        imagen2: "imagenes/imagenes-aventuras/mapa_rosaleda_viveros.png",
        imagen3: "imagenes/imagenes-aventuras/viveros_libre_6.jpg",
        imagen4: "imagenes/imagenes-aventuras/viveros_libre_7.jpg",
        imagen5: "imagenes/imagenes-aventuras/viveros_libre_8.jpg",
    },
    // Parada 33: Jardines del Real (Viveros) 2 (Párrafos: viv11)
    {
        id: "Av4-P-31",
        tipo: "parada",
        parada: 33, // mapa número v7-v8
        mapa_numero: "v7-v8",
        nombre: "Jardines del Real (Viveros) 2",
        coordenadas: { lat: Number('39.479455'), lng: Number('-0.368610') },
        imagen: "imagenes/imagenes-aventuras/viveros_museo_ciencias_naturales.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
    },
    // Tramo 25:Alquería de Canet y Museo de Ciencias Naturales → Estanque de los patos (Párrafos: viv11-B)
    {
        id: "Av4-TR-25",
        tipo: "tramo",
        tramo: 25, // De mapa número v7-v8 a mapa número v11
        mapa_numero: "v7-v8→v11",
        nombre: "Alquería de Canet y Museo de Ciencias Naturales → Estanque de los patos",
        inicio: { lat: Number('39.479455'), lng: Number('-0.368610') },
         waypoints: [
            { lat: Number('39.478955'), lng: Number('-0.368506') },
            { lat: Number('39.478695'), lng: Number('-0.368994') },
            { lat: Number('39.478746'), lng: Number('-0.369329') },
         ],
        fin: { lat: Number('39.478899'), lng: Number('-0.369452') },
        imagen: "imagenes/imagenes-aventuras/viveros_museo_ciencias_naturales.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
        imagen3: "imagenes/imagenes-aventuras/viveros_patos.jpg",
        video: "",
    },
    // Parada 34: Estanque de los patos (Reto 20) (Párrafos: viv11-C)
    {
        id: "Av4-P-32",
        tipo: "parada",
        parada: 34, // mapa número v11
        mapa_numero: "v11",
        nombre: "Estanque de los patos",
        coordenadas: { lat: Number('39.478899'), lng: Number('-0.369452') },
        imagen: "imagenes/imagenes-aventuras/viveros_patos.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
    },
    // Tramo 26: Estanque de los patos → Portón del Convento de San Julián (Párrafos: viv13)
    {
        id: "Av4-TR-26",
        tipo: "tramo",
        tramo: 26, // De mapa número v11 a mapa número v12
        mapa_numero: "v11→v12",
        nombre: "Estanque de los patos → Portón del Convento de San Julián",
        inicio: { lat: Number('39.478899'), lng: Number('-0.369452') },
         waypoints: [
            { lat: Number('39.478727'), lng: Number('-0.369513') },
            { lat: Number('39.478692'), lng: Number('-0.369677') },
            { lat: Number('39.478647'), lng: Number('-0.369797') },
         ],
        fin: { lat: Number('39.478579'), lng: Number('-0.369801') },
        imagen: "imagenes/imagenes-aventuras/viveros_patos.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
        imagen3: "imagenes/imagenes-aventuras/viveros_san_julian.jpg",
        video: "",
    },
    // Parada 35: Portón del Convento de San Julián (Párrafos: viv14, viv15)
    {
        id: "Av4-P-33",
        tipo: "parada",
        parada: 35, // mapa número v12
        mapa_numero: "v12",
        nombre: "Portón del Convento de San Julián",
        coordenadas: { lat: Number('39.478579'), lng: Number('-0.369801') },
        imagen: "imagenes/imagenes-aventuras/viveros_san_julian.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
        imagen3: "imagenes/imagenes-aventuras/viveros_libre_10.jpg",
        imagen4: "imagenes/imagenes-aventuras/viveros_paseo_poetas.jpg",
    },
    // Tramo 27: Entrada Jardínes del Real (Viveros) → Puente del Real (Párrafos: 650, 37)
    {
        id: "Av4-TR-27",
        tipo: "tramo",
        tramo: 27, // De mapa número 25 a mapa número 26
        mapa_numero: "25→26",
        nombre: "Entrada Jardínes del Real (Viveros) → Puente del Real",
        inicio: { lat: Number('39.477480'), lng: Number('-0.368360') },
         waypoints: [
            { lat: Number('39.477386'), lng: Number('-0.368269') },
            { lat: Number('39.477270'), lng: Number('-0.368000') },
            { lat: Number('39.477371'), lng: Number('-0.367701') },
            { lat: Number('39.477254'), lng: Number('-0.367581') },
            { lat: Number('39.477201'), lng: Number('-0.367353') },
         ],
        fin: { lat: Number('39.476941'), lng: Number('-0.367427') },
        imagen: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
        imagen3: "imagenes/imagenes-aventuras/puente_real_up.jpg",
        video: "",
    },
    // Parada 36: Puente del Real (Párrafos: 651, 652, 653)
    {
        id: "Av4-P-34",
        tipo: "parada",
        parada: 36, // mapa número v13
        mapa_numero: 26,
        nombre: "Puente del Real",
        coordenadas: { lat: Number('39.476941'), lng: Number('-0.367427') },
        imagen: "imagenes/imagenes-aventuras/puente_real_up.jpg",
    },
    // Tramo 28: Puente del Real → Torres de Serranos (Final) (Párrafos: 2-E )
    {
        id: "Av4-TR-28",
        tipo: "tramo",
        tramo: 28, // De mapa número 26 a mapa número 1
        mapa_numero: "26→1",
        nombre: "Puente del Real → Torres de Serranos",
        inicio: { lat: Number('39.476941'), lng: Number('-0.367427')  },
         waypoints: [
            { lat: Number('39.476993'), lng: Number('-0.367660') },
            { lat: Number('39.477032'), lng: Number('-0.368000') },
            { lat: Number('39.476923'), lng: Number('-0.368213') },
            { lat: Number('39.476530'), lng: Number('-0.368623') },
            { lat: Number('39.475984'), lng: Number('-0.369195') },
            { lat: Number('39.475791'), lng: Number('-0.369413') },
            { lat: Number('39.475839'), lng: Number('-0.369686') },
            { lat: Number('39.475940'), lng: Number('-0.369873') },
            { lat: Number('39.476392'), lng: Number('-0.370329') },
            { lat: Number('39.476845'), lng: Number('-0.370805') },
            { lat: Number('39.477157'), lng: Number('-0.371197') },
            { lat: Number('39.477482'), lng: Number('-0.371722') },
            { lat: Number('39.477901'), lng: Number('-0.372413') },
            { lat: Number('39.478273'), lng: Number('-0.373032') },
            { lat: Number('39.478507'), lng: Number('-0.373466') },
            { lat: Number('39.478772'), lng: Number('-0.374087') },
            { lat: Number('39.478993'), lng: Number('-0.374631') },
            { lat: Number('39.479076'), lng: Number('-0.374825') },
            { lat: Number('39.478975'), lng: Number('-0.374995') },
            { lat: Number('39.478984'), lng: Number('-0.375453') },
            { lat: Number('39.478957'), lng: Number('-0.376069') },
            { lat: Number('39.478845'), lng: Number('-0.376213') },
         ],
        fin: { lat: Number('39.478590'), lng: Number('-0.376330')},
        imagen: "imagenes/imagenes-aventuras/puente_real_up.jpg",
        imagen2: "imagenes/imagenes-aventuras/pont_real_serranos.jpg",
        imagen3: "imagenes/imagenes-aventuras/iglesia_del_temple.jpg",
        imagen4: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
        video: "",
    },
    // Parada 35 - FINAL: Torres de Serranos Final (Reto21Puzzle PZ-05) (Párrafos: 475, 503, 507, 526,)
    {
        id: "Av4-P-35",
        tipo: "parada",
        parada: 37, // mapa número 1
        mapa_numero: 1,
        nombre: "Torres de Serranos Final",
        coordenadas: { lat: Number('39.478590'), lng: Number('-0.376330') },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg"
    },
    ]
    }
  },
  Aventura5: {
    "coordenadas-hijo2.html": {
      coordenadas: [
        // poner las coordenadas específicas de los puntos a visitar del mapa. dibujarReferencias() ignora automáticamente las que tengan coordenadas: null.
    {
        tipo: "referencia",
        id: "REF-1",
        mapa_numero: 1,
        coordenadas: { lat: Number('39.479210'), lng: Number('-0.376040') },
        nombre: "Torres de Serranos",
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-2",
        mapa_numero: 2,
        coordenadas: { lat: Number('39.480662'), lng: Number('-0.375352') },
        nombre: "Puente de Serranos",
        imagen: "imagenes/imagenes-aventuras/puente_serranos.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-3",
        mapa_numero: 3,
        coordenadas: { lat: Number('39.477850'), lng: Number('-0.371290') },
        nombre: "Ruinas en el Jardín del Turia",
        imagen: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-4",
        mapa_numero: 4,
        coordenadas: { lat: Number('39.477473'), lng: Number('-0.368361') },
        nombre: "Jardines del Real (Viveros)",
        imagen: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-5",
        mapa_numero: 5,
        coordenadas: { lat: Number('39.473200'), lng: Number('-0.365830') },
        nombre: "Puente de la Exposición",
        imagen: "imagenes/imagenes-aventuras/pont_de_la_exposicio.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-6",
        mapa_numero: 6,
        coordenadas: { lat: Number('39.471100'), lng: Number('-0.364240') },
        nombre: "Puente de las Flores",
        imagen: "imagenes/imagenes-aventuras/puente_flores-down.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-7",
        mapa_numero: 7,
        coordenadas: { lat: Number('39.472110'), lng: Number('-0.368480') },
        nombre: "Puerta del Mar",
        imagen: "imagenes/imagenes-aventuras/puerta_mar.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-8",
        mapa_numero: 8,
        coordenadas: { lat: Number('39.470246'), lng: Number('-0.369961') },
        nombre: "Casa de los Dragones",
        imagen: "imagenes/imagenes-aventuras/casa_dragones.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-9",
        mapa_numero: 9,
        coordenadas: { lat: Number('39.468766'), lng: Number('-0.368764') },
        nombre: "Mercado de Colón",
        imagen: "imagenes/imagenes-aventuras/mercado_colon.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-10",
        mapa_numero: 10,
        coordenadas: { lat: Number('39.470231'), lng: Number('-0.370702') },
        nombre: "Antigua Puerta Judía",
        imagen: "imagenes/imagenes-aventuras/ruinas_calle_colon.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-11",
        mapa_numero: 11,
         coordenadas: { lat: Number('39.466660'), lng: Number('-0.376140') },
        nombre: "Plaza de Toros ðŸ‚",
        imagen: "imagenes/imagenes-aventuras/Plaza_Toros.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-12",
        mapa_numero: 12,
       coordenadas: { lat: Number('39.467080'), lng: Number('-0.377190') },
        nombre: "Estación del Norte 🚂",
        imagen: "imagenes/imagenes-aventuras/Estacion_Norte.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-13",
        mapa_numero: 13,
        coordenadas: { lat: Number('39.470752'), lng: Number('-0.381589') },
        nombre: "Biblioteca del Hospital",
        imagen: "imagenes/imagenes-aventuras/biblioteca_hospital.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-14",
        mapa_numero: 14,
        coordenadas: { lat: Number('39.470915'), lng: Number('-0.380936') },
        nombre: "Museo y Colegio del Arte Mayor de la Seda",
        imagen: "imagenes/imagenes-aventuras/museo_de_la_seda.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-15",
        mapa_numero: 15,
        coordenadas: { lat: Number('39.473700'), lng: Number('-0.378680') },
        nombre: "Mercado Central",
        imagen: "imagenes/imagenes-aventuras/mercado_central.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-",
        mapa_numero: 16,
        coordenadas: { lat: Number('39.474380'), lng: Number('-0.378340') },
        nombre: "Lonja de la Seda",
        imagen: "imagenes/imagenes-aventuras/lonja.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-17",
        mapa_numero: 17,
        coordenadas: { lat: Number('39.475757'), lng: Number('-0.384049') },
        nombre: "Torres de Quart",
        imagen: "imagenes/imagenes-aventuras/torres_de_quart.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-18",
        mapa_numero: 18,
        coordenadas: { lat: Number('39.478245'), lng: Number('-0.383135') },
        nombre: "Museo de Prehistória de Valencia",
        imagen: "",
    },
    {
        tipo: "referencia",
        id: "REF-19",
        mapa_numero: 19,
        coordenadas: { lat: Number('39.478241'), lng: Number('-0.383093') },
        nombre: "Museo de Etnología de Valencia",
        imagen: "",
    },
    {
        tipo: "referencia",
        id: "REF-20",
        mapa_numero: 20,
        coordenadas: { lat: Number('39.478197'), lng: Number('-0.382608') },
        nombre: "Iglesia de la Milagrosa",
        imagen: "imagenes/imagenes-aventuras/iglesia_de_la_milagrosa.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-21",
        mapa_numero: 21,
        coordenadas: { lat: Number('39.479941'), lng: Number('-0.382899') },
        nombre: "Instituto Valenciano de Arte Moderno (IVAM)",
        imagen: "imagenes/imagenes-aventuras/ivam.jpg",
    },

      // ────---------------------------------------------

    // Coordenadas completas Aventura 5
        // Parada 0 - Torres de Serranos (start) (Reto 3) (Párrafos: 223, 226, 228)
    {
        id: "Av5-P-0",
        tipo: "inicio",
        parada: 2, // mapa número 1
        mapa_numero: 1,
        nombre: "Torres de Serranos (start)",
        coordenadas: { lat: Number('39.478760'), lng: Number('-0.376260') },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
    },

    // Tramo 1: Torres de Serranos → Plaza de la Crída (Torres de Serranos Front)(Párrafos: 229, 5)
    {
        id: "Av5-TR-1",
        tipo: "tramo",
        tramo: 1, // De mapa número 1 a mapa número 2
        mapa_numero: "1→2",
        nombre: "Torres de Serranos → Plaza de la Crída",
        inicio: { lat: Number('39.478760'), lng: Number('-0.376260') },
         waypoints: [
            { lat: Number('39.479050'), lng: Number('-0.376130') },
            { lat: Number('39.479341'), lng: Number('-0.376408') },
            { lat: Number('39.479500'), lng: Number('-0.376210') },
            { lat: Number('39.479430'), lng: Number('-0.375970') }
        ],
        fin: { lat: Number('39.479590'), lng: Number('-0.375830') },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
        imagen2: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        video: "",
    },
    // Parada 3: Plaza de la Crída (Torres de Serranos Front) (Reto 4) (Párrafos: 126, 233, 641, 642, 643, 562, 689)
    {
        id: "Av5-P-1",
        tipo: "parada",
        parada: 3, // mapa número 2
        mapa_numero: 2,
        nombre: "Plaza de la Crída",
        coordenadas: { lat: Number('39.480620'), lng: Number('-0.375350') },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
    },
    // Tramo 2: Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos 1 (Párrafos: 230, 231)
    {
        id: "Av5-TR-2",
        tipo: "tramo",
        tramo: 2, // De mapa número 2 a sin número de mapa (Centro Puente de Serranos)
        mapa_numero: "2→-",
        nombre: "Plaza de la Crída → Centro Puente de Serranos",
        inicio: { lat: Number('39.480620'), lng: Number('-0.375350') },
        waypoints:
        [
            { lat: Number('39.480260'), lng: Number('-0.375530') },
        ],
        fin: { lat: Number('39.480620'), lng: Number('-0.375350') },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_serranos_2.jpg",
        imagen3:"imagenes/imagenes-aventuras/puente_serranos.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_serranos_3.jpg",
        video: "",
    },
    // Parada 4: Centro Puente Serranos 1 (Reto 5) (Párrafos: 608, 609, 610)
    {
        id: "Av5-P-2",
        tipo: "parada",
        parada: 4, // Sin número de mapa
        mapa_numero: null,
        nombre: "Centro Puente Serranos",
        coordenadas: { lat: Number('39.480620'), lng: Number('-0.375350') },
        imagen: "imagenes/imagenes-aventuras/puente_serranos_3.jpg",
    },
    // Parada 5: Centro Puente Serranos 2 (Párrafos: 602, 232-B, 234, 235, 224)
    {
        id: "Av5-P-3",
        tipo: "parada",
        parada: 5, // Sin número de mapa
        mapa_numero: null,
        nombre: "Centro Puente Serranos 2",
        coordenadas: { lat: Number('39.480640'), lng: Number('-0.375340') },
        imagen: "imagenes/imagenes-aventuras/museo_bellas_artes.jpg",
    },
    // Tramo 3: Centro Puente de Serranos 2 → Ruinas del Jardín del Turia (Párrafos: 236, 644, 6)
    {
        id: "Av5-TR-3",
        tipo: "tramo",
        tramo: 3, // De sin número de mapa (Centro Puente de Serranos 2) a mapa número 3
        mapa_numero: "-→3",
        nombre: "Centro Puente de Serranos 2 → Ruinas del Jardín del Turia",
        inicio: { lat: Number('39.480640'), lng: Number('-0.375340') },
        waypoints:
        [
            { lat: Number('39.480020'), lng: Number('-0.375640') },
            { lat: Number('39.479570'), lng: Number('-0.375880') },
            { lat: Number('39.479480'), lng: Number('-0.375800') },
            { lat: Number('39.479270'), lng: Number('-0.375330') },
            { lat: Number('39.479240'), lng: Number('-0.375220') },
            { lat: Number('39.479170'), lng: Number('-0.375060') },
            { lat: Number('39.479110'), lng: Number('-0.374920') },
            { lat: Number('39.479060'), lng: Number('-0.374840') },
            { lat: Number('39.479040'), lng: Number('-0.374780') },
            { lat: Number('39.478980'), lng: Number('-0.374680') },
            { lat: Number('39.478930'), lng: Number('-0.374560') },
            { lat: Number('39.478870'), lng: Number('-0.374430') },
            { lat: Number('39.478640'), lng: Number('-0.373910') },
            { lat: Number('39.478490'), lng: Number('-0.373540') },
            { lat: Number('39.478350'), lng: Number('-0.373220') },
            { lat: Number('39.478150'), lng: Number('-0.372920') },
            { lat: Number('39.478210'), lng: Number('-0.372790') },
            { lat: Number('39.477920'), lng: Number('-0.372320') },
            { lat: Number('39.477720'), lng: Number('-0.371990') },
            { lat: Number('39.477720'), lng: Number('-0.371970') },
            { lat: Number('39.477730'), lng: Number('-0.371950') },
            { lat: Number('39.477790'), lng: Number('-0.371910') },
            { lat: Number('39.477890'), lng: Number('-0.371830') },
            { lat: Number('39.477960'), lng: Number('-0.371780') },
            { lat: Number('39.477870'), lng: Number('-0.371610') },
            { lat: Number('39.477790'), lng: Number('-0.371490') },
        ],
        fin: { lat: Number('39.477730'), lng: Number('-0.371390') },
        imagen: "imagenes/imagenes-aventuras/puente_serranos_3.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_serranos.jpg",
        imagen3: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        imagen4: "imagenes/imagenes-aventuras/serranos_pont_fusta.jpg",
        imagen5: "imagenes/imagenes-aventuras/pont_fusta.jpg",
        imagen6: "imagenes/imagenes-aventuras/museo_bellas_artes.jpg",
        imagen7: "imagenes/imagenes-aventuras/bajada_rio_ruinas.jpg",
        imagen8: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
        video: "",
    },
    // Parada 6: Ruinas del Jardín del Turia (Párrafos: 704, 703, 645, 646-A)
    {
        id: "Av5-P-4",
        tipo: "parada",
        parada: 6, // mapa número 3
        mapa_numero: 3,
        nombre: "Ruinas del Jardín del Turia",
        coordenadas: { lat: Number('39.477730'), lng: Number('-0.371390') },
        imagen: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
    },
    // Tramo 4: Ruinas del Jardín del Turia → Jardines del Real (Viveros) (Párrafos: 647, 7)
    {
        id: "Av5-TR-4",
        tipo: "tramo",
        tramo: 4, // De mapa número 3 → mapa número 4
        mapa_numero: "3→4",
        nombre: "Ruinas del Jardín del Turia → Jardines del Real (Viveros)",
        inicio: { lat: Number('39.477730'), lng: Number('-0.371390') },
        waypoints:
        [
            { lat: Number('39.477960'), lng: Number('-0.371780') },
            { lat: Number('39.477840'), lng: Number('-0.371870') },
            { lat: Number('39.477740'), lng: Number('-0.371940') },
            { lat: Number('39.477700'), lng: Number('-0.371860') },
            { lat: Number('39.477570'), lng: Number('-0.371670') },
            { lat: Number('39.477460'), lng: Number('-0.371500') },
            { lat: Number('39.477300'), lng: Number('-0.371230') },
            { lat: Number('39.476920'), lng: Number('-0.370670') },
            { lat: Number('39.476330'), lng: Number('-0.369870') },
            { lat: Number('39.476030'), lng: Number('-0.369470') },
            { lat: Number('39.476310'), lng: Number('-0.369180') },
            { lat: Number('39.476570'), lng: Number('-0.368880') },
            { lat: Number('39.476800'), lng: Number('-0.368630') },
            { lat: Number('39.476980'), lng: Number('-0.368440') },
            { lat: Number('39.477050'), lng: Number('-0.368550') },
            { lat: Number('39.477120'), lng: Number('-0.368680') },
            { lat: Number('39.477140'), lng: Number('-0.368650') },
            { lat: Number('39.477090'), lng: Number('-0.368550') },
            { lat: Number('39.477050'), lng: Number('-0.368460') },
            { lat: Number('39.477080'), lng: Number('-0.368440') },
            { lat: Number('39.477110'), lng: Number('-0.368470') },
            { lat: Number('39.477180'), lng: Number('-0.368410') },
            { lat: Number('39.477270'), lng: Number('-0.368330') },
            { lat: Number('39.477300'), lng: Number('-0.368330') },
            { lat: Number('39.477450'), lng: Number('-0.368400') },
        ],
        fin: { lat: Number('39.477480'), lng: Number('-0.368360') },
        imagen: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_real.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente_real_down.jpg",
        imagen4: "imagenes/imagenes-aventuras/viveros-tunel_turia.jpg",
        imagen5: "imagenes/imagenes-aventuras/viveros_tunel_2.jpg",
        imagen6: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        video: "",
    },
    // Parada 7: Jardines del Real (Viveros) (Reto6puzzle PZ-08) (Párrafos: 648-B, 649-B)
    {
        id: "Av5-P-5",
        tipo: "parada",
        parada: 7, // mapa número 4
        mapa_numero: 4,
        nombre: "Jardines del Real (Viveros)",
        coordenadas: { lat: Number('39.477480'), lng: Number('-0.368360') },
        imagen: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_ paseo_palmeras.jpg",
        imagen3: "imagenes/imagenes-aventuras/viveros_libre_6.jpg",
        imagen4: "imagenes/imagenes-aventuras/viveros_rosaleda.jpg",
    },
    // Tramo 5: Jardines del Real (Viveros) → Puente de la Exposición (Peineta) (Párrafos: 7-C)
    {
        id: "Av5-TR-5",
        tipo: "tramo",
        tramo: 5, // De mapa número 4 a mapa número 5
        mapa_numero: "4→5",
        nombre: "Jardines del Real (Viveros) → Puente de la Exposición",
        inicio: { lat: Number('39.477480'), lng: Number('-0.368360') },
        waypoints:
        [
            { lat: Number('39.477450'), lng: Number('-0.368410') },
            { lat: Number('39.477280'), lng: Number('-0.368320') },
            { lat: Number('39.477110'), lng: Number('-0.368470') },
            { lat: Number('39.477070'), lng: Number('-0.368430') },
            { lat: Number('39.477060'), lng: Number('-0.368460') },
            { lat: Number('39.477140'), lng: Number('-0.368650') },
            { lat: Number('39.477120'), lng: Number('-0.368690') },
            { lat: Number('39.476980'), lng: Number('-0.368440') },
            { lat: Number('39.476820'), lng: Number('-0.368600') },
            { lat: Number('39.476510'), lng: Number('-0.368340') },
            { lat: Number('39.476450'), lng: Number('-0.367750') },
            { lat: Number('39.475730'), lng: Number('-0.367190') },
            { lat: Number('39.475080'), lng: Number('-0.366690') },
            { lat: Number('39.474330'), lng: Number('-0.366070') },
            { lat: Number('39.473720'), lng: Number('-0.365570') },
            { lat: Number('39.473590'), lng: Number('-0.365850') },

        ],
        fin: { lat: Number('39.473430'), lng: Number('-0.366170') },
        imagen: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_real_down.jpg",
        imagen3: "imagenes/imagenes-aventuras/pont_de_la_exposicio.jpg",
        video: "",
    },
    // Parada 8: Puente de la Exposición (Peineta) (Reto 7) (Párrafos: 237, 1, 145, 239)
    {
        id: "Av5-P-6",
        tipo: "parada",
        parada: 8, // mapa número 5
        mapa_numero: 5,
        nombre: "Puente de la Exposición",
        coordenadas: { lat: Number('39.473430'), lng: Number('-0.366170') },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_exposicio.jpg",
    },
    // Tramo 6: Puente de la Exposición (Peineta) → Puente de las Flores (Párrafos: 605, 225, 10)
    {
        id: "Av5-TR-6",
        tipo: "tramo",
        tramo: 6, // De mapa número 5 a mapa número 6
        mapa_numero: "5→6",
        nombre: "Puente de la Exposición → Puente de las Flores",
        inicio: { lat: Number('39.473430'), lng: Number('-0.366170') },
        waypoints:
        [
            { lat: Number('39.473200'), lng: Number('-0.366530') },
            { lat: Number('39.473010'), lng: Number('-0.366910') },
            { lat: Number('39.472320'), lng: Number('-0.366340') },
            { lat: Number('39.471950'), lng: Number('-0.366030') },
            { lat: Number('39.471280'), lng: Number('-0.365480') },
        ],
        fin: { lat: Number('39.470997'), lng: Number('-0.365178') },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_exposicio.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_flores-down.jpg",
        video: "",
    },
    // Parada 9: Puente de las Flores (Párrafos: 241, 298,)
    {
        id: "Av5-P-7",
        tipo: "parada",
        parada: 9, // mapa número 6
        mapa_numero: 6,
        nombre: "Puente de las Flores",
        coordenadas: { lat: Number('39.470997'), lng: Number('-0.365178') },
        imagen: "imagenes/imagenes-aventuras/puente-de_las_flores.jpg",
    },
     // Tramo 7: Puente de las Flores → Puerta de la Mar (Párrafos: 296-B, 299, 245, 11-D)
    {
        id: "Av5-TR-7",
        tipo: "tramo",
        tramo: 7, // De mapa número 6 a mapa número 7
        mapa_numero: "6→7",
        nombre: "Puente de las Flores → Puerta de la Mar",
        inicio: { lat: Number('39.470997'), lng: Number('-0.365178') },
        waypoints:
        [
            { lat: Number('39.471206'), lng: Number('-0.364502') },
            { lat: Number('39.471506'), lng: Number('-0.363838') },
            { lat: Number('39.471740'), lng: Number('-0.363997') },
            { lat: Number('39.471775'), lng: Number('-0.363853') },
            { lat: Number('39.471569'), lng: Number('-0.363694') },
            { lat: Number('39.471621'), lng: Number('-0.363449') },
            { lat: Number('39.471527'), lng: Number('-0.363495') },
            { lat: Number('39.471063'), lng: Number('-0.364554') },
            { lat: Number('39.470789'), lng: Number('-0.365355') },
            { lat: Number('39.470571'), lng: Number('-0.365544') },
            { lat: Number('39.471018'), lng: Number('-0.366466') },
            { lat: Number('39.471757'), lng: Number('-0.368081') },
            { lat: Number('39.472201'), lng: Number('-0.368001') },
            { lat: Number('39.472377'), lng: Number('-0.368183') },
            { lat: Number('39.472445'), lng: Number('-0.368513') },
            { lat: Number('39.472380'), lng: Number('-0.368756') },
        ],
        fin: { lat: Number('39.472081'), lng: Number('-0.368912')},
        imagen: "imagenes/imagenes-aventuras/puente_flores-down.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_flores_subida.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente_flores_subida_2.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente-de_las_flores.jpg",
        imagen5: "imagenes/imagenes-aventuras/puente_flores_top.jpg",
        imagen6: "imagenes/imagenes-aventuras/puente_flores_agua.jpg",
        imagen7: "imagenes/imagenes-aventuras/puerta_mar.jpg",
        video: "",
    },
     // Parada 10: Puerta de la Mar (Reto 8) (Párrafos: 300, 84, 301, 148, 117)
    {
        id: "Av5-P-8",
        tipo: "parada",
        parada: 10, // mapa número 7
        mapa_numero: "7",
        nombre: "Puerta de la Mar",
        coordenadas:  { lat: Number('39.472081'), lng: Number('-0.368912') },
        imagen: "imagenes/imagenes-aventuras/puerta_mar.jpg",
    },
    // Tramo 8: Puerta de la Mar → Calle Colón → Casa de los Dragones (Párrafos: 303, 12-B)
    {
        id: "Av5-TR-8",
        tipo: "tramo",
        tramo: 8, // De mapa número 7 a mapa número 8
        mapa_numero: "7→8",
        nombre: "Puerta de la Mar → Calle Colón → Casa de los Dragones",
        inicio: { lat: Number('39.472081'), lng: Number('-0.368912') },
        waypoints:
        [
            { lat: Number('39.471813'), lng: Number('-0.368974') },
            { lat: Number('39.471722'), lng: Number('-0.368756') },
            { lat: Number('39.471539'), lng: Number('-0.368960') },
            { lat: Number('39.471278'), lng: Number('-0.369235') },
            { lat: Number('39.470835'), lng: Number('-0.369726') },
            { lat: Number('39.470654'), lng: Number('-0.369927') },
            { lat: Number('39.470436'), lng: Number('-0.370165') },
            { lat: Number('39.470349'), lng: Number('-0.370248') },
            { lat: Number('39.470273'), lng: Number('-0.370069') },
            { lat: Number('39.470139'), lng: Number('-0.369976') },
        ],
        fin: { lat: Number('39.470192'), lng: Number('-0.369919') },
        imagen: "imagenes/imagenes-aventuras/puerta_mar.jpg",
        imagen2: "imagenes/imagenes-aventuras/calle_colon.jpg",
        imagen3: "imagenes/imagenes-aventuras/casa_dragones.jpg",
        video: "",
    },
    // Parada 11: Casa de los Dragones (Reto: 9) (Párrafos: 304, 305)
    {
        id: "Av5-P-9",
        tipo: "parada",
        parada: 11, // mapa número 8
        mapa_numero: 8,
        nombre: "Casa de los Dragones",
        coordenadas: { lat: Number('39.470192'), lng: Number('-0.369919') },
        imagen: "imagenes/imagenes-aventuras/casa_dragones.jpg",
        imagen2: "imagenes/imagenes-aventuras/casa_dragones_dragon.jpg",
    },
    // Tramo 9: Casa de los Dragones → Mercado de Colón (Front) (Párrafos: 306, 13)
    {
        id: "Av5-TR-9",
        tipo: "tramo",
        tramo: 9, // De mapa número 8 a mapa número 9
        mapa_numero: "8→9",
        nombre: "Casa de los Dragones → Mercado de Colón",
        inicio: { lat: Number('39.470192'), lng: Number('-0.369919') },
        waypoints:
        [
            { lat: Number('39.470099'), lng: Number('-0.369940') },
            { lat: Number('39.469897'), lng: Number('-0.369794') },
            { lat: Number('39.469042'), lng: Number('-0.369188') },
            { lat: Number('39.468706'), lng: Number('-0.368954') },
        ],
        fin: { lat: Number('39.468727'), lng: Number('-0.368908') },
        imagen: "imagenes/imagenes-aventuras/casa_dragones.jpg",
        imagen2: "imagenes/imagenes-aventuras/mercado_colon.jpg",
        video: "",
    },
    // Parada 12: Mercado de Colón 1 (Reto: 10) (Párrafos: 308, 309, 310)
    {
        id: "Av5-P-10",
        tipo: "parada",
        parada: 12, // mapa número 9
        mapa_numero: 9,
        nombre: "Mercado de Colón",
        coordenadas: { lat: Number('39.468727'), lng: Number('-0.368908') },
        imagen: "imagenes/imagenes-aventuras/mercado_colon.jpg",
    },
    // Parada 13: Mercado de Colón 2 (Reto: 11) (Párrafos: 311, 312)
    {
        id: "Av5-P-11",
        tipo: "parada",
        parada: 13, // mapa número 9
        mapa_numero: 9,
        nombre: "Mercado de Colón",
        coordenadas: { lat: Number('39.468722'), lng: Number('-0.368902') },
        imagen: "imagenes/imagenes-aventuras/mercado_colon.jpg",
    },
    // Parada 14: Mercado de Colón 3 (Reto: 12) (Párrafos: 313)
    {
        id: "Av5-P-12",
        tipo: "parada",
        parada: 14, // mapa número 9
        mapa_numero: 9,
        nombre: "Mercado de Colón",
        coordenadas: { lat: Number('39.468712'), lng: Number('-0.368897') },
        imagen: "imagenes/imagenes-aventuras/mercado_colon.jpg",
    },
    // Tramo 10: Mercado de Colón Front → Mercado de Colón Back (Párrafos: 314, 307)
    {
        id: "Av5-TR-10",
        tipo: "tramo",
        tramo: 10, // De mapa número 9 a mapa número 9
        mapa_numero: "9→9",
        nombre: "Mercado de Colón → Mercado de Colón",
        inicio: { lat: Number('39.468712'), lng: Number('-0.368897') },
        waypoints:
        [
            { lat: Number('39.468479'), lng: Number('-0.368752') },
            { lat: Number('39.468593'), lng: Number('-0.368502') },
            { lat: Number('39.468803'), lng: Number('-0.368004') },
            { lat: Number('39.468984'), lng: Number('-0.367685') },
            { lat: Number('39.469144'), lng: Number('-0.367817') },
        ],
        fin: { lat: Number('39.469161'), lng: Number('-0.367874') },
        imagen: "imagenes/imagenes-aventuras/mercado_colon.jpg",
        imagen2: "imagenes/imagenes-aventuras/mercado_de_colon_2.jpg",
        video: "",
    },
    // Parada 15: Mercado de Colón Back (Reto: 13) (Párrafos: 315, 316, 339)
    {
        id: "Av5-P-13",
        tipo: "parada",
        parada: 15, // mapa número 9
        mapa_numero: 9,
        nombre: "Mercado de Colón",
        coordenadas: { lat: Number('39.469161'), lng: Number('-0.367874') },
        imagen: "imagenes/imagenes-aventuras/mercado_de_colon_2.jpg",
    },
    // Parada 16: Mercado de Colón Back 2 (Fábula del Murciélago) (Párrafos: 339)
    {
        id: "Av5-P-14",
        tipo: "parada",
        parada: 16, // mapa número 9
        mapa_numero: 9,
        nombre: "Mercado de Colón",
        coordenadas: { lat: Number('39.469169'), lng: Number('-0.367883') },
        imagen: "imagenes/imagenes-aventuras/mercado_de_colon_2.jpg",
    },
    // Tramo 11: Mercado de Colón Back → Antigua Puerta Judía de la Muralla en Calle Colón (Párrafos: 317, 14-B)
    {
        id: "Av5-TR-11",
        tipo: "tramo",
        tramo: 11, // De mapa número 9 a mapa número 10
        mapa_numero: "9→10",
        nombre: "Mercado de Colón → Antigua Puerta Judía de la Muralla en Calle Colón",
        inicio: { lat: Number('39.469169'), lng: Number('-0.367883') },
        waypoints:
        [
            { lat: Number('39.469406'), lng: Number('-0.367986') },
            { lat: Number('39.469760'), lng: Number('-0.368246') },
            { lat: Number('39.470116'), lng: Number('-0.368490') },
            { lat: Number('39.470531'), lng: Number('-0.368768') },
            { lat: Number('39.471024'), lng: Number('-0.369134') },
            { lat: Number('39.471219'), lng: Number('-0.369323') },
            { lat: Number('39.470843'), lng: Number('-0.369728') },
            { lat: Number('39.470505'), lng: Number('-0.370108') },
            { lat: Number('39.470200'), lng: Number('-0.370436') },
            { lat: Number('39.470270'), lng: Number('-0.370520') },
        ],
        fin: { lat: Number('39.470209'), lng: Number('-0.370656') },
        imagen: "imagenes/imagenes-aventuras/mercado_de_colon_2.jpg",
        imagen2: "imagenes/imagenes-aventuras/calle_colon_2.jpg",
        imagen3: "imagenes/imagenes-aventuras/ruinas_calle_colon.jpg",
        video: "",
    },
    // Parada 17: Antigua Puerta Judía de la Muralla en Calle Colón (Párrafos: 318)
    {
        id: "Av5-P-15",
        tipo: "parada",
        parada: 17, // mapa número 10
        mapa_numero: 10,
        nombre: "Antigua Puerta Judía de la Muralla en Calle Colón",
        coordenadas: { lat: Number('39.470209'), lng: Number('-0.370656') },
        imagen: "imagenes/imagenes-aventuras/ruinas_calle_colon.jpg",
    },
    // Tramo 12: Antigua Puerta Judía de la Muralla en Calle Colón → Plaza de Toros (Párrafos: 319, 15)
    {
        id: "Av5-TR-12",
        tipo: "tramo",
        tramo: 12, // De mapa número 10 a mapa número 11
        mapa_numero: "10→11",
        nombre: "Antigua Puerta Judía de la Muralla en Calle Colón → Plaza de Toros",
        inicio: { lat: Number('39.470209'), lng: Number('-0.370656') },
        waypoints:
        [
            { lat: Number('39.470270'), lng: Number('-0.370520') },
            { lat: Number('39.470200'), lng: Number('-0.370436') },
            { lat: Number('39.470040'), lng: Number('-0.370620') },
            { lat: Number('39.469791'), lng: Number('-0.370948') },
            { lat: Number('39.469683'), lng: Number('-0.371090') },
            { lat: Number('39.469514'), lng: Number('-0.371324') },
            { lat: Number('39.469374'), lng: Number('-0.371533') },
            { lat: Number('39.469137'), lng: Number('-0.371866') },
            { lat: Number('39.468995'), lng: Number('-0.372075') },
            { lat: Number('39.468787'), lng: Number('-0.372379') },
            { lat: Number('39.468601'), lng: Number('-0.372616') },
            { lat: Number('39.468410'), lng: Number('-0.372897') },
            { lat: Number('39.468151'), lng: Number('-0.373276') },
            { lat: Number('39.467896'), lng: Number('-0.373645') },
            { lat: Number('39.467740'), lng: Number('-0.373869') },
            { lat: Number('39.467509'), lng: Number('-0.374194') },
            { lat: Number('39.467161'), lng: Number('-0.374708') },
            { lat: Number('39.467072'), lng: Number('-0.374883') },
            { lat: Number('39.467048'), lng: Number('-0.374994') },
            { lat: Number('39.467040'), lng: Number('-0.375190') },
            { lat: Number('39.467106'), lng: Number('-0.375551') },
        ],
        fin: { lat: Number('39.467031'), lng: Number('-0.375683') },
        imagen: "imagenes/imagenes-aventuras/ruinas_calle_colon.jpg",
        imagen2: "imagenes/imagenes-aventuras/calle_colon_2.jpg",
        imagen3: "imagenes/imagenes-aventuras/Plaza_Toros.jpg",
        video: "",
    },
    // Parada 18: Plaza de Toros(Reto: 14) (Párrafos: 320, 321, 323, 322)
    {
        id: "Av5-P-16",
        tipo: "parada",
        parada: 18, // mapa número 11
        mapa_numero: 11,
        nombre: "Plaza de Toros",
        coordenadas: { lat: Number('39.467031'), lng: Number('-0.375683') },
        imagen: "imagenes/imagenes-aventuras/Plaza_Toros.jpg",
    },
    // Tramo 13: Plaza de Toros → Estación del Norte (Párrafos: 324, 20)
    {
        id: "Av5-TR-13",
        tipo: "tramo",
        tramo: 13, // De mapa número 11 a mapa número 12
        mapa_numero: "11→12",
        nombre: "Plaza de Toros → Estación del Norte",
        inicio: { lat: Number('39.467031'), lng: Number('-0.375683') },
        waypoints:
        [
            { lat: Number('39.467215'), lng: Number('-0.375988') },
            { lat: Number('39.467318'), lng: Number('-0.376425') },
            { lat: Number('39.467411'), lng: Number('-0.376851') },
        ],
        fin: { lat: Number('39.467381'), lng: Number('-0.377117') },
        imagen: "imagenes/imagenes-aventuras/Plaza_Toros.jpg",
        imagen2: "imagenes/imagenes-aventuras/Estacion_Norte.jpg",
        video: "",
    },
    // Parada 19: (Reto: 15) (Párrafos: 325, 326)
    {
        id: "Av5-P-17",
        tipo: "parada",
        parada: 19, // mapa número 12
        mapa_numero: 12,
        nombre: "Estación del Norte (Tren)",
        coordenadas: { lat: Number('39.467381'), lng: Number('-0.377117') },
        imagen: "imagenes/imagenes-aventuras/Estacion_Norte.jpg",
    },
    // Tramo 14: Estación del Norte (exterior) → Estación del Norte (interior) (Párrafos: 327, 330)
    {
        id: "Av5-TR-14",
        tipo: "tramo",
        tramo: 14, // De mapa número 12 a mapa número 12
        mapa_numero: "12→12",
        nombre: "Estación del Norte → Estación del Norte",
        inicio: { lat: Number('39.467381'), lng: Number('-0.377117') },
        waypoints:
        [
            { lat: Number('39.467149'), lng: Number('-0.377185') },
        ],
        fin: { lat: Number('39.467000'), lng: Number('-0.377270') },
        imagen: "imagenes/imagenes-aventuras/Estacion_Norte.jpg",
        imagen2: "",
        video: "",
    },
    // Parada 20: (Reto: 16) (Párrafos: 328, 329)
    {
        id: "Av5-P-18",
        tipo: "parada",
        parada: 20, // mapa número 12
        mapa_numero: 12,
        nombre: "Estación del Norte",
        coordenadas: { lat: Number('39.467000'), lng: Number('-0.377270') },
        imagen: "imagenes/imagenes-aventuras/estacion_interior_2.jpeg",
    },
     // Tramo 15: Estación del Norte → Calle del Hospital (Párrafos: 576, 3-E, 3-B)
    {
        id: "Av5-TR-15",
        tipo: "tramo",
        tramo: 15, // De mapa número 12 a mapa número 13
        mapa_numero: "12→13",
        nombre: "Estación del Norte → Calle del Hospital",
        inicio: { lat: Number('39.467000'), lng: Number('-0.377270') },
        waypoints:
        [
            { lat: Number('39.467149'), lng: Number('-0.377185') },
            { lat: Number('39.467396'), lng: Number('-0.377110') },
            { lat: Number('39.467489'), lng: Number('-0.377103') },
            { lat: Number('39.467604'), lng: Number('-0.377451') },
            { lat: Number('39.467664'), lng: Number('-0.377685') },
            { lat: Number('39.467669'), lng: Number('-0.377856') },
            { lat: Number('39.467800'), lng: Number('-0.378377') },
            { lat: Number('39.467936'), lng: Number('-0.378912') },
            { lat: Number('39.468150'), lng: Number('-0.379745') },
            { lat: Number('39.468164'), lng: Number('-0.379927') },
            { lat: Number('39.468278'), lng: Number('-0.380282') },
            { lat: Number('39.468416'), lng: Number('-0.380605') },
            { lat: Number('39.468508'), lng: Number('-0.380914') },
            { lat: Number('39.468635'), lng: Number('-0.381218') },
            { lat: Number('39.469008'), lng: Number('-0.381743') },
            { lat: Number('39.469452'), lng: Number('-0.382289') },
            { lat: Number('39.469697'), lng: Number('-0.382655') },
            { lat: Number('39.470121'), lng: Number('-0.383188') },
            { lat: Number('39.470282'), lng: Number('-0.383427') },
            { lat: Number('39.470450'), lng: Number('-0.383392') },
            { lat: Number('39.470595'), lng: Number('-0.383458') },
        ],
        fin: { lat: Number('39.470638'), lng: Number('-0.383312') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_toros_y_estacion_del_norte.jpg",
        imagen2: "imagenes/imagenes-aventuras/guillem-castro-1.jpg",
        imagen3: "imagenes/imagenes-aventuras/biblioteca_hospital_fuente.jpg",
        imagen3: "imagenes/imagenes-aventuras/iglesia_calle_hospital.jpg",
        video: "",
    },
    // Parada 21: Calle del Hospital (Ermita de Santa Lucía) (Reto: 17) (Párrafos: 578, 579)
    {
        id: "Av5-P-19",
        tipo: "parada",
        parada: 21, // mapa número 13
        mapa_numero: 13,
        nombre: "Calle del Hospital (Ermita de Santa Lucía)",
        coordenadas: { lat: Number('39.470638'), lng: Number('-0.383312') },
        imagen: "imagenes/imagenes-aventuras/biblioteca_hospital_fuente.jpg",
    },
    // Parada 22: Calle del Hospital 2 (Ermita de Santa Lucía) (Reto: 18) (Párrafos: 580)
    {
        id: "Av5-P-20",
        tipo: "parada",
        parada: 22, // mapa número 13
        mapa_numero: 13,
        nombre: "Calle del Hospital (Ermita de Santa Lucía)",
        coordenadas: { lat: Number('39.470669'), lng: Number('-0.383250') },
        imagen: "imagenes/imagenes-aventuras/iglesia_calle_hospital.jpg",
    },
    // Parada 23: Calle del Hospital 3 (Ermita de Santa Lucía) (Reto: 19) (Párrafos: 581, 582, 583)
    {
        id: "Av5-P-21",
        tipo: "parada",
        parada: 23, // mapa número 13
        mapa_numero: 13,
        nombre: "Calle del Hospital (Ermita de Santa Lucía)",
        coordenadas: { lat: Number('39.470673'), lng: Number('-0.383215') },
        imagen: "imagenes/imagenes-aventuras/iglesia_calle_hospital.jpg",
    },
     // Tramo 16: Calle del Hospital (Ermita de Santa Lucía) → Museo y Colegio del Arte Mayor de la Seda (Párrafos: 584, 21)
    {
        id: "Av5-TR-16",
        tipo: "tramo",
        tramo: 16, // De mapa número 13 a mapa número 14
        mapa_numero: "13→14",
        nombre: "Calle del Hospital (Ermita de Santa Lucía) → Museo y Colegio del Arte Mayor de la Seda",
        inicio: { lat: Number('39.470673'), lng: Number('-0.383215') },
        waypoints:
        [
            { lat: Number('39.470767'), lng: Number('-0.383094') },
            { lat: Number('39.470883'), lng: Number('-0.382808') },
            { lat: Number('39.470927'), lng: Number('-0.382570') },
            { lat: Number('39.470926'), lng: Number('-0.382217') },
            { lat: Number('39.470923'), lng: Number('-0.381774') },
            { lat: Number('39.470876'), lng: Number('-0.381511') }, //entrada Biblioteca
            { lat: Number('39.470854'), lng: Number('-0.381225') },
        ],
        fin: { lat: Number('39.470928'), lng: Number('-0.380926') },
        imagen: "imagenes/imagenes-aventuras/iglesia_calle_hospital.jpg",
        imagen2: "imagenes/imagenes-aventuras/calle_hospital_antigua_entrada.jpg",
        imagen3: "imagenes/imagenes-aventuras/biblioteca_hospital.jpg",
        imagen4: "imagenes/imagenes-aventuras/museo_de_la_seda.jpg",
        video: "",
    },
    // Parada 24: Museo y Colegio del Arte Mayor de la Seda (Reto: 20) (Párrafos: 585, 145, 586)
    {
        id: "Av5-P-22",
        tipo: "parada",
        parada: 24, // mapa número 14
        mapa_numero: 14,
        nombre: "Museo y Colegio del Arte Mayor de la Seda",
        coordenadas: { lat: Number('39.470928'), lng: Number('-0.380926') },
        imagen: "imagenes/imagenes-aventuras/museo_de_la_seda.jpg",
        imagen2: "imagenes/imagenes-aventuras/museo_seda_date.jpg",
    },
    // Parada 25: Museo y Colegio del Arte Mayor de la Seda 2 (Párrafos: 587, 396)
    {
        id: "Av5-P-23",
        tipo: "parada",
        parada: 25, // mapa número 14
        mapa_numero: 14,
        nombre: "Museo y Colegio del Arte Mayor de la Seda",
        coordenadas: { lat: Number('39.470925'), lng: Number('-0.380941') },
        imagen: "imagenes/imagenes-aventuras/museo_de_la_seda.jpg",
    },
    // Tramo 17 : Museo y Colegio del Arte Mayor de la Seda → Biblioteca del Hospital (Párrafos: 588, 589, 590, 591, 592 )
    {
        id: "Av5-TR-17",
        tipo: "tramo",
        tramo: 17, // De mapa número 14 a mapa número 13
        mapa_numero: "14→13",
        nombre: "Museo y Colegio del Arte Mayor de la Seda → Biblioteca del Hospital",
        inicio: { lat: Number('39.470925'), lng: Number('-0.380941') },
        waypoints:
        [
            { lat: Number('39.470856'), lng: Number('-0.381243') },
            { lat: Number('39.470876'), lng: Number('-0.381511') },
            { lat: Number('39.470699'), lng: Number('-0.381588') },
            { lat: Number('39.470760'), lng: Number('-0.381855') },
            { lat: Number('39.470649'), lng: Number('-0.381917') },
            { lat: Number('39.470583'), lng: Number('-0.382178') },
            { lat: Number('39.470159'), lng: Number('-0.382362') },
            { lat: Number('39.469970'), lng: Number('-0.382312') },
            { lat: Number('39.469949'), lng: Number('-0.382019') },
        ],
        fin: { lat: Number('39.469930'), lng: Number('-0.381871') },
        imagen: "imagenes/imagenes-aventuras/museo_de_la_seda.jpg",
        imagen2: "imagenes/imagenes-aventuras/biblioteca_hospital.jpg",
        imagen3: "imagenes/imagenes-aventuras/biblioteca-hospital-trasera.jpg",
        imagen3: "imagenes/imagenes-aventuras/jardin_de_la_biblioteca.jpg",
        video: "",
    },
    // Parada 26: Biblioteca del Hospital 2 (Reto21Puzzle PZ-14 ) (Párrafos: 592-B)
    {
        id: "Av5-P-24",
        tipo: "parada",
        parada: 26, // mapa número 13
        mapa_numero: 13,
        nombre: "Biblioteca del Hospital",
        coordenadas: { lat: Number('39.469930'), lng: Number('-0.381871') },
        imagen: "imagenes/imagenes-aventuras/jardin_de_la_biblioteca.jpg",
    },
     // Tramo 18: Biblioteca del Hospital → Mercado Central (Párrafos: 691)
    {
        id: "Av5-TR-18",
        tipo: "tramo",
        tramo: 18, // De mapa número 13 a mapa número 15
        mapa_numero: "13→15",
        nombre: "Biblioteca del Hospital → Mercado Central",
        inicio: { lat: Number('39.469930'), lng: Number('-0.381871') },
        waypoints:
        [
            { lat: Number('39.469925'), lng: Number('-0.382171') },
            { lat: Number('39.470044'), lng: Number('-0.382386') },
            { lat: Number('39.470458'), lng: Number('-0.382259') },
            { lat: Number('39.470691'), lng: Number('-0.382119') },
            { lat: Number('39.470660'), lng: Number('-0.381908') },
            { lat: Number('39.470768'), lng: Number('-0.381868') },
            { lat: Number('39.470699'), lng: Number('-0.381562') },
            { lat: Number('39.470875'), lng: Number('-0.381512') },
            { lat: Number('39.470855'), lng: Number('-0.381243') },
            { lat: Number('39.470938'), lng: Number('-0.380871') },
            { lat: Number('39.471023'), lng: Number('-0.380509') },
            { lat: Number('39.471166'), lng: Number('-0.380041') },
            { lat: Number('39.471271'), lng: Number('-0.379647') },
            { lat: Number('39.471732'), lng: Number('-0.379672') },
            { lat: Number('39.472226'), lng: Number('-0.379708') },
            { lat: Number('39.472695'), lng: Number('-0.379733') },
            { lat: Number('39.473037'), lng: Number('-0.379732') },
            { lat: Number('39.472954'), lng: Number('-0.379058') },
            { lat: Number('39.472947'), lng: Number('-0.378715') },
            { lat: Number('39.473291'), lng: Number('-0.378650') },
            { lat: Number('39.473346'), lng: Number('-0.378083') },
            { lat: Number('39.473602'), lng: Number('-0.378003') },
        ],
        fin: { lat: Number('39.473846'), lng: Number('-0.378332') },
        imagen: "imagenes/imagenes-aventuras/jardin_de_la_biblioteca.jpg",
        imagen2: "imagenes/imagenes-aventuras/biblioteca_hospital.jpg",
        imagen3: "imagenes/imagenes-aventuras/museo_de_la_seda.jpg",
        imagen4: "imagenes/imagenes-aventuras/calle_hospital_avenida_oeste.jpg",
        imagen5: "imagenes/imagenes-aventuras/avenida-oeste.jpg",
        imagen6: "imagenes/imagenes-aventuras/avenida-oeste-mercado-central.jpg",
        imagen4: "imagenes/imagenes-aventuras/mercado_central.jpg",
        video: "",
    },
    // Parada 27: Mercado Central (Reto 22 ) (Párrafos: 701,22-B, 361, 362, 363, 364)
    {
        id: "Av5-P-25",
        tipo: "parada",
        parada: 27, // mapa número 15
        mapa_numero: 15,
        nombre: "Mercado Central",
        coordenadas: { lat: Number('39.473846'), lng: Number('-0.378332') },
        imagen: "imagenes/imagenes-aventuras/mercado_central.jpg",
    },
    // Parada 28: Mercado Central 2 (Reto23Puzzle PZ-16) (Párrafos: 274-B)
    {
        id: "Av5-P-26",
        tipo: "parada",
        parada: 28, // mapa número 15
        mapa_numero: 15,
        nombre: "Mercado Central",
        coordenadas: { lat: Number('39.473863'), lng: Number('-0.378355') },
        imagen: "imagenes/imagenes-aventuras/mercado_central.jpg",
    },
    // Tramo 19: Mercado Central → Lonja (Mercado de la Seda) (Párrafos: 155)
    {
        id: "Av5-TR-19",
        tipo: "tramo",
        tramo: 19, // De mapa número 15 a mapa número 16
        mapa_numero: "15→16",
        nombre: "Mercado Central → Lonja (Mercado de la Seda)",
        inicio: { lat: Number('39.473863'), lng: Number('-0.378355') },
        waypoints:
        [
            { lat: Number('39.474094'), lng: Number('-0.378519') },
        ],
        fin: { lat: Number('39.474220'), lng: Number('-0.378750') },
        imagen: "imagenes/imagenes-aventuras/mercado_central.jpg",
        imagen2: "imagenes/imagenes-aventuras/lonja.jpg",
        video: "",
    },
    // Parada 29: Lonja (Mercado de la Seda) 1 (Párrafos: 372, 373, 374)
    {
        id: "Av5-P-27",
        tipo: "parada",
        parada: 29, // mapa número 16
        mapa_numero: 16,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474220'), lng: Number('-0.378750') },
        imagen: "imagenes/imagenes-aventuras/lonja.jpg",
    },

    // Parada 30: Lonja (Mercado de la Seda) Puerta de Los Pecados 1 (Reto 24) (Párrafos: 375, 376, 377, 378, 379)
    {
        id: "Av5-P-28",
        tipo: "parada",
        parada: 30, // mapa número 16
        mapa_numero: 16,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474170'), lng: Number('-0.378600') },
        imagen: "imagenes/imagenes-aventuras/Lonja_puerta_pecados.jpg",
        imagen2: "imagenes/imagenes-aventuras/lonja4.jpg",
    },

    // Parada 31: Lonja (Mercado de la Seda) Puerta de Los Pecados 2 (Reto 25) (Párrafos: 380, 381)
    {
        id: "Av5-P-29",
        tipo: "parada",
        parada: 31, // mapa número 16
        mapa_numero: 16,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474160'), lng: Number('-0.378570') },
        imagen: "imagenes/imagenes-aventuras/lonja5.jpg",
    },
    // Parada 32: Lonja (Mercado de la Seda) 2 (Párrafos: 140, 274-C, 24-B)
    {
        id: "Av5-P-30",
        tipo: "parada",
        parada: 32, // mapa número 16
        mapa_numero: 16,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474182'), lng: Number('-0.378555') },
        imagen: "imagenes/imagenes-aventuras/lonja.jpg",
    },
    // Tramo 20: Lonja (Mercado de la Seda) → Torres de Quart (Párrafos: 24-C)
    {
        id: "Av5-TR-20",
        tipo: "tramo",
        tramo: 20, // De mapa número 16 a mapa número 17
        mapa_numero: "16→17",
        nombre: "Lonja (Mercado de la Seda) → Torres de Quart",
        inicio: { lat: Number('39.474182'), lng: Number('-0.378555') },
        waypoints:
        [
            { lat: Number('39.474496'), lng: Number('-0.378897') },
            { lat: Number('39.474820'), lng: Number('-0.379382') },
            { lat: Number('39.474990'), lng: Number('-0.379805') },
            { lat: Number('39.475015'), lng: Number('-0.380250') },
            { lat: Number('39.475108'), lng: Number('-0.380966') },
            { lat: Number('39.475165'), lng: Number('-0.381361') },
            { lat: Number('39.475256'), lng: Number('-0.382065') },
            { lat: Number('39.475335'), lng: Number('-0.382667') },
            { lat: Number('39.475466'), lng: Number('-0.383468') },
            { lat: Number('39.475507'), lng: Number('-0.383747') },
            { lat: Number('39.475655'), lng: Number('-0.383760') },
            { lat: Number('39.475785'), lng: Number('-0.383746') },
            { lat: Number('39.475744'), lng: Number('-0.384067') },
            { lat: Number('39.475744'), lng: Number('-0.384067') },
        ],
        fin: { lat: Number('39.475797'), lng: Number('-0.384197') },
        imagen: "imagenes/imagenes-aventuras/lonja.jpg",
        imagen2: "imagenes/imagenes-aventuras/torres_de_quart.jpg",
        video: "",
    },
    // Parada 33: Torres de Quart 1 (Reto 26) (Párrafos: 571, 594, 572, 573)
    {
        id: "Av5-P-31",
        tipo: "parada",
        parada: 33, // mapa número 17
        mapa_numero: 17,
        nombre: "Torres de Quart",
        coordenadas: { lat: Number('39.475797'), lng: Number('-0.384197') },
        imagen: "imagenes/imagenes-aventuras/torres_de_quart.jpg",
    },
    // Parada 34: Torres de Quart 2 (Reto27Puzzle PZ-15) (Párrafos: 574, 575)
    {
        id: "Av5-P-32",
        tipo: "parada",
        parada: 34, // mapa número 17
        mapa_numero: 17,
        nombre: "Torres de Quart",
        coordenadas: { lat: Number('39.475815'), lng: Number('-0.384196') },
        imagen: "imagenes/imagenes-aventuras/torres_de_quart.jpg",
        imagen2: "imagenes/imagenes-aventuras/torres-quart-palleter.jpg",
    },
    // Tramo 21: Torres de Quart → Museo de Prehistoria y Etnología (Párrafos: 333, 27-D)
    {
        id: "Av5-TR-21",
        tipo: "tramo",
        tramo: 21, // De mapa número 17 a mapa número 18
        mapa_numero: "17→18",
        nombre: "Torres de Quart → Museo de Prehistoria y Etnología",
        inicio: { lat: Number('39.475815'), lng: Number('-0.384196') },
        waypoints:
        [
            { lat: Number('39.476076'), lng: Number('-0.384187') },
            { lat: Number('39.476395'), lng: Number('-0.384116') },
            { lat: Number('39.476741'), lng: Number('-0.384061') },
            { lat: Number('39.477122'), lng: Number('-0.384009') },
            { lat: Number('39.477476'), lng: Number('-0.383943') },
            { lat: Number('39.477821'), lng: Number('-0.383860') },
            { lat: Number('39.478149'), lng: Number('-0.383801') },
            { lat: Number('39.478190'), lng: Number('-0.383774') },
            { lat: Number('39.478242'), lng: Number('-0.383562') },
        ],
        fin: { lat: Number('39.478248'), lng: Number('-0.383117') },
        imagen: "imagenes/imagenes-aventuras/torres_de_quart.jpg",
        imagen2: "imagenes/imagenes-aventuras/torres-quart-guillem-castro.jpg",
        imagen3: "imagenes/imagenes-aventuras/museo_prehistoria_far.jpg",
        imagen4: "imagenes/imagenes-aventuras/museo_prehistoria_close.jpg",
        imagen5: "imagenes/imagenes-aventuras/museo_prehistoria-front.jpg",
        video: "",
    },
    // Parada 35: Museo de prehistoria y Etnología (Párrafos: 565, 566)
    {
        id: "Av5-P-33",
        tipo: "parada",
        parada: 35, // mapa número 18/19
        mapa_numero: "18/19",
        nombre: "Museo de Prehistoria y Etnología",
        coordenadas: { lat: Number('39.478248'), lng: Number('-0.383117') },
        imagen: "imagenes/imagenes-aventuras/museo_prehistoria-front.jpg",
    },
    // Tramo 22: Museo de Prehistoria y Etnología → Iglesia de la Milagrosa (Párrafos: 567, 31)
    {
        id: "Av5-TR-22",
        tipo: "tramo",
        tramo: 22, // De mapa número 18/19 a mapa número 20
        mapa_numero: "18/19→20",
        nombre: "Museo de Prehistoria y Etnología → Iglesia de la Milagrosa",
        inicio: { lat: Number('39.478248'), lng: Number('-0.383117') },
        waypoints:
        [
            { lat: Number('39.478208'), lng: Number('-0.382867') },
        ],
        fin: { lat: Number('39.478176'), lng: Number('-0.382630') },
        imagen: "imagenes/imagenes-aventuras/museo_prehistoria-front.jpg",
        imagen2: "imagenes/imagenes-aventuras/iglesia_de_la_milagrosa.jpg",
        video: "",
    },
    // Parada 36: Iglesia de la Milagrosa (Reto 28) (Párrafos: 568, 569, 127)
    {
        id: "Av5-P-34",
        tipo: "parada",
        parada: 36, // mapa número 20
        mapa_numero: "20",
        nombre: "Iglesia de la Milagrosa",
        coordenadas: { lat: Number('39.478176'), lng: Number('-0.382630') },
        imagen: "imagenes/imagenes-aventuras/iglesia_de_la_milagrosa.jpg",
    },
    // Tramo 23: Iglesia de la Milagrosa → Instituto Valenciano de Arte Moderno (IVAM) (Párrafos: 564, 563-B)
    {
        id: "Av5-TR-23",
        tipo: "tramo",
        tramo: 23, // De mapa número 20 a mapa número 21
        mapa_numero: "20→21",
        nombre: "Iglesia de la Milagrosa → Instituto Valenciano de Arte Moderno (IVAM)",
        inicio: { lat: Number('39.478176'), lng: Number('-0.382630') },
        waypoints:
        [
            { lat: Number('39.478208'), lng: Number('-0.382867') },
            { lat: Number('39.478248'), lng: Number('-0.383117') },
            { lat: Number('39.478242'), lng: Number('-0.383562') },
            { lat: Number('39.478190'), lng: Number('-0.383774') },
            { lat: Number('39.478149'), lng: Number('-0.383801') },
            { lat: Number('39.478360'), lng: Number('-0.383771') },
            { lat: Number('39.479042'), lng: Number('-0.383543') },
            { lat: Number('39.479177'), lng: Number('-0.383504') },
            { lat: Number('39.479572'), lng: Number('-0.383345') },
            { lat: Number('39.479915'), lng: Number('-0.383198') },
            { lat: Number('39.480048'), lng: Number('-0.383156') },
        ],
        fin: { lat: Number('39.480042'), lng: Number('-0.382967') },
        imagen: "imagenes/imagenes-aventuras/iglesia_de_la_milagrosa.jpg",
        imagen2: "imagenes/imagenes-aventuras/museo_prehistoria-front.jpg",
        imagen3: "imagenes/imagenes-aventuras/museo_prehistoria_close.jpg",
        imagen4: "imagenes/imagenes-aventuras/museo_prehistoria_guillem_castro.jpg",
        imagen5: "imagenes/imagenes-aventuras/ivam.jpg",
        video: "",
    },
    // Parada 37: Instituto Valenciano de Arte Moderno (IVAM) (Párrafos: 4)
    {
        id: "Av5-P-35",
        tipo: "parada",
        parada: 37, // mapa número 21
        mapa_numero: "21",
        nombre: "Instituto Valenciano de Arte Moderno (IVAM)",
        coordenadas: { lat: Number('39.480042'), lng: Number('-0.382967') },
        imagen: "imagenes/imagenes-aventuras/ivam.jpg",
    },
    // Tramo 24: Instituto Valenciano de Arte Moderno (IVAM)  → Torres de Serranos Final (Párrafos: 2-C)
    {
        id: "Av5-TR-24",
        tipo: "tramo",
        tramo: 24, // De mapa número 21 a mapa número 1
        mapa_numero: "21→1",
        nombre: "Instituto Valenciano de Arte Moderno (IVAM) → Torres de Serranos",
        inicio: { lat: Number('39.480042'), lng: Number('-0.382967') },
        waypoints:
        [
            { lat: Number('39.480048'), lng: Number('-0.383156') },
            { lat: Number('39.480485'), lng: Number('-0.383053') },
            { lat: Number('39.480793'), lng: Number('-0.382270') },
            { lat: Number('39.481280'), lng: Number('-0.380776') },
            { lat: Number('39.481494'), lng: Number('-0.380138') },
            { lat: Number('39.481355'), lng: Number('-0.379496') },
            { lat: Number('39.481286'), lng: Number('-0.379359') },
            { lat: Number('39.481289'), lng: Number('-0.379131') },
            { lat: Number('39.481059'), lng: Number('-0.378902') },
            { lat: Number('39.480927'), lng: Number('-0.378486') },
            { lat: Number('39.480664'), lng: Number('-0.377978') },
            { lat: Number('39.480266'), lng: Number('-0.377288') },
            { lat: Number('39.479902'), lng: Number('-0.376643') },
            { lat: Number('39.479711'), lng: Number('-0.376320') },
            { lat: Number('39.479535'), lng: Number('-0.376478') },
            { lat: Number('39.479427'), lng: Number('-0.376588') },
            { lat: Number('39.479180'), lng: Number('-0.376294') },
            { lat: Number('39.479036'), lng: Number('-0.376007') },
            { lat: Number('39.478884'), lng: Number('-0.376185') },
        ],
        fin: {  lat: Number('39.478590'), lng: Number('-0.376330') },
        imagen: "imagenes/imagenes-aventuras/ivam.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_de_las_artes.jpg",
        imagen3: "imagenes/imagenes-aventuras/ivam_serranos_1.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_san_jose.jpg",
        imagen5: "imagenes/imagenes-aventuras/ivam_serranos_2.jpg",
        imagen6: "imagenes/imagenes-aventuras/ivam_serranos_3.jpg",
        imagen7: "imagenes/imagenes-aventuras/ivam_serranos_4.jpg",
        imagen8: "imagenes/imagenes-aventuras/ivam_serranos_5.jpg",
        imagen9: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        video: "",
    },
    // Parada 36 - FINAL: Torres de Serranos Final (Reto35Puzzle PZ-05) (Párrafos: 475, 503, 507, 526,)
    {
        id: "Av5-P-36",
        tipo: "parada",
        parada: 38, // mapa número 1
        mapa_numero: 1,
        nombre: "Torres de Serranos",
        coordenadas: { lat: Number('39.478590'), lng: Number('-0.376330') },
        imagen: "imagenes/imagenes-aventuras/ivam.jpg",
        imagen2: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg"
    },
    ]
    }
  },
  AventuraFallas: {
    "coordenadas-hijo2.html": {
      coordenadas: [
    // poner las coordenadas específicas de los puntos a visitar del mapa. dibujarReferencias() ignora automáticamente las que tengan coordenadas: null.
    {
        tipo: "referencia",
        id: "REF-1",
        mapa_numero: 1,
        coordenadas: { lat: Number('39.479210'), lng: Number('-0.376040') },
        nombre: "Torres de Serranos",
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-2",
        mapa_numero: 2,
        coordenadas: { lat: Number('39.480662'), lng: Number('-0.375352') },
        nombre: "Puente de Serranos",
        imagen: "imagenes/imagenes-aventuras/puente_serranos_3.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-3",
        mapa_numero: 3,
        coordenadas: { lat: Number('39.478660'), lng: Number('-0.374700') },
        nombre: "Calle Muro de Santa Ana",
        imagen: "imagenes/imagenes-aventuras/Calle_Muro_Santa_Ana.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-4",
        mapa_numero: 4,
        coordenadas: { lat: Number('39.477820'), lng: Number('-0.374870') },
        nombre: "Iglesia de San Lorenzo",
        imagen: "imagenes/imagenes-aventuras/iglesia_san_lorenzo.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-5",
        mapa_numero: 5,
        coordenadas: { lat: Number('39.476340'), lng: Number('-0.375310') },
        nombre: "Plaza de la Virgen",
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
    },
    {
        tipo: "referencia",
        id: "REF-6",
        mapa_numero: 6,
        coordenadas: { lat: Number('39.476260'), lng: Number('-0.374840') },
        nombre: "Real Basílica de Nuestra Señora de los Desamparados",
        imagen: "imagenes/imagenes-aventuras/basilica_almoina.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-7",
        mapa_numero: 7,
        coordenadas: { lat: Number('39.475982'), lng: Number('-0.375222')},
        nombre: "Catedral de valencia",
        imagen: "imagenes/imagenes-aventuras/puerta_gotica_catedral_2.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-8",
        mapa_numero: 8,
        coordenadas: { lat: Number('39.475201'), lng: Number('-0.375554')},
        nombre: "Catedral de valencia",
        imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-9",
        mapa_numero: 9,
        coordenadas: { lat: Number('39.474567'), lng: Number('-0.375496')},
        nombre: "Plaza de la Reina",
        imagen: "imagenes/imagenes-aventuras/Plaza_Reina_3.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-10",
        mapa_numero: 10,
        coordenadas: { lat: Number('39.473970'), lng: Number('-0.376220') },
        nombre: "Torre de Santa Catalina",
        imagen: "imagenes/imagenes-aventuras/torre_santa_catalina.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-11",
        mapa_numero: 11,
        coordenadas: { lat: Number('39.470620'), lng: Number('-0.376840') },
        nombre: "Plaza del Ayuntamiento",
        imagen: "imagenes/imagenes-aventuras/plaza_del_ayuntamiento.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-12",
        mapa_numero: 12,
        coordenadas: { lat: Number('39.469810'), lng: Number('-0.377060') },
        nombre: "Ayuntamiento de Valencia",
        imagen: "imagenes/imagenes-aventuras/ayuntamiento.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-13",
        mapa_numero: 13,
        coordenadas: { lat: Number('39.469450'), lng: Number('-0.375540') },
        nombre: "Palacio de Comunicaciones (Correos)",
        imagen: "imagenes/imagenes-aventuras/correos.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-14",
        mapa_numero: 14,
        coordenadas: { lat: Number('39.469863'), lng: Number('-0.375701') },
        nombre: "Edificio Suay",
        imagen: "imagenes/imagenes-aventuras/edificio_suay.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-15",
        mapa_numero: 15,
        coordenadas: { lat: Number('39.473700'), lng: Number('-0.378680') },
        nombre: "Mercado Central",
        imagen: "imagenes/imagenes-aventuras/mercado_central.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-16",
        mapa_numero: 16,
        coordenadas: { lat: Number('39.474210'), lng: Number('-0.379190') },
        nombre: "Real Parroquia de los Santos Juanes (San Juan del Mercado)",
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-17",
        mapa_numero: 17,
        coordenadas: { lat: Number('39.474380'), lng: Number('-0.378340') },
        nombre: "Lonja de la Seda",
        imagen: "imagenes/imagenes-aventuras/lonja.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-18",
        mapa_numero: 18,
        coordenadas: { lat: Number('39.474330'), lng: Number('-0.377780') },
        nombre: "Plaza del Doctor López Collado",
        imagen: "imagenes/imagenes-aventuras/Plaza_collado.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-19",
        mapa_numero: 19,
        coordenadas: { lat: Number('39.476080'), lng: Number('-0.377360') },
        nombre: "Plaza del Negrito",
        imagen: "imagenes/imagenes-aventuras/Plaza_negrito.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-20",
        mapa_numero: 20,
        coordenadas: { lat: Number('39.476620'), lng: Number('-0.377130') },
        nombre: "Calle Caballeros",
        imagen: "imagenes/imagenes-aventuras/Calle_caballeros.jpg"
    },
    {
        tipo: "referencia",
        id: "REF-21",
        mapa_numero: 21,
        coordenadas: { lat: Number('39.476700'), lng: Number('-0.376650') },
        nombre: "Palacio de la Generalitat Valenciana",
        imagen: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg"
    },
    // ────-------------------------------------------------
// coordenadas completas hijo2 Aventura Fallas //
    // Parada 0 - Torres de Serranos (start) (Reto 3) (Párrafos: 223, 226, 228)
    {
        id: "AvFallas-P-0",
        tipo: "inicio",
        parada: 2, // mapa número 1
        mapa_numero: 1,
        nombre: "Torres de Serranos (start)",
        coordenadas: { lat: Number('39.478760'), lng: Number('-0.376260') },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
    },

    // Tramo 1: Torres de Serranos → Plaza de la Crída (Torres de Serranos Front)(Párrafos: 229, 129, 593, 129-B, 471, 5, 607, 629, 697, 698, 118, 130, 666, 696, 131, 132, 133, 134, 135)
    {
        id: "AvFallas-TR-1",
        tipo: "tramo",
        tramo: 1, // De mapa número 1 a sin número de mapa
        mapa_numero: "1→-",
        nombre: "Torres de Serranos → Plaza de la Crída",
        inicio: { lat: Number('39.478760'), lng: Number('-0.376260') },
         waypoints: [
            { lat: Number('39.479050'), lng: Number('-0.376130') },
            { lat: Number('39.479341'), lng: Number('-0.376408') },
            { lat: Number('39.479500'), lng: Number('-0.376210') },
            { lat: Number('39.479430'), lng: Number('-0.375970') }
        ],
        fin: { lat: Number('39.479590'), lng: Number('-0.375830') },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
        imagen2: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        video: "",
    },
    // Parada 3: Plaza de la Crída (Torres de Serranos Front) (Reto 4) (Párrafos: 137, 126, 141, 470, 404, 138, 139, 153, 233)
    {
        id: "AvFallas-P-1",
        tipo: "parada",
        parada: null, // sin número de mapa
        mapa_numero: 2,
        nombre: "Plaza de la Crída",
        coordenadas: { lat: Number('39.480620'), lng: Number('-0.375350') },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
    },
    // Tramo 2: Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos 1 (Párrafos: 230, 5-B)
    {
        id: "AvFallas-TR-2",
        tipo: "tramo",
        tramo: 2, // De mapa número 1 a mapa número 2 (Plaza de la Crída)
        mapa_numero: "1→2",
        nombre: "Plaza de la Crída → Puente de Serranos",
        inicio: { lat: Number('39.480620'), lng: Number('-0.375350') },
        waypoints:
        [
            { lat: Number('39.480260'), lng: Number('-0.375530') },
        ],
        fin: { lat: Number('39.480620'), lng: Number('-0.375350') },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_serranos_2.jpg",
        imagen3:"imagenes/imagenes-aventuras/puente_serranos.jpg",
        video: "",
    },
    // Parada 4: Centro Puente Serranos (Párrafos: 231, 234, 235, 148, 480, 240, 638)
    {
        id: "AvFallas-P-2",
        tipo: "parada",
        parada: 4, // mapa número 2
        mapa_numero: 2,
        nombre: "Puente Serranos",
        coordenadas: { lat: Number('39.480620'), lng: Number('-0.375350') },
        imagen: "imagenes/imagenes-aventuras/puente_serranos.jpg",
    },
    // Tramo 3: Plaza de la Crída → Calle Muro de Santa Ana (Párrafos: 81, 6-B)
    {
        id: "AvFallas-TR-3",
        tipo: "tramo",
        tramo: 3, //De mapa número 1 a mapa número 3
        mapa_numero: "1→3",
        nombre: "Plaza de la Crída → Calle Muro de Santa Ana",
        inicio: { lat: Number('39.480620'), lng: Number('-0.375350') },
        waypoints: [
            { lat: Number('39.479590'), lng: Number('-0.375830') },
            { lat: Number('39.479390'), lng: Number('-0.375200') },
            { lat: Number('39.479130'), lng: Number('-0.374760') },
            { lat: Number('39.478860'), lng: Number('-0.374900') },
            { lat: Number('39.478860'), lng: Number('-0.374700') },
        ],
        fin: { lat: Number('39.478660'), lng: Number('-0.374700') },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        imagen2: "imagenes/imagenes-aventuras/Calle_Muro_Santa_Ana.jpg",
        video: "",
    },
    // Parada 5: calle Muro Santa Ana (Reto 5) (Párrafos: 68)
    {
        id: "AvFallas-P-3",
        tipo: "parada",
        parada: 4, // mapa número 3
        mapa_numero: 3,
        nombre: "Calle Muro de Santa Ana",
        coordenadas: { lat: Number('39.478660'), lng: Number('-0.374700') },
        imagen: "imagenes/imagenes-aventuras/Calle_Muro_Santa_Ana.jpg",
    },
    // Tramo 4: Calle Muro de Santa Ana → Iglesia de San Lorenzo (Párrafos: 156, 682-B, 7, )
    {
        id: "AvFallas-TR-4",
        tipo: "tramo",
        tramo: 4, // mapa número 3 a mapa número 4
        mapa_numero: "3→4",
        nombre: "Calle Muro de Santa Ana → Iglesia de San Lorenzo",
        inicio: { lat: Number('39.478660'), lng: Number('-0.374700') },
        waypoints: [
            { lat: Number('39.478210'), lng: Number('-0.374790') },
        ],
        fin: { lat: Number('39.477820'), lng: Number('-0.374870') },
        imagen: "imagenes/imagenes-aventuras/Calle_Muro_Santa_Ana.jpg",
        imagen2: "imagenes/imagenes-aventuras/cortes_valencianas.jpg",
        video: "",
    },
    // Parada 6: Iglesia de San Lorenzo (Reto 6) (Párrafos: 684, 157, 683)
    {
        id: "AvFallas-P-4",
        tipo: "parada",
        parada: 6, // mapa número 4
        mapa_numero: 4,
        nombre: "Iglesia de San Lorenzo",
        coordenadas: { lat: Number('39.477820'), lng: Number('-0.374870') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_lorenzo.jpg",
    },
    // Tramo 5: Iglesia de San Lorenzo → Plaza de la Virgen (Párrafos: 159, 8)
    {
        id: "AvFallas-TR-5",
        tipo: "tramo",
        tramo: 5, // mapa número 4 a mapa número 5
        mapa_numero: "4→5",
        nombre: "Iglesia de San Lorenzo → Plaza de la Virgen",
        inicio: { lat: Number('39.477820'), lng: Number('-0.374870') },
        waypoints: [
            { lat: Number('39.477200'), lng: Number('-0.375030') },
        ],
        fin: { lat: Number('39.476610'), lng: Number('-0.375160') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_lorenzo.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
        video: "",
    },
    // Parada 7: Plaza de la Virgen (Reto 7) (Párrafos: 466, 467)
    {
        id: "AvFallas-P-5",
        tipo: "parada",
        parada: 7, // mapa número 5
        mapa_numero: 5,
        nombre: "Plaza de la Virgen",
        coordenadas: { lat: Number('39.476620'), lng: Number('-0.375240') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
        imagen2:"",
    },
    // Parada 8: Plaza de la Virgen 2 (Ofrenda) (Párrafos: 469, 473, 474, 62, 146, 10-B)
    {
        id: "AvFallas-P-6",
        tipo: "parada",
        parada: 8, // mapa número 5
        mapa_numero: 5,
        nombre: "Plaza de la Virgen",
        coordenadas: { lat: Number('39.476570'), lng: Number('-0.375240') },
        imagen: "",
    },
    // Parada 9: Plaza de la Virgen 3 (Basílica) (Reto8Puzzle PZ-01) (Párrafos: 451, 452, 160)
    {
        id: "AvFallas-P-7",
        tipo: "parada",
        parada: 9, // mapa número 6
        mapa_numero: 6,
        nombre: "Plaza de la Virgen",
        coordenadas: { lat: Number('39.476560'), lng: Number('-0.375160') },
        imagen: "",
    },
    // Tramo 6 - Plaza de la Virgen → Torre del Miguelete (Párrafos: 161, 477-B, 147, 141, 150, 426, 11-B)
                {
                    id: "AvFallas-TR-6",
                    tipo: "tramo",
                    tramo: 6, // De mapa número 6 a mapa número 7
                    mapa_numero: "6→7",
                    nombre: "Plaza de la Virgen → Torre del Miguelete",
                    inicio: { lat: Number('39.476560'), lng: Number('-0.375160') },
                    waypoints:
                    [
                      { lat: Number('39.476490'), lng: Number('-0.375050') },
                      { lat: Number('39.476310'), lng: Number('-0.375060') },
                      { lat: Number('39.476080'), lng: Number('-0.375070') },
                      { lat: Number('39.476040'), lng: Number('-0.375150') },
                        { lat: Number('39.476000'), lng: Number('-0.375220') },
                        { lat: Number('39.475800'), lng: Number('-0.375390') },
                        { lat: Number('39.475580'), lng: Number('-0.375560') },
                        { lat: Number('39.475410'), lng: Number('-0.375690') },
                        { lat: Number('39.475260'), lng: Number('-0.375790') },
                    ],
                    fin: { lat: Number('39.475220'), lng: Number('-0.375650') },
                    imagen: "imagenes/imagenes-aventuras/puerta_gotica_catedral_2.jpg",
                    imagen2: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
                    video: ""
                },
                // Parada 8 - Torre del Miguelete (Reto 9) (Párrafos: 427)
                {
                    id: "AvFallas-P-8",
                    tipo: "parada",
                    parada: 10, // mapa número 7
                    mapa_numero: 7,
                    nombre: "Torre del Miguelete",
                    coordenadas: { lat: Number('39.475220'), lng: Number('-0.375650') },
                    imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
                },
               // Parada 9 - Torre del Miguelete 2 (Reto 10) (Párrafos: 428)
                {
                    id: "AvFallas-P-9",
                    tipo: "parada",
                    parada: 11, // mapa número 7
                    mapa_numero: 7,
                    nombre: "Torre del Miguelete",
                    coordenadas: { lat: Number('39.475230'), lng: Number('-0.375670') },
                    imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
                },

                // Parada 10 - Puerta de los Hierros (Barroca) de la Catedral de Valencia (Párrafos: 216, 12, 432, 141)
                {
                    id: "AvFallas-P-10",
                    tipo: "parada",
                    parada: 12, // mapa número 8
                    mapa_numero: 8,
                    nombre: "Puerta de los Hierros (Barroca) de la Catedral de Valencia",
                    coordenadas: { lat: Number('39.475204'), lng: Number('-0.375543') },
                    imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
                },
                // Parada 11 - Puerta de los Hierros (Barroca) de la Catedral de Valencia (Párrafos: 163, 164, 165, 166, 167)
                {
                    id: "AvFallas-P-11",
                    tipo: "parada",
                    parada: 13, // mapa número 8
                    mapa_numero: 8,
                    nombre: "Puerta de los Hierros (Barroca) de la Catedral de Valencia",
                    coordenadas: { lat: Number('39.475180'), lng: Number('-0.375505') },
                    imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
                },
                // Tramo 7 - Puerta de los Hierros (Barroca) de la Catedral de Valencia → Torre Barroca de la Iglesia de Santa Catalina (Párrafos: 21-D, 694, 13-C, 307, 699)
                {
                    id: "AvFallas-TR-7",
                    tipo: "tramo",
                    tramo: 7, // De mapa número 8 a mapa número 10
                    mapa_numero: "8→10",
                    nombre: "Puerta de los Hierros (Barroca) de la Catedral de Valencia → Torre Barroca de la Iglesia de Santa Catalina",
                    inicio: { lat: Number('39.475180'), lng: Number('-0.375505') },
                    waypoints:
                    [
                        { lat: Number('39.475170'), lng: Number('-0.375490') },
                        { lat: Number('39.474960'), lng: Number('-0.375590') },
                        { lat: Number('39.474870'), lng: Number('-0.375630') },
                        { lat: Number('39.474770'), lng: Number('-0.375650') },
                        { lat: Number('39.474600'), lng: Number('-0.375700') },
                        { lat: Number('39.474370'), lng: Number('-0.375740') },
                        { lat: Number('39.474210'), lng: Number('-0.375730') },
                        { lat: Number('39.474000'), lng: Number('-0.375720') },
                    ],
                    fin: { lat: Number('39.473830'), lng: Number('-0.375710') },
                    imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
                    imagen2: "imagenes/imagenes-aventuras/Plaza_Reina_2.jpg",
                    imagen3: "imagenes/imagenes-aventuras/torre_santa_catalina.jpg",
                    video: ""
                },
                // Parada 12 - Torre Barroca de Santa Catalina (Reto11Puzzle PZ-17) (Párrafos: 169, 419, 14-C, 420, 425, 141)
                {
                    id: "AvFallas-P-12",
                    tipo: "parada",
                    parada: 14, // mapa número 10
                    mapa_numero: 10,
                    nombre: "Torre Barroca de Santa Catalina",
                    coordenadas: { lat: Number('39.473830'), lng: Number('-0.375710') },
                    imagen: "imagenes/imagenes-aventuras/torre_santa_catalina.jpg",
                },
                // Tramo 8: Torre Barroca de Santa Catalina → Plaza del Ayuntamiento (Párrafos: 170, 15)
    {
        id: "AvFallas-TR-8",
        tipo: "tramo",
        tramo: 8, // De mapa número 10 a mapa número 11
        mapa_numero: "10→11",
        nombre: "Torre Barroca de Santa Catalina → Plaza del Ayuntamiento",
        inicio: { lat: Number('39.473830'), lng: Number('-0.375710') },
        waypoints: [
            { lat: Number('39.473740'), lng: Number('-0.375660') },
            { lat: Number('39.473420'), lng: Number('-0.375920') },
            { lat: Number('39.473020'), lng: Number('-0.376220') },
            { lat: Number('39.472470'), lng: Number('-0.376630') },
            { lat: Number('39.472120'), lng: Number('-0.376760') },
            { lat: Number('39.471440'), lng: Number('-0.376890') },
        ],
        fin: { lat: Number('39.470560'), lng: Number('-0.376770') },
        imagen: "imagenes/imagenes-aventuras/torre_santa_catalina.jpg",
        imagen2: "imagenes/imagenes-aventuras/calle_san_Vicente_2.jpg",
        imagen3: "imagenes/imagenes-aventuras/plaza_del_ayuntamiento.jpg",
        video: "",
    },
    // Parada 15: Plaza del Ayuntamiento (Párrafos: 263, 346, 143)
    {
        id: "AvFallas-P-13",
        tipo: "parada",
        parada: 15, // mapa número 11
        mapa_numero: 11,
        nombre: "Plaza del Ayuntamiento",
        coordenadas: { lat: Number('39.470560'), lng: Number('-0.376770') },
        imagen: "imagenes/imagenes-aventuras/plaza_del_ayuntamiento.jpg",
    },
    // Parada 16: Plaza del Ayuntamiento 2 (Mascletà) (Párrafos: 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181)
    {
        id: "AvFallas-P-14",
        tipo: "parada",
        parada: 16, // mapa número 11
        mapa_numero: 11,
        nombre: "Plaza del Ayuntamiento",
        coordenadas: { lat: Number('39.470567'), lng: Number('-0.376732') },
        imagen: "imagenes/imagenes-aventuras/plaza_del_ayuntamiento.jpg",
    },
    // Tramo 9: Plaza del Ayuntamiento → Edificio del Ayuntamiento de València (Párrafos: 187, 332, 334, 340, 19)
    {
        id: "AvFallas-TR-9",
        tipo: "tramo",
        tramo: 9, // De mapa número 11 a mapa número 12
        mapa_numero: "11→12",
        nombre: "Plaza del Ayuntamiento → Edificio del Ayuntamiento de València",
        inicio: { lat: Number('39.470560'), lng: Number('-0.376770') },
        waypoints: [
            { lat: Number('39.470070'), lng: Number('-0.376810') },
        ],
        fin: { lat: Number('39.469710'), lng: Number('-0.376930') },
        imagen: "imagenes/imagenes-aventuras/plaza_del_ayuntamiento.jpg",
        imagen2: "imagenes/imagenes-aventuras/ayuntamiento.jpg",
        video: "",
    },
    // Parada 17: Edificio del Ayuntamiento (reto 12) (Párrafos: 336, 337, 144, 338)
    {
        id: "AvFallas-P-15",
        tipo: "parada",
        parada: 17, // mapa número 12
        mapa_numero: 12,
        nombre: "Edificio del Ayuntamiento",
        coordenadas: { lat: Number('39.469710'), lng: Number('-0.376930') },
        imagen: "imagenes/imagenes-aventuras/ayuntamiento.jpg",
    },
    // Parada 18: Edificio del Ayuntamiento 2 (Creación de una Falla) (Párrafos: 182, 183, 184, 185)
    {
        id: "AvFallas-P-16",
        tipo: "parada",
        parada: 18, // mapa número 12
        mapa_numero: 12,
        nombre: "Edificio del Ayuntamiento",
        coordenadas: { lat: Number('39.469610'), lng: Number('-0.376870') },
        imagen: "imagenes/imagenes-aventuras/ayuntamiento.jpg",
    },
    // Tramo 10: Edificio del Ayuntamiento → Palacio de Comunicaciones (Correos) (Párrafos: 188)
    {
        id: "AvFallas-TR-10",
        tipo: "tramo",
        tramo: 10, // De mapa número 12 a mapa número 13
        mapa_numero: "12→13",
        nombre: "Edificio del Ayuntamiento → Palacio de Comunicaciones (Correos)",
        inicio: { lat: Number('39.469610'), lng: Number('-0.376870') },
        waypoints: [
            { lat: Number('39.469409'), lng: Number('-0.376853') },
            { lat: Number('39.469365'), lng: Number('-0.376608') },
            { lat: Number('39.469330'), lng: Number('-0.376148') },
            { lat: Number('39.469358'), lng: Number('-0.376060') },
            { lat: Number('39.469224'), lng: Number('-0.375661') },
        ],
        fin: { lat: Number('39.469420'), lng: Number('-0.375590') },
        imagen: "imagenes/imagenes-aventuras/ayuntamiento.jpg",
        imagen2: "imagenes/imagenes-aventuras/correos.jpg",
        video: "",
    },
    // Parada 19: Palacio de Comunicaciones (Correos) (Reto 13) (Párrafos: 343, 344)
    {
        id: "AvFallas-P-17",
        tipo: "parada",
        parada: 19, // mapa número 13
        mapa_numero: 13,
        nombre: "Palacio de Comunicaciones - Correos",
        coordenadas: { lat: Number('39.469420'), lng: Number('-0.375590') },
        imagen: "imagenes/imagenes-aventuras/correos.jpg",
    },

    // Parada 20: Edificio Suay - La Equitativa (Reto 14) (Párrafos: 693-C, 455, 693-B)
    {
        id: "AvFallas-P-18",
        tipo: "parada",
        parada: 20, // mapa número 14
        mapa_numero: 14,
        nombre: "Edificio Suay - La Equitativa",
        coordenadas: { lat: Number('39.469610'), lng: Number('-0.375680') },
        imagen: "imagenes/imagenes-aventuras/edificio_suay.jpg",
    },
    // Tramo 11: Palacio de Comunicaciones (Correos) → Mercado Central (Párrafos: 189)
    {
        id: "AvFallas-TR-11",
        tipo: "tramo",
        tramo: 11, // De mapa número 14 a mapa número 15
        mapa_numero: "14→15",
        nombre: "Palacio de Comunicaciones → Mercado Central",
        inicio: { lat: Number('39.469610'), lng: Number('-0.375680') },
        waypoints: [
            { lat: Number('39.470272'), lng: Number('-0.375873') },
            { lat: Number('39.470873'), lng: Number('-0.376283') },
            { lat: Number('39.471367'), lng: Number('-0.376599') },
            { lat: Number('39.471985'), lng: Number('-0.376745') },
            { lat: Number('39.472272'), lng: Number('-0.376792') },
            { lat: Number('39.472260'), lng: Number('-0.376911') },
            { lat: Number('39.472790'), lng: Number('-0.377313') },
            { lat: Number('39.473489'), lng: Number('-0.377999') },
        ],
        fin: { lat: Number('39.473770'), lng: Number('-0.378320') },
        imagen: "imagenes/imagenes-aventuras/edificio_suay.jpg",
        imagen2: "",
        imagen3: "imagenes/imagenes-aventuras/mercado_central.jpg",
        video: "",
    },
    // Parada 21: Mercado central (Reto 15) (Párrafos: 701, 22-B, 361, 362, 363, 190, 364)
    {
        id: "AvFallas-P-19",
        tipo: "parada",
        parada: 21, // mapa número 15
        mapa_numero: 15,
        nombre: "Mercado central",
        coordenadas: { lat: Number('39.473770'), lng: Number('-0.378320') },
        imagen: "imagenes/imagenes-aventuras/mercado_central.jpg",
    },
    // Tramo 12: Mercado Central → Iglesia de los Santos Juanes (Párrafos: 463)
    {
        id: "AvFallas-TR-12",
        tipo: "tramo",
        tramo: 12, // De mapa número 15 a mapa número 16
        mapa_numero: "15→16",
        nombre: "Mercado Central → Iglesia de los Santos Juanes o San Juan del Mercado",
        inicio: { lat: Number('39.473770'), lng: Number('-0.378320') },
        waypoints: [
            { lat: Number('39.474080'), lng: Number('-0.378620') },
        ],
        fin: { lat: Number('39.474250'), lng: Number('-0.378950') },
        imagen: "imagenes/imagenes-aventuras/mercado_central.jpg",
        imagen2: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg",
        video: "",
    },

    // Parada 22: Iglesia de los Santos Juanes o San Juan del Mercado 1 (Reto 16) (Párrafos: 365, 366)
    {
        id: "AvFallas-P-20",
        tipo: "parada",
        parada: 22, // mapa número 16
        mapa_numero: 16,
        nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)",
        coordenadas: { lat: Number('39.474250'), lng: Number('-0.378950') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg",
    },

    // Parada 23: Iglesia de los Santos Juanes 2 (San Juan del Mercado) (Reto 17) (Párrafos: 368, 367)
    {
        id: "AvFallas-P-21",
        tipo: "parada",
        parada: 23, // mapa número 16
        mapa_numero: 16,
        nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)",
        coordenadas: { lat: Number('39.474240'), lng: Number('-0.378890') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg",
    },
    // Tramo 13: Iglesia Santos Juanes (San Juan del Mercado) → Lonja de Valencia (Mercado de la Seda) (Párrafos: 369, 24-D)
    {
        id: "AvFallas-TR-13",
        tipo: "tramo",
        tramo: 13, // De mapa número 16 a mapa número 17
        mapa_numero: "16→17",
        nombre: "Iglesia Santos Juanes → Lonja de València (Mercado de la Seda)",
        inicio: { lat: Number('39.474240'), lng: Number('-0.378890') },
        waypoints: [],
        fin: { lat: Number('39.474220'), lng: Number('-0.378750') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg",
        imagen2: "imagenes/imagenes-aventuras/lonja.jpg",
        video: "",
    },
    // Parada 24: Lonja (Mercado de la Seda) historia (Reto18Puzzle PZ-04) (Párrafos: 370, 371, 372, 373, 374, 140)
    {
        id: "AvFallas-P-22",
        tipo: "parada",
        parada: 24, // mapa número 17
        mapa_numero: 17,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474220'), lng: Number('-0.378750') },
        imagen: "imagenes/imagenes-aventuras/lonja.jpg",
    },
    // Parada 25: Lonja (Mercado de la Seda) historia palabra Fallas (Párrafos: 191, 192, 193, 194, 195, 196, )
    {
        id: "AvFallas-P-23",
        tipo: "parada",
        parada: 25, // mapa número 17
        mapa_numero: 17,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474270'), lng: Number('-0.378719') },
        imagen: "imagenes/imagenes-aventuras/lonja.jpg",
    },
    // Tramo 14: Rodeando la Lonja (Mercado de la Seda) (Párrafos: 388, 392, 333)
    {
        id: "AvFallas-TR-14",
        tipo: "tramo",
        tramo: 14, // De mapa número 17 a mapa número 17
        mapa_numero: "14→14",
        nombre: "Lonja (Mercado de la Seda)",
        inicio: { lat: Number('39.474270'), lng: Number('-0.378719') },
        waypoints: [
            { lat: Number('39.47439'), lng: Number('-0.37887') },
            { lat: Number('39.47445'), lng: Number('-0.37889') },
            { lat: Number('39.47456'), lng: Number('-0.3787') },
            { lat: Number('39.474750'), lng: Number('-0.378420') },
        ],
        fin: { lat: Number('39.474660'), lng: Number('-0.378340') },
        imagen: "imagenes/imagenes-aventuras/Lonja_esquina_izquierda.jpg",
        imagen2: "imagenes/imagenes-aventuras/Lonja_patio_naranjos_far_view.jpg",
        imagen3: "imagenes/imagenes-aventuras/Lonja_patio_naranjos_close_view.jpg",
        imagen4: "imagenes/imagenes-aventuras/Lonja-puerta-visitante.jpg",
        video: "",
    },
     // Tramo 15: Lonja (Mercado de la Seda) -entrada visitantes →  Plaza Doctor López Collado (Párrafos: 197, 397, 27-B)
    {
        id: "AvFallas-TR-15",
        tipo: "tramo",
        tramo: 15, // De mapa número 17 a mapa número 18
        mapa_numero: "17→18",
        nombre: "Lonja (Mercado de la Seda) → Plaza Doctor López Collado",
        inicio: { lat: Number('39.474660'), lng: Number('-0.378340') },
        waypoints: [
            { lat: Number('39.474530'), lng: Number('-0.378190') },
            { lat: Number('39.474360'), lng: Number('-0.378000') },
        ],
        fin: { lat: Number('39.474440'), lng: Number('-0.377900') },
        imagen: "imagenes/imagenes-aventuras/Lonja-puerta-visitante.jpg",
        imagen2: "imagenes/imagenes-aventuras/lonja2.jpg",
        imagen3: "imagenes/imagenes-aventuras/Plaza_collado.jpg",
        video: "",
    },

    // Parada 26: Plaza Doctor López Collado (Párrafos: 398)
    {
        id: "AvFallas-P-24",
        tipo: "parada",
        parada: 26, // mapa número 18
        mapa_numero: 18,
        nombre: "Plaza Doctor López Collado",
        coordenadas: { lat: Number('39.474440'), lng: Number('-0.377900') },
        imagen: "imagenes/imagenes-aventuras/lonja7.jpg",
        imagen2: "imagenes/imagenes-aventuras/Plaza_collado.jpg",
    },

    // Tramo 16: Plaza del Doctor López Collado → Plaza del Negrito (Párrafos: 198, 671, 522, 199)
    {
        id: "AvFallas-TR-16",
        tipo: "tramo",
        tramo: 16, // De mapa número 18 a mapa número 19
        mapa_numero: "18→19",
        nombre: "Plaza del Doctor Collado → Plaza del Negrito (Fuente del Negrito)",
        inicio: { lat: Number('39.474440'), lng: Number('-0.377900') },
        waypoints: [
            { lat: Number('39.474670'), lng: Number('-0.377660') },
            { lat: Number('39.474760'), lng: Number('-0.377590')},
            { lat: Number('39.474930'), lng: Number('-0.377610') },
            { lat: Number('39.475290'), lng: Number('-0.377680') },
            { lat: Number('39.475590'), lng: Number('-0.377720') },
            { lat: Number('39.475850'), lng: Number('-0.377590') },
        ],
        fin: { lat: Number('39.476110'), lng: Number('-0.377410') },
        imagen: "imagenes/imagenes-aventuras/Plaza_collado.jpg",
        imagen2: "imagenes/imagenes-aventuras/Plaza_negrito.jpg",
        imagen3: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
        video: "",
    },

    // Parada 27: Fuente del Negrito (Reto 19) (Párrafos: 382, 501)
    {
        id: "AvFallas-P-25",
        tipo: "parada",
        parada: 27, // mapa número 19
        mapa_numero: 19,
        nombre: "Fuente del Negrito",
        coordenadas: { lat: Number('39.476110'), lng: Number('-0.377410') },
        imagen: "imagenes/imagenes-aventuras/Plaza_negrito.jpg",
        image2: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
    },

    // Tramo 17: Plaza del Negrito → Calle Caballeros → Palacio de la Generalitat (Párrafos: 280, 486, 288)
    {
        id: "AvFallas-TR-17",
        tipo: "tramo",
        tramo: 17, // De mapa número 19 a mapa número 21
        mapa_numero: "19→21",
        nombre: "Plaza del Negrito → Calle Caballeros → Palacio de la Generalitat",
        inicio: { lat: Number('39.476110'), lng: Number('-0.377410') },
        waypoints: [
            { lat: Number('39.476390'), lng: Number('-0.377360') },
            { lat: Number('39.476630'), lng: Number('-0.377300') },
            { lat: Number('39.476610'), lng: Number('-0.376850') }
        ],
        fin: { lat: Number('39.476610'), lng: Number('-0.376730') },
        imagen: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
        imagen2: "imagenes/imagenes-aventuras/Calle_caballeros.jpg",
        imagen3: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
        video: "",
    },

    // Parada 28: Palau de la Generalitat (Párrafos: 481-B, 482-B)
    {
        id: "AvFallas-P-26",
        tipo: "parada",
        parada: 28, // mapa número 21
        mapa_numero: 21,
        nombre: "Palau de la Generalitat",
        coordenadas: { lat: Number('39.476680'), lng: Number('-0.376710') },
        imagen: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
    },

     // Tramo 18: Palacio de la Generalitat → Calle de los Serranos (Párrafos: 2-D, 289, 436, 448, 449)
    {
        id: "AvFallas-TR-18",
        tipo: "tramo",
        tramo: 18, // De mapa número 21 a mapa número 1
        mapa_numero: "21→1",
        nombre: "Palacio de la Generalitat → Calle de los Serranos",
        inicio: { lat: Number('39.476680'), lng: Number('-0.376710') },
        waypoints: [
            { lat: Number('39.476870'), lng: Number('-0.376860') },
            { lat: Number('39.477300'), lng: Number('-0.376890') },
            { lat: Number('39.477730'), lng: Number('-0.376710') },
        ],
        fin: { lat: Number('39.478590'), lng: Number('-0.376330') },
        imagen:"imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
        imagen2: "imagenes/imagenes-aventuras/Calle_serranos.jpg",
        imagen3: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
        video: ""
    },

    // Parada 27 - FINAL: Torres de Serranos Final (Reto20Puzzle PZ-05) (Párrafos: 475, 503, 507, 526,)
    {
        id: "AvFallas-P-27",
        tipo: "parada",
        parada: 29, // mapa número 1
        mapa_numero: 1,
        nombre: "Torres de Serranos",
        coordenadas: { lat: Number('39.478590'), lng: Number('-0.376330') },
        imagen: "imagenes/imagenes-aventuras/Calle_serranos.jpg",
        imagen2: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg"
    },
       ]
    }
  },
  Aventura34km: {
    "coordenadas-hijo2.html": {
      coordenadas: [
        /* array de coordenadas hijo2 (Aventura 34km) */


                 // Coordenadas completas Aventura 34km
    // Parada 0 - Torres de Serranos (start) (Reto 3) (Párrafos: 223, 226, 228)
    {
        id: "Av34km-P-2",
        tipo: "inicio",
        parada: 2, // mapa número 1
        mapa_numero: 1,
        nombre: "Torres de Serranos (start)",
        coordenadas: { lat: Number('39.478760'), lng: Number('-0.376260') },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
    },

    // Tramo 1: Torres de Serranos → Plaza de la Crída (Torres de Serranos Front) (Párrafos: 229, 5)
    {
        id: "Av34km-TR-1",
        tipo: "tramo",
        tramo: 1, // De mapa número 1 a mapa número 2
        mapa_numero: "1→2",
        nombre: "Torres de Serranos → Plaza de la Crída",
        inicio: { lat: Number('39.478760'), lng: Number('-0.376260') },
        waypoints: [
            { lat: Number('39.479050'), lng: Number('-0.376130') },
            { lat: Number('39.479341'), lng: Number('-0.376408') },
            { lat: Number('39.479500'), lng: Number('-0.376210') },
            { lat: Number('39.479430'), lng: Number('-0.375970') }
        ],
        fin: { lat: Number('39.479590'), lng: Number('-0.375830') },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg",
        imagen2: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        video: "",
    },
    // Parada 3: Plaza de la Crída (Torres de Serranos Front) (Reto4Puzzle PZ-19) (Párrafos: 126)
    {
        id: "Av34km-P-3",
        tipo: "parada",
        parada: 3, // mapa número 2
        mapa_numero: 2,
        nombre: "Plaza de la Crída",
        coordenadas: { lat: Number('39.480620'), lng: Number('-0.375350') },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
    },
    // Tramo 2: Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos 1 (Párrafos: 230)
    {
        id: "Av34km-TR-2",
        tipo: "tramo",
        tramo: 2, // De mapa número 2 a sin número de mapa (Centro Puente de Serranos)
        mapa_numero: "2→-",
        nombre: "Plaza de la Crída → Centro Puente de Serranos",
        inicio: { lat: Number('39.480620'), lng: Number('-0.375350') },
        waypoints:
        [
            { lat: Number('39.480260'), lng: Number('-0.375530') },
        ],
        fin: { lat: Number('39.480640'), lng: Number('-0.375340') },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_serranos_2.jpg",
        imagen3:"imagenes/imagenes-aventuras/puente_serranos.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_serranos_3.jpg",
        video: "",
    },
    // Parada 4: Centro Puente Serranos (Párrafos: 231, 232, 234, 6, 235, 224)
    {
        id: "Av34km-P-4",
        tipo: "parada",
        parada: 4, // Sin número de mapa
        mapa_numero: "-",
        nombre: "Centro Puente Serranos",
        coordenadas: { lat: Number('39.480640'), lng: Number('-0.375340') },
        imagen: "imagenes/imagenes-aventuras/puente_serranos_3.jpg",
    },
    // Tramo 3: Centro Puente de Serranos → Puente de la Exposición (Párrafos: 236-A, 236-B)
    {
        id: "Av34km-TR-3",
        tipo: "tramo",
        tramo: 3, // De sin número de mapa (Centro Puente de Serranos) a mapa número 4
        mapa_numero: "-→4",
        nombre: "Centro Puente de Serranos → Puente de la Exposición",
        inicio: { lat: Number('39.480640'), lng: Number('-0.375340') },
        waypoints:
        [
            { lat: Number('39.480020'), lng: Number('-0.375640') },
            { lat: Number('39.479570'), lng: Number('-0.375880') },
            { lat: Number('39.479480'), lng: Number('-0.375800') },
            { lat: Number('39.479270'), lng: Number('-0.375330') },
            { lat: Number('39.479240'), lng: Number('-0.375220') },
            { lat: Number('39.479170'), lng: Number('-0.375060') },
            { lat: Number('39.479110'), lng: Number('-0.374920') },
            { lat: Number('39.479060'), lng: Number('-0.374840') },
            { lat: Number('39.479040'), lng: Number('-0.374780') },
            { lat: Number('39.478980'), lng: Number('-0.374680') },
            { lat: Number('39.478930'), lng: Number('-0.374560') },
            { lat: Number('39.478870'), lng: Number('-0.374430') },
            { lat: Number('39.478640'), lng: Number('-0.373910') },
            { lat: Number('39.478490'), lng: Number('-0.373540') },
            { lat: Number('39.478350'), lng: Number('-0.373220') },
            { lat: Number('39.478150'), lng: Number('-0.372920') },
            { lat: Number('39.478210'), lng: Number('-0.372790') },
            { lat: Number('39.477920'), lng: Number('-0.372320') },
            { lat: Number('39.477720'), lng: Number('-0.371990') },
            { lat: Number('39.477720'), lng: Number('-0.371970') },
            { lat: Number('39.477730'), lng: Number('-0.371950') },
            { lat: Number('39.477790'), lng: Number('-0.371910') },
            { lat: Number('39.477769'), lng: Number('-0.371943') },
            { lat: Number('39.477101'), lng: Number('-0.370926') },
            { lat: Number('39.476541'), lng: Number('-0.370091') },
            { lat: Number('39.476460'), lng: Number('-0.369916') },
            { lat: Number('39.476196'), lng: Number('-0.369499') },
            { lat: Number('39.475416'), lng: Number('-0.368847') },
            { lat: Number('39.474515'), lng: Number('-0.368177') },
            { lat: Number('39.474033'), lng: Number('-0.367775') },
            { lat: Number('39.474008'), lng: Number('-0.367508') },
            { lat: Number('39.474227'), lng: Number('-0.366904') },
            { lat: Number('39.473805'), lng: Number('-0.366658') },
            { lat: Number('39.473376'), lng: Number('-0.366300') },
        ],
        fin: { lat: Number('39.473375'), lng: Number('-0.366101') },
        imagen: "imagenes/imagenes-aventuras/puente_serranos_3.jpg",
        imagen2: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        imagen3: "imagenes/imagenes-aventuras/serranos_pont_fusta.jpg",
        imagen4: "imagenes/imagenes-aventuras/pont_fusta.jpg",
        imagen5: "imagenes/imagenes-aventuras/museo_bellas_artes.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_real_down.jpg",
        imagen3: "imagenes/imagenes-aventuras/pont_de_la_exposicio.jpg",
        video: "",
    },
    // Parada 5: Puente de la Exposición (Peineta) (Reto 5) (Párrafos: 237, 238, 70, 480, 240, 239)
    {
        id: "Av34km-P-5",
        tipo: "parada",
        parada: 5, // mapa número 4
        mapa_numero: 4,
        nombre: "Puente de la Exposición",
        coordenadas: { lat: Number('39.473375'), lng: Number('-0.366101') },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_exposicio.jpg",
    },
    // Tramo 4: Puente de la Exposición (Peineta) → Puente de las Flores (Párrafos: 225, 8)
    {
        id: "Av34km-TR-4",
        tipo: "tramo",
        tramo: 4, // De mapa número 4 a mapa número 5
        mapa_numero: "4→5",
        nombre: "Puente de la Exposición → Puente de las Flores",
        inicio: { lat: Number('39.473430'), lng: Number('-0.366170') },
        waypoints:
        [
            { lat: Number('39.473200'), lng: Number('-0.366530') },
            { lat: Number('39.473010'), lng: Number('-0.366910') },
            { lat: Number('39.472320'), lng: Number('-0.366340') },
            { lat: Number('39.471950'), lng: Number('-0.366030') },
            { lat: Number('39.471280'), lng: Number('-0.365480') },
        ],
        fin: { lat: Number('39.470800'), lng: Number('-0.365070') },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_exposicio.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_flores-down.jpg",
        video: "",
    },
    // Parada 6: Puente de las Flores (Párrafos: 241, 570)
    {
        id: "Av34km-P-6",
        tipo: "parada",
        parada: 6, // mapa número 5
        mapa_numero: 5,
        nombre: "Puente de las Flores",
        coordenadas: { lat: Number('39.470800'), lng: Number('-0.365070') },
        imagen: "imagenes/imagenes-aventuras/puente-de_las_flores.jpg",
    },
    // Tramo 5: Puente de las Flores → Puente de Aragón (parte superior) (Párrafos: 242, 10, 243, 11)
    {
        id: "Av34km-TR-5",
        tipo: "tramo",
        tramo: 5, // De mapa número 5 a mapa número 7
        mapa_numero: "5→7",
        nombre: "Puente de las Flores → Puente de Aragón",
        inicio: { lat: Number('39.470800'), lng: Number('-0.365070') },
        waypoints:
        [
            { lat: Number('39.470130'), lng: Number('-0.364480') },
            { lat: Number('39.470150'), lng: Number('-0.364140') },
            { lat: Number('39.469820'), lng: Number('-0.363800') },
            { lat: Number('39.470080'), lng: Number('-0.363090') },
            { lat: Number('39.470340'), lng: Number('-0.363210') },
            { lat: Number('39.470350'), lng: Number('-0.362860') },
            { lat: Number('39.470000'), lng: Number('-0.362560') },
            { lat: Number('39.469470'), lng: Number('-0.362250') },
            { lat: Number('39.469490'), lng: Number('-0.362200') },
            { lat: Number('39.469140'), lng: Number('-0.361990') },
            { lat: Number('39.468960'), lng: Number('-0.361920') },
            { lat: Number('39.468940'), lng: Number('-0.362310') },
        ],
        fin: { lat: Number('39.468910'), lng: Number('-0.362860') },
        imagen: "imagenes/imagenes-aventuras/puente-de_las_flores.jpg",
        imagen2: "imagenes/imagenes-aventuras/pont_de_la_mar_down.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente_aragon_subida.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_aragon_top.jpg",
        video: "",
    },
    // Parada 7: Puente de Aragón (Reto 6) (Párrafos: 244, 246)
    {
        id: "Av34km-P-7",
        tipo: "parada",
        parada: 7, // mapa número 7
        mapa_numero: 7,
        nombre: "Puente de Aragón",
        coordenadas: { lat: Number('39.468910'), lng: Number('-0.362860') },
        imagen: "imagenes/imagenes-aventuras/puente_aragon_top.jpg",
        imagen2: "imagenes/imagenes-aventuras/Puente_de_aragon_vista.jpg",
    },
    // Tramo 6: Puente de Aragón (parte superior) → Puente de la Mar (Parte Superior) (Párrafos: 247, 10)
    {
        id: "Av34km-TR-6",
        tipo: "tramo",
        tramo: 6, // De mapa número 7 a mapa número 6
        mapa_numero: "7→6",
        nombre: "Puente de Aragón → Puente de la Mar",
        inicio: { lat: Number('39.468920'), lng: Number('-0.362880') },
        waypoints:
        [
            { lat: Number('39.468910'), lng: Number('-0.363290') },
            { lat: Number('39.468880'), lng: Number('-0.363980') },
            { lat: Number('39.469460'), lng: Number('-0.364420') },
        ],
        fin: { lat: Number('39.470010'), lng: Number('-0.364770') },
        imagen: "imagenes/imagenes-aventuras/puente_aragon_top.jpg",
        imagen2: "imagenes/imagenes-aventuras/pont_de_la_mar_top.jpg",
        video: "",
    },
    // Parada 8: Puente de la Mar (Parte Superior) (Reto 7) (Párrafos: 248, 249)
    {
        id: "Av34km-P-8",
        tipo: "parada",
        parada: 8, // mapa número 6
        mapa_numero: 6,
        nombre: "Puente de la Mar",
        coordenadas: { lat: Number('39.470010'), lng: Number('-0.364770') },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_mar_top.jpg",
    },
    // Tramo 7: Puente de la Mar (Parte Superior) → Palacio de la Música (Párrafos: 250, 251, 12)
    {
        id: "Av34km-TR-7",
        tipo: "tramo",
        tramo: 7, // De mapa número 6 a mapa número 8
        mapa_numero: "6→8",
        nombre: "Puente de la Mar → Palacio de la Música",
        inicio: { lat: Number('39.470010'), lng: Number('-0.364770') },
        waypoints:
        [
            { lat: Number('39.469870'), lng: Number('-0.364670') },
            { lat: Number('39.469880'), lng: Number('-0.364530') },
            { lat: Number('39.469310'), lng: Number('-0.364190') },
            { lat: Number('39.468650'), lng: Number('-0.363580') },
            { lat: Number('39.467950'), lng: Number('-0.363160') },
            { lat: Number('39.466230'), lng: Number('-0.362090') },
            { lat: Number('39.466330'), lng: Number('-0.361760') },
        ],
        fin: { lat: Number('39.465800'), lng: Number('-0.361490') },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_mar_top.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_mar_bajada.jpg",
        imagen3:"imagenes/imagenes-aventuras/palau_de_la_musica.jpg",
        video: "",
    },
    // Parada 9: Palacio de la Música (Reto 8) (Párrafos: 252, 253)
    {
        id: "Av34km-P-9",
        tipo: "parada",
        parada: 9, // mapa número 8
        mapa_numero: 8,
        nombre: "Palacio de la Música",
        coordenadas:  { lat: Number('39.465800'), lng: Number('-0.361490') },
        imagen: "imagenes/imagenes-aventuras/palau_de_la_musica.jpg",
    },
    // Tramo 8: Palacio de la Música → Gulliver (Párrafos: 254, 255, 13, 256, 257, 14)
    {
        id: "Av34km-TR-8",
        tipo: "tramo",
        tramo: 8, // De mapa número 8 a mapa número 10
        mapa_numero: "8→10",
        nombre: "Palacio de la Música → Gulliver",
        inicio: { lat: Number('39.465800'), lng: Number('-0.361490') },
        waypoints:
        [
            { lat: Number('39.465260'), lng: Number('-0.361140') },
            { lat: Number('39.465460'), lng: Number('-0.360590') },
            { lat: Number('39.465350'), lng: Number('-0.360410') },
            { lat: Number('39.464990'), lng: Number('-0.359970') },
            { lat: Number('39.464490'), lng: Number('-0.359670') },
            { lat: Number('39.463980'), lng: Number('-0.359480') },
            { lat: Number('39.463100'), lng: Number('-0.359170') },
        ],
        fin: { lat: Number('39.462980'), lng: Number('-0.359720') },
        imagen: "imagenes/imagenes-aventuras/palau_de_la_musica.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_angel_custodio.jpg",
        imagen3: "imagenes/imagenes-aventuras/gulliver.jpg",
        video: "",
    },
    // Parada 10: Gulliver (Reto 9) (Párrafos: 258, 260, 259)
    {
        id: "Av34km-P-10",
        tipo: "parada",
        parada: 10, // mapa número 10
        mapa_numero: 10,
        nombre: "Gulliver",
        coordenadas:  { lat: Number('39.462980'), lng: Number('-0.359720') },
        imagen: "imagenes/imagenes-aventuras/gulliver.jpg",
        imagen2: "imagenes/imagenes-aventuras/gulliver_maqueta.jpg",
        imagen3: "imagenes/imagenes-aventuras/gulliver_dentro.jpg",
    },
    // Tramo 9: Gulliver → Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias (Párrafos: 261, 15, 16)
    {
        id: "Av34km-TR-9",
        tipo: "tramo",
        tramo: 9, // De mapa número 10 a mapa número 11
        mapa_numero: "10→11",
        nombre: "Gulliver → Pistas de Patinaje",
        inicio: { lat: Number('39.462980'), lng: Number('-0.359720') },
        waypoints:
        [
            { lat: Number('39.463100'), lng: Number('-0.359170') },
            { lat: Number('39.463300'), lng: Number('-0.358890') },
            { lat: Number('39.463260'), lng: Number('-0.358860') },
            { lat: Number('39.462900'), lng: Number('-0.358640') },
            { lat: Number('39.462790'), lng: Number('-0.358660') },
            { lat: Number('39.462460'), lng: Number('-0.358440') },
            { lat: Number('39.462320'), lng: Number('-0.358350') },
            { lat: Number('39.462160'), lng: Number('-0.358200') },
            { lat: Number('39.461970'), lng: Number('-0.358140') },
            { lat: Number('39.460970'), lng: Number('-0.357580') },
            { lat: Number('39.460430'), lng: Number('-0.357100') },
            { lat: Number('39.460330'), lng: Number('-0.357350') },
            { lat: Number('39.460030'), lng: Number('-0.357710') },
        ],
        fin: { lat: Number('39.459850'), lng: Number('-0.357590') },
        imagen: "imagenes/imagenes-aventuras/gulliver.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_reino.jpg",
        imagen3:"imagenes/imagenes-aventuras/puente_reino_gargola.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_reino_gargola_down.jpg",
        imagen5:"imagenes/imagenes-aventuras/CAC_patinaje.jpg",
        video: "",
    },
    // Parada 11: Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias (Párrafos: 262, 17, 264, 265, 266, 18, 267, 19)
    {
        id: "Av34km-P-11",
        tipo: "parada",
        parada: 11, // mapa número 11
        mapa_numero: 11,
        nombre: "Pistas de Patinaje",
        coordenadas:  { lat: Number('39.459850'), lng: Number('-0.357590') },
        imagen: "imagenes/imagenes-aventuras/CAC_patinaje.jpg",
    },
    // Tramo 10: Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe (Párrafos: 268, 269)
    {
        id: "Av34km-TR-10",
        tipo: "tramo",
        tramo: 10, // De mapa número 11 a sin número de mapa
        mapa_numero: "11→-",
        nombre: "Pistas de Patinaje → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe",
        inicio: { lat: Number('39.459850'), lng: Number('-0.357590') },
        waypoints:
        [
            //comentadas porque la ruta ha cambiado pero aún pueden ser útiles en el futuro//
            //{ lat: Number('39.460030'), lng: Number('-0.357710') },
            //{ lat: Number('39.460330'), lng: Number('-0.357350') },
            //{ lat: Number('39.460430'), lng: Number('-0.357100') },
            //{ lat: Number('39.460210'), lng: Number('-0.356610') },
            //{ lat: Number('39.460110'), lng: Number('-0.356270') },
            //{ lat: Number('39.460250'), lng: Number('-0.356050') },
            //{ lat: Number('39.460250'), lng: Number('-0.356020') },
            //{ lat: Number('39.460210'), lng: Number('-0.355980') },
            //{ lat: Number('39.460230'), lng: Number('-0.355890') },
            //{ lat: Number('39.460210'), lng: Number('-0.355800') },
            //{ lat: Number('39.460240'), lng: Number('-0.355770') },
            //{ lat: Number('39.460230'), lng: Number('-0.355680') },
            //{ lat: Number('39.460280'), lng: Number('-0.355590') },
            //{ lat: Number('39.460150'), lng: Number('-0.355200') },
            //{ lat: Number('39.459890'), lng: Number('-0.354460') },
            //{ lat: Number('39.459830'), lng: Number('-0.354450') },
            //{ lat: Number('39.459800'), lng: Number('-0.354420') },
            //{ lat: Number('39.459790'), lng: Number('-0.354370') },
            //{ lat: Number('39.459750'), lng: Number('-0.354350') },
            //{ lat: Number('39.459690'), lng: Number('-0.354300') },
            //{ lat: Number('39.459480'), lng: Number('-0.354140') },
            //{ lat: Number('39.459350'), lng: Number('-0.354070') },
            //{ lat: Number('39.459220'), lng: Number('-0.353830') },
            //{ lat: Number('39.459080'), lng: Number('-0.353410') },
            //{ lat: Number('39.459100'), lng: Number('-0.353360') },
            //{ lat: Number('39.459090'), lng: Number('-0.353310') },
            //{ lat: Number('39.458990'), lng: Number('-0.353000') },
            //{ lat: Number('39.458910'), lng: Number('-0.352770') },
            //{ lat: Number('39.458920'), lng: Number('-0.352740') },
            //{ lat: Number('39.458900'), lng: Number('-0.352710') },
            //{ lat: Number('39.458890'), lng: Number('-0.352670') },
            //{ lat: Number('39.458850'), lng: Number('-0.352610') },
            //{ lat: Number('39.458790'), lng: Number('-0.352530') },
            //{ lat: Number('39.458730'), lng: Number('-0.352460') },
            //{ lat: Number('39.458720'), lng: Number('-0.352380') },
            //{ lat: Number('39.458690'), lng: Number('-0.352320') },
            //{ lat: Number('39.458490'), lng: Number('-0.352200') },
            //{ lat: Number('39.458410'), lng: Number('-0.352080') },
            //{ lat: Number('39.458310'), lng: Number('-0.352010') },
            //{ lat: Number('39.458300'), lng: Number('-0.352000') },
            //{ lat: Number('39.458270'), lng: Number('-0.351950') },
            //{ lat: Number('39.458220'), lng: Number('-0.351900') },
            //{ lat: Number('39.458140'), lng: Number('-0.351870') },
            //{ lat: Number('39.458110'), lng: Number('-0.351810') },
            //{ lat: Number('39.458130'), lng: Number('-0.351520') },
            //{ lat: Number('39.458070'), lng: Number('-0.351400') },
            //{ lat: Number('39.457790'), lng: Number('-0.351350') },
            //{ lat: Number('39.457580'), lng: Number('-0.350920') },
            //{ lat: Number('39.457500'), lng: Number('-0.350590') },
            //{ lat: Number('39.456790'), lng: Number('-0.349900') },
            //{ lat: Number('39.456780'), lng: Number('-0.349860') },
            //FIN comentadas porque la ruta ha cambiado pero aún pueden ser útiles en el futuro//
            { lat: Number('39.460116'), lng: Number('-0.357540') },
            { lat: Number('39.460265'), lng: Number('-0.357193') },
            { lat: Number('39.460428'), lng: Number('-0.357201') },
            { lat: Number('39.460470'), lng: Number('-0.357087') },
            { lat: Number('39.460452'), lng: Number('-0.356951') },
            { lat: Number('39.460553'), lng: Number('-0.357151') },
            { lat: Number('39.460563'), lng: Number('-0.356952') },
            { lat: Number('39.460629'), lng: Number('-0.357030') },
            { lat: Number('39.460671'), lng: Number('-0.357144') },
            { lat: Number('39.460722'), lng: Number('-0.357177') },
            { lat: Number('39.460833'), lng: Number('-0.356953') },
            { lat: Number('39.461012'), lng: Number('-0.356876') },
            { lat: Number('39.460865'), lng: Number('-0.356629') },
            { lat: Number('39.460686'), lng: Number('-0.356303') },
            { lat: Number('39.460497'), lng: Number('-0.355896') },
            { lat: Number('39.460275'), lng: Number('-0.355261') },
            { lat: Number('39.460086'), lng: Number('-0.354500') },
            { lat: Number('39.459989'), lng: Number('-0.354198') },
            { lat: Number('39.459673'), lng: Number('-0.353900') },
            { lat: Number('39.459559'), lng: Number('-0.353458') },
            { lat: Number('39.459588'), lng: Number('-0.353269') },
            { lat: Number('39.459549'), lng: Number('-0.353235') },
            { lat: Number('39.459366'), lng: Number('-0.352965') },
            { lat: Number('39.459168'), lng: Number('-0.352681') },
            { lat: Number('39.458844'), lng: Number('-0.352215') },
            { lat: Number('39.458546'), lng: Number('-0.351780') },
            { lat: Number('39.457785'), lng: Number('-0.350672') },
            { lat: Number('39.457337'), lng: Number('-0.350028') },
            { lat: Number('39.457059'), lng: Number('-0.349621') },
            { lat: Number('39.456843'), lng: Number('-0.349310') },
        ],
        fin: { lat: Number('39.456730'), lng: Number('-0.349399') },
        imagen: "imagenes/imagenes-aventuras/CAC_patinaje.jpg",
        imagen2: "imagenes/imagenes-aventuras/cac_mapa.jpg",
        imagen3:"imagenes/imagenes-aventuras/pano_CAC.jpg",
        video: "",
    },
    // Parada 12: Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía (Párrafos: 270, 19, 271)
    {
        id: "Av34km-P-12",
        tipo: "parada",
        parada: 12, // mapa número 12
        mapa_numero: 12,
        nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía",
        coordenadas:  { lat: Number('39.456730'), lng: Number('-0.349399') },
        imagen: "imagenes/imagenes-aventuras/pano_CAC.jpg",
        imagen2: "imagenes/imagenes-aventuras/reina_sofia_side.jpg"
    },
    // Parada 13: Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe (Párrafos: 272, 21, 273, 275)
    {
        id: "Av34km-P-13",
        tipo: "parada",
        parada: 13, // mapa número 14
        mapa_numero: 14,
        nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe",
        coordenadas:  { lat: Number('39.456689'), lng: Number('-0.349407') },
        imagen: "imagenes/imagenes-aventuras/pano_CAC.jpg",
        imagen2: "imagenes/imagenes-aventuras/museo_principe_felipe.jpg",
        imagen3: "imagenes/imagenes-aventuras/CAC-6.jpg",
    },
    // Tramo 11: Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe → Puente l'Assut de l'Or (Párrafos: 276, 32-B)
    {
        id: "Av34km-TR-11",
        tipo: "tramo",
        tramo: 11, // De sin número de mapa a mapa número 15
        mapa_numero: "-→15",
        nombre: "Mirador de la Ciudad de las Artes y de las Ciencias → Puente l'Assut de l'Or",
        inicio: { lat: Number('39.456689'), lng: Number('-0.349407') },
        waypoints:
        [
            //comentadas porque la ruta ha cambiado pero aún pueden ser útiles en el futuro//
            //{ lat: Number('39.456661'), lng: Number('-0.349362') },
            //{ lat: Number('39.456532'), lng: Number('-0.349333') },
            //{ lat: Number('39.456457'), lng: Number('-0.349199') },
            //{ lat: Number('39.456205'), lng: Number('-0.348962') },
            //{ lat: Number('39.456353'), lng: Number('-0.348608') },
            //{ lat: Number('39.456239'), lng: Number('-0.348377') },
            //FIN comentadas porque la ruta ha cambiado pero aún pueden ser útiles en el futuro//
            { lat: Number('39.456800'), lng: Number('-0.349252') },
            { lat: Number('39.456484'), lng: Number('-0.348792') },
            { lat: Number('39.456243'), lng: Number('-0.348433') },
            { lat: Number('39.456257'), lng: Number('-0.348392') },
            { lat: Number('39.455986'), lng: Number('-0.348276') },
        ],
        fin: { lat: Number('39.455825'), lng: Number('-0.348149') },
        imagen: "imagenes/imagenes-aventuras/pano_CAC.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_Assut_2.jpg",
        video: "",
    },
    // Parada 14: Puente l'Assut de l'Or (Reto10puzzle PZ-09) (Párrafos: 277, 278)
    {
        id: "Av34km-P-14",
        tipo: "parada",
        parada: 14, // mapa número 15
        mapa_numero: 15,
        nombre: "Puente l'Assut de l'Or",
        coordenadas:  { lat: Number('39.455825'), lng: Number('-0.348149') },
        imagen: "imagenes/imagenes-aventuras/puente_Assut_2.jpg",
    },
    // Tramo 12: Puente l'Assut de l'Or → Ágora y Oceanogràfic (Párrafos: 279)
    {
        id: "Av34km-TR-12",
        tipo: "tramo",
        tramo: 12, // De mapa número 15 a mapa número 16 y 17
        mapa_numero: "15→16/17",
        nombre: "Puente l'Assut de l'Or → Ágora y Oceanogràfic",
        inicio: { lat: Number('39.455825'), lng: Number('-0.348149') },
        waypoints:
        [
            { lat: Number('39.455900'), lng: Number('-0.348190') },
            { lat: Number('39.455230'), lng: Number('-0.349190') },
            { lat: Number('39.454320'), lng: Number('-0.350550') },
            { lat: Number('39.453790'), lng: Number('-0.351300') },
            { lat: Number('39.453620'), lng: Number('-0.351120') },
        ],
        fin: { lat: Number('39.453520'), lng: Number('-0.350810') },
        imagen: "imagenes/imagenes-aventuras/puente_Assut_2.jpg",
        imagen2: "imagenes/imagenes-aventuras/agora.jpg",
        imagen3: "imagenes/imagenes-aventuras/oceanografic.jpg",
        imagen4:"imagenes/imagenes-aventuras/agora_oceanografic.jpg",
        video: "",
    },
    // Parada 15: Ágora y Oceanogràfic (Párrafos: 281, 23-D, 282, 283, 24-D, 284)
    {
        id: "Av34km-P-15",
        tipo: "parada",
        parada: 15, // mapa número 16/17
        mapa_numero: "16/17",
        nombre: "Ágora y Oceanogràfic",
        coordenadas:  { lat: Number('39.453520'), lng: Number('-0.350810') },
        imagen: "imagenes/imagenes-aventuras/agora_oceanografic.jpg",
    },
    // Tramo 13: Ágora y Oceanogràfic → Umbracle (Párrafos: 285, 27)
    {
        id: "Av34km-TR-13",
        tipo: "tramo",
        tramo: 13, // De mapa número 16/17 a mapa número 18
        mapa_numero: "16/17→18",
        nombre: "Ágora y Oceanogràfic → Umbracle",
        inicio: { lat: Number('39.453520'), lng: Number('-0.350810') },
        waypoints:
        [
            { lat: Number('39.453620'), lng: Number('-0.351120') },
            { lat: Number('39.453958'), lng: Number('-0.351566') },
            { lat: Number('39.454040'), lng: Number('-0.352035') },
            { lat: Number('39.454078'), lng: Number('-0.352015') },
            { lat: Number('39.454067'), lng: Number('-0.351911') },
            { lat: Number('39.454080'), lng: Number('-0.351803') },
            { lat: Number('39.454138'), lng: Number('-0.351741') },
            { lat: Number('39.454216'), lng: Number('-0.351765') },
            { lat: Number('39.454288'), lng: Number('-0.351873') },
            { lat: Number('39.454473'), lng: Number('-0.351941') },
            { lat: Number('39.454990'), lng: Number('-0.352570') },
            { lat: Number('39.455460'), lng: Number('-0.353270') },

        ],
        fin: { lat: Number('39.455635'), lng: Number('-0.353670') },
        imagen: "imagenes/imagenes-aventuras/agora_oceanografic.jpg",
        imagen2: "imagenes/imagenes-aventuras/umbracle.jpg",
        video: "",
    },
    // Parada 16: Umbracle (Reto 11) (Párrafos: 286, 292)
    {
        id: "Av34km-P-16",
        tipo: "parada",
        parada: 16, // mapa número 18
        mapa_numero: "18",
        nombre: "Umbracle",
        coordenadas:  { lat: Number('39.455635'), lng: Number('-0.353670') },
        imagen: "imagenes/imagenes-aventuras/umbracle.jpg",

    },
    // Tramo 14: Umbracle → Hemisféric (Párrafos: 287, 290)
    {
        id: "Av34km-TR-14",
        tipo: "tramo",
        tramo: 14, // De mapa número 18 a mapa número 19
        mapa_numero: "18→19",
        nombre: "Umbracle → Hemisféric",
        inicio: { lat: Number('39.455635'), lng: Number('-0.353670') },
        waypoints:
        [
            { lat: Number('39.456678'), lng: Number('-0.355255') },
            { lat: Number('39.457553'), lng: Number('-0.356357') },
            { lat: Number('39.458643'), lng: Number('-0.357172') },
            { lat: Number('39.459348'), lng: Number('-0.357818') },
            { lat: Number('39.459003'), lng: Number('-0.356469') },
            { lat: Number('39.458205'), lng: Number('-0.354901') },
        ],
        fin: { lat: Number('39.457675'), lng: Number('-0.353992') },
        imagen: "imagenes/imagenes-aventuras/umbracle.jpg",
        imagen2: "imagenes/imagenes-aventuras/reina_sofia_front.jpg",
        imagen3:"imagenes/imagenes-aventuras/hemisferic.jpg",
        video: "",
    },
    // Parada 17: Hemisféric (Reto 12) (Párrafos: 291, 707)
    {
        id: "Av34km-P-17",
        tipo: "parada",
        parada: 17, // mapa número 19
        mapa_numero: "19",
        nombre: "Hemisféric",
        coordenadas:  { lat: Number('39.457675'), lng: Number('-0.353992') },
        imagen: "imagenes/imagenes-aventuras/hemisferic.jpg",
    },
    // Tramo 15: Ciudad de las Artes y las Ciencias → Puente de la Mar (Párrafos: 293, 30)
    {
        id: "Av34km-TR-15",
        tipo: "tramo",
        tramo: 15, // De mapa número 19 a mapa número 6
        mapa_numero: "19→6",
        nombre: "Ciudad de las Artes y las Ciencias → Puente de la Mar",
        inicio: { lat: Number('39.457675'), lng: Number('-0.353992') },
        waypoints:
        [
            { lat: Number('39.457838'), lng: Number('-0.353730') },
            { lat: Number('39.458224'), lng: Number('-0.353780') },
            { lat: Number('39.458632'), lng: Number('-0.354407') },
            { lat: Number('39.459077'), lng: Number('-0.355962') },
            { lat: Number('39.459412'), lng: Number('-0.357080') },
            { lat: Number('39.459684'), lng: Number('-0.358352') },
            { lat: Number('39.460893'), lng: Number('-0.359343') },
            { lat: Number('39.462333'), lng: Number('-0.360201') },
            { lat: Number('39.463831'), lng: Number('-0.360717') },
            { lat: Number('39.466314'), lng: Number('-0.362187') },
            { lat: Number('39.467368'), lng: Number('-0.362825') },
            { lat: Number('39.468523'), lng: Number('-0.363562') },
            { lat: Number('39.469606'), lng: Number('-0.364172') },
            { lat: Number('39.470128'), lng: Number('-0.364533') },
            { lat: Number('39.470169'), lng: Number('-0.364142') },
            { lat: Number('39.470406'), lng: Number('-0.364173') },
        ],
        fin: { lat: Number('39.470617'), lng: Number('-0.363887') },
        imagen: "imagenes/imagenes-aventuras/pano_CAC.jpg",
        imagen2: "imagenes/imagenes-aventuras/hemisferic.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente_reino_gargola.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_reino_gargola_down.jpg",
        imagen5: "imagenes/imagenes-aventuras/puente_angel_custodio.jpg",
        imagen6: "imagenes/imagenes-aventuras/palau_de_la_musica.jpg",
        imagen7: "imagenes/imagenes-aventuras/puente_aragon-down.jpg",
        imagen8: "imagenes/imagenes-aventuras/pont_de_la_mar_down.jpg",
        video: "",
    },
    // Parada 18: Puente de la Mar (Reto 13) (Párrafos: 294, 295)
    {
        id: "Av34km-P-18",
        tipo: "parada",
        parada: 18, // mapa número 6
        mapa_numero: "6",
        nombre: "Puente de la Mar",
        coordenadas:  { lat: Number('39.470617'), lng: Number('-0.363887') },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_mar_down.jpg",
    },
    // Tramo 16: Puente de la Mar → Puerta de la Mar (Párrafos: 296, 297, 8, 298, 31, 299, 245, 32)
    {
        id: "Av34km-TR-16",
        tipo: "tramo",
        tramo: 16, // De mapa número 6 a mapa número 21
        mapa_numero: "6→21",
        nombre: "Puente de la Mar → Puerta de la Mar",
        inicio: { lat: Number('39.470617'), lng: Number('-0.363887') },
        waypoints:
        [
            { lat: Number('39.470599'), lng: Number('-0.363375') },
            { lat: Number('39.470393'), lng: Number('-0.363195') },
            { lat: Number('39.470431'), lng: Number('-0.362907') },
            { lat: Number('39.471009'), lng: Number('-0.363373') },
            { lat: Number('39.471705'), lng: Number('-0.363960') },
            { lat: Number('39.471775'), lng: Number('-0.363853') },
            { lat: Number('39.471569'), lng: Number('-0.363694') },
            { lat: Number('39.471621'), lng: Number('-0.363449') },
            { lat: Number('39.471527'), lng: Number('-0.363495') },
            { lat: Number('39.471063'), lng: Number('-0.364554') },
            { lat: Number('39.470789'), lng: Number('-0.365355') },
            { lat: Number('39.470571'), lng: Number('-0.365544') },
            { lat: Number('39.471018'), lng: Number('-0.366466') },
            { lat: Number('39.471757'), lng: Number('-0.368081') },
            { lat: Number('39.472201'), lng: Number('-0.368001') },
            { lat: Number('39.472377'), lng: Number('-0.368183') },
            { lat: Number('39.472445'), lng: Number('-0.368513') },
            { lat: Number('39.472380'), lng: Number('-0.368756') },
        ],
        fin: { lat: Number('39.472081'), lng: Number('-0.368912') },
        imagen: "imagenes/imagenes-aventuras/pont_de_la_mar_down.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_flores_subida.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente_flores_subida_2.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente-de_las_flores.jpg",
        imagen5: "imagenes/imagenes-aventuras/puente_flores_top.jpg",
        imagen6: "imagenes/imagenes-aventuras/puente_flores_agua.jpg",
        imagen7: "imagenes/imagenes-aventuras/puerta_mar.jpg",
        video: "",
    },
    // Parada 19: Puerta de la Mar (Reto 14) (Párrafos: 300, 227, 301, 302)
    {
        id: "Av34km-P-19",
        tipo: "parada",
        parada: 19, // mapa número 21
        mapa_numero: "21",
        nombre: "Puerta de la Mar",
        coordenadas:  { lat: Number('39.472081'), lng: Number('-0.368912') },
        imagen: "imagenes/imagenes-aventuras/puerta_mar.jpg",
    },
    // Tramo 17: Puerta de la Mar → Calle Colón → Casa de los Dragones (Párrafos: 303, 33)
    {
        id: "Av34km-TR-17",
        tipo: "tramo",
        tramo: 17, // De mapa número 21 a mapa número 22
        mapa_numero: "21→22",
        nombre: "Puerta de la Mar → Calle Colón → Casa de los Dragones",
        inicio: { lat: Number('39.472081'), lng: Number('-0.368912') },
        waypoints:
        [
            { lat: Number('39.471813'), lng: Number('-0.368974') },
            { lat: Number('39.471722'), lng: Number('-0.368756') },
            { lat: Number('39.471539'), lng: Number('-0.368960') },
            { lat: Number('39.471278'), lng: Number('-0.369235') },
            { lat: Number('39.470835'), lng: Number('-0.369726') },
            { lat: Number('39.470654'), lng: Number('-0.369927') },
            { lat: Number('39.470436'), lng: Number('-0.370165') },
            { lat: Number('39.470349'), lng: Number('-0.370248') },
            { lat: Number('39.470273'), lng: Number('-0.370069') },
            { lat: Number('39.470139'), lng: Number('-0.369976') },
        ],
        fin: { lat: Number('39.470192'), lng: Number('-0.369919') },
        imagen: "imagenes/imagenes-aventuras/puerta_mar.jpg",
        imagen2: "imagenes/imagenes-aventuras/calle_colon.jpg",
        imagen3: "imagenes/imagenes-aventuras/casa_dragones.jpg",
        video: "",
    },
    // Parada 20: Casa de los Dragones (Reto: 15) (Párrafos: 304, 305)
    {
        id: "Av34km-P-20",
        tipo: "parada",
        parada: 20, // mapa número 22
        mapa_numero: "22",
        nombre: "Casa de los Dragones",
        coordenadas: { lat: Number('39.470192'), lng: Number('-0.369919') },
        imagen: "imagenes/imagenes-aventuras/casa_dragones.jpg",
        imagen2: "imagenes/imagenes-aventuras/casa_dragones_dragon.jpg",
    },
    // Tramo 18: Casa de los Dragones → Mercado de Colón (Front) (Párrafos: 306, 34)
    {
        id: "Av34km-TR-18",
        tipo: "tramo",
        tramo: 18, // De mapa número 22 a mapa número 23
        mapa_numero: "22→23",
        nombre: "Casa de los Dragones → Mercado de Colón",
        inicio: { lat: Number('39.470192'), lng: Number('-0.369919') },
        waypoints:
        [
            { lat: Number('39.470099'), lng: Number('-0.369940') },
            { lat: Number('39.469897'), lng: Number('-0.369794') },
            { lat: Number('39.469042'), lng: Number('-0.369188') },
            { lat: Number('39.468706'), lng: Number('-0.368954') },
        ],
        fin: { lat: Number('39.468727'), lng: Number('-0.368908') },
        imagen: "imagenes/imagenes-aventuras/casa_dragones.jpg",
        imagen2: "imagenes/imagenes-aventuras/mercado_colon.jpg",
        video: "",
    },
    // Parada 21: Mercado de Colón 1 (Reto: 16) (Párrafos: 308, 309, 310)
    {
        id: "Av34km-P-21",
        tipo: "parada",
        parada: 21, // mapa número 23
        mapa_numero: "23",
        nombre: "Mercado de Colón",
        coordenadas: { lat: Number('39.468727'), lng: Number('-0.368908') },
        imagen: "imagenes/imagenes-aventuras/mercado_colon.jpg",
    },
    // Parada 22: Mercado de Colón 2 (Reto: 17) (Párrafos: 311, 312)
    {
        id: "Av34km-P-22",
        tipo: "parada",
        parada: 22, // mapa número 23
        mapa_numero: "23",
        nombre: "Mercado de Colón",
        coordenadas: { lat: Number('39.468722'), lng: Number('-0.368902') },
        imagen: "imagenes/imagenes-aventuras/mercado_colon.jpg",
    },
    // Parada 23: Mercado de Colón 3 (Reto: 18) (Párrafos: 313)
    {
        id: "Av34km-P-23",
        tipo: "parada",
        parada: 23, // mapa número 23
        mapa_numero: "23",
        nombre: "Mercado de Colón",
        coordenadas: { lat: Number('39.468712'), lng: Number('-0.368897') },
        imagen: "imagenes/imagenes-aventuras/mercado_colon.jpg",
    },
    // Tramo 19: Mercado de Colón Front → Mercado de Colón Back (Párrafos: 314, 307)
    {
        id: "Av34km-TR-19",
        tipo: "tramo",
        tramo: 19, // De mapa número 23 a mapa número 23
        mapa_numero: "23→23",
        nombre: "Mercado de Colón → Mercado de Colón",
        inicio: { lat: Number('39.468712'), lng: Number('-0.368897') },
        waypoints:
        [
            { lat: Number('39.468479'), lng: Number('-0.368752') },
            { lat: Number('39.468593'), lng: Number('-0.368502') },
            { lat: Number('39.468803'), lng: Number('-0.368004') },
            { lat: Number('39.468984'), lng: Number('-0.367685') },
            { lat: Number('39.469144'), lng: Number('-0.367817') },
        ],
        fin: { lat: Number('39.469161'), lng: Number('-0.367874') },
        imagen: "imagenes/imagenes-aventuras/mercado_colon.jpg",
        imagen2: "imagenes/imagenes-aventuras/mercado_de_colon_2.jpg",
        video: "",
    },
    // Parada 24: Mercado de Colón Back (Reto19Puzzle PZ-20) (Párrafos: 315, 316)
    {
        id: "Av34km-P-24",
        tipo: "parada",
        parada: 24, // mapa número 23
        mapa_numero: "23",
        nombre: "Mercado de Colón",
        coordenadas: { lat: Number('39.469161'), lng: Number('-0.367874') },
        imagen: "imagenes/imagenes-aventuras/mercado_de_colon_2.jpg",
    },
    // Tramo 20: Mercado de Colón Back → Antigua Puerta Judía de la Muralla en Calle Colón (Párrafos: 317, 35)
    {
        id: "Av34km-TR-20",
        tipo: "tramo",
        tramo: 20, // De mapa número 23 a mapa número 24
        mapa_numero: "23→24",
        nombre: "Mercado de Colón → Antigua Puerta Judía de la Muralla en Calle Colón",
        inicio: { lat: Number('39.469169'), lng: Number('-0.367883') },
        waypoints:
        [
            { lat: Number('39.469406'), lng: Number('-0.367986') },
            { lat: Number('39.469760'), lng: Number('-0.368246') },
            { lat: Number('39.470116'), lng: Number('-0.368490') },
            { lat: Number('39.470531'), lng: Number('-0.368768') },
            { lat: Number('39.471024'), lng: Number('-0.369134') },
            { lat: Number('39.471219'), lng: Number('-0.369323') },
            { lat: Number('39.470843'), lng: Number('-0.369728') },
            { lat: Number('39.470505'), lng: Number('-0.370108') },
            { lat: Number('39.470200'), lng: Number('-0.370436') },
            { lat: Number('39.470270'), lng: Number('-0.370520') },
        ],
        fin: { lat: Number('39.470209'), lng: Number('-0.370656') },
        imagen: "imagenes/imagenes-aventuras/mercado_de_colon_2.jpg",
        imagen2: "imagenes/imagenes-aventuras/calle_colon_2.jpg",
        imagen3: "imagenes/imagenes-aventuras/ruinas_calle_colon.jpg",
        video: "",
    },
    // Parada 25: Antigua Puerta Judía de la Muralla en Calle Colón (Párrafos: 318)
    {
        id: "Av34km-P-25",
        tipo: "parada",
        parada: 25, // mapa número 24
        mapa_numero: 24,
        nombre: "Antigua Puerta Judía de la Muralla en Calle Colón",
        coordenadas: { lat: Number('39.470209'), lng: Number('-0.370656') },
        imagen: "imagenes/imagenes-aventuras/ruinas_calle_colon.jpg",
    },
    // Tramo 21: Antigua Puerta Judía de la Muralla en Calle Colón → Plaza de Toros (Párrafos: 319, 36)
    {
        id: "Av34km-TR-21",
        tipo: "tramo",
        tramo: 21, // De mapa número 24 a mapa número 25
        mapa_numero: "24→25",
        nombre: "Antigua Puerta Judía de la Muralla en Calle Colón → Plaza de Toros",
        inicio: { lat: Number('39.470209'), lng: Number('-0.370656') },
        waypoints:
        [
            { lat: Number('39.470270'), lng: Number('-0.370520') },
            { lat: Number('39.470200'), lng: Number('-0.370436') },
            { lat: Number('39.470040'), lng: Number('-0.370620') },
            { lat: Number('39.469791'), lng: Number('-0.370948') },
            { lat: Number('39.469683'), lng: Number('-0.371090') },
            { lat: Number('39.469514'), lng: Number('-0.371324') },
            { lat: Number('39.469374'), lng: Number('-0.371533') },
            { lat: Number('39.469137'), lng: Number('-0.371866') },
            { lat: Number('39.468995'), lng: Number('-0.372075') },
            { lat: Number('39.468787'), lng: Number('-0.372379') },
            { lat: Number('39.468601'), lng: Number('-0.372616') },
            { lat: Number('39.468410'), lng: Number('-0.372897') },
            { lat: Number('39.468151'), lng: Number('-0.373276') },
            { lat: Number('39.467896'), lng: Number('-0.373645') },
            { lat: Number('39.467740'), lng: Number('-0.373869') },
            { lat: Number('39.467509'), lng: Number('-0.374194') },
            { lat: Number('39.467161'), lng: Number('-0.374708') },
            { lat: Number('39.467072'), lng: Number('-0.374883') },
            { lat: Number('39.467048'), lng: Number('-0.374994') },
            { lat: Number('39.467040'), lng: Number('-0.375190') },
            { lat: Number('39.467106'), lng: Number('-0.375551') },
        ],
        fin: { lat: Number('39.467031'), lng: Number('-0.375683') },
        imagen: "imagenes/imagenes-aventuras/ruinas_calle_colon.jpg",
        imagen2: "imagenes/imagenes-aventuras/calle_colon_2.jpg",
        imagen3: "imagenes/imagenes-aventuras/Plaza_Toros.jpg",
        video: "",
    },
    // Parada 26: Plaza de Toros(Reto: 20) (Párrafos: 320, 321, 323, 322)
    {
        id: "Av34km-P-26",
        tipo: "parada",
        parada: 26, // mapa número 25
        mapa_numero: 25,
        nombre: "Plaza de Toros",
        coordenadas: { lat: Number('39.467031'), lng: Number('-0.375683') },
        imagen: "imagenes/imagenes-aventuras/Plaza_Toros.jpg",
    },
    // Tramo 22: Plaza de Toros → Estación del Norte (Párrafos: 324, 37)
    {
        id: "Av34km-TR-22",
        tipo: "tramo",
        tramo: 22, // De mapa número 25 a mapa número 26
        mapa_numero: "25→26",
        nombre: "Plaza de Toros → Estación del Norte",
        inicio: { lat: Number('39.467031'), lng: Number('-0.375683') },
        waypoints:
        [
            { lat: Number('39.467215'), lng: Number('-0.375988') },
            { lat: Number('39.467318'), lng: Number('-0.376425') },
            { lat: Number('39.467411'), lng: Number('-0.376851') },
        ],
        fin: { lat: Number('39.467381'), lng: Number('-0.377117') },
        imagen: "imagenes/imagenes-aventuras/Plaza_Toros.jpg",
        imagen2: "imagenes/imagenes-aventuras/Estacion_Norte.jpg",
        video: "",
    },
    // Parada 27: (Reto: 21) (Párrafos: 325, 326)
    {
        id: "Av34km-P-27",
        tipo: "parada",
        parada: 27, // mapa número 26
        mapa_numero: 26,
        nombre: "Estación del Norte (Tren)",
        coordenadas: { lat: Number('39.467381'), lng: Number('-0.377117') },
        imagen: "imagenes/imagenes-aventuras/Estacion_Norte.jpg",
    },
    // Tramo 23: Estación del Norte (exterior) → Estación del Norte (interior) (Párrafos: 327, 330)
    {
        id: "Av34km-TR-23",
        tipo: "tramo",
        tramo: 23, // De mapa número 26 a mapa número 26
        mapa_numero: "26→26",
        nombre: "Estación del Norte → Estación del Norte",
        coordenadas: { lat: Number('39.467381'), lng: Number('-0.377117') },
        waypoints:
        [
            { lat: Number('39.467149'), lng: Number('-0.377185') },
        ],
        fin: { lat: Number('39.467000'), lng: Number('-0.377270') },
        imagen: "imagenes/imagenes-aventuras/Estacion_Norte.jpg",
        imagen2: "imagenes/imagenes-aventuras/estacion_interior_2.jpeg",
        video: "",
    },
    // Parada 28: Estación del Norte (interior) (Reto: 22) (Párrafos: 328, 329)
    {
        id: "Av34km-P-28",
        tipo: "parada",
        parada: 28, // mapa número 26
        mapa_numero: 26,
        nombre: "Estación del Norte",
        coordenadas: { lat: Number('39.467000'), lng: Number('-0.377270') },
        imagen: "imagenes/imagenes-aventuras/estacion_interior_2.jpeg",
    },
    // Tramo 24: Estación del Norte (interior) → Plaza del Ayuntamiento (Párrafos: 331)
    {
        id: "Av34km-TR-24",
        tipo: "tramo",
        tramo: 24, // De mapa número 26 a mapa número 27
        mapa_numero: "26→27",
        nombre: "Estación del Norte → Plaza del Ayuntamiento",
        coordenadas: { lat: Number('39.467000'), lng: Number('-0.377270') },
        waypoints:
        [
            { lat: Number('39.467382'), lng: Number('-0.377115') },
            { lat: Number('39.467611, -0.377288') },
            { lat: Number('39.467989, -0.377120') },
            { lat: Number('39.468307, -0.377075') },
            { lat: Number('39.468450, -0.377011') },
            { lat: Number('39.468442, -0.376905') },
            { lat: Number('39.468810, -0.376859') },
            { lat: Number('39.469071, -0.376831') },
            { lat: Number('39.469169, -0.376658') },
            { lat: Number('39.469359, -0.376649') },
            { lat: Number('39.469518, -0.376830') },
        ],
        fin: { lat: Number('39.469710'), lng: Number('-0.376930') },
        imagen: "imagenes/imagenes-aventuras/Estacion_Norte.jpg",
        imagen2: "imagenes/imagenes-aventuras/ayuntamiento.jpg",
        video: "",
    },
    // Parada 29: Plaza del Ayuntamiento y Edificio Ayuntamiento (Exterior) (reto 23) (Párrafos:  38,  263, 217,  40,  334,  336,  337, 338)
    {
        id: "Av34km-P-29",
        tipo: "parada",
        parada: 29, // mapa número 27 y 28
        mapa_numero: "27/28",
        nombre: "Plaza del Ayuntamiento",
        coordenadas: { lat: Number('39.469710'), lng: Number('-0.376930') },
        imagen: "imagenes/imagenes-aventuras/ayuntamiento.jpg",
    },
    // Parada 30: Edificio del Ayuntamiento (Fábula del Murciélago e interior del Ayuntamiento) (Párrafos: 339, 340, 341, 113)
    {
        id: "Av34km-P-30",
        tipo: "parada",
        parada: 30, // mapa número 28
        mapa_numero: 28,
        nombre: "Edificio del Ayuntamiento",
        coordenadas: { lat: Number('39.469610'), lng: Number('-0.376870') },
        imagen: "imagenes/imagenes-aventuras/ayuntamiento.jpg",
    },
    // Tramo 25: Edificio del Ayuntamiento → Palacio de Comunicaciones (Correos) (Párrafos: 692, 342)
    {
        id: "Av34km-TR-25",
        tipo: "tramo",
        tramo: 25, // De mapa número 28 a mapa número 29
        mapa_numero: "28→29",
        nombre: "Edificio del Ayuntamiento → Palacio de Comunicaciones (Correos)",
        inicio: { lat: Number('39.469610'), lng: Number('-0.376870') },
        waypoints: [
            { lat: Number('39.469409'), lng: Number('-0.376853') },
            { lat: Number('39.469365'), lng: Number('-0.376608') },
            { lat: Number('39.469330'), lng: Number('-0.376148') },
            { lat: Number('39.469358'), lng: Number('-0.376060') },
            { lat: Number('39.469224'), lng: Number('-0.375661') },
        ],
        fin: { lat: Number('39.469420'), lng: Number('-0.375590') },
        imagen: "imagenes/imagenes-aventuras/ayuntamiento.jpg",
        imagen2: "imagenes/imagenes-aventuras/correos.jpg",
        video: "",
    },
    // Parada 31: Palacio de Comunicaciones (Correos) (Reto 24) (Párrafos: 343, 344)
    {
        id: "Av34km-P-31",
        tipo: "parada",
        parada: 31, // mapa número 29
        mapa_numero: 29,
        nombre: "Palacio de Comunicaciones (Correos)",
        coordenadas: { lat: Number('39.469420'), lng: Number('-0.375590') },
        imagen: "imagenes/imagenes-aventuras/correos.jpg",
    },

    // Parada 32: Edificio Suay - La Equitativa (Reto 25) (Párrafos: 693, 693-B)
    {
        id: "Av34km-P-32",
        tipo: "parada",
        parada: 32, // mapa número 29 a sin número de mapa
        mapa_numero: "29→-",
        nombre: "Edificio Suay - La Equitativa",
        coordenadas: { lat: Number('39.469610'), lng: Number('-0.375680') },
        imagen: "imagenes/imagenes-aventuras/edificio_suay.jpg",
    },
    // Tramo 26: Palacio de Comunicaciones (Correos) → Banco de Valencia (Párrafos: 345, 347, 348, 42)
    {
        id: "Av34km-TR-26",
        tipo: "tramo",
        tramo: 26, // De mapa número 29 a mapa número 30
        mapa_numero: "29→30",
        nombre: "Palacio de Comunicaciones → Banco de València",
        inicio: { lat: Number('39.469610'), lng: Number('-0.375680') },
        waypoints: [
            { lat: Number('39.469980'), lng: Number('-0.375870') },
            { lat: Number('39.470300'), lng: Number('-0.375900') },
            { lat: Number('39.470390'), lng: Number('-0.375050') },
            { lat: Number('39.470430'), lng: Number('-0.374270') }
        ],
        fin: { lat: Number('39.470610'), lng: Number('-0.374080') },
        imagen: "imagenes/imagenes-aventuras/correos.jpg",
        imagen2: "imagenes/imagenes-aventuras/Calle_barcas.jpg",
        imagen3: "imagenes/imagenes-aventuras/banco_de_valencia.jpg",
        video: "",
    },

    // Parada 33: Banco de Valencia (Reto: 26) (Párrafos: 349, 350)
    {
        id: "Av34km-P-33",
        tipo: "parada",
        parada: 33, // mapa número 30
        mapa_numero: 30,
        nombre: "Banco de Valencia",
        coordenadas: { lat: Number('39.470610'), lng: Number('-0.374080') },
        imagen: "imagenes/imagenes-aventuras/banco_de_valencia.jpg",
    },

    // Tramo 27: Banco de Valencia → Palacio del Marqués de Dos Aguas "Museo Nacional de Cerámica" (Párrafos: 351, 43, 352, 353, 354)
    {
        id: "Av34km-TR-27",
        tipo: "tramo",
        tramo: 27, // De mapa número 30 a mapa número 31
        mapa_numero: "30→31",
        nombre: "Banco de València → Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)",
        inicio: { lat: Number('39.470610'), lng: Number('-0.374080') },
        waypoints: [
            { lat: Number('39.471190'), lng: Number('-0.374230') },
            { lat: Number('39.472140'), lng: Number('-0.374460') },
            { lat: Number('39.472750'), lng: Number('-0.374450') }
        ],
        fin: { lat: Number('39.472760'), lng: Number('-0.374670') },
        imagen: "imagenes/imagenes-aventuras/banco_de_valencia.jpg",
        imagen2: "imagenes/imagenes-aventuras/Iglesia_San_juan_cruz.jpg",
        imagen3: "imagenes/imagenes-aventuras/Marques_dos_aguas_2.jpg",
        video: "",
    },

    // Parada 34: Palacio del Marqués de Dos Aguas "Museo Nacional de Cerámica" (Párrafos: 356, 357)
    {
        id: "Av34km-P-34",
        tipo: "parada",
        parada: 34, // mapa número 31
        mapa_numero: 31,
        nombre: "Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)",
        coordenadas: { lat: Number('39.472760'), lng: Number('-0.374670') },
        imagen: "imagenes/imagenes-aventuras/Marques_dos_aguas_1.jpg",
        imagen2:"imagenes/imagenes-aventuras/museo_ceramica_9.jpg",
        imagen3: "imagenes/imagenes-aventuras/museo_ceramica_8.jpg",
    },

    // Tramo 28: Palacio del Marqués de Dos Aguas "Museo Nacional de Cerámica" → Mercado Central (Párrafos: 358, 359, 360, 44)
    {
        id: "Av34km-TR-28",
        tipo: "tramo",
        tramo: 28, // De mapa número 31 a mapa número 32
        mapa_numero: "31→32",
        nombre: "Palacio del Marqués → Mercado Central",
        inicio: { lat: Number('39.472760'), lng: Number('-0.374670') },
        waypoints: [
            { lat: Number('39.473030'), lng: Number('-0.375270') },
            { lat: Number('39.473080'), lng: Number('-0.375830') },
            { lat: Number('39.473150'), lng: Number('-0.376080') },
            { lat: Number('39.472610'), lng: Number('-0.376540') },
            { lat: Number('39.472160'), lng: Number('-0.376840') },
            { lat: Number('39.472400'), lng: Number('-0.377050') },
            { lat: Number('39.473190'), lng: Number('-0.377650') },
        ],
        fin: { lat: Number('39.473770'), lng: Number('-0.378320') },
        imagen: "imagenes/imagenes-aventuras/Marques_dos_aguas_1.jpg",
        imagen2: "imagenes/imagenes-aventuras/Calle_San_Vicente.jpg",
        imagen3: "imagenes/imagenes-aventuras/mercado_central.jpg",
        video: "",
    },

    // Parada 35: Mercado central (Reto 27) (Párrafos: 701, 44, 361, 362, 363, 364)
    {
        id: "Av34km-P-35",
        tipo: "parada",
        parada: 35, // mapa número 32
        mapa_numero: 32,
        nombre: "Mercado central",
        coordenadas: { lat: Number('39.473770'), lng: Number('-0.378320') },
        imagen: "imagenes/imagenes-aventuras/mercado_central.jpg",
    },

    // Tramo 29: Mercado Central → Iglesia de los Santos Juanes (Párrafos: 274, 45)
    {
        id: "Av34km-TR-29",
        tipo: "tramo",
        tramo: 29, // De mapa número 32 a mapa número 33
        mapa_numero: "32→33",
        nombre: "Mercado Central → Iglesia de los Santos Juanes (San Juan del Mercado)",
        inicio: { lat: Number('39.473770'), lng: Number('-0.378320') },
        waypoints: [
            { lat: Number('39.474080'), lng: Number('-0.378620') },
        ],
        fin: { lat: Number('39.474250'), lng: Number('-0.378950') },
        imagen: "imagenes/imagenes-aventuras/mercado_central.jpg",
        imagen2: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg",
        video: "",
    },

    // Parada 36: Iglesia de los Santos Juanes o San Juan del Mercado 1 (Reto 28) (Párrafos: 45, 365, 366)
    {
        id: "Av34km-P-36",
        tipo: "parada",
        parada: 36, // mapa número 33
        mapa_numero: 33,
        nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)",
        coordenadas: { lat: Number('39.474250'), lng: Number('-0.378950') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg",
    },

    // Parada 37: Iglesia de los Santos Juanes 2 (San Juan del Mercado) (Reto 29) (Párrafos: 368, 367)
    {
        id: "Av34km-P-37",
        tipo: "parada",
        parada: 37, // mapa número 33
        mapa_numero: 33,
        nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)",
        coordenadas: { lat: Number('39.474240'), lng: Number('-0.378890') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg",
    },

    // Tramo 30: Iglesia Santos Juanes (San Juan del Mercado) → Lonja de Valencia (Mercado de la Seda) (Párrafos: 369, 46)
    {
        id: "Av34km-TR-30",
        tipo: "tramo",
        tramo: 30, // De mapa número 33 a mapa número 34
        mapa_numero: "33→34",
        nombre: "Iglesia Santos Juanes (San Juan del Mercado) → Lonja de Valencia (Mercado de la Seda)",
        inicio: { lat: Number('39.474240'), lng: Number('-0.378890') },
        waypoints: [],
        fin: { lat: Number('39.474220'), lng: Number('-0.378750') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_mercado.jpg",
        imagen2: "imagenes/imagenes-aventuras/lonja.jpg",
        video: "",
    },

    // Parada 38: Lonja (Mercado de la Seda) historia (Reto30Puzzle PZ-04) (Párrafos: 370, 371, 372, 373, 374)
    {
        id: "Av34km-P-38",
        tipo: "parada",
        parada: 38, // mapa número 34
        mapa_numero: 34,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474220'), lng: Number('-0.378750') },
        imagen: "imagenes/imagenes-aventuras/lonja.jpg",
    },

    // Parada 39: Lonja (Mercado de la Seda) Puerta de Los Pecados 1 (Reto 31) (Párrafos: 375, 376, 377, 378, 379)
    {
        id: "Av34km-P-39",
        tipo: "parada",
        parada: 39, // mapa número 34
        mapa_numero: 34,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474170'), lng: Number('-0.378600') },
        imagen: "imagenes/imagenes-aventuras/Lonja_puerta_pecados.jpg",
        imagen2: "imagenes/imagenes-aventuras/lonja4.jpg",
    },

    // Parada 40: Lonja (Mercado de la Seda) Puerta de Los Pecados 2 (Reto 32) (Párrafos: 380, 381)
    {
        id: "Av34km-P-40",
        tipo: "parada",
        parada: 40, // mapa número 34
        mapa_numero: 34,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474160'), lng: Number('-0.378570') },
        imagen: "imagenes/imagenes-aventuras/lonja5.jpg",
    },

    // Parada 41: Lonja (Mercado de la Seda) Gárgolas 1 (Reto 33) (Párrafos: 383, 384)
    {
        id: "Av34km-P-41",
        tipo: "parada",
        parada: 41, // mapa número 34
        mapa_numero: 34,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474170'), lng: Number('-0.378680') },
        imagen: "imagenes/imagenes-aventuras/lonja3.jpg",
    },

    // Parada 42: Lonja (Mercado de la Seda) Gárgolas 2 (Reto 34) (Párrafos: 385)
    {
        id: "Av34km-P-42",
        tipo: "parada",
        parada: 42, // mapa número 34
        mapa_numero: 34,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474190'), lng: Number('-0.378710') },
        imagen: "imagenes/imagenes-aventuras/lonja.jpg",
    },

    // Parada 43: Lonja (Mercado de la Seda) Fornicador (Reto 35) (Párrafos: 386, 387)
    {
        id: "Av34km-P-43",
        tipo: "parada",
        parada: 43, // mapa número 34
        mapa_numero: 34,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474340'), lng: Number('-0.378780') },
        imagen: "imagenes/imagenes-aventuras/lonja6.jpg",
    },

    // Tramo 31: Rodeando la Lonja (Mercado de la Seda)(Párrafos: 388)
    {
        id: "Av34km-TR-31",
        tipo: "tramo",
        tramo: 31, // De mapa número 34 a mapa número 34
        mapa_numero: "34→34",
        nombre: "Lonja (Mercado de la Seda)",
        inicio: { lat: Number('39.474340'), lng: Number('-0.378780') },
        waypoints: [
            { lat: Number('39.474450'), lng: Number('-0.378890') },
        ],
        fin: { lat: Number('39.474560'), lng: Number('-0.378700') },
        imagen: "imagenes/imagenes-aventuras/Lonja_esquina_izquierda.jpg",
        imagen2: "imagenes/imagenes-aventuras/Lonja_patio_naranjos_far_view.jpg",
        imagen3: "imagenes/imagenes-aventuras/Lonja_patio_naranjos_close_view.jpg",
        video: "",
    },

    // Parada 44: Lonja (Mercado de la Seda) - Gárgola Torre (Párrafos: 390, 391)
    {
        id: "Av34km-P-44",
        tipo: "parada",
        parada: 44, // mapa número 34
        mapa_numero: 34,
        nombre: "Lonja (Mercado de la Seda)",
        coordenadas: { lat: Number('39.474560'), lng: Number('-0.378700') },
        imagen: "imagenes/imagenes-aventuras/lonja7.jpg",
    },

    // Tramo 32: Lonja (Mercado de la Seda) - Patio de los naranjos → Lonja entrada visitantes (Párrafos: 392)
    {
        id: "Av34km-TR-32",
        tipo: "tramo",
        tramo: 32, // De mapa número 34 a mapa número 34
        mapa_numero: "34→34",
        nombre: "Lonja Patio de los naranjos → Lonja entrada visitantes",
        inicio: { lat: Number('39.474560'), lng: Number('-0.378700') },
        waypoints: [
            { lat: Number('39.474750'), lng: Number('-0.378420') },
        ],
        fin: { lat: Number('39.474660'), lng: Number('-0.378340') },
        imagen: "imagenes/imagenes-aventuras/Lonja_patio_naranjos_close_view.jpg",
        imagen2: "imagenes/imagenes-aventuras/Lonja-puerta-visitante.jpg",
        video: "",
    },

    // Tramo 33: Lonja (Mercado de la Seda) -entrada visitantes →  Puerta Gótica Lonja (Mercado de la Seda) (Párrafos: 393)
    {
        id: "Av34km-TR-33",
        tipo: "tramo",
        tramo: 33, // De mapa número 34 a mapa número 34
        mapa_numero: "34→35",
        nombre: "Lonja entrada visitantes → Lonja (Mercado de la Seda)",
        inicio: { lat: Number('39.474660'), lng: Number('-0.378340') },
        waypoints: [
            { lat: Number('39.474564'), lng: Number('-0.378228') },
        ],
        fin: { lat: Number('39.474391'), lng: Number('-0.378047') },
        imagen: "imagenes/imagenes-aventuras/Lonja-puerta-visitante.jpg",
        imagen2: "imagenes/imagenes-aventuras/lonja2.jpg",
        video: "",
    },
    // Parada 45: Puerta Gótica Lonja (Mercado de la Seda) (Párrafos: 394)
    {
        id: "Av34km-P-45",
        tipo: "parada",
        parada: 45, // mapa número 34
        mapa_numero: 34,
        nombre: "Lonja (Mercado de la Seda)",
        fin: { lat: Number('39.474391'), lng: Number('-0.378047') },
        imagen: "imagenes/imagenes-aventuras/lonja7.jpg",
    },
    // Tramo 34: Puerta Gótica Lonja (Mercado de la Seda) → Plaza Doctor López Collado (Párrafos: 397, 47)
    {
        id: "Av34km-TR-34",
        tipo: "tramo",
        tramo: 34, // De mapa número 34 a mapa número 35
        mapa_numero: "34→35",
        nombre: "Puerta Gótica Lonja (Mercado de la Seda) → Plaza Doctor López Collado",
        inicio: { lat: Number('39.474391'), lng: Number('-0.378047') },
        waypoints: [
            { lat: Number('39.474350'), lng: Number('-0.377971') },
        ],
        fin: { lat: Number('39.474440'), lng: Number('-0.377900') },
        imagen: "imagenes/imagenes-aventuras/lonja2.jpg",
        imagen2: "imagenes/imagenes-aventuras/Plaza_collado.jpg",
        video: "",
    },
    // Parada 46: Plaza Doctor López Collado (Párrafos: 398, 399, 400, 401, 402)
    {
        id: "Av34km-P-46",
        tipo: "parada",
        parada: 46, // mapa número 35
        mapa_numero: 35,
        nombre: "Plaza Doctor López Collado",
        coordenadas: { lat: Number('39.474440'), lng: Number('-0.377900') },
        imagen: "imagenes/imagenes-aventuras/Plaza_collado.jpg",
    },
    // Tramo 35: Plaza Doctor López Collado → Plaza Redonda (Párrafos: 403, 405)
    {
        id: "Av34km-TR-35",
        tipo: "tramo",
        tramo: 35, // De mapa número 35 a mapa número 36
        mapa_numero: "35→36",
        nombre: "Plaza Doctor López Collado → Plaza Redonda",
        inicio: { lat: Number('39.474440'), lng: Number('-0.377900') },
        waypoints: [
            { lat: Number('39.474351'), lng: Number('-0.377968') },
            { lat: Number('39.474213'), lng: Number('-0.377785') },
            { lat: Number('39.474236'), lng: Number('-0.377706') },
            { lat: Number('39.473996'), lng: Number('-0.377416') },
            { lat: Number('39.473841'), lng: Number('-0.377219') },
            { lat: Number('39.473616'), lng: Number('-0.377010') },
            { lat: Number('39.473414'), lng: Number('-0.376820') },
            { lat: Number('39.473569'), lng: Number('-0.376650') },
        ],
        fin: { lat: Number('39.473690'), lng: Number('-0.376680') },
        imagen: "imagenes/imagenes-aventuras/Plaza_collado.jpg",
        imagen2: "imagenes/imagenes-aventuras/Plaza_redonda.jpg",
        video: "",
    },
    // Parada 45 - Plaza Redonda (Reto36Puzzle PZ-07) (Párrafos: 406)
    {
        id: "Av34km-P-47",
        tipo: "parada",
        parada: 47, // mapa número 36
        mapa_numero: 36,
        nombre: "Plaza Redonda",
        coordenadas: { lat: Number('39.473690'), lng: Number('-0.376680') },
        imagen: "imagenes/imagenes-aventuras/plaza_redonda.jpg",
    },
    // Tramo 36: Plaza Redonda → Plaza Lope de Vega (Párrafos: 407)
    {
        id: "Av34km-TR-36",
        tipo: "tramo",
        tramo: 36, // De mapa número 36 a mapa número 37
        mapa_numero: "36→37",
        nombre: "Plaza Redonda → Plaza Lope de Vega",
        inicio: { lat: Number('39.473690'), lng: Number('-0.376680') },
        waypoints: [
            { lat: Number('39.473917'), lng: Number('-0.376830') },
            { lat: Number('39.473992'), lng: Number('-0.376824') },
        ],
        fin: { lat: Number('39.474040'), lng: Number('-0.376750') },
        imagen: "imagenes/imagenes-aventuras/plaza_redonda.jpg",
        imagen2: "imagenes/imagenes-aventuras/iglesia_santa_catalina.jpg",
        imagen3: "imagenes/imagenes-aventuras/edificio_estrecho.jpg",
        video: "",
    },
    // Parada 48: Plaza Lope de Vega - Edificio estrecho (Reto 37) (Párrafos: 408, 409, 410)
    {
        id: "Av34km-P-48",
        tipo: "parada",
        parada: 48, // mapa número 37
        mapa_numero: 37,
        nombre: "Plaza Lope de Vega - Edificio estrecho",
        coordenadas: { lat: Number('39.474040'), lng: Number('-0.376750') },
        imagen: "imagenes/imagenes-aventuras/edificio_estrecho.jpg",
    },
    // Parada 49: Plaza Lope de Vega - Iglesia de Santa Catalina (Párrafos: 411, 412)
    {
        id: "Av34km-P-49",
        tipo: "parada",
        parada: 49, // mapa número 37
        mapa_numero: 37,
        nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina",
        coordenadas: { lat: Number('39.474040'), lng: Number('-0.376740') },
        imagen: "imagenes/imagenes-aventuras/iglesia_santa_catalina.jpg",
    },
    // Parada 50: Plaza Lope de Vega - Iglesia de Santa Catalina 2 (Párrafos: 413, 414)
    {
        id: "Av34km-P-50",
        tipo: "parada",
        parada: 50, // mapa número 37
        mapa_numero: 37,
        nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina",
        coordenadas: { lat: Number('39.474040'), lng: Number('-0.376750') },
        imagen: "imagenes/imagenes-aventuras/iglesia_santa_catalina.jpg",
    },
    // Parada 51: Plaza Lope de Vega - Iglesia de Santa Catalina 3 (Reto 38) (Párrafos: 417, 416)
    {
        id: "Av34km-P-51",
        tipo: "parada",
        parada: 51, // mapa número 37
        mapa_numero: 37,
        nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina",
        coordenadas: { lat: Number('39.474040'), lng: Number('-0.376750') },
        imagen: "imagenes/imagenes-aventuras/iglesia_santa_catalina.jpg",
    },
    // Tramo 37: Plaza Lope de Vega → Torre de Santa Catalina (Párrafos: 418, 419)
    {
        id: "Av34km-TR-37",
        tipo: "tramo",
        tramo: 37, // De mapa número 37 a mapa número 38
        mapa_numero: "37→38",
        nombre: "Plaza Lope de Vega → Torre de Santa Catalina",
        inicio: { lat: Number('39.474040'), lng: Number('-0.376750') },
        waypoints: [
            { lat: Number('39.473921'), lng: Number('-0.376690') },
            { lat: Number('39.473898'), lng: Number('-0.376218') },
            { lat: Number('39.473876'), lng: Number('-0.375965') },
        ],
        fin: { lat: Number('39.473830'), lng: Number('-0.375720') },
        imagen: "imagenes/imagenes-aventuras/iglesia_santa_catalina.jpg",
        imagen2: "imagenes/imagenes-aventuras/torre_santa_catalina.jpg",
        video: "",
    },
    // Parada 52: Torre Barroca de Santa Catalina (Reto 39) (Párrafos: 420, 423)
    {
        id: "Av34km-P-52",
        tipo: "parada",
        parada: 52, // mapa número 38
        mapa_numero: 38,
        nombre: "Torre Barroca de Santa Catalina",
        coordenadas: { lat: Number('39.473830'), lng: Number('-0.375720') },
        imagen: "imagenes/imagenes-aventuras/torre_santa_catalina.jpg",
    },
    // Parada 53: Torre Barroca de Santa Catalina (Reto 40) (Párrafos: 421, 422, 423)
    {
        id: "Av34km-P-53",
        tipo: "parada",
        parada: 53, // mapa número 38
        mapa_numero: 38,
        nombre: "Torre Barroca de Santa Catalina",
        coordenadas: { lat: Number('39.473830'), lng: Number('-0.375710') },
        imagen: "imagenes/imagenes-aventuras/torre_santa_catalina.jpg",
    },
    // Tramo 38: Torre Barroca de la Iglesia de Santa Catalina → Torre del Miguelete (Párrafos: 48-B, 425, 426, 48, 694)
    {
        id: "Av34km-TR-38",
        tipo: "tramo",
        tramo: 38, // De mapa número 38 a mapa número 39
        mapa_numero: "38→39",
        nombre: "Torre Barroca de la Iglesia de Santa Catalina → Torre del Miguelete",
        inicio: { lat: Number('39.473830'), lng: Number('-0.375710') },
        waypoints:
        [
            { lat: Number('39.474226'), lng: Number('-0.375648') },
            { lat: Number('39.474577'), lng: Number('-0.375593') },
            { lat: Number('39.475036'), lng: Number('-0.375500') },
            { lat: Number('39.475180'), lng: Number('-0.375530') },
        ],
        fin: { lat: Number('39.475220'), lng: Number('-0.375650') },
        imagen: "imagenes/imagenes-aventuras/torre_santa_catalina.jpg",
        imagen2: "imagenes/imagenes-aventuras/Plaza_Reina_2.jpg",
        imagen3: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
        video: ""
    },
    // Parada 52 - Torre del Miguelete (reto 41) (Párrafos: 11-C, 427)
    {
        id: "Av34km-P-54",
        tipo: "parada",
        parada: 54, // mapa número 39
        mapa_numero: 39,
        nombre: "Torre del Miguelete",
        coordenadas: { lat: Number('39.475230'), lng: Number('-0.375670') },
        imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
    },
    // Parada 53 - Torre del Miguelete 2 (reto 42) (Párrafos: 428)
    {
        id: "Av34km-P-55",
        tipo: "parada",
        parada: 55, // mapa número 39
        mapa_numero: 39,
        nombre: "Torre del Miguelete",
        coordenadas: { lat: Number('39.475224'), lng: Number('-0.375609') },
        imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
    },

    // Parada 54 - Puerta de los Hierros (Barroca) de la Catedral de Valencia (Reto 42) (Párrafos: 429, 430, 432, 431)
    {
        id: "Av34km-P-56",
        tipo: "parada",
        parada: 56, // mapa número 39
        mapa_numero: 39,
        nombre: "Puerta de los Hierros (Barroca) de la Catedral de Valencia",
        coordenadas: { lat: Number('39.475210'), lng: Number('-0.375610') },
        imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
    },
    // Tramo 39: Puerta de los Hierros (Barroca) de la Catedral de Valencia → Puerta Románica de la Catedral de Valencia (Párrafos: 434, 435, 49)
    {
        id: "Av34km-TR-39",
        tipo: "tramo",
        tramo: 39, // De mapa número 39 a mapa número 40
        mapa_numero: "39→40",
        nombre: "Puerta de los Hierros (Barroca) de la Catedral de Valencia → Puerta Románica de la Catedral de Valencia",
        inicio: { lat: Number('39.475210'), lng: Number('-0.375610') },
        waypoints:
        [
            { lat: Number('39.475031'), lng: Number('-0.375011') },
            { lat: Number('39.475237'), lng: Number('-0.374880') },
            { lat: Number('39.475539'), lng: Number('-0.374720') },
        ],
        fin: { lat: Number('39.475552'), lng: Number('-0.374557') },
        imagen: "imagenes/imagenes-aventuras/puerta_barroca_catedral_miguelete.jpg",
        imagen2: "imagenes/imagenes-aventuras/catedral_hacia_plaza_reina.jpg",
        imagen3: "imagenes/imagenes-aventuras/puerta_romanica_catedral.jpg",
        video: ""
    },
    // Parada 57: Catedral de Valencia (Puerta Románica) (Reto 44) (Párrafos: 437, 439, 438)
    {
        id: "Av34km-P-57",
        tipo: "parada",
        parada: 57, // mapa número 40
        mapa_numero: "40",
        nombre: "Catedral de Valencia (Puerta Románica)",
        coordenadas:  { lat: Number('39.475552'), lng: Number('-0.374557') },
        imagen: "imagenes/imagenes-aventuras/puerta_romanica_catedral.jpg",
    },
    // Tramo 40: Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína) (Párrafos: 714)
    {
        id: "Av34km-TR-40",
        tipo: "tramo",
        tramo: 40, // De mapa número 40 a mapa número 42
        mapa_numero: "40→42",
        nombre: "Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína)",
        inicio: { lat: Number('39.475552'), lng: Number('-0.374557') },
        waypoints:
        [
            { lat: Number('39.475836'), lng: Number('-0.374397') }
        ],
        fin: { lat: Number('39.475986'), lng: Number('-0.374472') },
        imagen: "imagenes/imagenes-aventuras/puerta_romanica_catedral.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        video: "",
    },
    // Parada 58: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 1, Panel cerámico (reto 45) (Párrafos: 441, 442)
    {
        id: "Av34km-P-58",
        tipo: "parada",
        parada: 58, // mapa número 42
        mapa_numero: "42",
        nombre: "Plaza Décimo Junio Bruto",
        coordenadas:  { lat: Number('39.475986'), lng: Number('-0.374472') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/catedral_almoina.jpg",
        imagen3: "imagenes/imagenes-aventuras/panel_ceramico_muro_norte_catedral.jpg",
    },
    // Parada 59: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 2, Capilla exterior (reto 46) (Párrafos: 443, 444)
    {
        id: "Av34km-P-59",
        tipo: "parada",
        parada: 59, // mapa número 42
        mapa_numero: "42",
        nombre: "Plaza Décimo Junio Bruto",
        coordenadas:  { lat: Number('39.476012'), lng: Number('-0.374604') },
        imagen: "imagenes/imagenes-aventuras/capilla_exterior_catedral.jpg",
    },
    // Parada 60: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 3, Capilla exterior (reto 47) (Párrafos: 445)
    {
        id: "Av34km-P-60",
        tipo: "parada",
        parada: 60, // mapa número 42
        mapa_numero: "42",
        nombre: "Plaza Décimo Junio Bruto",
        coordenadas:  { lat: Number('39.476025'), lng: Number('-0.374600') },
        imagen: "imagenes/imagenes-aventuras/capilla_exterior_catedral.jpg",
    },
     // Parada 61: Plaza Décimo Junio Bruto (Plaza de la Almoína) Basílica de Valencia (Párrafos: 446, 447, 50, 452, 51-B)
    {
        id: "Av34km-P-61",
        tipo: "parada",
        parada: 61, // mapa número 42/41
        mapa_numero: "42/41",
        nombre: "Plaza Décimo Junio Bruto (Basílica de Valencia)",
        coordenadas:  { lat: Number('39.476046'), lng: Number('-0.374656') },
        imagen: "imagenes/imagenes-aventuras/capilla_pared_catedral.jpg",
        imagen2: "imagenes/imagenes-aventuras/puerta_negra_relieve_basilica.jpg",
        imagen3: "imagenes/imagenes-aventuras/basilica_almoina.jpg",
    },
    // Parada 62: Plaza Décimo Junio Bruto (Plaza de la Almoína) Historia Basílica (Párrafos: 450, 451)
    {
        id: "Av34km-P-62",
        tipo: "parada",
        parada: 62, // mapa número 42
        mapa_numero: "42",
        nombre: "Plaza Décimo Junio Bruto",
        coordenadas:  { lat: Number('39.476000'), lng: Number('-0.374533') },
        imagen: "",
    },
    // Parada 63: Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de Gantxo (Reto 48) (Párrafos: 51, 454, 455-B, 456)
    {
        id: "Av34km-P-63",
        tipo: "parada",
        parada: 63, // mapa número 42
        mapa_numero: "42",
        nombre: "Plaza Décimo Junio Bruto (Casa del Punt de Gantxo)",
        coordenadas:  { lat: Number('39.475986'), lng: Number('-0.374472') },
        imagen: "imagenes/imagenes-aventuras/casa_del_punt_de_gantxo.jpg",
    },
    // Parada 64: Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de Gantxo (Reto 49) (Párrafos: 455-C, 455-D)
    {
        id: "Av34km-P-64",
        tipo: "parada",
        parada: 64, // mapa número 42
        mapa_numero: "42",
        nombre: "Plaza Décimo Junio Bruto (Casa del Punt de Gantxo)",
        coordenadas:  { lat: Number('39.475986'), lng: Number('-0.374472') },
        imagen: "imagenes/imagenes-aventuras/casa_del_punt_de_gantxo.jpg",
    },
    // Tramo 41: Plaza Décimo Junio Bruto (Plaza de la Almoína) → Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico (Párrafos: 457, 51-D)
    {
        id: "Av34km-TR-41",
        tipo: "tramo",
        tramo: 41, // De mapa número 42 a mapa número 42
        mapa_numero: "42→42",
        nombre: "Plaza Décimo Junio Bruto → Plaza Décimo Junio Bruto (Museo Arqueológico)",
        inicio: { lat: Number('39.475986'), lng: Number('-0.374472') },
        waypoints:
        [
            { lat: Number('39.476078'), lng: Number('-0.374327') },
            { lat: Number('39.476050'), lng: Number('-0.374290') },
        ],
        fin: { lat: Number('39.476240'), lng: Number('-0.374270') },
        imagen: "imagenes/imagenes-aventuras/casa_del_punt_de_gantxo.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen3: "imagenes/imagenes-aventuras/museo_la_almoina.jpg",
        video: "",
    },
    // Parada 63: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico (Reto 50) (Párrafos: 458)
    {
        id: "Av34km-P-63",
        tipo: "parada",
        parada: 63, // mapa número 42
        mapa_numero: "42",
        nombre: "Plaza Décimo Junio Bruto (Museo Arqueológico)",
        coordenadas:  { lat: Number('39.476240'), lng: Number('-0.374270') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/museo_almoina_2.jpg",
    },
    // Parada 64: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico 2 (Reto51puzzle PZ-02) (Párrafos: 459, 460, 461)
    {
        id: "Av34km-P-64",
        tipo: "parada",
        parada: 64, // mapa número 33
        mapa_numero: "33",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico",
        coordenadas:  { lat: Number('39.476240'), lng: Number('-0.374290') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/museo_la_almoina.jpg",
    },
    // Parada 65: Plaza Décimo Junio Bruto (Plaza de la Almoína) Cimborrio de la Catedral de Valencia (Reto 52) (Párrafos: 49-B, 464)
    {
        id: "Av34km-P-65",
        tipo: "parada",
        parada: 65, // mapa número 42
        mapa_numero: "42",
        nombre: "Plaza Décimo Junio Bruto (Cimborrio de la Catedral de Valencia)",
        coordenadas:  { lat: Number('39.476297'), lng: Number('-0.374291') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/museo_la_almoina.jpg",
    },
    // Tramo 42: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen (Párrafos: 465, 59)
    {
        id: "Av34km-TR-42",
        tipo: "tramo",
        tramo: 42, // De mapa número 42 a mapa número 43
        mapa_numero: "42→43",
        nombre: "Plaza Décimo Junio Bruto (Museo Arqueológico) → Plaza de la Virgen",
        inicio: { lat: Number('39.476240'), lng: Number('-0.374290') },
        waypoints:
        [
            { lat: Number('39.476300'), lng: Number('-0.374600') },
            { lat: Number('39.476560'), lng: Number('-0.374540') },
            { lat: Number('39.476610'), lng: Number('-0.374990') },
            { lat: Number('39.476660'), lng: Number('-0.375180') },
        ],
        fin: { lat: Number('39.476600'), lng: Number('-0.375270') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_almoina.jpg",
        imagen2: "imagenes/imagenes-aventuras/Paso_Plaza_Almoina.jpg",
        video: "",
    },
    // Parada 66: Plaza de la Virgen (Fuente de Neptuno) (Reto 26) (Párrafos: 466, 467)
    {
        id: "Av34km-P-66",
        tipo: "parada",
        parada: 66, // mapa número 35
        mapa_numero: "35",
        nombre: "Plaza de la Virgen (Fuente de Neptuno)",
        coordenadas:  { lat: Number('39.476600'), lng: Number('-0.375270') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
    },
    // Parada 67: Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia) (Reto 27) (Párrafos: 477-B, 479, 141, 468)
    {
        id: "Av34km-P-67",
        tipo: "parada",
        parada: 67, // mapa número 35
        mapa_numero: "35",
        nombre: "Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia)",
        coordenadas:  { lat: Number('39.476600'), lng: Number('-0.375290') },
        imagen: "imagenes/imagenes-aventuras/puerta_gotica_catedral_2.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
    },
    // Tramo 43: Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia) → Palacio de la Generalitat Valenciana (Párrafos: )
    {
        id: "Av34km-TR-43",
        tipo: "tramo",
        tramo: 43, // De mapa número  a mapa número
        mapa_numero: "33→35",
        nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen",
        inicio: { lat: Number('39.476600'), lng: Number('-0.375290') },
        waypoints:
        [
            { lat: Number('39.476708'), lng: Number('-0.375872') },
            { lat: Number('39.476795'), lng: Number('-0.376293') },
            { lat: Number('39.476885'), lng: Number('-0.376760') },
        ],
        fin: { lat: Number('39.476680'), lng: Number('-0.376710') },
        imagen: "imagenes/imagenes-aventuras/plaza_de_la_virgen.jpg",
        imagen2: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
        video: "",
    },
    // Parada 68 - Palau de la Generalitat (Reto 5) (Párrafos: 481, 482, 482-B, 483)
    {
        id: "Av34km-P-68",
        tipo: "parada",
        parada: 68, // mapa número 3
        mapa_numero: 3,
        nombre: "Palau de la Generalitat",
        coordenadas: { lat: Number('39.476680'), lng: Number('-0.376710') },
        imagen: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
    },
    // Tramo 44 - Palau de la Generalitat → Calle Caballeros (Párrafos: 104)
    {
        id: "Av34km-TR-44",
        tipo: "tramo",
        tramo: 44, // De mapa número 3 a mapa número 4
        mapa_numero: "3→4",
        nombre: "Palau de la Generalitat → Calle Caballeros",
        inicio: { lat: Number('39.476680'), lng: Number('-0.376710') },
        waypoints: [],
        fin: { lat: Number('39.476590'), lng: Number('-0.376940') },
        imagen: "imagenes/imagenes-aventuras/palau_de_la_generalitat.jpg",
        imagen2: "imagenes/imagenes-aventuras/Calle_caballeros.jpg",
        video: ""
    },

    // Tramo 45 - Calle Caballeros → Iglesia de San Nicolás (Párrafos: 487-B)
    {
        id: "Av34km-TR-45",
        tipo: "tramo",
        tramo: 45, // De mapa número 4 a mapa número 5
        mapa_numero: "4→5",
        nombre: "Calle Caballeros → Iglesia de San Nicolás",
        inicio: { lat: Number('39.476590'), lng: Number('-0.376940') },
        waypoints:
        [
            { lat: Number('39.476600'), lng: Number('-0.376860') },
            { lat: Number('39.476630'), lng: Number('-0.377830') },
            { lat: Number('39.476670'), lng: Number('-0.378380') },
            { lat: Number('39.476620'), lng: Number('-0.378650') },
        ],
        fin: { lat: Number('39.476570'), lng: Number('-0.378830') },
        imagen: "imagenes/imagenes-aventuras/Calle_caballeros.jpg",
        imagen2: "imagenes/imagenes-aventuras/iglesia_san_nicolas_front.jpg",
        video: ""
    },

    // Parada 69 - Iglesia de San Nicolás FRONT (Reto6puzzle PZ-06) (Párrafos: 488, 489, 490)
    {
        id: "Av34km-P-69",
        tipo: "parada",
        parada: 69, // mapa número 5
        mapa_numero: 5,
        nombre: "Iglesia de San Nicolás FRONT",
        coordenadas: { lat: Number('39.476570'), lng: Number('-0.378830') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_nicolas_front.jpg",
    },

    // Tramo 46 - Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK (Párrafos: 491, 10)
    {
        id: "Av34km-TR-46",
        tipo: "tramo",
        tramo: 46, // De mapa número 5 a mapa número 6
        mapa_numero: "5→6",
        nombre: "Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK",
        inicio: { lat: Number('39.476570'), lng: Number('-0.378830') },
        waypoints:
        [
            { lat: Number('39.476550'), lng: Number('-0.379180') },
            { lat: Number('39.476320'), lng: Number('-0.379170') },
        ],
        fin: { lat: Number('39.476100'), lng: Number('-0.379180') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_nicolas_front.jpg",
        imagen2: "imagenes/imagenes-aventuras/iglesia_san_nicolas_back.jpg",
        video: ""
    },

    // Parada 70 - Iglesia de San Nicolás BACK (Reto 7) (Párrafos: 493, 494-B, 496)
    {
        id: "Av34km-P-70",
        tipo: "parada",
        parada: 70, // mapa número 6
        mapa_numero: 6,
        nombre: "Iglesia de San Nicolás BACK",
        coordenadas: { lat: Number('39.476100'), lng: Number('-0.379180') },
        imagen: "imagenes/imagenes-aventuras/Iglesia_San_Nicolas_esquina_back.jpg",
    },

    // Parada 71 - Iglesia de San Nicolás BACK (Reto 8) (Párrafos: 497, 498)
    {
        id: "Av34km-P-71",
        tipo: "parada",
        parada: 71, // mapa número 6
        mapa_numero: 6,
        nombre: "Iglesia de San Nicolás BACK",
        coordenadas: { lat: Number('39.476070'), lng: Number('-0.379180') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_nicolas_back.jpg",
    },

    // Parada 72 - Iglesia de San Nicolás BACK (Reto 9) (Párrafos: 504, 505)
    {
        id: "Av34km-P-72",
        tipo: "parada",
        parada: 72, // mapa número 6
        mapa_numero: 6,
        nombre: "Iglesia de San Nicolás BACK",
        coordenadas: { lat: Number('39.476050'), lng: Number('-0.379150') },
        imagen: "imagenes/imagenes-aventuras/Iglesia_San_Nicolas_esquina_back.jpg",
    },

    // Tramo 47 - Iglesia de San Nicolás BACK → Plaza del Negrito (Párrafos: 499, 500-B)
    {
        id: "Av34km-TR-47",
        tipo: "tramo",
        tramo: 47, // De mapa número 6 a mapa número 7
        mapa_numero: "6→7",
        nombre: "Iglesia de San Nicolás BACK → Plaza del Negrito",
        inicio: { lat: Number('39.476050'), lng: Number('-0.379150') },
        waypoints:
        [
            { lat: Number('39.476030'), lng: Number('-0.378910') },
            { lat: Number('39.475980'), lng: Number('-0.378540') },
            { lat: Number('39.475900'), lng: Number('-0.378110') },
            { lat: Number('39.475810'), lng: Number('-0.377680') },
            { lat: Number('39.475950'), lng: Number('-0.377520') },

        ],
        fin: { lat: Number('39.476110'), lng: Number('-0.377410') },
        imagen: "imagenes/imagenes-aventuras/Iglesia_San_Nicolas_esquina_back.jpg",
        imagen2: "imagenes/imagenes-aventuras/iglesia_san_nicolas_3.jpg",
        imagen3: "imagenes/imagenes-aventuras/iglesia_san_nicolas_4.jpg",
        imagen4: "imagenes/imagenes-aventuras/Plaza_negrito.jpg",
        imagen5: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
        video: ""
    },

    // Parada 73 - Plaza del Negrito (Reto 10) (Párrafos: 382, 501)
    {
        id: "Av34km-P-73",
        tipo: "parada",
        parada: 73, // mapa número 7
        mapa_numero: 7,
        nombre: "Plaza del Negrito",
        coordenadas: { lat: Number('39.476110'), lng: Number('-0.377410') },
        imagen: "imagenes/imagenes-aventuras/Plaza_negrito.jpg",
        imagen2: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
    },

    // Tramo 48 - Plaza del Negrito → Calle Caballeros → Plaza del Tossal (Párrafos: 502-B, 506, 12)
    {
        id: "Av34km-TR-48",
        tipo: "tramo",
        tramo: 48, // De mapa número 7 a mapa número 4 y mapa número 8
        mapa_numero: "7→4→8",
        nombre: "Plaza del Negrito → Calle Caballeros → Plaza del Tossal",
        inicio: { lat: Number('39.476110'), lng: Number('-0.377410') },
        waypoints:
        [
            { lat: Number('39.476310'), lng: Number('-0.377370') },
            { lat: Number('39.476490'), lng: Number('-0.377340') },
            { lat: Number('39.476620'), lng: Number('-0.377330') },
            { lat: Number('39.476630'), lng: Number('-0.377830') },
            { lat: Number('39.476670'), lng: Number('-0.378380') },
            { lat: Number('39.476620'), lng: Number('-0.378650') },
            { lat: Number('39.476560'), lng: Number('-0.379110') },
            { lat: Number('39.476510'), lng: Number('-0.379440') },
            { lat: Number('39.476460'), lng: Number('-0.379720') },
        ],
        fin: { lat: Number('39.476390'), lng: Number('-0.380010') },
        imagen: "imagenes/imagenes-aventuras/fuente_del_negrito.jpg",
        imagen2: "imagenes/imagenes-aventuras/Calle_caballeros.jpg",
        imagen3: "imagenes/imagenes-aventuras/iglesia_san_nicolas_front.jpg",
        imagen4: "imagenes/imagenes-aventuras/plaza_del_tossal.jpg",
        video: ""
    },

    // Parada 74 - Plaza del Tossal (Reto 11) (Párrafos: 12-C, 508, 509)
    {
        id: "Av34km-P-74",
        tipo: "parada",
        parada: 74, // mapa número 8
        mapa_numero: 8,
        nombre: "Plaza del Tossal",
        coordenadas: { lat: Number('39.476390'), lng: Number('-0.380010') },
        imagen: "imagenes/imagenes-aventuras/plaza_del_tossal.jpg",
    },

    // Parada 75 - Plaza del Tossal 2 (Párrafos: 510, 511)
    {
        id: "Av34km-P-75",
        tipo: "parada",
        parada: 75, // mapa número 8
        mapa_numero: 8,
        nombre: "Plaza del Tossal",
        coordenadas: { lat: Number('39.476360'), lng: Number('-0.379990') },
        imagen: "imagenes/imagenes-aventuras/plaza_del_tossal.jpg",
    },

    // Tramo 49 - Plaza del Tossal → Portal de la Valldigna (Párrafos: 512, 13-C)
    {
        id: "Av34km-TR-49",
        tipo: "tramo",
        tramo: 49, // De mapa número 8 a mapa número 9
        mapa_numero: "8→9",
        nombre: "Plaza del Tossal → Portal de la Valldigna",
        inicio: { lat: Number('39.476360'), lng: Number('-0.379990') },
        waypoints:
        [
            { lat: Number('39.476520'), lng: Number('-0.379940') },
            { lat: Number('39.476770'), lng: Number('-0.379830') },
            { lat: Number('39.477010'), lng: Number('-0.379690') },
            { lat: Number('39.477330'), lng: Number('-0.379570') },
            { lat: Number('39.477560'), lng: Number('-0.379450') },
            { lat: Number('39.477760'), lng: Number('-0.379150') },
            { lat: Number('39.477660'), lng: Number('-0.378890') },
        ],
        fin: { lat: Number('39.477550'), lng: Number('-0.378600') },
        imagen: "imagenes/imagenes-aventuras/plaza_del_tossal.jpg",
        imagen2: "imagenes/imagenes-aventuras/portal-de-la_valldigna.jpg",
        video: ""
    },

    // Parada 76 - Portal de la Valldigna (Párrafos: 513, 589, 144)
    {
        id: "Av34km-P-76",
        tipo: "parada",
        parada: 76, // mapa número 9
        mapa_numero: 9,
        nombre: "Portal de la Valldigna",
        coordenadas: { lat: Number('39.477550'), lng: Number('-0.378600') },
        imagen: "imagenes/imagenes-aventuras/portal-de-la_valldigna.jpg",
    },

    // Tramo 50 - Portal de la Valldigna → Torre del Ángel (Torre árabe) (Párrafos: 560, 514, 14-C)
    {
        id: "Av34km-TR-50",
        tipo: "tramo",
        tramo: 50, // De mapa número 9 a mapa número 10
        mapa_numero: "9→10",
        nombre: "Portal de la Valldigna → Torre del Ángel (Torre árabe)",
        inicio: { lat: Number('39.477550'), lng: Number('-0.378600') },
        waypoints:
        [
            { lat: Number('39.477470'), lng: Number('-0.378150') },
            { lat: Number('39.477430'), lng: Number('-0.377980') },
            { lat: Number('39.477680'), lng: Number('-0.377950') },
            { lat: Number('39.477770'), lng: Number('-0.377940') },
            { lat: Number('39.478010'), lng: Number('-0.377860') },
        ],
        fin: { lat: Number('39.478030'), lng: Number('-0.377910') },
        imagen: "imagenes/imagenes-aventuras/portal-de-la_valldigna.jpg",
        imagen2: "imagenes/imagenes-aventuras/torre-del_angel_arabe.jpg",
        video: ""
    },

    // Parada 77 - Torre del Ángel (Torre árabe) (Reto 12) (Párrafos: 515, 516, 517, 518, 519)
    {
        id: "Av34km-P-77",
        tipo: "parada",
        parada: 77, // mapa número 10
        mapa_numero: 10,
        nombre: "Torre del Ángel (Torre árabe)",
        coordenadas: { lat: Number('39.478030'), lng: Number('-0.377910') },
        imagen: "imagenes/imagenes-aventuras/torre-del_angel_arabe.jpg",
        video: ""
    },
    // Tramo 51 - Torre del Ángel (Torre árabe) → Plaza de la Virgen (Párrafos: 521, 522, 671, 520, 105, 15-B)
    {
        id: "Av34km-TR-51",
        tipo: "tramo",
        tramo: 51, // De mapa número 10 a mapa número 11
        mapa_numero: "10→11",
        nombre: "Torre del Ángel (Torre árabe) → Plaza de la Virgen",
        inicio: { lat: Number('39.478030'), lng: Number('-0.377910') },
        waypoints:
        [
            { lat: Number('39.477950'), lng: Number('-0.377730') },
            { lat: Number('39.478100'), lng: Number('-0.377590') },
            { lat: Number('39.478060'), lng: Number('-0.377300') },
            { lat: Number('39.477970'), lng: Number('-0.376910') },
            { lat: Number('39.477910'), lng: Number('-0.376620') },
            { lat: Number('39.478183'), lng: Number('-0.376511') },
             ],
        fin: { lat: Number('39.478310'), lng: Number('-0.376540') },
        imagen: "imagenes/imagenes-aventuras/torre-del_angel_arabe.jpg",
        imagen2: "imagenes/imagenes-aventuras/refugio_guerra_civil.jpg",
        video: ""
    },
        // Parada 78 - Refugio Guerra Civil (Párrafos: 524, 395)
    {
        id: "Av34km-P-78",
        tipo: "parada",
        parada: 78, // mapa número 3
        mapa_numero: 3,
        nombre: "Refugio Guerra Civil",
        coordenadas: { lat: Number('39.478290'), lng: Number('-0.376475') },
        imagen: "imagenes/imagenes-aventuras/refugio_guerra_civil.jpg",
    },
    // Tramo 52: Refugio Guerra Civil → Museo de Corpus Christi (Casa de las Rocas) (Párrafos: )
    {
        id: "Av34km-TR-52",
        tipo: "tramo",
        tramo: 52, // De mapa número  a mapa número
        mapa_numero: "33→35",
        nombre: "Refugio Guerra Civil → Museo de Corpus Christi (Casa de las Rocas)",
        inicio: { lat: Number('39.478290'), lng: Number('-0.376475') },
        waypoints:
        [
            { lat: Number('39.478507'), lng: Number('-0.376375') },
            { lat: Number('39.478792'), lng: Number('-0.376264') },
            { lat: Number('39.478860'), lng: Number('-0.376565') },
        ],
        coordenadas: { lat: Number('39.478960'), lng: Number('-0.376920') },
        imagen: "imagenes/imagenes-aventuras/refugio_guerra_civil.jpg",
        imagen2: "imagenes/imagenes-aventuras/casa_rocas.jpg",
        video: "",
    },
    // Parada 79 - Museo de Corpus Christi (Casa de las Rocas) (Reto4Puzzle PZ-18) (Párrafos: 5-B, 530, 531, 532, 396)
    {
        id: "Av34km-P-79",
        tipo: "parada",
        parada: 79, // mapa número 2
        mapa_numero: 1,
        nombre: "",
        coordenadas: { lat: Number('39.478960'), lng: Number('-0.376920') },
        imagen: "imagenes/imagenes-aventuras/casa_rocas.jpg",
    },
    // Tramo 53: Museo de Corpus Christi (Casa de las Rocas) → Parroquia de la Santísima Cruz (Iglesia del Carmen) (Párrafos: 533, 6-B)
    {
        id: "Av34km-TR-53",
        tipo: "tramo",
        tramo: 53, // De mapa número 2 a mapa número 3
        mapa_numero: "2→3",
        nombre: "Museo de Corpus Christi (Casa de las Rocas) → Parroquia de la Santísima Cruz (Iglesia del Carmen)",
        inicio: { lat: Number('39.478960'), lng: Number('-0.376920') },
         waypoints: [
            { lat: Number('39.479010'), lng: Number('-0.377120') },
            { lat: Number('39.479020'), lng: Number('-0.377420') },
            { lat: Number('39.478990'), lng: Number('-0.377800') },
            { lat: Number('39.479040'), lng: Number('-0.378190') },
            { lat: Number('39.479130'), lng: Number('-0.378380') },
         ],
        fin: {lat: Number('39.479210'), lng: Number('-0.378590') },
        imagen: "imagenes/imagenes-aventuras/casa_rocas.jpg",
        imagen2: "imagenes/imagenes-aventuras/iglesia_del_carmen.jpg",
        video: "",
    },
    // Parada 80 - Parroquia de la Santísima Cruz (Iglesia del Carmen) (Reto 5) (Párrafos: 534, 535, 536, 537, 538)
    {
        id: "Av34km-P-80",
        tipo: "parada",
        parada: 80, // mapa número 3
        mapa_numero: 3,
        nombre: "Parroquia de la Santísima Cruz (Iglesia del Carmen)",
        coordenadas: { lat: Number('39.479210'), lng: Number('-0.378590') },
        imagen: "imagenes/imagenes-aventuras/iglesia_del_carmen.jpg",
    },
    // Parada 81 - Parroquia de la Santísima Cruz (Iglesia del Carmen) 2 (Reto 6) (Párrafos: 539, 540, 541)
    {
        id: "Av34km-P-81",
        tipo: "parada",
        parada: 81, // mapa número 3
        mapa_numero: 3,
        nombre: "",
        coordenadas: { lat: Number('39.479210'), lng: Number('-0.378600') },
        imagen: "imagenes/imagenes-aventuras/iglesia_del_carmen.jpg",
    },
    // Tramo 54: Parroquia de la Santísima Cruz (Iglesia del Carmen) → Centro Cultural Contemporáneo "El Carmen" (Párrafos: 542, 7)
    {
        id: "Av34km-TR-54",
        tipo: "tramo",
        tramo: 54, // De mapa número 3 a mapa número 4
        mapa_numero: "3→4",
        nombre: "Parroquia de la Santísima Cruz (Iglesia del Carmen) → Centro Cultural Contemporáneo: El Carmen",
        inicio: { lat: Number('39.479210'), lng: Number('-0.378600') },
         waypoints: [
            { lat: Number('39.479270'), lng: Number('-0.378760') },
         ],
        fin: {lat: Number('39.479340'), lng: Number('-0.378850') },
        imagen: "imagenes/imagenes-aventuras/iglesia_del_carmen.jpg",
        imagen2: "imagenes/imagenes-aventuras/centro_cultural_el_carmen.jpg",
        video: "",
    },
    // Parada 82 - Centro Cultural Contemporáneo "El Carmen" (Reto 7) (Párrafos: 543, 544-B, 545, 546)
    {
        id: "Av34km-P-82",
        tipo: "parada",
        parada: 82, // mapa número 4
        mapa_numero: 4,
        nombre: "Centro Cultural Contemporáneo: El Carmen",
        coordenadas: { lat: Number('39.479340'), lng: Number('-0.378850') },
        imagen: "imagenes/imagenes-aventuras/centro_cultural_el_carmen.jpg",
    },
    // Parada 83 - Centro Cultural Contemporáneo "El Carmen" 2 (Reto 8) (Párrafos: 547, 548, 549, 550)
    {
        id: "Av34km-P-83",
        tipo: "parada",
        parada: 83, // mapa número 4
        mapa_numero: 4,
        nombre: "Centro Cultural Contemporáneo: El Carmen",
        coordenadas: { lat: Number('39.479360'), lng: Number('-0.378880') },
        imagen: "imagenes/imagenes-aventuras/centro_cultural_el_carmen.jpg",
    },
    // Tramo 55: Centro Cultural Contemporáneo: El Carmen → Casa de los Gatos (Párrafos: 551, 8-B, 552)
    {
        id: "Av34km-TR-55",
        tipo: "tramo",
        tramo: 55, // De mapa número 4 a mapa número 5
        mapa_numero: "4→5",
        nombre: "Centro Cultural Contemporáneo: El Carmen → Casa de los Gatos",
        inicio: { lat: Number('39.479360'), lng: Number('-0.378880') },
         waypoints: [
            { lat: Number('39.479360'), lng: Number('-0.378880') },
            { lat: Number('39.479630'), lng: Number('-0.379290') }
         ],
        fin: {lat: Number('39.479740'), lng: Number('-0.379500') },
        imagen: "imagenes/imagenes-aventuras/centro_cultural_el_carmen.jpg",
        imagen2: "imagenes/imagenes-aventuras/casa_de_los_gatos.jpg",
        video: "",
    },
    // Parada 84 - Casa de los Gatos (Reto 9) (Párrafos: 553, 554)
    {
        id: "Av34km-P-84",
        tipo: "parada",
        parada: 84, // mapa número 5
        mapa_numero: 5,
        nombre: "Casa de los Gatos",
        coordenadas: { lat: Number('39.479740'), lng: Number('-0.379500') },
        imagen: "imagenes/imagenes-aventuras/casa_de_los_gatos.jpg",
    },
    // Parada 85 - Casa de los Gatos 2 (Párrafos: 555, 556)
    {
        id: "Av34km-P-85",
        tipo: "parada",
        parada: 85, // mapa número 5
        mapa_numero: 5,
        nombre: "Casa de los Gatos",
        coordenadas: { lat: Number('39.479750'), lng: Number('-0.379510') },
        imagen: "imagenes/imagenes-aventuras/casa_de_los_gatos.jpg",
    },
    // Parada 86 - Casa de los Gatos 3 (Reto 10) (Párrafos: 557, 558)
    {
        id: "Av34km-P-86",
        tipo: "parada",
        parada: 86, // mapa número 5
        mapa_numero: 5,
        nombre: "Casa de los Gatos",
        coordenadas: { lat: Number('39.479750'), lng: Number('-0.379500') },
        imagen: "imagenes/imagenes-aventuras/casa_de_los_gatos.jpg",
    },
    // Parada 87 - Casa de los Gatos 4 (Reto 11) (Párrafos: 559)
    {
        id: "Av34km-P-87",
        tipo: "parada",
        parada: 87, // mapa número 5
        mapa_numero: 5,
        nombre: "Casa de los Gatos",
        coordenadas: { lat: Number('39.479740'), lng: Number('-0.379510') },
        imagen: "imagenes/imagenes-aventuras/casa_de_los_gatos.jpg",
    },
    // Tramo 56: Casa de los Gatos → Instituto Valenciano de Arte Moderno (IVAM) (Párrafos: 561, 10-C)
    {
        id: "Av34km-TR-56",
        tipo: "tramo",
        tramo: 56, // De mapa número 5 a mapa número 6
        mapa_numero: "5→6",
        nombre: "Casa de los Gatos → Instituto Valenciano de Arte Moderno (IVAM)",
        inicio: { lat: Number('39.479740'), lng: Number('-0.379510') },
         waypoints: [
            { lat: Number('39.479780'), lng: Number('-0.379860')},
            { lat: Number('39.479670'), lng: Number('-0.379840') },
            { lat: Number('39.479590'), lng: Number('-0.379860') },
            { lat: Number('39.479760'), lng: Number('-0.380620') },
            { lat: Number('39.480010'), lng: Number('-0.381750') },
            { lat: Number('39.480140'), lng: Number('-0.382410') },
            { lat: Number('39.480250'), lng: Number('-0.382920') },
         ],
        fin: { lat: Number('39.480022'), lng: Number('-0.382899') },
        imagen: "imagenes/imagenes-aventuras/casa_de_los_gatos.jpg",
        imagen2: "imagenes/imagenes-aventuras/ivam.jpg",
        video: "",
    },
    // Parada 88: Instituto Valenciano de Arte Moderno (IVAM): Trazado de las Murallas (Párrafos: 562, 562-B)
    {
        id: "Av34km-P-88",
        tipo: "parada",
        parada: 88, // mapa número 6
        mapa_numero: 6,
        nombre: "Instituto Valenciano de Arte Moderno (IVAM)",
        coordenadas: { lat: Number('39.480022'), lng: Number('-0.382899') },
        imagen: "imagenes/imagenes-aventuras/ivam.jpg",
        imagen2:"imagenes/imagenes-aventuras/torres_de_quart.jpg",
    },
    // Parada 89: Instituto Valenciano de Arte Moderno (IVAM): Museo (Párrafos: 563-C)
    {
        id: "Av34km-P-89",
        tipo: "parada",
        parada: 89, // mapa número 6
        mapa_numero: 6,
        nombre: "Instituto Valenciano de Arte Moderno (IVAM)",
        coordenadas: { lat: Number('39.480022'), lng: Number('-0.382899') },
        imagen: "imagenes/imagenes-aventuras/ivam.jpg",
    },
    // Tramo 57: Instituto Valenciano de Arte Moderno (IVAM) → Museo de prehistoria y Etnología (Párrafos: )
    {
        id: "Av34km-TR-57",
        tipo: "tramo",
        tramo: 57, // De mapa número  a mapa número
        mapa_numero: "5→6",
        nombre: "Instituto Valenciano de Arte Moderno (IVAM) → Museo de prehistoria y Etnología",
        inicio: { lat: Number('39.480022'), lng: Number('-0.382899') },
         waypoints: [
            { lat: Number('39.480023'), lng: Number('-0.383164') },
            { lat: Number('39.479822'), lng: Number('-0.383262') },
            { lat: Number('39.479651'), lng: Number('-0.383301') },
            { lat: Number('39.479293'), lng: Number('-0.383427') },
            { lat: Number('39.479044'), lng: Number('-0.383525') },
            { lat: Number('39.478782'), lng: Number('-0.383634') },
            { lat: Number('39.478334'), lng: Number('-0.383766') },
            { lat: Number('39.478158'), lng: Number('-0.383787') },
            { lat: Number('39.478182'), lng: Number('-0.383672') },
            { lat: Number('39.478290'), lng: Number('-0.383551') },
            { lat: Number('39.478279'), lng: Number('-0.383392') },
         ],
        fin: { lat: Number('39.478248'), lng: Number('-0.383117') },
        imagen: "imagenes/imagenes-aventuras/ivam.jpg",
        imagen3: "imagenes/imagenes-aventuras/museo_prehistoria_far.jpg",
        imagen4: "imagenes/imagenes-aventuras/museo_prehistoria_close.jpg",
        imagen5: "imagenes/imagenes-aventuras/museo_prehistoria-front.jpg",
        video: "",
    },
    // Parada 90: Museo de prehistoria y Etnología (Párrafos: 565, 566)
    {
        id: "Av34km-P-90",
        tipo: "parada",
        parada: 90, // mapa número 18/19
        mapa_numero: "18/19",
        nombre: "Museo de Prehistoria y Etnología",
        coordenadas: { lat: Number('39.478248'), lng: Number('-0.383117') },
        imagen: "imagenes/imagenes-aventuras/museo_prehistoria-front.jpg",
    },
    // Tramo 58: Museo de Prehistoria y Etnología → Iglesia de la Milagrosa (Párrafos: 567, 31)
    {
        id: "Av34km-TR-58",
        tipo: "tramo",
        tramo: 58, // De mapa número 18/19 a mapa número 20
        mapa_numero: "18/19→20",
        nombre: "Museo de Prehistoria y Etnología → Iglesia de la Milagrosa",
        inicio: { lat: Number('39.478248'), lng: Number('-0.383117') },
        waypoints:
        [
            { lat: Number('39.478208'), lng: Number('-0.382867') },
        ],
        fin: { lat: Number('39.478176'), lng: Number('-0.382630') },
        imagen: "imagenes/imagenes-aventuras/museo_prehistoria-front.jpg",
        imagen2: "imagenes/imagenes-aventuras/iglesia_de_la_milagrosa.jpg",
        video: "",
    },
    // Parada 91: Iglesia de la Milagrosa (Reto 28) (Párrafos: 568, 569, 127)
    {
        id: "Av34km-P-91",
        tipo: "parada",
        parada: 91, // mapa número 20
        mapa_numero: "20",
        nombre: "Iglesia de la Milagrosa",
        coordenadas: { lat: Number('39.478176'), lng: Number('-0.382630') },
        imagen: "imagenes/imagenes-aventuras/iglesia_de_la_milagrosa.jpg",
    },
    // Tramo 59: Iglesia de la Milagrosa → Torres de Quart (Párrafos: 567, 31)
    {
        id: "Av34km-TR-59",
        tipo: "tramo",
        tramo: 59, // De mapa número 18/19 a mapa número 20
        mapa_numero: "18/19→20",
        nombre: "Iglesia de la Milagrosa → Torres de Quart",
        inicio: { lat: Number('39.478176'), lng: Number('-0.382630') },
        waypoints:
        [
            { lat: Number('39.478248'), lng: Number('-0.383117') },
            { lat: Number('39.478279'), lng: Number('-0.383392') },
            { lat: Number('39.478285'), lng: Number('-0.383578') },
            { lat: Number('39.478216'), lng: Number('-0.383616') },
            { lat: Number('39.478155'), lng: Number('-0.383797') },
            { lat: Number('39.477940'), lng: Number('-0.383839') },
            { lat: Number('39.477595'), lng: Number('-0.383909') },
            { lat: Number('39.477378'), lng: Number('-0.383947') },
            { lat: Number('39.477033'), lng: Number('-0.384030') },
            { lat: Number('39.476724'), lng: Number('-0.384087') },
            { lat: Number('39.476406'), lng: Number('-0.384140') },
            { lat: Number('39.476014'), lng: Number('-0.384200') },
            { lat: Number('39.475863'), lng: Number('-0.384217') },
        ],
        fin: { lat: Number('39.475797'), lng: Number('-0.384197') },
        imagen: "imagenes/imagenes-aventuras/iglesia_de_la_milagrosa.jpg",
        imagen2: "imagenes/imagenes-aventuras/museo_prehistoria_close.jpg",
        imagen3: "imagenes/imagenes-aventuras/torres_de_quart.jpg",
        video: "",
    },
    // Parada 92: Torres de Quart 1 (Reto 26) (Párrafos: 571, 594, 572, 573)
    {
        id: "Av34km-P-92",
        tipo: "parada",
        parada: 92, // mapa número 17
        mapa_numero: 17,
        nombre: "Torres de Quart",
        coordenadas: { lat: Number('39.475797'), lng: Number('-0.384197') },
        imagen: "imagenes/imagenes-aventuras/torres_de_quart.jpg",
    },
    // Parada 93: Torres de Quart 2 (Reto27Puzzle PZ-15) (Párrafos: 574, 575)
    {
        id: "Av34km-P-93",
        tipo: "parada",
        parada: 93, // mapa número 17
        mapa_numero: 17,
        nombre: "Torres de Quart",
        coordenadas: { lat: Number('39.475780'), lng: Number('-0.384202') },
        imagen: "imagenes/imagenes-aventuras/torres_de_quart.jpg",
        imagen2: "imagenes/imagenes-aventuras/torres-quart-palleter.jpg",
    },
    // Tramo 60: Torres de Quart → Biblioteca del Hospital (Párrafos: )
    {
        id: "Av34km-TR-60",
        tipo: "tramo",
        tramo: 60, // De mapa número  a mapa número
        mapa_numero: "18/19→20",
        nombre: "Torres de Quart → Biblioteca del Hospital",
        inicio: { lat: Number('39.475780'), lng: Number('-0.384202') },
        waypoints:
        [
            { lat: Number('39.475035'), lng: Number('-0.384130') },
            { lat: Number('39.473862'), lng: Number('-0.383989') },
            { lat: Number('39.472483'), lng: Number('-0.384038') },
            { lat: Number('39.470578'), lng: Number('-0.383620') },
            { lat: Number('39.470570'), lng: Number('-0.383448') },
        ],
        fin: { lat: Number('39.470638'), lng: Number('-0.383312') },
        imagen: "imagenes/imagenes-aventuras/torres_de_quart.jpg",
        imagen2: "imagenes/imagenes-aventuras/biblioteca_hospital_fuente.jpg",
        video: "",
    },
    // Parada 94: calle del Hospital (Ermita de Santa lucía) (Reto: 17) (Párrafos: 578, 579)
    {
        id: "Av34km-P-94",
        tipo: "parada",
        parada: 94, // mapa número 13
        mapa_numero: 13,
        nombre: "Calle del Hospital (Ermita de Santa Lucía)",
        coordenadas: { lat: Number('39.470638'), lng: Number('-0.383312') },
        imagen: "imagenes/imagenes-aventuras/biblioteca_hospital_fuente.jpg",
    },
    // Parada 95: calle del Hospital 2 (Ermita de Santa lucía) (Reto: 18) (Párrafos: 580)
    {
        id: "Av34km-P-95",
        tipo: "parada",
        parada: 95, // mapa número 13
        mapa_numero: 13,
        nombre: "Calle del Hospital (Ermita de Santa Lucía)",
        coordenadas: { lat: Number('39.470669'), lng: Number('-0.383250') },
        imagen: "imagenes/imagenes-aventuras/iglesia_calle_hospital.jpg",
    },
    // Parada 96: calle del Hospital 3 (Ermita de Santa lucía) (Reto: 19) (Párrafos: 581, 582, 583)
    {
        id: "Av34km-P-96",
        tipo: "parada",
        parada: 96, // mapa número 13
        mapa_numero: 13,
        nombre: "Calle del Hospital (Ermita de Santa Lucía)",
        coordenadas: { lat: Number('39.470673'), lng: Number('-0.383215') },
        imagen: "imagenes/imagenes-aventuras/iglesia_calle_hospital.jpg",
    },
     // Tramo 61: calle del Hospital (Ermita de Santa Lucía) → Museo y Colegio del Arte Mayor de la Seda (Párrafos: 584, 21)
    {
        id: "Av34km-TR-61",
        tipo: "tramo",
        tramo: 61, // De mapa número 13 a mapa número 14
        mapa_numero: "13→14",
        nombre: "Calle del Hospital (Ermita de Santa Lucía) → Museo y Colegio del Arte Mayor de la Seda",
        inicio: { lat: Number('39.470673'), lng: Number('-0.383215') },
        waypoints:
        [
            { lat: Number('39.470767'), lng: Number('-0.383094') },
            { lat: Number('39.470883'), lng: Number('-0.382808') },
            { lat: Number('39.470927'), lng: Number('-0.382570') },
            { lat: Number('39.470926'), lng: Number('-0.382217') },
            { lat: Number('39.470923'), lng: Number('-0.381774') },
            { lat: Number('39.470876'), lng: Number('-0.381511') }, //entrada Biblioteca
            { lat: Number('39.470854'), lng: Number('-0.381225') },
        ],
        fin: { lat: Number('39.470928'), lng: Number('-0.380926') },
        imagen: "imagenes/imagenes-aventuras/iglesia_calle_hospital.jpg",
        imagen2: "imagenes/imagenes-aventuras/calle_hospital_antigua_entrada.jpg",
        imagen3: "imagenes/imagenes-aventuras/biblioteca_hospital.jpg",
        imagen4: "imagenes/imagenes-aventuras/museo_de_la_seda.jpg",
        video: "",
    },
    // Parada 97: Museo y Colegio del Arte Mayor de la Seda (Reto: 20) (Párrafos: 585, 145, 586)
    {
        id: "Av34km-P-97",
        tipo: "parada",
        parada: 97, // mapa número 14
        mapa_numero: 14,
        nombre: "Museo y Colegio del Arte Mayor de la Seda",
        coordenadas: { lat: Number('39.470928'), lng: Number('-0.380926') },
        imagen: "imagenes/imagenes-aventuras/museo_de_la_seda.jpg",
        imagen2: "imagenes/imagenes-aventuras/museo_seda_date.jpg",
    },
    // Parada 98: Museo y Colegio del Arte Mayor de la Seda 2 (Párrafos: 587, 396)
    {
        id: "Av34km-P-98",
        tipo: "parada",
        parada: 98, // mapa número 14
        mapa_numero: 14,
        nombre: "Museo y Colegio del Arte Mayor de la Seda",
        coordenadas: { lat: Number('39.470925'), lng: Number('-0.380941') },
        imagen: "imagenes/imagenes-aventuras/museo_de_la_seda.jpg",
    },
    // Tramo 62 : Museo y Colegio del Arte Mayor de la Seda → Biblioteca del Hospital (Párrafos: 588, 589, 590, 591, 592 )
    {
        id: "Av34km-TR-62",
        tipo: "tramo",
        tramo: 62, // De mapa número 14 a mapa número 13
        mapa_numero: "14→13",
        nombre: "Museo y Colegio del Arte Mayor de la Seda → Biblioteca del Hospital",
        inicio: { lat: Number('39.470925'), lng: Number('-0.380941') },
        waypoints:
        [
            { lat: Number('39.470856'), lng: Number('-0.381243') },
            { lat: Number('39.470876'), lng: Number('-0.381511') },
            { lat: Number('39.470699'), lng: Number('-0.381588') },
            { lat: Number('39.470760'), lng: Number('-0.381855') },
            { lat: Number('39.470649'), lng: Number('-0.381917') },
            { lat: Number('39.470583'), lng: Number('-0.382178') },
            { lat: Number('39.470159'), lng: Number('-0.382362') },
            { lat: Number('39.469970'), lng: Number('-0.382312') },
            { lat: Number('39.469949'), lng: Number('-0.382019') },
        ],
        fin: { lat: Number('39.469930'), lng: Number('-0.381871') },
        imagen: "imagenes/imagenes-aventuras/museo_de_la_seda.jpg",
        imagen2: "imagenes/imagenes-aventuras/biblioteca_hospital.jpg",
        imagen3: "imagenes/imagenes-aventuras/biblioteca-hospital-trasera.jpg",
        imagen3: "imagenes/imagenes-aventuras/jardin_de_la_biblioteca.jpg",
        video: "",
    },
    // Parada 99: Biblioteca del Hospital 2 (Reto21Puzzle PZ-14 ) (Párrafos: 592-B)
    {
        id: "Av34km-P-99",
        tipo: "parada",
        parada: 99, // mapa número 13
        mapa_numero: 13,
        nombre: "Biblioteca del Hospital",
        coordenadas: { lat: Number('39.469930'), lng: Number('-0.381871') },
        imagen: "imagenes/imagenes-aventuras/jardin_de_la_biblioteca.jpg",
    },
    // Tramo 63:  Biblioteca del Hospital → Torres de Quart (Párrafos:  )
    {
        id: "Av34km-TR-63",
        tipo: "tramo",
        tramo: 63, // De mapa número  a mapa número
        mapa_numero: "14→13",
        nombre: "Biblioteca del Hospital → Torres de Quart",
        inicio: { lat: Number('39.469930'), lng: Number('-0.381871') },
        waypoints:
        [
            { lat: Number('39.469964'), lng: Number('-0.382118') },
            { lat: Number('39.469924'), lng: Number('-0.382191') },
            { lat: Number('39.470028'), lng: Number('-0.382349') },
            { lat: Number('39.470131'), lng: Number('-0.382367') },
            { lat: Number('39.470401'), lng: Number('-0.382269') },
            { lat: Number('39.470696'), lng: Number('-0.382118') },
            { lat: Number('39.470653'), lng: Number('-0.381911') },
            { lat: Number('39.470767'), lng: Number('-0.381856') },
            { lat: Number('39.470715'), lng: Number('-0.381639') },
            { lat: Number('39.470878'), lng: Number('-0.381583') },
            { lat: Number('39.470901'), lng: Number('-0.382291') },
            { lat: Number('39.470901'), lng: Number('-0.382774') },
            { lat: Number('39.470792'), lng: Number('-0.383181') },
            { lat: Number('39.470676'), lng: Number('-0.383478') },
            { lat: Number('39.470604'), lng: Number('-0.383460') },
            { lat: Number('39.470566'), lng: Number('-0.383618') },
            { lat: Number('39.471014'), lng: Number('-0.383799') },
            { lat: Number('39.471505'), lng: Number('-0.383980') },
            { lat: Number('39.471732'), lng: Number('-0.384044') },
            { lat: Number('39.471909'), lng: Number('-0.384078') },
            { lat: Number('39.472447'), lng: Number('-0.384090') },
            { lat: Number('39.472864'), lng: Number('-0.384030') },
            { lat: Number('39.473329'), lng: Number('-0.384026') },
            { lat: Number('39.473886'), lng: Number('-0.384016') },
            { lat: Number('39.474631'), lng: Number('-0.384107') },
            { lat: Number('39.475517'), lng: Number('-0.384221') },
        ],
        fin: { lat: Number('39.475780'), lng: Number('-0.384202') },
        imagen: "imagenes/imagenes-aventuras/museo_de_la_seda.jpg",
        imagen2: "imagenes/imagenes-aventuras/biblioteca_hospital.jpg",
        imagen3: "imagenes/imagenes-aventuras/biblioteca-hospital-trasera.jpg",
        imagen4: "imagenes/imagenes-aventuras/jardin_de_la_biblioteca.jpg",
        video: "",
    },
    // Parada 100: Torres de Quart 2 (Reto27Puzzle PZ-15) (Párrafos: 574, 575)
    {
        id: "Av34km-P-100",
        tipo: "parada",
        parada: 100, // mapa número 17
        mapa_numero: 17,
        nombre: "Torres de Quart",
        coordenadas: { lat: Number('39.475780'), lng: Number('-0.384202') },
        imagen: "imagenes/imagenes-aventuras/torres_de_quart.jpg",
        imagen2: "imagenes/imagenes-aventuras/torres-quart-palleter.jpg",
    },
    // Tramo 64: Torres de Quart → jardín Botánico (Párrafos: )
    {
        id: "Av34km-TR-64",
        tipo: "tramo",
        tramo: 64, // De mapa número  a mapa número
        mapa_numero: "14→13",
        nombre: "Museo y Colegio del Arte Mayor de la Seda → Biblioteca del Hospital",
        inicio: { lat: Number('39.475780'), lng: Number('-0.384202') },
        waypoints:
        [
            { lat: Number('39.475740'), lng: Number('-0.384253') },
            { lat: Number('39.475658'), lng: Number('-0.384690') },
            { lat: Number('39.475572'), lng: Number('-0.385169') },
            { lat: Number('39.475442'), lng: Number('-0.386010') },
        ],
        fin: { lat: Number('39.475395'), lng: Number('-0.386364') },
        imagen: "imagenes/imagenes-aventuras/museo_de_la_seda.jpg",
        imagen2: "imagenes/imagenes-aventuras/biblioteca_hospital.jpg",
        imagen3: "imagenes/imagenes-aventuras/biblioteca-hospital-trasera.jpg",
        imagen4: "imagenes/imagenes-aventuras/jardin_de_la_biblioteca.jpg",
        video: "",
    },
    // Parada 101: Jardín Botánico (Párrafos: )
    {
        id: "Av34km-P-101",
        tipo: "parada",
        parada: 101, // mapa número 17
        mapa_numero: 17,
        nombre: "Jardín Botánico",
        coordenadas: { lat: Number('39.475395'), lng: Number('-0.386364') },
        imagen: "imagenes/imagenes-aventuras/jardin_botanico.jpg",
    },
    // Tramo 65 : Jardín Botánico → Jardín de las Hespérides (Párrafos: 588, 589, 590, 591, 592 )
    {
        id: "Av34km-TR-65",
        tipo: "tramo",
        tramo: 65, // De mapa número 14 a mapa número 13
        mapa_numero: "14→13",
        nombre: "Jardín Botánico → Jardín de las Hespérides",
        inicio: { lat: Number('39.475395'), lng: Number('-0.386364') },
        waypoints:
        [
            { lat: Number('39.475316'), lng: Number('-0.386815') },
            { lat: Number('39.475301'), lng: Number('-0.387159') },
            { lat: Number('39.475683'), lng: Number('-0.387230') },
            { lat: Number('39.476110'), lng: Number('-0.387341') },
            { lat: Number('39.476409'), lng: Number('-0.387446') },
            { lat: Number('39.476919'), lng: Number('-0.387645') },
            { lat: Number('39.477372'), lng: Number('-0.387831') },
            { lat: Number('39.477303'), lng: Number('-0.388155') },
            { lat: Number('39.477468'), lng: Number('-0.388224') },
        ],
        fin: { lat: Number('39.477646'), lng: Number('-0.388293') },
        imagen: "imagenes/imagenes-aventuras/museo_de_la_seda.jpg",
        imagen2: "imagenes/imagenes-aventuras/biblioteca_hospital.jpg",
        imagen3: "imagenes/imagenes-aventuras/biblioteca-hospital-trasera.jpg",
        imagen4: "imagenes/imagenes-aventuras/jardin_de_la_biblioteca.jpg",
        video: "",
    },
    // Parada 102: Jardín de las Hespérides (Párrafos: 574, 575)
    {
        id: "Av34km-P-102",
        tipo: "parada",
        parada: 102, // mapa número 17
        mapa_numero: 17,
        nombre: "Torres de Quart",
        coordenadas: { lat: Number('39.477646'), lng: Number('-0.388293') },
        imagen: "imagenes/imagenes-aventuras/torres_de_quart.jpg",
        imagen2: "imagenes/imagenes-aventuras/torres-quart-palleter.jpg",
    },
    // Tramo 66: Jardín de las Hespérides → estadio de Atletismo (Párrafos: 588, 589, 590, 591, 592 )
    {
        id: "Av34km-TR-66",
        tipo: "tramo",
        tramo: 66, // De mapa número 14 a mapa número 13
        mapa_numero: "14→13",
        nombre: "Jardín de las Hespérides → Estadio de Atletismo",
        inicio: { lat: Number('39.477646'), lng: Number('-0.388293') },
        waypoints:
        [
            { lat: Number('39.477738'), lng: Number('-0.388288') },
            { lat: Number('39.477825'), lng: Number('-0.387975') },
            { lat: Number('39.477913'), lng: Number('-0.388033') },
            { lat: Number('39.477813'), lng: Number('-0.388579') },
            { lat: Number('39.477642'), lng: Number('-0.389183') },
            { lat: Number('39.477496'), lng: Number('-0.389663') },
            { lat: Number('39.477648'), lng: Number('-0.389747') },
            { lat: Number('39.477756'), lng: Number('-0.389378') },
            { lat: Number('39.477789'), lng: Number('-0.389267') },
            { lat: Number('39.477830'), lng: Number('-0.389282') },
            { lat: Number('39.477950'), lng: Number('-0.388912') },
            { lat: Number('39.478019'), lng: Number('-0.388852') },
            { lat: Number('39.477906'), lng: Number('-0.389274') },
            { lat: Number('39.477724'), lng: Number('-0.390009') },
            { lat: Number('39.477452'), lng: Number('-0.390948') },
            { lat: Number('39.477035'), lng: Number('-0.391982') },
            { lat: Number('39.476703'), lng: Number('-0.392713') },
            { lat: Number('39.476375'), lng: Number('-0.393427') },
            { lat: Number('39.476172'), lng: Number('-0.393896') },
            { lat: Number('39.476403'), lng: Number('-0.394072') },
        ],
        fin: {lat: Number('39.476680'), lng: Number('-0.394290')},
        imagen: "imagenes/imagenes-aventuras/museo_de_la_seda.jpg",
        imagen2: "imagenes/imagenes-aventuras/biblioteca_hospital.jpg",
        imagen3: "imagenes/imagenes-aventuras/biblioteca-hospital-trasera.jpg",
        imagen4: "imagenes/imagenes-aventuras/jardin_de_la_biblioteca.jpg",
        video: "",
    },
    // Parada 103: Estadio de Atletismo (Reto12puzzle PZ-10) (Párrafos: 603)
    {
        id: "Av34km-P-103",
        tipo: "parada",
        parada: 103, // mapa número 9
        mapa_numero: 9,
        nombre: "Estadio de Atletismo",
        coordenadas: { lat: Number('39.476680'), lng: Number('-0.394290') },
        imagen: "imagenes/imagenes-aventuras/estadio_atletismo.jpg",
    },
    // Tramo 67: Estadio de Atletismo → Na Turia (Plataforma elevada) (Párrafos: 604-B)
    {
        id: "Av34km-TR-67",
        tipo: "tramo",
        tramo: 67, // De mapa número 9 a mapa número 11
        mapa_numero: "9→11",
        nombre: "Estadio de Atletismo → Na Turia",
        inicio: { lat: Number('39.476680'), lng: Number('-0.394290') },
         waypoints: [
            { lat: Number('39.476920'), lng: Number('-0.394470') },
            { lat: Number('39.477170'), lng: Number('-0.394650') },
            { lat: Number('39.476870'), lng: Number('-0.395290') },
            { lat: Number('39.476520'), lng: Number('-0.396070') },
            { lat: Number('39.476170'), lng: Number('-0.396850') },
            { lat: Number('39.475960'), lng: Number('-0.397480') },
            { lat: Number('39.475850'), lng: Number('-0.397430') },
         ],
        fin: { lat: Number('39.475770'), lng: Number('-0.397480') },
        imagen: "imagenes/imagenes-aventuras/estadio_atletismo.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_campanar.jpg",
        imagen3: "imagenes/imagenes-aventuras/naturia_plataforma.jpg",
        video: "",
    },
    // Parada 104: Na Turia (Plataforma elevada) (Reto 13) (Párrafos: 606, 231, 608, 609, 602, 610)
    {
        id: "Av34km-P-104",
        tipo: "parada",
        parada: 104, // mapa número 11
        mapa_numero: 11,
        nombre: "Na Turia",
        coordenadas: { lat: Number('39.475770'), lng: Number('-0.397480') },
        imagen: "imagenes/imagenes-aventuras/naturia_plataforma.jpg",
        imagen2: "",
    },
    // Tramo 68: Na Turia (Plataforma elevada) → Na Turia (Museo) (Párrafos: 711, 21)
    {
        id: "Av34km-TR-68",
        tipo: "tramo",
        tramo: 68, // De mapa número 11 a mapa número 11
        mapa_numero: "11→11",
        nombre: "Na Turia (Plataforma elevada) → Na Turia (Museo)",
        inicio: { lat: Number('39.475770'), lng: Number('-0.397480') },
         waypoints: [
            { lat: Number('39.475850'), lng: Number('-0.397430') },
            { lat: Number('39.475960'), lng: Number('-0.397460') },
            { lat: Number('39.475890'), lng: Number('-0.397830') },
            { lat: Number('39.475800'), lng: Number('-0.398270') },
            { lat: Number('39.475750'), lng: Number('-0.398540') },
            { lat: Number('39.475470'), lng: Number('-0.398450') },
            { lat: Number('39.475190'), lng: Number('-0.398360') },

         ],
        fin: {lat: Number('39.475230'), lng: Number('-0.398120') },
        imagen: "imagenes/imagenes-aventuras/naturia_plataforma.jpg",
        imagen2: "imagenes/imagenes-aventuras/naturia_front.jpg",
        video: "",
    },

    // Parada 105: Na Turia (Museo) (Párrafos: 713, 54)
    {
        id: "Av34km-P-105",
        tipo: "parada",
        parada: 105, // mapa número 11
        mapa_numero: 11,
        nombre: "Na Turia",
        coordenadas: { lat: Number('39.475230'), lng: Number('-0.398120') },
        imagen: "imagenes/imagenes-aventuras/naturia_front.jpg",
        imagen2: "imagenes/imagenes-aventuras/naturia_2.jpg",
        imagen3: "imagenes/imagenes-aventuras/naturia_3.jpg",
    },
    // Tramo 69: Na Turia → Puente Amarillo (Párrafos: 611, 20)
    {
        id: "Av34km-TR-69",
        tipo: "tramo",
        tramo: 69, // De mapa número 11 a mapa número 12
        mapa_numero: "11→12",
        nombre: "Na Turia → Puente Amarillo",
        inicio: { lat: Number('39.475230'), lng: Number('-0.398120') },
         waypoints: [
            { lat: Number('39.475180'), lng: Number('-0.398370') },
            { lat: Number('39.475470'), lng: Number('-0.398450') },
            { lat: Number('39.475750'), lng: Number('-0.398540') },
            { lat: Number('39.475660'), lng: Number('-0.398980') },
            { lat: Number('39.475520'), lng: Number('-0.399720') },
            { lat: Number('39.475120'), lng: Number('-0.401840') },
         ],
        fin: {lat: Number('39.474940'), lng: Number('-0.402800') },
        imagen: "imagenes/imagenes-aventuras/naturia_front.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_amarillo.jpg",
        video: "",
    },
    // Parada 106: Puente Amarillo (Párrafos: 128, 312, 613, 614, 615)
    {
        id: "Av34km-P-106",
        tipo: "parada",
        parada: 106, // mapa número 12
        mapa_numero: 12,
        nombre: "Puente Amarillo",
        coordenadas: { lat: Number('39.474940'), lng: Number('-0.402800') },
        imagen: "imagenes/imagenes-aventuras/puente_amarillo.jpg",
    },
    // Tramo 70: Puente Amarillo → Puente 9 de Octubre  (Párrafos: 3)
    {
        id: "Av34km-TR-70",
        tipo: "tramo",
        tramo: 70, // De mapa número 12 a mapa número 13
        mapa_numero: "12→13",
        nombre: "Puente Amarillo → Puente 9 de Octubre",
        inicio: { lat: Number('39.474940'), lng: Number('-0.402800') },
         waypoints: [
            { lat: Number('39.474960'), lng: Number('-0.402900') },
            { lat: Number('39.474841'), lng: Number('-0.403309') },
            { lat: Number('39.474676'), lng: Number('-0.403726') },
            { lat: Number('39.474700'), lng: Number('-0.403942') },
            { lat: Number('39.474509'), lng: Number('-0.404457') },
            { lat: Number('39.474516'), lng: Number('-0.404712') },
            { lat: Number('39.474338'), lng: Number('-0.405193') },
         ],
        fin: {lat: Number('39.474386'), lng: Number('-0.405568') },
        imagen: "imagenes/imagenes-aventuras/puente_amarillo.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_9_octubre_close.jpg",
        video: "",
    },
    // Parada 107: Puente 9 de Octubre (Párrafos: 616, 616-B, 617)
    {
        id: "Av34km-P-107",
        tipo: "parada",
        parada: 107, // mapa número 13
        mapa_numero: 13,
        nombre: "Puente 9 de Octubre",
        coordenadas: { lat: Number('39.474386'), lng: Number('-0.405568')  },
        imagen: "imagenes/imagenes-aventuras/puente_9_octubre_close.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_9_octubre_far.jpg",
    },
    // Tramo 71: Puente 9 de Octubre → Parque de Cabecera (El Morro) (Párrafos: 618, 21, 619)
    {
        id: "Av34km-TR-71",
        tipo: "tramo",
        tramo: 71, // De mapa número 13 a mapa número 14
        mapa_numero: "13→14",
        nombre: "Puente 9 de Octubre → Parque de Cabecera (El Morro)",
        inicio: { lat: Number('39.474386'), lng: Number('-0.405568') },
         waypoints: [
            { lat: Number('39.474295'), lng: Number('-0.406398') },
            { lat: Number('39.474159'), lng: Number('-0.406864') },
            { lat: Number('39.474665'), lng: Number('-0.407867') },
            { lat: Number('39.475110'), lng: Number('-0.408124') },
            { lat: Number('39.475501'), lng: Number('-0.408085') },
            { lat: Number('39.475722'), lng: Number('-0.407743') },
            { lat: Number('39.475826'), lng: Number('-0.407644') },
            { lat: Number('39.475710'), lng: Number('-0.407134') },
            { lat: Number('39.475575'), lng: Number('-0.406996') },
            { lat: Number('39.475384'), lng: Number('-0.407068') },
            { lat: Number('39.475347'), lng: Number('-0.407255') },
            { lat: Number('39.475539'), lng: Number('-0.407697') },
            { lat: Number('39.475424'), lng: Number('-0.407915') },
            { lat: Number('39.475045'), lng: Number('-0.407811') },
            { lat: Number('39.474850'), lng: Number('-0.407565') },
            { lat: Number('39.474887'), lng: Number('-0.407365') },
            { lat: Number('39.475010'), lng: Number('-0.407285') },
            { lat: Number('39.475157'), lng: Number('-0.407328') },
            { lat: Number('39.475329'), lng: Number('-0.407478') },
            { lat: Number('39.475362'), lng: Number('-0.407649') },
            { lat: Number('39.475283'), lng: Number('-0.407675') },
                { lat: Number('39.475214'), lng: Number('-0.407603') },
         ],
        fin: {lat: Number('39.475316'), lng: Number('-0.407615')},
        imagen: "imagenes/imagenes-aventuras/puente_9_octubre_far.jpg",
        imagen2: "imagenes/imagenes-aventuras/parque_de_cabecera_el_morro_middle.jpg",
        video: "",
    },
    // Parada 108: Parque de Cabecera (El Morro) (Reto14puzzle PZ-11 ) (Párrafos: 621, 622)
    {
        id: "Av34km-P-108",
        tipo: "parada",
        parada: 108, // mapa número 14
        mapa_numero: 14,
        nombre: "Parque de Cabecera (El Morro)",
        coordenadas: { lat: Number('39.475316'), lng: Number('-0.407615') },
        imagen: "imagenes/imagenes-aventuras/parque_de_cabecera_el_morro_down.jpg",
        imagen2: "imagenes/imagenes-aventuras/parque_de_cabecera_el_morro_middle.jpg",
        imagen3: "imagenes/imagenes-aventuras/parque_de_cabecera_el_morro_top.jpg",
    },
    // Parada 109: Parque de Cabecera (El Morro) (Párrafos: 623, 624, 625)
    {
        id: "Av34km-P-109",
        tipo: "parada",
        parada: 109, // mapa número 14
        mapa_numero: 14,
        nombre: "Parque de Cabecera (El Morro)",
        coordenadas: { lat: Number('39.475329'), lng: Number('-0.407602') },
        imagen: "imagenes/imagenes-aventuras/parque_de_cabecera_el_morro_middle.jpg",
    },
    // Tramo 72: Parque de Cabecera (El Morro) → Bioparc (Párrafos: 22-E, 628-B)
    {
        id: "Av34km-TR-72",
        tipo: "tramo",
        tramo: 72, // De mapa número 14 a mapa número 15
        mapa_numero: "14→15",
        nombre: "Parque de Cabecera (El Morro) → Bioparc",
        inicio: { lat: Number('39.475329'), lng: Number('-0.407602')  },
         waypoints: [
            { lat: Number('39.475198'), lng: Number('-0.407590') },
            { lat: Number('39.475270'), lng: Number('-0.407674') },
            { lat: Number('39.475353'), lng: Number('-0.407667') },
            { lat: Number('39.475370'), lng: Number('-0.407579') },
            { lat: Number('39.475263'), lng: Number('-0.407406') },
            { lat: Number('39.475101'), lng: Number('-0.407295') },
            { lat: Number('39.474920'), lng: Number('-0.407307') },
            { lat: Number('39.474838'), lng: Number('-0.407422') },
            { lat: Number('39.474853'), lng: Number('-0.407608') },
            { lat: Number('39.474766'), lng: Number('-0.407352') },
            { lat: Number('39.474811'), lng: Number('-0.407048') },
            { lat: Number('39.474955'), lng: Number('-0.406749') },
            { lat: Number('39.475186'), lng: Number('-0.406555') },
            { lat: Number('39.475464'), lng: Number('-0.406479') },
            { lat: Number('39.475490'), lng: Number('-0.406421') },
            { lat: Number('39.475923'), lng: Number('-0.406513') },
            { lat: Number('39.476257'), lng: Number('-0.406581') },
            { lat: Number('39.476591'), lng: Number('-0.406646') },
            { lat: Number('39.477045'), lng: Number('-0.406731') },
            { lat: Number('39.477563'), lng: Number('-0.406862') },
         ],
        fin: {lat: Number('39.478020'), lng: Number('-0.406962') },
        imagen: "imagenes/imagenes-aventuras/parque_de_cabecera_el_morro_middle.jpg",
        imagen2: "imagenes/imagenes-aventuras/bioparc.jpg",
        video: "",
    },
    // Parada 110: Bioparc (Reto15puzzle PZ-12) (Párrafos: 627, 628)
    {
        id: "Av34km-P-110",
        tipo: "parada",
        parada: 110, // mapa número 15
        mapa_numero: 15,
        nombre: "Bioparc",
        coordenadas: { lat: Number('39.478020'), lng: Number('-0.406962') },
        imagen: "imagenes/imagenes-aventuras/bioparc.jpg",
    },
    // Tramo 73: Bioparc → Molino del Sol (Párrafos: 708, 23-C)
    {
        id: "Av34km-TR-73",
        tipo: "tramo",
        tramo: 73, // De mapa número 15 a mapa número 16
        mapa_numero: "15→16",
        nombre: "Bioparc → Molino del Sol",
        inicio: { lat: Number('39.478020'), lng: Number('-0.406962') },
         waypoints: [
            { lat: Number('39.477242'), lng: Number('-0.406792') },
            { lat: Number('39.476581'), lng: Number('-0.406645') },
            { lat: Number('39.476385'), lng: Number('-0.406615') },
            { lat: Number('39.476112'), lng: Number('-0.406554') },
            { lat: Number('39.476067'), lng: Number('-0.407099') },
            { lat: Number('39.475973'), lng: Number('-0.407644') },
            { lat: Number('39.476714'), lng: Number('-0.408012') },
            { lat: Number('39.477405'), lng: Number('-0.408416') },
            { lat: Number('39.478151'), lng: Number('-0.408627') },
            { lat: Number('39.478589'), lng: Number('-0.408844') },
            { lat: Number('39.478963'), lng: Number('-0.409175') },
            { lat: Number('39.479150'), lng: Number('-0.409226') },
            { lat: Number('39.479874'), lng: Number('-0.409130') },
            { lat: Number('39.480465'), lng: Number('-0.409224') },
            { lat: Number('39.481059'), lng: Number('-0.409784') },
            { lat: Number('39.481439'), lng: Number('-0.410131') },
         ],
        fin: {lat: Number('39.481476'), lng: Number('-0.410299') },
        imagen: "imagenes/imagenes-aventuras/bioparc.jpg",
        imagen2: "imagenes/imagenes-aventuras/parque_cabecera.jpg",
        imagen3: "imagenes/imagenes-aventuras/parque_de_cabecera_end_side.jpg",
        imagen4: "imagenes/imagenes-aventuras/parque_de_cabecera_end_park.jpg",
        video: "",
    },
    // Parada 111: Molino del Sol (Párrafos: 709)
    {
        id: "Av34km-P-111",
        tipo: "parada",
        parada: 111, // mapa número 16
        mapa_numero: 16,
        nombre: "Molino del Sol",
        coordenadas: { lat: Number('39.481476'), lng: Number('-0.410299') },
        imagen: "imagenes/imagenes-aventuras/parque_de_cabecera_end_park.jpg",
    },
    // Tramo 74: Molino de Sol → Museo de Historia (Párrafos: 710, 24-D)
    {
        id: "Av34km-TR-74",
        tipo: "tramo",
        tramo: 74, // De mapa número 16 a mapa número 17
        mapa_numero: "16→17",
        nombre: "Molino de Sol → Museo de Historia",
        inicio: { lat: Number('39.481476'), lng: Number('-0.410299') },
         waypoints: [
            { lat: Number('39.481189'), lng: Number('-0.410518') },
            { lat: Number('39.480787'), lng: Number('-0.410196') },
            { lat: Number('39.480254'), lng: Number('-0.409787') },
            { lat: Number('39.479866'), lng: Number('-0.409631') },
            { lat: Number('39.479382'), lng: Number('-0.409689') },
            { lat: Number('39.479148'), lng: Number('-0.409734') },
            { lat: Number('39.478857'), lng: Number('-0.409728') },
            { lat: Number('39.478233'), lng: Number('-0.409565') },
            { lat: Number('39.477862'), lng: Number('-0.409327') },
            { lat: Number('39.477527'), lng: Number('-0.409289') },
            { lat: Number('39.477181'), lng: Number('-0.409605') },
            { lat: Number('39.476759'), lng: Number('-0.409442') },
            { lat: Number('39.476289'), lng: Number('-0.409259') },
            { lat: Number('39.476073'), lng: Number('-0.409310') },
            { lat: Number('39.475800'), lng: Number('-0.409505') },
            { lat: Number('39.475573'), lng: Number('-0.409676') },
            { lat: Number('39.475409'), lng: Number('-0.409775') },
            { lat: Number('39.474960'), lng: Number('-0.409842') },
            { lat: Number('39.474716'), lng: Number('-0.409607') },
            { lat: Number('39.474463'), lng: Number('-0.409194') },
            { lat: Number('39.474161'), lng: Number('-0.408666') },
            { lat: Number('39.474014'), lng: Number('-0.407791') },
            { lat: Number('39.473807'), lng: Number('-0.407420') },
            { lat: Number('39.473492'), lng: Number('-0.406986') },
            { lat: Number('39.473357'), lng: Number('-0.407035') },
            { lat: Number('39.473227'), lng: Number('-0.407334') },
            { lat: Number('39.473090'), lng: Number('-0.407515') },
            { lat: Number('39.472887'), lng: Number('-0.407471') },
            { lat: Number('39.472836'), lng: Number('-0.407840') },
            { lat: Number('39.472845'), lng: Number('-0.407965') },
            { lat: Number('39.472932'), lng: Number('-0.408327') },
                    ],
        fin: {lat: Number('39.472788'), lng: Number('-0.408349') },
        imagen: "imagenes/imagenes-aventuras/parque_de_cabecera_end_park.jpg",
        imagen2: "imagenes/imagenes-aventuras/cabecera_izquierda.jpg",
        imagen3: "imagenes/imagenes-aventuras/parque_de_ cabecera_lake_side.jpg",
        imagen4: "imagenes/imagenes-aventuras/museo_de_historia.jpg",
        video: "",
    },
    // Parada 112: Museo de Historia (Párrafos: 630, 631, 632)
    {
        id: "Av34km-P-112",
        tipo: "parada",
        parada: 112, // mapa número 17
        mapa_numero: 17,
        nombre: "Museo de Historia",
        coordenadas: { lat: Number('39.472788'), lng: Number('-0.408349') },
        imagen: "imagenes/imagenes-aventuras/museo_de_historia.jpg",
    },
    // Tramo 75: Museo de Historia → Pechina en el Turia (Párrafos: 633, 28-B, 415, 27-B)
    {
        id: "Av34km-TR-75",
        tipo: "tramo",
        tramo: 75, // De mapa número 17 a mapa número 18
        mapa_numero: "17→18",
        nombre: "Museo de Historia → Pechina en el Turia",
        inicio: { lat: Number('39.472788'), lng: Number('-0.408349') },
         waypoints: [
            { lat: Number('39.472768'), lng: Number('-0.407962') },
            { lat: Number('39.472858'), lng: Number('-0.407629') },
            { lat: Number('39.472891'), lng: Number('-0.407468') },
            { lat: Number('39.473026'), lng: Number('-0.407492') },
            { lat: Number('39.473048'), lng: Number('-0.407202') },
            { lat: Number('39.473086'), lng: Number('-0.406919') },
            { lat: Number('39.473212'), lng: Number('-0.406418') },
            { lat: Number('39.473307'), lng: Number('-0.405727') },
            { lat: Number('39.473483'), lng: Number('-0.405065') },
            { lat: Number('39.473483'), lng: Number('-0.405065') },
            { lat: Number('39.473526'), lng: Number('-0.404125') },
            { lat: Number('39.473691'), lng: Number('-0.403656') },
            { lat: Number('39.473642'), lng: Number('-0.403215') },
            { lat: Number('39.473768'), lng: Number('-0.402547') },
            { lat: Number('39.473917'), lng: Number('-0.401835') },
            { lat: Number('39.474056'), lng: Number('-0.401120') },
            { lat: Number('39.474223'), lng: Number('-0.400289') },
            { lat: Number('39.474321'), lng: Number('-0.399684') },
            { lat: Number('39.474416'), lng: Number('-0.399264') },
            { lat: Number('39.474558'), lng: Number('-0.398619') },
            { lat: Number('39.474859'), lng: Number('-0.397199') },
            { lat: Number('39.475142'), lng: Number('-0.396440') },
            { lat: Number('39.475476'), lng: Number('-0.395321') },
            { lat: Number('39.476455'), lng: Number('-0.393164') },
            { lat: Number('39.477282'), lng: Number('-0.391149') },
            { lat: Number('39.477911'), lng: Number('-0.389085') },
            { lat: Number('39.478193'), lng: Number('-0.388239') },
         ],
        fin: { lat: Number('39.478455'), lng: Number('-0.387677')},
        imagen: "imagenes/imagenes-aventuras/museo_de_historia.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_9_octubre.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente_amarillo.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_campanar.jpg",
        imagen5: "imagenes/imagenes-aventuras/estadio_atletismo.jpg",
        imagen6: "imagenes/imagenes-aventuras/puente_glorias_valencianas.jpg",
        imagen7: "imagenes/imagenes-aventuras/petxina_en_el_rio.jpg",
        video: "",
    },
    // Parada 113: Pechina en el Turia (Reto 16) (Párrafos: 634, 635)
    {
        id: "Av34km-P-113",
        tipo: "parada",
        parada: 113, // mapa número 18
        mapa_numero: 18,
        nombre: "Pechina en el Turia",
        coordenadas: { lat: Number('39.478455'), lng: Number('-0.387677') },
        imagen: "imagenes/imagenes-aventuras/petxina_en_el_rio.jpg",
    },
    // Tramo 76: Pechina en el Turia → Puente de San José (Párrafos: 636, 28-B)
    {
        id: "Av34km-TR-76",
        tipo: "tramo",
        tramo: 76, // De mapa número 18 a mapa número 19
        mapa_numero: "18→19",
        nombre: "Pechina en el Turia → Puente de San José",
        inicio: { lat: Number('39.478455'), lng: Number('-0.387677') },
         waypoints: [
            { lat: Number('39.478656'), lng: Number('-0.387023') },
            { lat: Number('39.478830'), lng: Number('-0.386554') },
            { lat: Number('39.479107'), lng: Number('-0.385908') },
            { lat: Number('39.479310'), lng: Number('-0.385449') },
            { lat: Number('39.479572'), lng: Number('-0.384894') },
            { lat: Number('39.479838'), lng: Number('-0.384380') },
            { lat: Number('39.480193'), lng: Number('-0.383746') },
            { lat: Number('39.480415'), lng: Number('-0.383351') },
            { lat: Number('39.480746'), lng: Number('-0.382726') },
            { lat: Number('39.481005'), lng: Number('-0.382011') },
            { lat: Number('39.481262'), lng: Number('-0.381323') },
            { lat: Number('39.481224'), lng: Number('-0.381227') },
            { lat: Number('39.481391'), lng: Number('-0.380749') },
            { lat: Number('39.481351'), lng: Number('-0.380740') },
            { lat: Number('39.481457'), lng: Number('-0.380332') },
            { lat: Number('39.481529'), lng: Number('-0.380252') },
            { lat: Number('39.481718'), lng: Number('-0.380281') },
         ],
        fin: {lat: Number('39.481833'), lng: Number('-0.380310')},
        imagen: "imagenes/imagenes-aventuras/petxina_en_el_rio.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_artes_down.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente_san_jose_subida.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_san_jose_subida_2.jpg",
        imagen5: "imagenes/imagenes-aventuras/puente_san_jose.jpg",
        imagen6: "imagenes/imagenes-aventuras/puente_san_jose_close.jpg",
        video: "",
    },
    // Parada 114: Puente de San José (Párrafos: 637, 638, 472)
    {
        id: "Av34km-P-114",
        tipo: "parada",
        parada: 114, // mapa número 19
        mapa_numero: 19,
        nombre: "Puente de San José",
        coordenadas: { lat: Number('39.481833'), lng: Number('-0.380310') },
        imagen: "imagenes/imagenes-aventuras/puente_san_jose_close.jpg",
    },
    // Tramo 77: Puente de San José → Torres de Serranos (Párrafos: 639)
    {
        id: "Av34km-TR-77",
        tipo: "tramo",
        tramo: 77, // De mapa número 19 a mapa número 1
        mapa_numero: "19→1",
        nombre: "Puente de San José → Torres de Serranos",
        inicio: { lat: Number('39.481833'), lng: Number('-0.380310') },
         waypoints: [
            { lat: Number('39.481700'), lng: Number('-0.380243') },
            { lat: Number('39.481522'), lng: Number('-0.380226') },
            { lat: Number('39.481451'), lng: Number('-0.379918') },
            { lat: Number('39.481368'), lng: Number('-0.379606') },
            { lat: Number('39.481290'), lng: Number('-0.379375') },
            { lat: Number('39.481268'), lng: Number('-0.379108') },
            { lat: Number('39.481158'), lng: Number('-0.378914') },
            { lat: Number('39.481056'), lng: Number('-0.378862') },
            { lat: Number('39.480855'), lng: Number('-0.378313') },
            { lat: Number('39.480595'), lng: Number('-0.377843') },
            { lat: Number('39.480194'), lng: Number('-0.377140') },
            { lat: Number('39.479709'), lng: Number('-0.376291') },
         ],
        fin: {lat: Number('39.479635'), lng: Number('-0.375845') },
        imagen: "imagenes/imagenes-aventuras/puente_san_jose.jpg",
        imagen2: "imagenes/imagenes-aventuras/ivam_serranos_2.jpg",
        imagen3: "imagenes/imagenes-aventuras/ivam_serranos_3.jpg",
        imagen4: "imagenes/imagenes-aventuras/ivam_serranos_4.jpg",
        imagen5: "imagenes/imagenes-aventuras/ivam_serranos_5.jpg",
        imagen6: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        video: "",
    },
    // Parada 115: Torres de Serranos Front (Reto 17) (Párrafos: 471, 687, 145, 126, 233 )
    {
        id: "Av34km-P-115",
        tipo: "parada",
        parada: 115, // mapa número 1
        mapa_numero: 1,
        nombre: "Torres de Serranos",
        coordenadas: { lat: Number('39.479635'), lng: Number('-0.375845') },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
    },
    // Tramo 78: Torres de Serranos Front → Centro Puente de Serranos 1 (Párrafos: 688)
    {
        id: "Av34km-TR-78",
        tipo: "tramo",
        tramo: 78, // De mapa número 1 a sin número de mapa (Centro Puente de Serranos)
        mapa_numero: "1→-",
        nombre: "Torres de Serranos → Centro Puente de Serranos",
        inicio: { lat: Number('39.479635'), lng: Number('-0.375845') },
        waypoints:
        [
            { lat: Number('39.480260'), lng: Number('-0.375530') },
        ],
        fin: { lat: Number('39.480640'), lng: Number('-0.375340') },
        imagen: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_serranos_2.jpg",
        imagen3:"imagenes/imagenes-aventuras/puente_serranos.jpg",
        imagen4: "imagenes/imagenes-aventuras/puente_serranos_3.jpg",
        video: "",
    },
    // Parada 116: Centro Puente Serranos (Párrafos: 234, 34-B, 235)
    {
        id: "Av34km-P-116",
        tipo: "parada",
        parada: 116, // Sin número de mapa
        mapa_numero: null,
        nombre: "Centro Puente Serranos",
        coordenadas: { lat: Number('39.480640'), lng: Number('-0.375340') },
        imagen: "imagenes/imagenes-aventuras/museo_bellas_artes.jpg",
    },
    // Tramo 79: Centro Puente de Serranos → Ruinas del Jardín del Turia (Párrafos: 644, 33-C)
    {
        id: "Av34km-TR-79",
        tipo: "tramo",
        tramo: 79, // De sin número de mapa (Centro Puente de Serranos) a mapa número 24
        mapa_numero: "-→24",
        nombre: "Centro Puente de Serranos → Ruinas del Jardín del Turia",
        inicio: { lat: Number('39.480640'), lng: Number('-0.375340') },
        waypoints:
        [
            { lat: Number('39.480020'), lng: Number('-0.375640') },
            { lat: Number('39.479570'), lng: Number('-0.375880') },
            { lat: Number('39.479480'), lng: Number('-0.375800') },
            { lat: Number('39.479270'), lng: Number('-0.375330') },
            { lat: Number('39.479240'), lng: Number('-0.375220') },
            { lat: Number('39.479170'), lng: Number('-0.375060') },
            { lat: Number('39.479110'), lng: Number('-0.374920') },
            { lat: Number('39.479060'), lng: Number('-0.374840') },
            { lat: Number('39.479040'), lng: Number('-0.374780') },
            { lat: Number('39.478980'), lng: Number('-0.374680') },
            { lat: Number('39.478930'), lng: Number('-0.374560') },
            { lat: Number('39.478870'), lng: Number('-0.374430') },
            { lat: Number('39.478640'), lng: Number('-0.373910') },
            { lat: Number('39.478490'), lng: Number('-0.373540') },
            { lat: Number('39.478350'), lng: Number('-0.373220') },
            { lat: Number('39.478150'), lng: Number('-0.372920') },
            { lat: Number('39.478210'), lng: Number('-0.372790') },
            { lat: Number('39.477920'), lng: Number('-0.372320') },
            { lat: Number('39.477720'), lng: Number('-0.371990') },
            { lat: Number('39.477720'), lng: Number('-0.371970') },
            { lat: Number('39.477730'), lng: Number('-0.371950') },
            { lat: Number('39.477790'), lng: Number('-0.371910') },
            { lat: Number('39.477890'), lng: Number('-0.371830') },
            { lat: Number('39.477960'), lng: Number('-0.371780') },
            { lat: Number('39.477870'), lng: Number('-0.371610') },
            { lat: Number('39.477790'), lng: Number('-0.371490') },
        ],
        fin: { lat: Number('39.477730'), lng: Number('-0.371390') },
        imagen: "imagenes/imagenes-aventuras/puente_serranos_3.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_serranos.jpg",
        imagen3: "imagenes/imagenes-aventuras/torres_de_serranos_front.jpg",
        imagen4: "imagenes/imagenes-aventuras/serranos_pont_fusta.jpg",
        imagen5: "imagenes/imagenes-aventuras/pont_fusta.jpg",
        imagen6: "imagenes/imagenes-aventuras/museo_bellas_artes.jpg",
        imagen7: "imagenes/imagenes-aventuras/bajada_rio_ruinas.jpg",
        imagen8: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
        video: "",
    },
    // Parada 117: Ruinas del Jardín del Turia (Reto18puzzle PZ-13) (Párrafos: 705, 703, 645, 646)
    {
        id: "Av34km-P-117",
        tipo: "parada",
        parada: 117, // mapa número 24
        mapa_numero: 24,
        nombre: "Ruinas del Jardín del Turia",
        coordenadas: { lat: Number('39.477730'), lng: Number('-0.371390') },
        imagen: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
    },
    // Tramo 80: Ruinas del Jardín del Turia → Jardines del Real (Viveros) (Párrafos: 647, 36)
    {
        id: "Av34km-TR-80",
        tipo: "tramo",
        tramo: 80, // De mapa número 24 → mapa número 25
        mapa_numero: "24→25",
        nombre: "Ruinas del Jardín del Turia → Jardines del Real (Viveros)",
        inicio: { lat: Number('39.477730'), lng: Number('-0.371390') },
        waypoints:
        [
            { lat: Number('39.477960'), lng: Number('-0.371780') },
            { lat: Number('39.477840'), lng: Number('-0.371870') },
            { lat: Number('39.477740'), lng: Number('-0.371940') },
            { lat: Number('39.477700'), lng: Number('-0.371860') },
            { lat: Number('39.477570'), lng: Number('-0.371670') },
            { lat: Number('39.477460'), lng: Number('-0.371500') },
            { lat: Number('39.477300'), lng: Number('-0.371230') },
            { lat: Number('39.476920'), lng: Number('-0.370670') },
            { lat: Number('39.476330'), lng: Number('-0.369870') },
            { lat: Number('39.476030'), lng: Number('-0.369470') },
            { lat: Number('39.476310'), lng: Number('-0.369180') },
            { lat: Number('39.476570'), lng: Number('-0.368880') },
            { lat: Number('39.476800'), lng: Number('-0.368630') },
            { lat: Number('39.476980'), lng: Number('-0.368440') },
            { lat: Number('39.477050'), lng: Number('-0.368550') },
            { lat: Number('39.477120'), lng: Number('-0.368680') },
            { lat: Number('39.477140'), lng: Number('-0.368650') },
            { lat: Number('39.477090'), lng: Number('-0.368550') },
            { lat: Number('39.477050'), lng: Number('-0.368460') },
            { lat: Number('39.477080'), lng: Number('-0.368440') },
            { lat: Number('39.477110'), lng: Number('-0.368470') },
            { lat: Number('39.477180'), lng: Number('-0.368410') },
            { lat: Number('39.477270'), lng: Number('-0.368330') },
            { lat: Number('39.477300'), lng: Number('-0.368330') },
            { lat: Number('39.477450'), lng: Number('-0.368400') },
        ],
        fin: { lat: Number('39.477480'), lng: Number('-0.368360') },
        imagen: "imagenes/imagenes-aventuras/ruinas_turia.jpg",
        imagen2: "imagenes/imagenes-aventuras/puente_real.jpg",
        imagen3: "imagenes/imagenes-aventuras/puente_real_down.jpg",
        imagen4: "imagenes/imagenes-aventuras/viveros-tunel_turia.jpg",
        imagen5: "imagenes/imagenes-aventuras/viveros_tunel_2.jpg",
        imagen6: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        video: "",
    },
    // Parada 118: Jardines del Real (Viveros) (Párrafos: 648)
    {
        id: "Av34km-P-118",
        tipo: "parada",
        parada: 118, // mapa número 25
        mapa_numero: 25,
        nombre: "Jardines del Real (Viveros)",
        coordenadas: { lat: Number('39.477480'), lng: Number('-0.368360') },
        imagen: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        imagen2: "imagenes/imagenes-aventuras/mapa_rosaleda_viveros.png",
        imagen3: "imagenes/imagenes-aventuras/viveros_plano.png",
    },
    // Tramo 81: Jardines del Real (Viveros) → Paseo de las Palmeras (Párrafos:649 )
    {
        id: "Av34km-TR-81",
        tipo: "tramo",
        tramo: 81, // De mapa número 25 a mapa número v1
        mapa_numero: "25→v1",
        nombre: "Jardines del Real (Viveros) → Paseo de las Palmeras",
        inicio: { lat: Number('39.477480'), lng: Number('-0.368360') },
         waypoints: [
            { lat: Number('39.477930'), lng: Number('-0.368126') },
         ],
        fin: {lat: Number('39.478239'), lng: Number('-0.367925') },
        imagen: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
        imagen3: "imagenes/imagenes-aventuras/viveros_ paseo_palmeras.jpg",
        video: "",
    },
    // Parada 119: Ruinas del Palacio real de Valencia y Montículo del General Javier Elio (Párrafos: viv1, viv2)
    {
        id: "Av34km-P-119",
        tipo: "parada",
        parada: 119, // mapa número v2-v3
        mapa_numero: "v2→v3",
        nombre: "Ruinas del Palacio real de Valencia y Montículo del General Javier Elio",
        coordenadas: { lat: Number('39.478239'), lng: Number('-0.367925') },
        imagen: "imagenes/imagenes-aventuras/viveros_maqueta_palacio.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_restos_palacio.jpg",
        imagen3: "imagenes/imagenes-aventuras/viveros_monte_elio.jpg",
        imagen4: "imagenes/imagenes-aventuras/viveros_plano.png",
    },
    // Tramo 82: Ruinas del Palacio real de Valencia y Montículo del General Javier Elio → Circuito urbano de educación vial (Párrafos: viv3)
    {
        id: "Av34km-TR-82",
        tipo: "tramo",
        tramo: 82, // De mapa número v3 a mapa número v5
        mapa_numero: "v3→v5",
        nombre: "Ruinas del Palacio real de Valencia y Montículo del General Javier Elio → Circuito urbano de educación vial",
        inicio: { lat: Number('39.478239'), lng: Number('-0.367925') },
         waypoints: [
            { lat: Number('39.478744'), lng: Number('-0.367728') },
            { lat: Number('39.479185'), lng: Number('-0.367502') },
            { lat: Number('39.479598'), lng: Number('-0.367292') },
         ],
        fin: {lat: Number('39.479742'), lng: Number('-0.367276') },
        imagen: "imagenes/imagenes-aventuras/viveros_monte_elio.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_casa_jardinero.jpg",
        imagen3: "imagenes/imagenes-aventuras/viveros_libre_4.jpg",
        imagen4: "imagenes/imagenes-aventuras/viveros_libre_2.jpg",
        imagen5: "imagenes/imagenes-aventuras/viveros_ circuito_vial.jpg",
        video: "",
    },
    // Tramo 83: Circuito urbano de educación vial → Museo de Ciencias Naturales (Párrafos: viv4)
    {
        id: "Av34km-TR-83",
        tipo: "tramo",
        tramo: 83, // De mapa número v5 a mapa número v8
        mapa_numero: "v5→v8",
        nombre: "Circuito urbano de educación vial → Museo de Ciencias Naturales",
        inicio: { lat: Number('39.479742'), lng: Number('-0.367276') },
         waypoints: [
            { lat: Number('39.479742'), lng: Number('-0.367276') },
            { lat: Number('39.479497'), lng: Number('-0.367881') },
         ],
        fin: { lat: Number('39.479455'), lng: Number('-0.368610') },
        imagen: "imagenes/imagenes-aventuras/viveros_ circuito_vial.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_paseo_poetas_2.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_pajarera.jpg",
        imagen3: "imagenes/imagenes-aventuras/viveros_plano.png",
        imagen4: "imagenes/imagenes-aventuras/viveros_alqueria_canet.jpg",
        imagen5: "imagenes/imagenes-aventuras/viveros_museo_ciencias_naturales.jpg",
        video: "",
    },
    // Parada 120: Museo de Ciencias Naturales (Reto 19) (Párrafos: viv6, viv5)
    {
        id: "Av34km-P-120",
        tipo: "parada",
        parada: 120, // mapa número v8
        mapa_numero: "v8",
        nombre: "Museo de Ciencias Naturales",
        coordenadas: { lat: Number('39.479455'), lng: Number('-0.368610') },
        imagen: "imagenes/imagenes-aventuras/viveros_museo_ciencias_naturales.jpg",
    },
    // Tramo 84: Museo de Ciencias Naturales → Jardín de la Rosaleda (Párrafos: viv7)
    {
        id: "Av34km-TR-84",
        tipo: "tramo",
        tramo: 84, // De mapa número v8 a mapa número v10
        mapa_numero: "v8→v10",
        nombre: "Museo de Ciencias Naturales → Jardín de la Rosaleda",
        inicio: { lat: Number('39.479455'), lng: Number('-0.368610') },
         waypoints: [
            { lat: Number('39.480270'), lng: Number('-0.368565') },
            { lat: Number('39.480353'), lng: Number('-0.368423') },
            { lat: Number('39.480822'), lng: Number('-0.368408') },
         ],
        fin: { lat: Number('39.480912'), lng: Number('-0.368572') },
        imagen: "imagenes/imagenes-aventuras/viveros_museo_ciencias_naturales.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
        imagen3: "imagenes/imagenes-aventuras/viveros_jardines_versalles.jpg",
        imagen4: "imagenes/imagenes-aventuras/mapa_rosaleda_viveros.png",
        imagen5: "imagenes/imagenes-aventuras/viveros_rosaleda.jpg",
        video: "",
    },
    // Parada 121: Jardín de la Rosaleda (Párrafos: viv9, viv10)
    {
        id: "Av34km-P-121",
        tipo: "parada",
        parada: 121, // mapa número v10
        mapa_numero: "v10",
        nombre: "Jardín de la Rosaleda",
        coordenadas: { lat: Number('39.480912'), lng: Number('-0.368572') },
        imagen: "imagenes/imagenes-aventuras/viveros_rosaleda.jpg",
        imagen2: "imagenes/imagenes-aventuras/mapa_rosaleda_viveros.png",
        imagen3: "imagenes/imagenes-aventuras/viveros_libre_6.jpg",
        imagen4: "imagenes/imagenes-aventuras/viveros_libre_7.jpg",
        imagen5: "imagenes/imagenes-aventuras/viveros_libre_8.jpg",
    },
    // Parada 122: Jardines del Real (Viveros) 2 (Párrafos: viv11)
    {
        id: "Av34km-P-122",
        tipo: "parada",
        parada: 122, // mapa número v7-v8
        mapa_numero: "v7-v8",
        nombre: "Jardines del Real (Viveros) 2",
        coordenadas: { lat: Number('39.479455'), lng: Number('-0.368610') },
        imagen: "imagenes/imagenes-aventuras/viveros_museo_ciencias_naturales.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
    },
    // Tramo 85:Alquería de Canet y Museo de Ciencias Naturales → Estanque de los patos (Párrafos: viv11-B)
    {
        id: "Av34km-TR-85",
        tipo: "tramo",
        tramo: 85, // De mapa número v7-v8 a mapa número v11
        mapa_numero: "v7-v8→v11",
        nombre: "Alquería de Canet y Museo de Ciencias Naturales → Estanque de los patos",
        inicio: { lat: Number('39.479455'), lng: Number('-0.368610') },
         waypoints: [
            { lat: Number('39.478955'), lng: Number('-0.368506') },
            { lat: Number('39.478695'), lng: Number('-0.368994') },
            { lat: Number('39.478746'), lng: Number('-0.369329') },
         ],
        fin: { lat: Number('39.478899'), lng: Number('-0.369452') },
        imagen: "imagenes/imagenes-aventuras/viveros_museo_ciencias_naturales.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
        imagen3: "imagenes/imagenes-aventuras/viveros_patos.jpg",
        video: "",
    },
    // Parada 123: Estanque de los patos (Reto 20) (Párrafos: viv11-C)
    {
        id: "Av34km-P-123",
        tipo: "parada",
        parada: 123, // mapa número v11
        mapa_numero: "v11",
        nombre: "Estanque de los patos",
        coordenadas: { lat: Number('39.478899'), lng: Number('-0.369452') },
        imagen: "imagenes/imagenes-aventuras/viveros_patos.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
    },
    // Tramo 86: Estanque de los patos → Portón del Convento de San Julián (Párrafos: viv13)
    {
        id: "Av34km-TR-86",
        tipo: "tramo",
        tramo: 86, // De mapa número v11 a mapa número v12
        mapa_numero: "v11→v12",
        nombre: "Estanque de los patos → Portón del Convento de San Julián",
        inicio: { lat: Number('39.478899'), lng: Number('-0.369452') },
         waypoints: [
            { lat: Number('39.478727'), lng: Number('-0.369513') },
            { lat: Number('39.478692'), lng: Number('-0.369677') },
            { lat: Number('39.478647'), lng: Number('-0.369797') },
         ],
        fin: { lat: Number('39.478579'), lng: Number('-0.369801') },
        imagen: "imagenes/imagenes-aventuras/viveros_patos.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
        imagen3: "imagenes/imagenes-aventuras/viveros_san_julian.jpg",
        video: "",
    },
    // Parada 124: Portón del Convento de San Julián (Párrafos: viv14, viv15)
    {
        id: "Av34km-P-124",
        tipo: "parada",
        parada: 124, // mapa número v12
        mapa_numero: "v12",
        nombre: "Portón del Convento de San Julián",
        coordenadas: { lat: Number('39.478579'), lng: Number('-0.369801') },
        imagen: "imagenes/imagenes-aventuras/viveros_san_julian.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
        imagen3: "imagenes/imagenes-aventuras/viveros_libre_10.jpg",
        imagen4: "imagenes/imagenes-aventuras/viveros_paseo_poetas.jpg",
    },
    // Tramo 87: Entrada Jardínes del Real (Viveros) → Puente del Real (Párrafos: 650, 37)
    {
        id: "Av34km-TR-87",
        tipo: "tramo",
        tramo: 87, // De mapa número 25 a mapa número 26
        mapa_numero: "25→26",
        nombre: "Entrada Jardínes del Real (Viveros) → Puente del Real",
        inicio: { lat: Number('39.477480'), lng: Number('-0.368360') },
         waypoints: [
            { lat: Number('39.477386'), lng: Number('-0.368269') },
            { lat: Number('39.477270'), lng: Number('-0.368000') },
            { lat: Number('39.477371'), lng: Number('-0.367701') },
            { lat: Number('39.477254'), lng: Number('-0.367581') },
            { lat: Number('39.477201'), lng: Number('-0.367353') },
         ],
        fin: { lat: Number('39.476941'), lng: Number('-0.367427') },
        imagen: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
        imagen3: "imagenes/imagenes-aventuras/puente_real_up.jpg",
        video: "",
    },
    // Parada 125: Puente del Real (Párrafos: )
    {
        id: "Av34km-P-125",
        tipo: "parada",
        parada: 125, // mapa número v13
        mapa_numero: 26,
        nombre: "Puente del Real",
        coordenadas: { lat: Number('39.476941'), lng: Number('-0.367427') },
        imagen: "imagenes/imagenes-aventuras/puente_real_up.jpg",
    },
    // Tramo 88: Puente del Real → Jardín de la Glorieta(Párrafos: )
    {
        id: "Av34km-TR-88",
        tipo: "tramo",
        tramo: 88, // De mapa número 26 a mapa número
        mapa_numero: "26→",
        nombre: "Puente del Real → Jardín de la Glorieta",
        inicio: { lat: Number('39.476941'), lng: Number('-0.367427') },
         waypoints: [
            { lat: Number('39.477036'), lng: Number('-0.367872') },
            { lat: Number('39.477034'), lng: Number('-0.368007') },
            { lat: Number('39.477009'), lng: Number('-0.368105') },
            { lat: Number('39.476963'), lng: Number('-0.368182') },
            { lat: Number('39.476538'), lng: Number('-0.368628') },
            { lat: Number('39.475929'), lng: Number('-0.369258') },
            { lat: Number('39.475799'), lng: Number('-0.369418') },
            { lat: Number('39.475862'), lng: Number('-0.369719') },
            { lat: Number('39.475644'), lng: Number('-0.369834') },
            { lat: Number('39.475566'), lng: Number('-0.369923') },
            { lat: Number('39.475231'), lng: Number('-0.369855') },
            { lat: Number('39.474811'), lng: Number('-0.369898') },
            { lat: Number('39.474456'), lng: Number('-0.369892') },
            { lat: Number('39.473749'), lng: Number('-0.369894') },
            { lat: Number('39.473698'), lng: Number('-0.369690') },
            { lat: Number('39.473509'), lng: Number('-0.369616') },
         ],
        fin: { lat: Number('39.473359'), lng: Number('-0.369589') },
        imagen: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
        imagen3: "imagenes/imagenes-aventuras/puente_real_up.jpg",
        video: "",
    },
    // Parada 126: Jardín de la Glorieta (Párrafos: )
    {
        id: "Av34km-P-126",
        tipo: "parada",
        parada: 126, // mapa número v13
        mapa_numero: 26,
        nombre: "Jardín de la Glorieta",
        coordenadas: { lat: Number('39.473359'), lng: Number('-0.369589') },
        imagen: "imagenes/imagenes-aventuras/puente_real_up.jpg",
    },
    // Tramo 89: Jardin de la Glorieta 1 (Plaza de Tetuán) → Jardín de la Glorieta 2 (Palacio de Justicia) (Párrafos: 650, 37)
    {
        id: "Av34km-TR-89",
        tipo: "tramo",
        tramo: 89, // De mapa número 25 a mapa número 26
        mapa_numero: "25→26",
        nombre: "Entrada Jardínes del Real (Viveros) → Puente del Real",
        inicio: { lat: Number('39.473359'), lng: Number('-0.369589') },
         waypoints: [
            { lat: Number('39.473158'), lng: Number('-0.369459') },
            { lat: Number('39.472476'), lng: Number('-0.368899') },
            { lat: Number('39.472366'), lng: Number('-0.368775') },
            { lat: Number('39.472226'), lng: Number('-0.368892') },
         ],
        fin: { lat: Number('39.472081'), lng: Number('-0.368912') },
        imagen: "imagenes/imagenes-aventuras/viveros_entrada.jpg",
        imagen2: "imagenes/imagenes-aventuras/viveros_plano.png",
        imagen3: "imagenes/imagenes-aventuras/puente_real_up.jpg",
        video: "",
    },
    // Parada 127: Palacio de Justicia (Párrafos: 659)
    {
        id: "Av34km-P-127",
        tipo: "parada",
        parada: 127, // mapa número 26
        mapa_numero: "26",
        nombre: "Palacio de Justicia",
        coordenadas:  { lat: Number('39.472081'), lng: Number('-0.368912') },
        imagen: "imagenes/imagenes-aventuras/palacio_justicia.jpg",
        imagen2: "imagenes/imagenes-aventuras/palacio_justicia_3.jpg",
    },
    // Tramo 90: Palacio de Justicia → Fundación Bancaja 1 (Párrafos: 660, 40-B)
    {
        id: "Av34km-TR-90",
        tipo: "tramo",
        tramo: 90, // De mapa número 27 a mapa número 28
        mapa_numero: "27→28",
        nombre: "Palacio de Justicia → Fundación Bancaja 1",
        inicio: { lat: Number('39.472081'), lng: Number('-0.368912') },
        waypoints:
        [
            { lat: Number('39.471863'), lng: Number('-0.368957') },
            { lat: Number('39.471972'), lng: Number('-0.369314') },
            { lat: Number('39.472055'), lng: Number('-0.369551') },
            { lat: Number('39.472202'), lng: Number('-0.370107') },
            { lat: Number('39.472659'), lng: Number('-0.370217') },
            { lat: Number('39.472840'), lng: Number('-0.370091') },
        ],
        fin: { lat: Number('39.473087'), lng: Number('-0.370027') },
        imagen: "imagenes/imagenes-aventuras/palacio_justicia.jpg",
        imagen2: "imagenes/imagenes-aventuras/edificio_bancaja.jpg",
        video: "",
    },
    // Parada 128: Fundación Bancaja 1 (Reto 17) (Párrafos: 661, 662)
    {
        id: "Av34km-P-128",
        tipo: "parada",
        parada: 128, // mapa número 28
        mapa_numero: "28",
        nombre: "Fundación Bancaja 1",
        coordenadas:  { lat: Number('39.473087'), lng: Number('-0.370027') },
        imagen: "imagenes/imagenes-aventuras/edificio_bancaja.jpg",
    },
    // Tramo 91: Fundación Bancaja 1 → Fundación Bancaja 2 (Párrafos: 663)
    {
        id: "Av34km-TR-91",
        tipo: "tramo",
        tramo: 91, // De mapa número 28 a mapa número 28
        mapa_numero: "28→28",
        nombre: "Fundación Bancaja 1 → Fundación Bancaja 2",
        inicio: { lat: Number('39.473087'), lng: Number('-0.370027') },
        waypoints:
        [
            { lat: Number('39.473759'), lng: Number('-0.369889') },
        ],
        fin: { lat: Number('39.473830'), lng: Number('-0.370067') },
        imagen: "imagenes/imagenes-aventuras/edificio_bancaja.jpg",
        imagen2: "imagenes/imagenes-aventuras/edificio_bancaja_2.jpg",
        video: "",
    },
    // Parada 129: Fundación Bancaja 2 (Párrafos: 664)
    {
        id: "Av34km-P-129",
        tipo: "parada",
        parada: 129, // mapa número 28
        mapa_numero: "28",
        nombre: "Fundación Bancaja 2",
        coordenadas:  { lat: Number('39.473830'), lng: Number('-0.370067') },
        imagen: "imagenes/imagenes-aventuras/edificio_bancaja_2.jpg",
    },
    // Tramo 92: Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente (Párrafos: 665, 41)
    {
        id: "Av34km-TR-92",
        tipo: "tramo",
        tramo: 92, // De mapa número 28 a mapa número 29
        mapa_numero: "28→29",
        nombre: "Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente",
        inicio: { lat: Number('39.473830'), lng: Number('-0.370067') },
        waypoints:
        [
            { lat: Number('39.473865'), lng: Number('-0.370408') },
            { lat: Number('39.473961'), lng: Number('-0.370880') },
            { lat: Number('39.473946'), lng: Number('-0.371786') },
            { lat: Number('39.473948'), lng: Number('-0.372367') },
        ],
        fin: { lat: Number('39.473836'), lng: Number('-0.372444')},
        imagen: "imagenes/imagenes-aventuras/edificio_bancaja_2.jpg",
        imagen2: "imagenes/imagenes-aventuras/iglesia_san_felipe_neri.jpg",
        video: "",
    },
    // Parada 130: Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente (Reto 18) (Párrafos: 667-B, 668)
    {
        id: "Av34km-P-130",
        tipo: "parada",
        parada: 130, // mapa número 29
        mapa_numero: "29",
        nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente",
        coordenadas:  { lat: Number('39.473836'), lng: Number('-0.372444') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_felipe_neri.jpg",
    },
    // Parada 131: Iglesia Santo Tomás Apostol y San Felipe Neri (Párrafos: 669)
    {
        id: "Av34km-P-131",
        tipo: "parada",
        parada: 131, // mapa número 29
        mapa_numero: "29",
        nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri",
        coordenadas:  { lat: Number('39.473833'), lng: Number('-0.372479') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_felipe_neri.jpg",
    },
    // Tramo 93: Iglesia Santo Tomás Apostol y San Felipe Neri → Iglesia San Juan del Hospital (Párrafos: 670-B)
    {
        id: "Av34km-TR-93",
        tipo: "tramo",
        tramo: 93, // De mapa número 29 a mapa número 30
        mapa_numero: "29→30",
        nombre: "Iglesia San Vicente Ferrer y San Felipe Neri → Iglesia San Juan del Hospital",
        inicio: { lat: Number('39.473833'), lng: Number('-0.372479') },
        waypoints:
        [
            { lat: Number('39.473998'), lng: Number('-0.372704') }
        ],
        fin: { lat: Number('39.474454'), lng: Number('-0.372731') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_felipe_neri.jpg",
        imagen2: "imagenes/imagenes-aventuras/iglesia_san_juan_del_hospital.jpg",
        video: "",
    },
    // Parada 132: Iglesia San Juan del Hospital (Párrafos: 671, 522, 672)
    {
        id: "Av34km-P-132",
        tipo: "parada",
        parada: 132, // mapa número 30
        mapa_numero: "30",
        nombre: "Iglesia San Juan del Hospital",
        coordenadas:  { lat: Number('39.474454'), lng: Number('-0.372731') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_hospital.jpg",
    },
    // Tramo 94: Iglesia San Juan del Hospital → Palacio Arzobispal (Párrafos: 453, 43-B)
    {
        id: "Av34km-TR-94",
        tipo: "tramo",
        tramo: 94, // De mapa número 30 a mapa número 31
        mapa_numero: "30→31",
        nombre: "Iglesia San Juan del Hospital → Palacio Arzobispal",
        inicio: { lat: Number('39.474454'), lng: Number('-0.372731') },
        waypoints:
        [
            { lat: Number('39.474858'), lng: Number('-0.372811') },
            { lat: Number('39.475766'), lng: Number('-0.372641') },
            { lat: Number('39.475853'), lng: Number('-0.373087') },
            { lat: Number('39.475527'), lng: Number('-0.373459') },
            { lat: Number('39.475513'), lng: Number('-0.373593') },
            { lat: Number('39.475377'), lng: Number('-0.373665') },
        ],
        fin: { lat: Number('39.475577'), lng: Number('-0.374196')},
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_hospital.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_napones_y_sicilia.jpg",
        imagen3: "imagenes/imagenes-aventuras/plaza_napones_y_sicilia_2.jpg",
        imagen4: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg",
        video: "",
    },
    // Parada 133: Palacio Arzobispal (Párrafos: 673)
    {
        id: "Av34km-P-133",
        tipo: "parada",
        parada: 133, // mapa número 31
        mapa_numero: "31",
        nombre: "Palacio Arzobispal",
        coordenadas:  { lat: Number('39.475577'), lng: Number('-0.374196') },
        imagen: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg",
    },
    // Tramo 95: Palacio Arzobispal → Museo de la Ciudad (Párrafos: )
    {
        id: "Av34km-TR-95",
        tipo: "tramo",
        tramo: 95, // De mapa número  a mapa número
        mapa_numero: "→",
        nombre: "Palacio Arzobispal → Museo de la Ciudad",
        inicio: { lat: Number('39.475577'), lng: Number('-0.374196') },
        waypoints:
        [
            { lat: Number('39.475674'), lng: Number('-0.374124') },
            { lat: Number('39.475853'), lng: Number('-0.374087') },
        ],
        fin: { lat: Number('39.475889'), lng: Number('-0.374065') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_hospital.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_napones_y_sicilia.jpg",
        imagen3: "imagenes/imagenes-aventuras/plaza_napones_y_sicilia_2.jpg",
        imagen4: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg",
        video: "",
    },
    // Parada 134: Museo de la Ciudad (Párrafos: )
    {
        id: "Av34km-P-134",
        tipo: "parada",
        parada: 134, // mapa número 31
        mapa_numero: "31",
        nombre: "Museo de la Ciudad",
        coordenadas:  { lat: Number('39.475889'), lng: Number('-0.374065') },
        imagen: "imagenes/imagenes-aventuras/museo_de_la_ciudad.jpg",
    },
    // Parada 135: Cripta de San Vicente Mártir (Párrafos: )
    {
        id: "Av34km-P-135",
        tipo: "parada",
        parada: 135, // mapa número 31
        mapa_numero: "31",
        nombre: "Museo de la Ciudad",
        coordenadas:  { lat: Number('39.475939'), lng: Number('-0.374076') },
        imagen: "imagenes/imagenes-aventuras/museo_de_la_ciudad.jpg",
    },
    // Tramo 96: Cripta de San Vicente Mártir → Amudín (Párrafos: )
    {
        id: "Av34km-TR-96",
        tipo: "tramo",
        tramo: 96, // De mapa número  a mapa número
        mapa_numero: "→",
        nombre: "Cripta de San Vicente Mártir → Amudín",
        inicio: { lat: Number('39.475939'), lng: Number('-0.374076') },
        waypoints:
        [
            { lat: Number('39.476179'), lng: Number('-0.373995') },
        ],
        fin: { lat: Number('39.476429'), lng: Number('-0.373911') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_hospital.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_napones_y_sicilia.jpg",
        imagen3: "imagenes/imagenes-aventuras/plaza_napones_y_sicilia_2.jpg",
        imagen4: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg",
        video: "",
    },
    // Parada 136: Almudín (Párrafos: )
    {
        id: "Av34km-P-136",
        tipo: "parada",
        parada: 136, // mapa número 31
        mapa_numero: "31",
        nombre: "Museo de la Ciudad",
        coordenadas:  { lat: Number('39.475939'), lng: Number('-0.374076') },
        imagen: "imagenes/imagenes-aventuras/museo_de_la_ciudad.jpg",
    },
     // Tramo 97: Almudín → Iglesia de San Lorenzo (Párrafos: )
    {
        id: "Av34km-TR-97",
        tipo: "tramo",
        tramo: 97, // De mapa número  a mapa número
        mapa_numero: "→",
        nombre: "Cripta de San Vicente Mártir → Amudín",
        inicio: { lat: Number('39.475939'), lng: Number('-0.374076') },
        waypoints:
        [
            { lat: Number('39.476569'), lng: Number('-0.374511') },
            { lat: Number('39.476683'), lng: Number('-0.375139') },
            { lat: Number('39.476778'), lng: Number('-0.375171') },
            { lat: Number('39.477023'), lng: Number('-0.375104') },
            { lat: Number('39.477374'), lng: Number('-0.375003') },
            { lat: Number('39.477642'), lng: Number('-0.374895') },
        ],
        fin: { lat: Number('39.477820'), lng: Number('-0.374870') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_hospital.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_napones_y_sicilia.jpg",
        imagen3: "imagenes/imagenes-aventuras/plaza_napones_y_sicilia_2.jpg",
        imagen4: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg",
        video: "",
    },
    // Parada 137: Iglesia de San Lorenzo (Reto ) (Párrafos: )
    {
        id: "Av34km-P-137",
        tipo: "parada",
        parada: 137, //  mapa número
        mapa_numero: null,
        nombre: "Iglesia de San Lorenzo",
        coordenadas: { lat: Number('39.477820'), lng: Number('-0.374870') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_lorenzo.jpg",
    },
    // Parada 138: Palacio de los Borgia  (Párrafos: )
    {
        id: "Av34km-P-138",
        tipo: "parada",
        parada: 138, //  mapa número
        mapa_numero: null,
        nombre: "Palacio de los Borgia",
        coordenadas: { lat: Number('39.477840'), lng: Number('-0.374850') },
        imagen: "imagenes/imagenes-aventuras/palacio_de_los_borgia.jpg",
    },
    // Tramo 98: Palacio de los Borgia → Torres de Serranos (Párrafos: )
    {
        id: "Av34km-TR-98",
        tipo: "tramo",
        tramo: 98, // De mapa número  a mapa número
        mapa_numero: "→",
        nombre: "Palacio de los Borgia → Torres de Serranos",
        inicio: { lat: Number('39.477840'), lng: Number('-0.374850') },
        waypoints:
        [
            { lat: Number('39.478375'), lng: Number('-0.374782') },
            { lat: Number('39.478890'), lng: Number('-0.374723') },
            { lat: Number('39.478951'), lng: Number('-0.375353') },
            { lat: Number('39.478952'), lng: Number('-0.376015') },
            { lat: Number('39.478877'), lng: Number('-0.376177') },
        ],
        fin: { lat: Number('39.478590'), lng: Number('-0.376330') },
        imagen: "imagenes/imagenes-aventuras/iglesia_san_juan_del_hospital.jpg",
        imagen2: "imagenes/imagenes-aventuras/plaza_napones_y_sicilia.jpg",
        imagen3: "imagenes/imagenes-aventuras/plaza_napones_y_sicilia_2.jpg",
        imagen4: "imagenes/imagenes-aventuras/palacio_arzobispal.jpg",
        video: "",
    },
    // Parada 139 - FINAL: Torres de Serranos Final (Reto28Puzzle PZ-05) (Párrafos: 475, 503, 507, 526)
    {
        id: "Av34km-P-139",
        tipo: "parada",
        parada: 139, // mapa número 1
        mapa_numero: 1,
        nombre: "Torres de Serranos Final",
        coordenadas: { lat: Number('39.478590'), lng: Number('-0.376330') },
        imagen: "imagenes/imagenes-aventuras/00_ torres_de serranos_back.jpg"
    },
    ]
    }
  },
};
