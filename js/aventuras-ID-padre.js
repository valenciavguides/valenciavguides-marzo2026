/**
 * aventuras-ID-padre.js
 * Módulo centralizado para el array de elementosIDpadre del padre
 * Estructura: DATOS_PADRE[aventura][idioma].elementosIDpadre = array de elementosIDpadre
 */

export const DATOS_PADRE = {
  Aventura1: {
    es: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
         {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av1-es" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-es", audio_id: "audio-intro-es", reto_id: "R2-Av1-es" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av1-P0-es", audio_id: "audio-Av1-P0-es", reto_id: "R3-Av1-es" },
        // Tramo 1: Torres de Serranos → Plaza de la crida (Puente de Serranos)
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Plaza de la crida (Puente de Serranos)", tramo_id: "TR-1", numero_mapa: "1→1", texto_id: "txt-Av1-TR1-es", audio_id: "audio-Av1-TR1-es" },
        // Parada 1: Plaza de la crída (Puente de Serranos) (Reto 4)
        { padreid: "padre-P1", tipo: "parada", nombre: "Plaza de la crída (Puente de Serranos)", parada_id: "P-1", numero_mapa: 1, texto_id: "txt-Av1-P1-es", audio_id: "audio-Av1-P1-es", reto_id: "R4-Av1-es" },
        // Tramo 2: Plaza de la crída → Calle Muro de Santa Ana
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Plaza de la crída → Calle Muro de Santa Ana", tramo_id: "TR-2", numero_mapa: "1→-", texto_id: "txt-Av1-TR2-es", audio_id: "audio-Av1-TR2-es" },
        // Parada 2: Calle Muro de Santa Ana (Reto 5)
        { padreid: "padre-P2", tipo: "parada", nombre: "Calle Muro de Santa Ana", parada_id: "P-2", numero_mapa: null, texto_id: "txt-Av1-P2-es", audio_id: "audio-Av1-P2-es", reto_id: "R5-Av1-es" },
        // Tramo 3: Calle Muro de Santa Ana → Palacio de los Borgia
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Calle Muro de Santa Ana → Palacio de los Borgia", tramo_id: "TR-3", numero_mapa: "-→2", texto_id: "txt-Av1-TR3-es", audio_id: "audio-Av1-TR3-es" },
        // Parada 3: Iglesia de San Lorenzo (Reto 6)
        { padreid: "padre-P3", tipo: "parada", nombre: "Iglesia de San Lorenzo", parada_id: "P-3", numero_mapa: null, texto_id: "txt-Av1-P3-es", audio_id: "audio-Av1-P3-es", reto_id: "R6-Av1-es" },
        // Tramo 4: Iglesia de San Lorenzo → Plaza de la Virgen
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Iglesia de San Lorenzo → Plaza de la Virgen", tramo_id: "TR-4", numero_mapa: "-→3", texto_id: "txt-Av1-TR4-es", audio_id: "audio-Av1-TR4-es" },
        // Parada 4: Plaza de la Virgen (Reto 7)
        { padreid: "padre-P4", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-4", numero_mapa: 3, texto_id: "txt-Av1-P4-es", audio_id: "audio-Av1-P4-es", reto_id: "R7-Av1-es" },
        // Parada 5: Plaza de la Virgen (Reto 8)
        { padreid: "padre-P5", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-5", numero_mapa: 3, texto_id: "txt-Av1-P5-es", audio_id: "audio-Av1-P5-es", reto_id: "R8-Av1-es" },
        // Parada 6: Plaza de la Virgen (Reto 9 Puzzle PZ-01)
        { padreid: "padre-P6", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-6", numero_mapa: 3, texto_id: "txt-Av1-P6-es", audio_id: "audio-Av1-P6-es", reto_id: "PZ-01" },
        // Tramo 5: Plaza de la Virgen → Plaza Décimo Junio Bruto (Plaza de la Almoína)
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Plaza de la Virgen → Plaza Décimo Junio Bruto (Plaza de la Almoína)", tramo_id: "TR-5", numero_mapa: "3→4", texto_id: "txt-Av1-TR5-es", audio_id: "audio-Av1-TR5-es" },
        // Parada 7: Panel cerámico muro Catedral (Reto 10)
        { padreid: "padre-P7", tipo: "parada", nombre: "Panel cerámico muro Catedral", parada_id: "P-7", numero_mapa: 5, texto_id: "txt-Av1-P7-es", audio_id: "audio-Av1-P7-es", reto_id: "R10-Av1-es" },
        // Parada 8: Capilla exterior catedral (Reto 11)
        { padreid: "padre-P8", tipo: "parada", nombre: "Capilla exterior catedral", parada_id: "P-8", numero_mapa: 5, texto_id: "txt-Av1-P8-es", audio_id: "audio-Av1-P8-es", reto_id: "R11-Av1-es" },
        // Parada 9: Capilla exterior catedral (Reto 12)
        { padreid: "padre-P9", tipo: "parada", nombre: "Capilla exterior catedral", parada_id: "P-9", numero_mapa: 5, texto_id: "txt-Av1-P9-es", audio_id: "audio-Av1-P9-es", reto_id: "R12-Av1-es" },
        // Parada 10: Arco Novo Catedral y Puerta Negra Basílica (sin reto)
        { padreid: "padre-P10", tipo: "parada", nombre: "Arco Novo Catedral y Puerta Negra Basílica", parada_id: "P-10", numero_mapa: "5,9", texto_id: "txt-Av1-P10-es", audio_id: "audio-Av1-P10-es" },
        // Parada 11: Casa del Punt de Gantxo (Reto 13)
        { padreid: "padre-P11", tipo: "parada", nombre: "Casa del Punt de Gantxo", parada_id: "P-11", numero_mapa: null, texto_id: "txt-Av1-P11-es", audio_id: "audio-Av1-P11-es", reto_id: "R13-Av1-es" },
        // Tramo 6: Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico", tramo_id: "TR-6", numero_mapa: "-→6", texto_id: "txt-Av1-TR6-es", audio_id: "audio-Av1-TR6-es" },
        // Parada 12: Museo arqueológico La Almoína (Reto 14)
        { padreid: "padre-P12", tipo: "parada", nombre: "Museo arqueológico La Almoína", parada_id: "P-12", numero_mapa: 6, texto_id: "txt-Av1-P12-es", audio_id: "audio-Av1-P12-es", reto_id: "R14-Av1-es" },
        // Parada 13: Museo arqueológico La Almoína (Reto 15 Puzzle PZ-02)
        { padreid: "padre-P13", tipo: "parada", nombre: "Museo arqueológico La Almoína", parada_id: "P-13", numero_mapa: 6, texto_id: "txt-Av1-P13-es", audio_id: "audio-Av1-P13-es", reto_id: "PZ-02" },
        // Parada 14: Vista de la Catedral, Cimborrio (Reto 16)
        { padreid: "padre-P14", tipo: "parada", nombre: "Vista de la Catedral, Cimborrio", parada_id: "P-14", numero_mapa: 5, texto_id: "txt-Av1-P14-es", audio_id: "audio-Av1-P14-es", reto_id: "R16-Av1-es" },
        // Tramo 7: Museo arqueológico La Almoína → Palacio Arzobispal
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Museo arqueológico La Almoína → Palacio Arzobispal", tramo_id: "TR-7", numero_mapa: "6→8", texto_id: "txt-Av1-TR7-es", audio_id: "audio-Av1-TR7-es" },
        // Parada 15: Palacio Arzobispal y Puerta Románica (Reto 17)
        { padreid: "padre-P15", tipo: "parada", nombre: "Palacio Arzobispal y Puerta Románica de la Catedral", parada_id: "P-15", numero_mapa: 8, texto_id: "txt-Av1-P15-es", audio_id: "audio-Av1-P15-es", reto_id: "R17-Av1-es" },
        // Parada 16: Puerta Románica de la Catedral (sin reto)
        { padreid: "padre-P16", tipo: "parada", nombre: "Puerta Románica de la Catedral", parada_id: "P-16", numero_mapa: 5, texto_id: "txt-Av1-P16-es", audio_id: "audio-Av1-P16-es" },
        // Tramo 8: Puerta Románica de la Catedral → Plaza del Ayuntamiento
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Puerta Románica de la Catedral → Plaza del Ayuntamiento", tramo_id: "TR-8", numero_mapa: "8→9", texto_id: "txt-Av1-TR8-es", audio_id: "audio-Av1-TR8-es" },
        // Parada 17: Plaza del Ayuntamiento (sin reto)
        { padreid: "padre-P17", tipo: "parada", nombre: "Plaza del Ayuntamiento", parada_id: "P-17", numero_mapa: 9, texto_id: "txt-Av1-P17-es", audio_id: "audio-Av1-P17-es" },
        // Tramo 9: Plaza del Ayuntamiento → Edificio del Ayuntamiento
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Plaza del Ayuntamiento → Edificio del Ayuntamiento", tramo_id: "TR-9", numero_mapa: "9→10", texto_id: "txt-Av1-TR9-es", audio_id: "audio-Av1-TR9-es" },
        // Parada 18: Edificio del Ayuntamiento (Reto 18)
        { padreid: "padre-P18", tipo: "parada", nombre: "Edificio del Ayuntamiento", parada_id: "P-18", numero_mapa: 10, texto_id: "txt-Av1-P18-es", audio_id: "audio-Av1-P18-es", reto_id: "R18-Av1-es" },
        // Parada 19: Edificio del Ayuntamiento (segunda parte, sin reto)
        { padreid: "padre-P19", tipo: "parada", nombre: "Edificio del Ayuntamiento", parada_id: "P-19", numero_mapa: 10, texto_id: "txt-Av1-P19-es", audio_id: "audio-Av1-P19-es" },
        // Tramo 10: Edificio del Ayuntamiento → Estación del Norte
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Edificio del Ayuntamiento → Estación del Norte", tramo_id: "TR-10", numero_mapa: "10→11", texto_id: "txt-Av1-TR10-es", audio_id: "audio-Av1-TR10-es" },
        // Parada 20: Estación del Norte (Reto 19)
        { padreid: "padre-P20", tipo: "parada", nombre: "Estación del Norte", parada_id: "P-20", numero_mapa: 11, texto_id: "txt-Av1-P20-es", audio_id: "audio-Av1-P20-es", reto_id: "R19-Av1-es" },
        // Tramo 11: Estación del Norte → Plaza de Toros
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Estación del Norte → Plaza de Toros de València", tramo_id: "TR-11", numero_mapa: "11→12", texto_id: "txt-Av1-TR11-es", audio_id: "audio-Av1-TR11-es" },
        // Parada 21: Plaza de Toros (Reto 20 Puzzle PZ-03)
        { padreid: "padre-P21", tipo: "parada", nombre: "Plaza de Toros", parada_id: "P-21", numero_mapa: 12, texto_id: "txt-Av1-P21-es", audio_id: "audio-Av1-P21-es", reto_id: "PZ-03" },
        // Tramo 12: Plaza de Toros → Casa estilo Árabe
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Plaza de Toros → Casa estilo Árabe", tramo_id: "TR-12", numero_mapa: "12→13", texto_id: "txt-Av1-TR12-es", audio_id: "audio-Av1-TR12-es" },
        // Parada 22: Casa estilo Árabe (mitad Aventura) (Reto 21)
        { padreid: "padre-P22", tipo: "parada", nombre: "Casa estilo Árabe", parada_id: "P-22", numero_mapa: 13, texto_id: "txt-Av1-P22-es", audio_id: "audio-Av1-P22-es", reto_id: "R21-Av1-es" },
        // Tramo 13: Casa estilo Árabe → Palacio de Comunicaciones (Correos)
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Casa estilo Árabe → Palacio de Comunicaciones (Correos)", tramo_id: "TR-13", numero_mapa: "13→14", texto_id: "txt-Av1-TR13-es", audio_id: "audio-Av1-TR13-es" },
        // Parada 23: Palacio de Comunicaciones (Correos) (Reto 22)
        { padreid: "padre-P23", tipo: "parada", nombre: "Palacio de Comunicaciones: Correos", parada_id: "P-23", numero_mapa: 14, texto_id: "txt-Av1-P23-es", audio_id: "audio-Av1-P23-es", reto_id: "R22-Av1-es" },
        // Parada 24: Edificio Suay - La Equitativa (Reto 23)
        { padreid: "padre-P24", tipo: "parada", nombre: "Edificio Suay - La Equitativa", parada_id: "P-24", numero_mapa: null, texto_id: "txt-Av1-P24-es", audio_id: "audio-Av1-P24-es", reto_id: "R23-Av1-es" },
        // Tramo 14: Palacio de Comunicaciones (Correos) → Banco de Valencia
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Palacio de Comunicaciones → Banco de València", tramo_id: "TR-14", numero_mapa: "14→15", texto_id: "txt-Av1-TR14-es", audio_id: "audio-Av1-TR14-es" },
        // Parada 25: Banco de Valencia (Reto 24)
        { padreid: "padre-P25", tipo: "parada", nombre: "Banco de Valencia", parada_id: "P-25", numero_mapa: 15, texto_id: "txt-Av1-P25-es", audio_id: "audio-Av1-P25-es", reto_id: "R24-Av1-es" },
        // Tramo 15: Banco de Valencia → Palacio del Marqués de Dos Aguas
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Banco de València → Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)", tramo_id: "TR-15", numero_mapa: "15→16", texto_id: "txt-Av1-TR15-es", audio_id: "audio-Av1-TR15-es" },
        // Parada 26: Palacio del Marqués de Dos Aguas (sin reto)
        { padreid: "padre-P26", tipo: "parada", nombre: "Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)", parada_id: "P-26", numero_mapa: 16, texto_id: "txt-Av1-P26-es", audio_id: "audio-Av1-P26-es" },
        // Tramo 16: Palacio del Marqués de Dos Aguas → Mercado Central
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Palacio del Marqués → Mercado Central", tramo_id: "TR-16", numero_mapa: "16→17", texto_id: "txt-Av1-TR16-es", audio_id: "audio-Av1-TR16-es" },
        // Parada 27: Mercado central (Reto 25)
        { padreid: "padre-P27", tipo: "parada", nombre: "Mercado central", parada_id: "P-27", numero_mapa: 17, texto_id: "txt-Av1-P27-es", audio_id: "audio-Av1-P27-es", reto_id: "R25-Av1-es" },
        // Tramo 17: Mercado Central → Iglesia de los Santos Juanes
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Mercado Central → Iglesia de los Santos Juanes (San Juan del Mercado)", tramo_id: "TR-17", numero_mapa: "17→18", texto_id: "txt-Av1-TR17-es", audio_id: "audio-Av1-TR17-es" },
        // Parada 28: Iglesia de los Santos Juanes 1 (Reto 26)
        { padreid: "padre-P28", tipo: "parada", nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)", parada_id: "P-28", numero_mapa: 18, texto_id: "txt-Av1-P28-es", audio_id: "audio-Av1-P28-es", reto_id: "R26-Av1-es" },
        // Parada 29: Iglesia de los Santos Juanes 2 (Reto 27)
        { padreid: "padre-P29", tipo: "parada", nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)", parada_id: "P-29", numero_mapa: 18, texto_id: "txt-Av1-P29-es", audio_id: "audio-Av1-P29-es", reto_id: "R27-Av1-es" },
        // Tramo 18: Iglesia Santos Juanes → Lonja de Valencia
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Iglesia Santos Juanes → Lonja de València (Mercado de la Seda)", tramo_id: "TR-18", numero_mapa: "18→19", texto_id: "txt-Av1-TR18-es", audio_id: "audio-Av1-TR18-es" },
        // Parada 30: Lonja historia (Reto 28 Puzzle PZ-04)
        { padreid: "padre-P30", tipo: "parada", nombre: "Lonja Historia", parada_id: "P-30", numero_mapa: 19, texto_id: "txt-Av1-P30-es", audio_id: "audio-Av1-P30-es", reto_id: "PZ-04" },
        // Parada 31: Lonja Puerta de Los Pecados 1 (Reto 29)
        { padreid: "padre-P31", tipo: "parada", nombre: "Lonja Puerta de Los Pecados", parada_id: "P-31", numero_mapa: 19, texto_id: "txt-Av1-P31-es", audio_id: "audio-Av1-P31-es", reto_id: "R29-Av1-es" },
        // Parada 32: Lonja Puerta de Los Pecados 2 (Reto 30)
        { padreid: "padre-P32", tipo: "parada", nombre: "Lonja Puerta de Los Pecados 2", parada_id: "P-32", numero_mapa: 19, texto_id: "txt-Av1-P32-es", audio_id: "audio-Av1-P32-es", reto_id: "R30-Av1-es" },
        // Parada 33: Lonja Gárgolas 1 (Reto 31)
        { padreid: "padre-P33", tipo: "parada", nombre: "Lonja (Gárgolas 1)", parada_id: "P-33", numero_mapa: 19, texto_id: "txt-Av1-P33-es", audio_id: "audio-Av1-P33-es", reto_id: "R31-Av1-es" },
        // Parada 34: Lonja Gárgolas 2 (Reto 32)
        { padreid: "padre-P34", tipo: "parada", nombre: "Lonja (Gárgolas 2)", parada_id: "P-34", numero_mapa: 19, texto_id: "txt-Av1-P34-es", audio_id: "audio-Av1-P34-es", reto_id: "R32-Av1-es" },
        // Parada 35: Lonja Fornicador (Reto 33)
        { padreid: "padre-P35", tipo: "parada", nombre: "Lonja (tallado ventana)", parada_id: "P-35", numero_mapa: 19, texto_id: "txt-Av1-P35-es", audio_id: "audio-Av1-P35-es", reto_id: "R33-Av1-es" },
        // Tramo 19: Rodeando la Lonja
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Rodeando la Lonja", tramo_id: "TR-19", numero_mapa: "19→19", texto_id: "txt-Av1-TR19-es", audio_id: "audio-Av1-TR19-es" },
        // Parada 36: Lonja Gárgola Torre (sin reto)
        { padreid: "padre-P36", tipo: "parada", nombre: "Lonja (Gárgola Torre)", parada_id: "P-36", numero_mapa: 19, texto_id: "txt-Av1-P36-es", audio_id: "audio-Av1-P36-es" },
        // Tramo 20: Lonja Patio de los naranjos → Lonja entrada visitantes
        { padreid: "padre-TR20", tipo: "tramo", nombre: "Lonja Patio de los naranjos → Lonja entrada visitantes", tramo_id: "TR-20", numero_mapa: "19→19", texto_id: "txt-Av1-TR20-es", audio_id: "audio-Av1-TR20-es" },
        // Tramo 21: Lonja entrada visitantes → Plaza Doctor López Collado
        { padreid: "padre-TR21", tipo: "tramo", nombre: "Lonja entrada visitantes → Plaza Doctor López Collado", tramo_id: "TR-21", numero_mapa: "19→20", texto_id: "txt-Av1-TR21-es", audio_id: "audio-Av1-TR21-es" },
        // Parada 37: Plaza Doctor López Collado (sin reto)
        { padreid: "padre-P37", tipo: "parada", nombre: "Plaza Doctor López Collado", parada_id: "P-37", numero_mapa: 20, texto_id: "txt-Av1-P37-es", audio_id: "audio-Av1-P37-es" },
        // Tramo 22: Plaza del Doctor López Collado → Plaza del Negrito
        { padreid: "padre-TR22", tipo: "tramo", nombre: "Plaza del Doctor Collado → Plaza del Negrito (Fuente del Negrito)", tramo_id: "TR-22", numero_mapa: "20→21", texto_id: "txt-Av1-TR22-es", audio_id: "audio-Av1-TR22-es" },
        // Parada 38: Fuente del Negrito (Reto 34)
        { padreid: "padre-P38", tipo: "parada", nombre: "Fuente del Negrito", parada_id: "P-38", numero_mapa: 21, texto_id: "txt-Av1-P38-es", audio_id: "audio-Av1-P38-es", reto_id: "R34-Av1-es" },
        // Tramo 23: Plaza del Negrito → Calle Caballeros
        { padreid: "padre-TR23", tipo: "tramo", nombre: "Plaza del Negrito → Calle Caballeros", tramo_id: "TR-23", numero_mapa: "21→22", texto_id: "txt-Av1-TR23-es", audio_id: "audio-Av1-TR23-es" },
        // Parada 39: Palau de la Generalitat (sin reto)
        { padreid: "padre-P39", tipo: "parada", nombre: "Palau de la Generalitat", parada_id: "P-39", numero_mapa: 23, texto_id: "txt-Av1-P39-es", audio_id: "audio-Av1-P39-es" },
        // Tramo 24: Palacio de la Generalitat → Calle de los Serranos (FINAL)
        { padreid: "padre-TR24", tipo: "tramo", nombre: "Palacio de la Generalitat → Calle de los Serranos (FINAL)", tramo_id: "TR-24", numero_mapa: "23→1", texto_id: "txt-Av1-TR24-es", audio_id: "audio-Av1-TR24-es" },
        // Parada 40 - FINAL: Torres de Serranos (Reto 35 Puzzle PZ-05)
        { padreid: "padre-P40", tipo: "parada", nombre: "Torres de Serranos Final", parada_id: "P-40", numero_mapa: 1, texto_id: "txt-Av1-P40-es", audio_id: "audio-Av1-P40-es", reto_id: "PZ-05" }
      ]
    },
    en: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
         {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av1-en" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-en", audio_id: "audio-intro-en", reto_id: "R2-Av1-en" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av1-P0-en", audio_id: "audio-Av1-P0-en", reto_id: "R3-Av1-en" },
        // Tramo 1: Torres de Serranos → Plaza de la crida (Puente de Serranos)
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Plaza de la crida (Puente de Serranos)", tramo_id: "TR-1", numero_mapa: "1→1", texto_id: "txt-Av1-TR1-en", audio_id: "audio-Av1-TR1-en" },
        // Parada 1: Plaza de la crída (Puente de Serranos) (Reto 4)
        { padreid: "padre-P1", tipo: "parada", nombre: "Plaza de la crída (Puente de Serranos)", parada_id: "P-1", numero_mapa: 1, texto_id: "txt-Av1-P1-en", audio_id: "audio-Av1-P1-en", reto_id: "R4-Av1-en" },
        // Tramo 2: Plaza de la crída → Calle Muro de Santa Ana
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Plaza de la crída → Calle Muro de Santa Ana", tramo_id: "TR-2", numero_mapa: "1→-", texto_id: "txt-Av1-TR2-en", audio_id: "audio-Av1-TR2-en" },
        // Parada 2: Calle Muro de Santa Ana (Reto 5)
        { padreid: "padre-P2", tipo: "parada", nombre: "Calle Muro de Santa Ana", parada_id: "P-2", numero_mapa: null, texto_id: "txt-Av1-P2-en", audio_id: "audio-Av1-P2-en", reto_id: "R5-Av1-en" },
        // Tramo 3: Calle Muro de Santa Ana → Palacio de los Borgia
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Calle Muro de Santa Ana → Palacio de los Borgia", tramo_id: "TR-3", numero_mapa: "-→2", texto_id: "txt-Av1-TR3-en", audio_id: "audio-Av1-TR3-en" },
        // Parada 3: Iglesia de San Lorenzo (Reto 6)
        { padreid: "padre-P3", tipo: "parada", nombre: "Iglesia de San Lorenzo", parada_id: "P-3", numero_mapa: null, texto_id: "txt-Av1-P3-en", audio_id: "audio-Av1-P3-en", reto_id: "R6-Av1-en" },
        // Tramo 4: Iglesia de San Lorenzo → Plaza de la Virgen
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Iglesia de San Lorenzo → Plaza de la Virgen", tramo_id: "TR-4", numero_mapa: "-→3", texto_id: "txt-Av1-TR4-en", audio_id: "audio-Av1-TR4-en" },
        // Parada 4: Plaza de la Virgen (Reto 7)
        { padreid: "padre-P4", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-4", numero_mapa: 3, texto_id: "txt-Av1-P4-en", audio_id: "audio-Av1-P4-en", reto_id: "R7-Av1-en" },
        // Parada 5: Plaza de la Virgen (Reto 8)
        { padreid: "padre-P5", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-5", numero_mapa: 3, texto_id: "txt-Av1-P5-en", audio_id: "audio-Av1-P5-en", reto_id: "R8-Av1-en" },
        // Parada 6: Plaza de la Virgen (Reto 9 Puzzle PZ-01)
        { padreid: "padre-P6", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-6", numero_mapa: 3, texto_id: "txt-Av1-P6-en", audio_id: "audio-Av1-P6-en", reto_id: "PZ-01" },
        // Tramo 5: Plaza de la Virgen → Plaza Décimo Junio Bruto (Plaza de la Almoína)
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Plaza de la Virgen → Plaza Décimo Junio Bruto (Plaza de la Almoína)", tramo_id: "TR-5", numero_mapa: "3→4", texto_id: "txt-Av1-TR5-en", audio_id: "audio-Av1-TR5-en" },
        // Parada 7: Panel cerámico muro Catedral (Reto 10)
        { padreid: "padre-P7", tipo: "parada", nombre: "Panel cerámico muro Catedral", parada_id: "P-7", numero_mapa: 5, texto_id: "txt-Av1-P7-en", audio_id: "audio-Av1-P7-en", reto_id: "R10-Av1-en" },
        // Parada 8: Capilla exterior catedral (Reto 11)
        { padreid: "padre-P8", tipo: "parada", nombre: "Capilla exterior catedral", parada_id: "P-8", numero_mapa: 5, texto_id: "txt-Av1-P8-en", audio_id: "audio-Av1-P8-en", reto_id: "R11-Av1-en" },
        // Parada 9: Capilla exterior catedral (Reto 12)
        { padreid: "padre-P9", tipo: "parada", nombre: "Capilla exterior catedral", parada_id: "P-9", numero_mapa: 5, texto_id: "txt-Av1-P9-en", audio_id: "audio-Av1-P9-en", reto_id: "R12-Av1-en" },
        // Parada 10: Arco Novo Catedral y Puerta Negra Basílica (sin reto)
        { padreid: "padre-P10", tipo: "parada", nombre: "Arco Novo Catedral y Puerta Negra Basílica", parada_id: "P-10", numero_mapa: "5,9", texto_id: "txt-Av1-P10-en", audio_id: "audio-Av1-P10-en" },
        // Parada 11: Casa del Punt de Gantxo (Reto 13)
        { padreid: "padre-P11", tipo: "parada", nombre: "Casa del Punt de Gantxo", parada_id: "P-11", numero_mapa: null, texto_id: "txt-Av1-P11-en", audio_id: "audio-Av1-P11-en", reto_id: "R13-Av1-en" },
        // Tramo 6: Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico", tramo_id: "TR-6", numero_mapa: "-→6", texto_id: "txt-Av1-TR6-en", audio_id: "audio-Av1-TR6-en" },
        // Parada 12: Museo arqueológico La Almoína (Reto 14)
        { padreid: "padre-P12", tipo: "parada", nombre: "Museo arqueológico La Almoína", parada_id: "P-12", numero_mapa: 6, texto_id: "txt-Av1-P12-en", audio_id: "audio-Av1-P12-en", reto_id: "R14-Av1-en" },
        // Parada 13: Museo arqueológico La Almoína (Reto 15 Puzzle PZ-02)
        { padreid: "padre-P13", tipo: "parada", nombre: "Museo arqueológico La Almoína", parada_id: "P-13", numero_mapa: 6, texto_id: "txt-Av1-P13-en", audio_id: "audio-Av1-P13-en", reto_id: "PZ-02" },
        // Parada 14: Vista de la Catedral, Cimborrio (Reto 16)
        { padreid: "padre-P14", tipo: "parada", nombre: "Vista de la Catedral, Cimborrio", parada_id: "P-14", numero_mapa: 5, texto_id: "txt-Av1-P14-en", audio_id: "audio-Av1-P14-en", reto_id: "R16-Av1-en" },
        // Tramo 7: Museo arqueológico La Almoína → Palacio Arzobispal
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Museo arqueológico La Almoína → Palacio Arzobispal", tramo_id: "TR-7", numero_mapa: "6→8", texto_id: "txt-Av1-TR7-en", audio_id: "audio-Av1-TR7-en" },
        // Parada 15: Palacio Arzobispal y Puerta Románica (Reto 17)
        { padreid: "padre-P15", tipo: "parada", nombre: "Palacio Arzobispal y Puerta Románica de la Catedral", parada_id: "P-15", numero_mapa: 8, texto_id: "txt-Av1-P15-en", audio_id: "audio-Av1-P15-en", reto_id: "R17-Av1-en" },
        // Parada 16: Puerta Románica de la Catedral (sin reto)
        { padreid: "padre-P16", tipo: "parada", nombre: "Puerta Románica de la Catedral", parada_id: "P-16", numero_mapa: 5, texto_id: "txt-Av1-P16-en", audio_id: "audio-Av1-P16-en" },
        // Tramo 8: Puerta Románica de la Catedral → Plaza del Ayuntamiento
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Puerta Románica de la Catedral → Plaza del Ayuntamiento", tramo_id: "TR-8", numero_mapa: "8→9", texto_id: "txt-Av1-TR8-en", audio_id: "audio-Av1-TR8-en" },
        // Parada 17: Plaza del Ayuntamiento (sin reto)
        { padreid: "padre-P17", tipo: "parada", nombre: "Plaza del Ayuntamiento", parada_id: "P-17", numero_mapa: 9, texto_id: "txt-Av1-P17-en", audio_id: "audio-Av1-P17-en" },
        // Tramo 9: Plaza del Ayuntamiento → Edificio del Ayuntamiento
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Plaza del Ayuntamiento → Edificio del Ayuntamiento", tramo_id: "TR-9", numero_mapa: "9→10", texto_id: "txt-Av1-TR9-en", audio_id: "audio-Av1-TR9-en" },
        // Parada 18: Edificio del Ayuntamiento (Reto 18)
        { padreid: "padre-P18", tipo: "parada", nombre: "Edificio del Ayuntamiento", parada_id: "P-18", numero_mapa: 10, texto_id: "txt-Av1-P18-en", audio_id: "audio-Av1-P18-en", reto_id: "R18-Av1-en" },
        // Parada 19: Edificio del Ayuntamiento (segunda parte, sin reto)
        { padreid: "padre-P19", tipo: "parada", nombre: "Edificio del Ayuntamiento", parada_id: "P-19", numero_mapa: 10, texto_id: "txt-Av1-P19-en", audio_id: "audio-Av1-P19-en" },
        // Tramo 10: Edificio del Ayuntamiento → Estación del Norte
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Edificio del Ayuntamiento → Estación del Norte", tramo_id: "TR-10", numero_mapa: "10→11", texto_id: "txt-Av1-TR10-en", audio_id: "audio-Av1-TR10-en" },
        // Parada 20: Estación del Norte (Reto 19)
        { padreid: "padre-P20", tipo: "parada", nombre: "Estación del Norte", parada_id: "P-20", numero_mapa: 11, texto_id: "txt-Av1-P20-en", audio_id: "audio-Av1-P20-en", reto_id: "R19-Av1-en" },
        // Tramo 11: Estación del Norte → Plaza de Toros
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Estación del Norte → Plaza de Toros de València", tramo_id: "TR-11", numero_mapa: "11→12", texto_id: "txt-Av1-TR11-en", audio_id: "audio-Av1-TR11-en" },
        // Parada 21: Plaza de Toros (Reto 20 Puzzle PZ-03)
        { padreid: "padre-P21", tipo: "parada", nombre: "Plaza de Toros", parada_id: "P-21", numero_mapa: 12, texto_id: "txt-Av1-P21-en", audio_id: "audio-Av1-P21-en", reto_id: "PZ-03" },
        // Tramo 12: Plaza de Toros → Casa estilo Árabe
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Plaza de Toros → Casa estilo Árabe", tramo_id: "TR-12", numero_mapa: "12→13", texto_id: "txt-Av1-TR12-en", audio_id: "audio-Av1-TR12-en" },
        // Parada 22: Casa estilo Árabe (mitad Aventura) (Reto 21)
        { padreid: "padre-P22", tipo: "parada", nombre: "Casa estilo Árabe", parada_id: "P-22", numero_mapa: 13, texto_id: "txt-Av1-P22-en", audio_id: "audio-Av1-P22-en", reto_id: "R21-Av1-en" },
        // Tramo 13: Casa estilo Árabe → Palacio de Comunicaciones (Correos)
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Casa estilo Árabe → Palacio de Comunicaciones (Correos)", tramo_id: "TR-13", numero_mapa: "13→14", texto_id: "txt-Av1-TR13-en", audio_id: "audio-Av1-TR13-en" },
        // Parada 23: Palacio de Comunicaciones (Correos) (Reto 22)
        { padreid: "padre-P23", tipo: "parada", nombre: "Palacio de Comunicaciones: Correos", parada_id: "P-23", numero_mapa: 14, texto_id: "txt-Av1-P23-en", audio_id: "audio-Av1-P23-en", reto_id: "R22-Av1-en" },
        // Parada 24: Edificio Suay - La Equitativa (Reto 23)
        { padreid: "padre-P24", tipo: "parada", nombre: "Edificio Suay - La Equitativa", parada_id: "P-24", numero_mapa: null, texto_id: "txt-Av1-P24-en", audio_id: "audio-Av1-P24-en", reto_id: "R23-Av1-en" },
        // Tramo 14: Palacio de Comunicaciones (Correos) → Banco de Valencia
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Palacio de Comunicaciones → Banco de València", tramo_id: "TR-14", numero_mapa: "14→15", texto_id: "txt-Av1-TR14-en", audio_id: "audio-Av1-TR14-en" },
        // Parada 25: Banco de Valencia (Reto 24)
        { padreid: "padre-P25", tipo: "parada", nombre: "Banco de Valencia", parada_id: "P-25", numero_mapa: 15, texto_id: "txt-Av1-P25-en", audio_id: "audio-Av1-P25-en", reto_id: "R24-Av1-en" },
        // Tramo 15: Banco de Valencia → Palacio del Marqués de Dos Aguas
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Banco de València → Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)", tramo_id: "TR-15", numero_mapa: "15→16", texto_id: "txt-Av1-TR15-en", audio_id: "audio-Av1-TR15-en" },
        // Parada 26: Palacio del Marqués de Dos Aguas (sin reto)
        { padreid: "padre-P26", tipo: "parada", nombre: "Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)", parada_id: "P-26", numero_mapa: 16, texto_id: "txt-Av1-P26-en", audio_id: "audio-Av1-P26-en" },
        // Tramo 16: Palacio del Marqués de Dos Aguas → Mercado Central
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Palacio del Marqués → Mercado Central", tramo_id: "TR-16", numero_mapa: "16→17", texto_id: "txt-Av1-TR16-en", audio_id: "audio-Av1-TR16-en" },
        // Parada 27: Mercado central (Reto 25)
        { padreid: "padre-P27", tipo: "parada", nombre: "Mercado central", parada_id: "P-27", numero_mapa: 17, texto_id: "txt-Av1-P27-en", audio_id: "audio-Av1-P27-en", reto_id: "R25-Av1-en" },
        // Tramo 17: Mercado Central → Iglesia de los Santos Juanes
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Mercado Central → Iglesia de los Santos Juanes (San Juan del Mercado)", tramo_id: "TR-17", numero_mapa: "17→18", texto_id: "txt-Av1-TR17-en", audio_id: "audio-Av1-TR17-en" },
        // Parada 28: Iglesia de los Santos Juanes 1 (Reto 26)
        { padreid: "padre-P28", tipo: "parada", nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)", parada_id: "P-28", numero_mapa: 18, texto_id: "txt-Av1-P28-en", audio_id: "audio-Av1-P28-en", reto_id: "R26-Av1-en" },
        // Parada 29: Iglesia de los Santos Juanes 2 (Reto 27)
        { padreid: "padre-P29", tipo: "parada", nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)", parada_id: "P-29", numero_mapa: 18, texto_id: "txt-Av1-P29-en", audio_id: "audio-Av1-P29-en", reto_id: "R27-Av1-en" },
        // Tramo 18: Iglesia Santos Juanes → Lonja de Valencia
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Iglesia Santos Juanes → Lonja de València (Mercado de la Seda)", tramo_id: "TR-18", numero_mapa: "18→19", texto_id: "txt-Av1-TR18-en", audio_id: "audio-Av1-TR18-en" },
        // Parada 30: Lonja historia (Reto 28 Puzzle PZ-04)
        { padreid: "padre-P30", tipo: "parada", nombre: "Lonja Historia", parada_id: "P-30", numero_mapa: 19, texto_id: "txt-Av1-P30-en", audio_id: "audio-Av1-P30-en", reto_id: "PZ-04" },
        // Parada 31: Lonja Puerta de Los Pecados 1 (Reto 29)
        { padreid: "padre-P31", tipo: "parada", nombre: "Lonja Puerta de Los Pecados", parada_id: "P-31", numero_mapa: 19, texto_id: "txt-Av1-P31-en", audio_id: "audio-Av1-P31-en", reto_id: "R29-Av1-en" },
        // Parada 32: Lonja Puerta de Los Pecados 2 (Reto 30)
        { padreid: "padre-P32", tipo: "parada", nombre: "Lonja Puerta de Los Pecados 2", parada_id: "P-32", numero_mapa: 19, texto_id: "txt-Av1-P32-en", audio_id: "audio-Av1-P32-en", reto_id: "R30-Av1-en" },
        // Parada 33: Lonja Gárgolas 1 (Reto 31)
        { padreid: "padre-P33", tipo: "parada", nombre: "Lonja (Gárgolas 1)", parada_id: "P-33", numero_mapa: 19, texto_id: "txt-Av1-P33-en", audio_id: "audio-Av1-P33-en", reto_id: "R31-Av1-en" },
        // Parada 34: Lonja Gárgolas 2 (Reto 32)
        { padreid: "padre-P34", tipo: "parada", nombre: "Lonja (Gárgolas 2)", parada_id: "P-34", numero_mapa: 19, texto_id: "txt-Av1-P34-en", audio_id: "audio-Av1-P34-en", reto_id: "R32-Av1-en" },
        // Parada 35: Lonja Fornicador (Reto 33)
        { padreid: "padre-P35", tipo: "parada", nombre: "Lonja (tallado ventana)", parada_id: "P-35", numero_mapa: 19, texto_id: "txt-Av1-P35-en", audio_id: "audio-Av1-P35-en", reto_id: "R33-Av1-en" },
        // Tramo 19: Rodeando la Lonja
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Rodeando la Lonja", tramo_id: "TR-19", numero_mapa: "19→19", texto_id: "txt-Av1-TR19-en", audio_id: "audio-Av1-TR19-en" },
        // Parada 36: Lonja Gárgola Torre (sin reto)
        { padreid: "padre-P36", tipo: "parada", nombre: "Lonja (Gárgola Torre)", parada_id: "P-36", numero_mapa: 19, texto_id: "txt-Av1-P36-en", audio_id: "audio-Av1-P36-en" },
        // Tramo 20: Lonja Patio de los naranjos → Lonja entrada visitantes
        { padreid: "padre-TR20", tipo: "tramo", nombre: "Lonja Patio de los naranjos → Lonja entrada visitantes", tramo_id: "TR-20", numero_mapa: "19→19", texto_id: "txt-Av1-TR20-en", audio_id: "audio-Av1-TR20-en" },
        // Tramo 21: Lonja entrada visitantes → Plaza Doctor López Collado
        { padreid: "padre-TR21", tipo: "tramo", nombre: "Lonja entrada visitantes → Plaza Doctor López Collado", tramo_id: "TR-21", numero_mapa: "19→20", texto_id: "txt-Av1-TR21-en", audio_id: "audio-Av1-TR21-en" },
        // Parada 37: Plaza Doctor López Collado (sin reto)
        { padreid: "padre-P37", tipo: "parada", nombre: "Plaza Doctor López Collado", parada_id: "P-37", numero_mapa: 20, texto_id: "txt-Av1-P37-en", audio_id: "audio-Av1-P37-en" },
        // Tramo 22: Plaza del Doctor López Collado → Plaza del Negrito
        { padreid: "padre-TR22", tipo: "tramo", nombre: "Plaza del Doctor Collado → Plaza del Negrito (Fuente del Negrito)", tramo_id: "TR-22", numero_mapa: "20→21", texto_id: "txt-Av1-TR22-en", audio_id: "audio-Av1-TR22-en" },
        // Parada 38: Fuente del Negrito (Reto 34)
        { padreid: "padre-P38", tipo: "parada", nombre: "Fuente del Negrito", parada_id: "P-38", numero_mapa: 21, texto_id: "txt-Av1-P38-en", audio_id: "audio-Av1-P38-en", reto_id: "R34-Av1-en" },
        // Tramo 23: Plaza del Negrito → Calle Caballeros
        { padreid: "padre-TR23", tipo: "tramo", nombre: "Plaza del Negrito → Calle Caballeros", tramo_id: "TR-23", numero_mapa: "21→22", texto_id: "txt-Av1-TR23-en", audio_id: "audio-Av1-TR23-en" },
        // Parada 39: Palau de la Generalitat (sin reto)
        { padreid: "padre-P39", tipo: "parada", nombre: "Palau de la Generalitat", parada_id: "P-39", numero_mapa: 23, texto_id: "txt-Av1-P39-en", audio_id: "audio-Av1-P39-en" },
        // Tramo 24: Palacio de la Generalitat → Calle de los Serranos (FINAL)
        { padreid: "padre-TR24", tipo: "tramo", nombre: "Palacio de la Generalitat → Calle de los Serranos (FINAL)", tramo_id: "TR-24", numero_mapa: "23→1", texto_id: "txt-Av1-TR24-en", audio_id: "audio-Av1-TR24-en" },
        // Parada 40 - FINAL: Torres de Serranos (Reto 35 Puzzle PZ-05)
        { padreid: "padre-P40", tipo: "parada", nombre: "Torres de Serranos Final", parada_id: "P-40", numero_mapa: 1, texto_id: "txt-Av1-P40-en", audio_id: "audio-Av1-P40-en", reto_id: "PZ-05" }
      ]
    },
    fr: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
         {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av1-fr" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-fr", audio_id: "audio-intro-fr", reto_id: "R2-Av1-fr" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av1-P0-fr", audio_id: "audio-Av1-P0-fr", reto_id: "R3-Av1-fr" },
        // Tramo 1: Torres de Serranos → Plaza de la crida (Puente de Serranos)
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Plaza de la crida (Puente de Serranos)", tramo_id: "TR-1", numero_mapa: "1→1", texto_id: "txt-Av1-TR1-fr", audio_id: "audio-Av1-TR1-fr" },
        // Parada 1: Plaza de la crída (Puente de Serranos) (Reto 4)
        { padreid: "padre-P1", tipo: "parada", nombre: "Plaza de la crída (Puente de Serranos)", parada_id: "P-1", numero_mapa: 1, texto_id: "txt-Av1-P1-fr", audio_id: "audio-Av1-P1-fr", reto_id: "R4-Av1-fr" },
        // Tramo 2: Plaza de la crída → Calle Muro de Santa Ana
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Plaza de la crída → Calle Muro de Santa Ana", tramo_id: "TR-2", numero_mapa: "1→-", texto_id: "txt-Av1-TR2-fr", audio_id: "audio-Av1-TR2-fr" },
        // Parada 2: Calle Muro de Santa Ana (Reto 5)
        { padreid: "padre-P2", tipo: "parada", nombre: "Calle Muro de Santa Ana", parada_id: "P-2", numero_mapa: null, texto_id: "txt-Av1-P2-fr", audio_id: "audio-Av1-P2-fr", reto_id: "R5-Av1-fr" },
        // Tramo 3: Calle Muro de Santa Ana → Palacio de los Borgia
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Calle Muro de Santa Ana → Palacio de los Borgia", tramo_id: "TR-3", numero_mapa: "-→2", texto_id: "txt-Av1-TR3-fr", audio_id: "audio-Av1-TR3-fr" },
        // Parada 3: Iglesia de San Lorenzo (Reto 6)
        { padreid: "padre-P3", tipo: "parada", nombre: "Iglesia de San Lorenzo", parada_id: "P-3", numero_mapa: null, texto_id: "txt-Av1-P3-fr", audio_id: "audio-Av1-P3-fr", reto_id: "R6-Av1-fr" },
        // Tramo 4: Iglesia de San Lorenzo → Plaza de la Virgen
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Iglesia de San Lorenzo → Plaza de la Virgen", tramo_id: "TR-4", numero_mapa: "-→3", texto_id: "txt-Av1-TR4-fr", audio_id: "audio-Av1-TR4-fr" },
        // Parada 4: Plaza de la Virgen (Reto 7)
        { padreid: "padre-P4", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-4", numero_mapa: 3, texto_id: "txt-Av1-P4-fr", audio_id: "audio-Av1-P4-fr", reto_id: "R7-Av1-fr" },
        // Parada 5: Plaza de la Virgen (Reto 8)
        { padreid: "padre-P5", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-5", numero_mapa: 3, texto_id: "txt-Av1-P5-fr", audio_id: "audio-Av1-P5-fr", reto_id: "R8-Av1-fr" },
        // Parada 6: Plaza de la Virgen (Reto 9 Puzzle PZ-01)
        { padreid: "padre-P6", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-6", numero_mapa: 3, texto_id: "txt-Av1-P6-fr", audio_id: "audio-Av1-P6-fr", reto_id: "PZ-01" },
        // Tramo 5: Plaza de la Virgen → Plaza Décimo Junio Bruto (Plaza de la Almoína)
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Plaza de la Virgen → Plaza Décimo Junio Bruto (Plaza de la Almoína)", tramo_id: "TR-5", numero_mapa: "3→4", texto_id: "txt-Av1-TR5-fr", audio_id: "audio-Av1-TR5-fr" },
        // Parada 7: Panel cerámico muro Catedral (Reto 10)
        { padreid: "padre-P7", tipo: "parada", nombre: "Panel cerámico muro Catedral", parada_id: "P-7", numero_mapa: 5, texto_id: "txt-Av1-P7-fr", audio_id: "audio-Av1-P7-fr", reto_id: "R10-Av1-fr" },
        // Parada 8: Capilla exterior catedral (Reto 11)
        { padreid: "padre-P8", tipo: "parada", nombre: "Capilla exterior catedral", parada_id: "P-8", numero_mapa: 5, texto_id: "txt-Av1-P8-fr", audio_id: "audio-Av1-P8-fr", reto_id: "R11-Av1-fr" },
        // Parada 9: Capilla exterior catedral (Reto 12)
        { padreid: "padre-P9", tipo: "parada", nombre: "Capilla exterior catedral", parada_id: "P-9", numero_mapa: 5, texto_id: "txt-Av1-P9-fr", audio_id: "audio-Av1-P9-fr", reto_id: "R12-Av1-fr" },
        // Parada 10: Arco Novo Catedral y Puerta Negra Basílica (sin reto)
        { padreid: "padre-P10", tipo: "parada", nombre: "Arco Novo Catedral y Puerta Negra Basílica", parada_id: "P-10", numero_mapa: "5,9", texto_id: "txt-Av1-P10-fr", audio_id: "audio-Av1-P10-fr" },
        // Parada 11: Casa del Punt de Gantxo (Reto 13)
        { padreid: "padre-P11", tipo: "parada", nombre: "Casa del Punt de Gantxo", parada_id: "P-11", numero_mapa: null, texto_id: "txt-Av1-P11-fr", audio_id: "audio-Av1-P11-fr", reto_id: "R13-Av1-fr" },
        // Tramo 6: Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico", tramo_id: "TR-6", numero_mapa: "-→6", texto_id: "txt-Av1-TR6-fr", audio_id: "audio-Av1-TR6-fr" },
        // Parada 12: Museo arqueológico La Almoína (Reto 14)
        { padreid: "padre-P12", tipo: "parada", nombre: "Museo arqueológico La Almoína", parada_id: "P-12", numero_mapa: 6, texto_id: "txt-Av1-P12-fr", audio_id: "audio-Av1-P12-fr", reto_id: "R14-Av1-fr" },
        // Parada 13: Museo arqueológico La Almoína (Reto 15 Puzzle PZ-02)
        { padreid: "padre-P13", tipo: "parada", nombre: "Museo arqueológico La Almoína", parada_id: "P-13", numero_mapa: 6, texto_id: "txt-Av1-P13-fr", audio_id: "audio-Av1-P13-fr", reto_id: "PZ-02" },
        // Parada 14: Vista de la Catedral, Cimborrio (Reto 16)
        { padreid: "padre-P14", tipo: "parada", nombre: "Vista de la Catedral, Cimborrio", parada_id: "P-14", numero_mapa: 5, texto_id: "txt-Av1-P14-fr", audio_id: "audio-Av1-P14-fr", reto_id: "R16-Av1-fr" },
        // Tramo 7: Museo arqueológico La Almoína → Palacio Arzobispal
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Museo arqueológico La Almoína → Palacio Arzobispal", tramo_id: "TR-7", numero_mapa: "6→8", texto_id: "txt-Av1-TR7-fr", audio_id: "audio-Av1-TR7-fr" },
        // Parada 15: Palacio Arzobispal y Puerta Románica (Reto 17)
        { padreid: "padre-P15", tipo: "parada", nombre: "Palacio Arzobispal y Puerta Románica de la Catedral", parada_id: "P-15", numero_mapa: 8, texto_id: "txt-Av1-P15-fr", audio_id: "audio-Av1-P15-fr", reto_id: "R17-Av1-fr" },
        // Parada 16: Puerta Románica de la Catedral (sin reto)
        { padreid: "padre-P16", tipo: "parada", nombre: "Puerta Románica de la Catedral", parada_id: "P-16", numero_mapa: 5, texto_id: "txt-Av1-P16-fr", audio_id: "audio-Av1-P16-fr" },
        // Tramo 8: Puerta Románica de la Catedral → Plaza del Ayuntamiento
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Puerta Románica de la Catedral → Plaza del Ayuntamiento", tramo_id: "TR-8", numero_mapa: "8→9", texto_id: "txt-Av1-TR8-fr", audio_id: "audio-Av1-TR8-fr" },
        // Parada 17: Plaza del Ayuntamiento (sin reto)
        { padreid: "padre-P17", tipo: "parada", nombre: "Plaza del Ayuntamiento", parada_id: "P-17", numero_mapa: 9, texto_id: "txt-Av1-P17-fr", audio_id: "audio-Av1-P17-fr" },
        // Tramo 9: Plaza del Ayuntamiento → Edificio del Ayuntamiento
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Plaza del Ayuntamiento → Edificio del Ayuntamiento", tramo_id: "TR-9", numero_mapa: "9→10", texto_id: "txt-Av1-TR9-fr", audio_id: "audio-Av1-TR9-fr" },
        // Parada 18: Edificio del Ayuntamiento (Reto 18)
        { padreid: "padre-P18", tipo: "parada", nombre: "Edificio del Ayuntamiento", parada_id: "P-18", numero_mapa: 10, texto_id: "txt-Av1-P18-fr", audio_id: "audio-Av1-P18-fr", reto_id: "R18-Av1-fr" },
        // Parada 19: Edificio del Ayuntamiento (segunda parte, sin reto)
        { padreid: "padre-P19", tipo: "parada", nombre: "Edificio del Ayuntamiento", parada_id: "P-19", numero_mapa: 10, texto_id: "txt-Av1-P19-fr", audio_id: "audio-Av1-P19-fr" },
        // Tramo 10: Edificio del Ayuntamiento → Estación del Norte
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Edificio del Ayuntamiento → Estación del Norte", tramo_id: "TR-10", numero_mapa: "10→11", texto_id: "txt-Av1-TR10-fr", audio_id: "audio-Av1-TR10-fr" },
        // Parada 20: Estación del Norte (Reto 19)
        { padreid: "padre-P20", tipo: "parada", nombre: "Estación del Norte", parada_id: "P-20", numero_mapa: 11, texto_id: "txt-Av1-P20-fr", audio_id: "audio-Av1-P20-fr", reto_id: "R19-Av1-fr" },
        // Tramo 11: Estación del Norte → Plaza de Toros
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Estación del Norte → Plaza de Toros de València", tramo_id: "TR-11", numero_mapa: "11→12", texto_id: "txt-Av1-TR11-fr", audio_id: "audio-Av1-TR11-fr" },
        // Parada 21: Plaza de Toros (Reto 20 Puzzle PZ-03)
        { padreid: "padre-P21", tipo: "parada", nombre: "Plaza de Toros", parada_id: "P-21", numero_mapa: 12, texto_id: "txt-Av1-P21-fr", audio_id: "audio-Av1-P21-fr", reto_id: "PZ-03" },
        // Tramo 12: Plaza de Toros → Casa estilo Árabe
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Plaza de Toros → Casa estilo Árabe", tramo_id: "TR-12", numero_mapa: "12→13", texto_id: "txt-Av1-TR12-fr", audio_id: "audio-Av1-TR12-fr" },
        // Parada 22: Casa estilo Árabe (mitad Aventura) (Reto 21)
        { padreid: "padre-P22", tipo: "parada", nombre: "Casa estilo Árabe", parada_id: "P-22", numero_mapa: 13, texto_id: "txt-Av1-P22-fr", audio_id: "audio-Av1-P22-fr", reto_id: "R21-Av1-fr" },
        // Tramo 13: Casa estilo Árabe → Palacio de Comunicaciones (Correos)
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Casa estilo Árabe → Palacio de Comunicaciones (Correos)", tramo_id: "TR-13", numero_mapa: "13→14", texto_id: "txt-Av1-TR13-fr", audio_id: "audio-Av1-TR13-fr" },
        // Parada 23: Palacio de Comunicaciones (Correos) (Reto 22)
        { padreid: "padre-P23", tipo: "parada", nombre: "Palacio de Comunicaciones: Correos", parada_id: "P-23", numero_mapa: 14, texto_id: "txt-Av1-P23-fr", audio_id: "audio-Av1-P23-fr", reto_id: "R22-Av1-fr" },
        // Parada 24: Edificio Suay - La Equitativa (Reto 23)
        { padreid: "padre-P24", tipo: "parada", nombre: "Edificio Suay - La Equitativa", parada_id: "P-24", numero_mapa: null, texto_id: "txt-Av1-P24-fr", audio_id: "audio-Av1-P24-fr", reto_id: "R23-Av1-fr" },
        // Tramo 14: Palacio de Comunicaciones (Correos) → Banco de Valencia
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Palacio de Comunicaciones → Banco de València", tramo_id: "TR-14", numero_mapa: "14→15", texto_id: "txt-Av1-TR14-fr", audio_id: "audio-Av1-TR14-fr" },
        // Parada 25: Banco de Valencia (Reto 24)
        { padreid: "padre-P25", tipo: "parada", nombre: "Banco de Valencia", parada_id: "P-25", numero_mapa: 15, texto_id: "txt-Av1-P25-fr", audio_id: "audio-Av1-P25-fr", reto_id: "R24-Av1-fr" },
        // Tramo 15: Banco de Valencia → Palacio del Marqués de Dos Aguas
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Banco de València → Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)", tramo_id: "TR-15", numero_mapa: "15→16", texto_id: "txt-Av1-TR15-fr", audio_id: "audio-Av1-TR15-fr" },
        // Parada 26: Palacio del Marqués de Dos Aguas (sin reto)
        { padreid: "padre-P26", tipo: "parada", nombre: "Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)", parada_id: "P-26", numero_mapa: 16, texto_id: "txt-Av1-P26-fr", audio_id: "audio-Av1-P26-fr" },
        // Tramo 16: Palacio del Marqués de Dos Aguas → Mercado Central
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Palacio del Marqués → Mercado Central", tramo_id: "TR-16", numero_mapa: "16→17", texto_id: "txt-Av1-TR16-fr", audio_id: "audio-Av1-TR16-fr" },
        // Parada 27: Mercado central (Reto 25)
        { padreid: "padre-P27", tipo: "parada", nombre: "Mercado central", parada_id: "P-27", numero_mapa: 17, texto_id: "txt-Av1-P27-fr", audio_id: "audio-Av1-P27-fr", reto_id: "R25-Av1-fr" },
        // Tramo 17: Mercado Central → Iglesia de los Santos Juanes
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Mercado Central → Iglesia de los Santos Juanes (San Juan del Mercado)", tramo_id: "TR-17", numero_mapa: "17→18", texto_id: "txt-Av1-TR17-fr", audio_id: "audio-Av1-TR17-fr" },
        // Parada 28: Iglesia de los Santos Juanes 1 (Reto 26)
        { padreid: "padre-P28", tipo: "parada", nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)", parada_id: "P-28", numero_mapa: 18, texto_id: "txt-Av1-P28-fr", audio_id: "audio-Av1-P28-fr", reto_id: "R26-Av1-fr" },
        // Parada 29: Iglesia de los Santos Juanes 2 (Reto 27)
        { padreid: "padre-P29", tipo: "parada", nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)", parada_id: "P-29", numero_mapa: 18, texto_id: "txt-Av1-P29-fr", audio_id: "audio-Av1-P29-fr", reto_id: "R27-Av1-fr" },
        // Tramo 18: Iglesia Santos Juanes → Lonja de Valencia
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Iglesia Santos Juanes → Lonja de València (Mercado de la Seda)", tramo_id: "TR-18", numero_mapa: "18→19", texto_id: "txt-Av1-TR18-fr", audio_id: "audio-Av1-TR18-fr" },
        // Parada 30: Lonja historia (Reto 28 Puzzle PZ-04)
        { padreid: "padre-P30", tipo: "parada", nombre: "Lonja Historia", parada_id: "P-30", numero_mapa: 19, texto_id: "txt-Av1-P30-fr", audio_id: "audio-Av1-P30-fr", reto_id: "PZ-04" },
        // Parada 31: Lonja Puerta de Los Pecados 1 (Reto 29)
        { padreid: "padre-P31", tipo: "parada", nombre: "Lonja Puerta de Los Pecados", parada_id: "P-31", numero_mapa: 19, texto_id: "txt-Av1-P31-fr", audio_id: "audio-Av1-P31-fr", reto_id: "R29-Av1-fr" },
        // Parada 32: Lonja Puerta de Los Pecados 2 (Reto 30)
        { padreid: "padre-P32", tipo: "parada", nombre: "Lonja Puerta de Los Pecados 2", parada_id: "P-32", numero_mapa: 19, texto_id: "txt-Av1-P32-fr", audio_id: "audio-Av1-P32-fr", reto_id: "R30-Av1-fr" },
        // Parada 33: Lonja Gárgolas 1 (Reto 31)
        { padreid: "padre-P33", tipo: "parada", nombre: "Lonja (Gárgolas 1)", parada_id: "P-33", numero_mapa: 19, texto_id: "txt-Av1-P33-fr", audio_id: "audio-Av1-P33-fr", reto_id: "R31-Av1-fr" },
        // Parada 34: Lonja Gárgolas 2 (Reto 32)
        { padreid: "padre-P34", tipo: "parada", nombre: "Lonja (Gárgolas 2)", parada_id: "P-34", numero_mapa: 19, texto_id: "txt-Av1-P34-fr", audio_id: "audio-Av1-P34-fr", reto_id: "R32-Av1-fr" },
        // Parada 35: Lonja Fornicador (Reto 33)
        { padreid: "padre-P35", tipo: "parada", nombre: "Lonja (tallado ventana)", parada_id: "P-35", numero_mapa: 19, texto_id: "txt-Av1-P35-fr", audio_id: "audio-Av1-P35-fr", reto_id: "R33-Av1-fr" },
        // Tramo 19: Rodeando la Lonja
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Rodeando la Lonja", tramo_id: "TR-19", numero_mapa: "19→19", texto_id: "txt-Av1-TR19-fr", audio_id: "audio-Av1-TR19-fr" },
        // Parada 36: Lonja Gárgola Torre (sin reto)
        { padreid: "padre-P36", tipo: "parada", nombre: "Lonja (Gárgola Torre)", parada_id: "P-36", numero_mapa: 19, texto_id: "txt-Av1-P36-fr", audio_id: "audio-Av1-P36-fr" },
        // Tramo 20: Lonja Patio de los naranjos → Lonja entrada visitantes
        { padreid: "padre-TR20", tipo: "tramo", nombre: "Lonja Patio de los naranjos → Lonja entrada visitantes", tramo_id: "TR-20", numero_mapa: "19→19", texto_id: "txt-Av1-TR20-fr", audio_id: "audio-Av1-TR20-fr" },
        // Tramo 21: Lonja entrada visitantes → Plaza Doctor López Collado
        { padreid: "padre-TR21", tipo: "tramo", nombre: "Lonja entrada visitantes → Plaza Doctor López Collado", tramo_id: "TR-21", numero_mapa: "19→20", texto_id: "txt-Av1-TR21-fr", audio_id: "audio-Av1-TR21-fr" },
        // Parada 37: Plaza Doctor López Collado (sin reto)
        { padreid: "padre-P37", tipo: "parada", nombre: "Plaza Doctor López Collado", parada_id: "P-37", numero_mapa: 20, texto_id: "txt-Av1-P37-fr", audio_id: "audio-Av1-P37-fr" },
        // Tramo 22: Plaza del Doctor López Collado → Plaza del Negrito
        { padreid: "padre-TR22", tipo: "tramo", nombre: "Plaza del Doctor Collado → Plaza del Negrito (Fuente del Negrito)", tramo_id: "TR-22", numero_mapa: "20→21", texto_id: "txt-Av1-TR22-fr", audio_id: "audio-Av1-TR22-fr" },
        // Parada 38: Fuente del Negrito (Reto 34)
        { padreid: "padre-P38", tipo: "parada", nombre: "Fuente del Negrito", parada_id: "P-38", numero_mapa: 21, texto_id: "txt-Av1-P38-fr", audio_id: "audio-Av1-P38-fr", reto_id: "R34-Av1-fr" },
        // Tramo 23: Plaza del Negrito → Calle Caballeros
        { padreid: "padre-TR23", tipo: "tramo", nombre: "Plaza del Negrito → Calle Caballeros", tramo_id: "TR-23", numero_mapa: "21→22", texto_id: "txt-Av1-TR23-fr", audio_id: "audio-Av1-TR23-fr" },
        // Parada 39: Palau de la Generalitat (sin reto)
        { padreid: "padre-P39", tipo: "parada", nombre: "Palau de la Generalitat", parada_id: "P-39", numero_mapa: 23, texto_id: "txt-Av1-P39-fr", audio_id: "audio-Av1-P39-fr" },
        // Tramo 24: Palacio de la Generalitat → Calle de los Serranos (FINAL)
        { padreid: "padre-TR24", tipo: "tramo", nombre: "Palacio de la Generalitat → Calle de los Serranos (FINAL)", tramo_id: "TR-24", numero_mapa: "23→1", texto_id: "txt-Av1-TR24-fr", audio_id: "audio-Av1-TR24-fr" },
        // Parada 40 - FINAL: Torres de Serranos (Reto 35 Puzzle PZ-05)
        { padreid: "padre-P40", tipo: "parada", nombre: "Torres de Serranos Final", parada_id: "P-40", numero_mapa: 1, texto_id: "txt-Av1-P40-fr", audio_id: "audio-Av1-P40-fr", reto_id: "PZ-05" }
      ]
    },
    it: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
         {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av1-it" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-it", audio_id: "audio-intro-it", reto_id: "R2-Av1-it" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av1-P0-it", audio_id: "audio-Av1-P0-it", reto_id: "R3-Av1-it" },
        // Tramo 1: Torres de Serranos → Plaza de la crida (Puente de Serranos)
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Plaza de la crida (Puente de Serranos)", tramo_id: "TR-1", numero_mapa: "1→1", texto_id: "txt-Av1-TR1-it", audio_id: "audio-Av1-TR1-it" },
        // Parada 1: Plaza de la crída (Puente de Serranos) (Reto 4)
        { padreid: "padre-P1", tipo: "parada", nombre: "Plaza de la crída (Puente de Serranos)", parada_id: "P-1", numero_mapa: 1, texto_id: "txt-Av1-P1-it", audio_id: "audio-Av1-P1-it", reto_id: "R4-Av1-it" },
        // Tramo 2: Plaza de la crída → Calle Muro de Santa Ana
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Plaza de la crída → Calle Muro de Santa Ana", tramo_id: "TR-2", numero_mapa: "1→-", texto_id: "txt-Av1-TR2-it", audio_id: "audio-Av1-TR2-it" },
        // Parada 2: Calle Muro de Santa Ana (Reto 5)
        { padreid: "padre-P2", tipo: "parada", nombre: "Calle Muro de Santa Ana", parada_id: "P-2", numero_mapa: null, texto_id: "txt-Av1-P2-it", audio_id: "audio-Av1-P2-it", reto_id: "R5-Av1-it" },
        // Tramo 3: Calle Muro de Santa Ana → Palacio de los Borgia
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Calle Muro de Santa Ana → Palacio de los Borgia", tramo_id: "TR-3", numero_mapa: "-→2", texto_id: "txt-Av1-TR3-it", audio_id: "audio-Av1-TR3-it" },
        // Parada 3: Iglesia de San Lorenzo (Reto 6)
        { padreid: "padre-P3", tipo: "parada", nombre: "Iglesia de San Lorenzo", parada_id: "P-3", numero_mapa: null, texto_id: "txt-Av1-P3-it", audio_id: "audio-Av1-P3-it", reto_id: "R6-Av1-it" },
        // Tramo 4: Iglesia de San Lorenzo → Plaza de la Virgen
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Iglesia de San Lorenzo → Plaza de la Virgen", tramo_id: "TR-4", numero_mapa: "-→3", texto_id: "txt-Av1-TR4-it", audio_id: "audio-Av1-TR4-it" },
        // Parada 4: Plaza de la Virgen (Reto 7)
        { padreid: "padre-P4", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-4", numero_mapa: 3, texto_id: "txt-Av1-P4-it", audio_id: "audio-Av1-P4-it", reto_id: "R7-Av1-it" },
        // Parada 5: Plaza de la Virgen (Reto 8)
        { padreid: "padre-P5", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-5", numero_mapa: 3, texto_id: "txt-Av1-P5-it", audio_id: "audio-Av1-P5-it", reto_id: "R8-Av1-it" },
        // Parada 6: Plaza de la Virgen (Reto 9 Puzzle PZ-01)
        { padreid: "padre-P6", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-6", numero_mapa: 3, texto_id: "txt-Av1-P6-it", audio_id: "audio-Av1-P6-it", reto_id: "PZ-01" },
        // Tramo 5: Plaza de la Virgen → Plaza Décimo Junio Bruto (Plaza de la Almoína)
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Plaza de la Virgen → Plaza Décimo Junio Bruto (Plaza de la Almoína)", tramo_id: "TR-5", numero_mapa: "3→4", texto_id: "txt-Av1-TR5-it", audio_id: "audio-Av1-TR5-it" },
        // Parada 7: Panel cerámico muro Catedral (Reto 10)
        { padreid: "padre-P7", tipo: "parada", nombre: "Panel cerámico muro Catedral", parada_id: "P-7", numero_mapa: 5, texto_id: "txt-Av1-P7-it", audio_id: "audio-Av1-P7-it", reto_id: "R10-Av1-it" },
        // Parada 8: Capilla exterior catedral (Reto 11)
        { padreid: "padre-P8", tipo: "parada", nombre: "Capilla exterior catedral", parada_id: "P-8", numero_mapa: 5, texto_id: "txt-Av1-P8-it", audio_id: "audio-Av1-P8-it", reto_id: "R11-Av1-it" },
        // Parada 9: Capilla exterior catedral (Reto 12)
        { padreid: "padre-P9", tipo: "parada", nombre: "Capilla exterior catedral", parada_id: "P-9", numero_mapa: 5, texto_id: "txt-Av1-P9-it", audio_id: "audio-Av1-P9-it", reto_id: "R12-Av1-it" },
        // Parada 10: Arco Novo Catedral y Puerta Negra Basílica (sin reto)
        { padreid: "padre-P10", tipo: "parada", nombre: "Arco Novo Catedral y Puerta Negra Basílica", parada_id: "P-10", numero_mapa: "5,9", texto_id: "txt-Av1-P10-it", audio_id: "audio-Av1-P10-it" },
        // Parada 11: Casa del Punt de Gantxo (Reto 13)
        { padreid: "padre-P11", tipo: "parada", nombre: "Casa del Punt de Gantxo", parada_id: "P-11", numero_mapa: null, texto_id: "txt-Av1-P11-it", audio_id: "audio-Av1-P11-it", reto_id: "R13-Av1-it" },
        // Tramo 6: Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico", tramo_id: "TR-6", numero_mapa: "-→6", texto_id: "txt-Av1-TR6-it", audio_id: "audio-Av1-TR6-it" },
        // Parada 12: Museo arqueológico La Almoína (Reto 14)
        { padreid: "padre-P12", tipo: "parada", nombre: "Museo arqueológico La Almoína", parada_id: "P-12", numero_mapa: 6, texto_id: "txt-Av1-P12-it", audio_id: "audio-Av1-P12-it", reto_id: "R14-Av1-it" },
        // Parada 13: Museo arqueológico La Almoína (Reto 15 Puzzle PZ-02)
        { padreid: "padre-P13", tipo: "parada", nombre: "Museo arqueológico La Almoína", parada_id: "P-13", numero_mapa: 6, texto_id: "txt-Av1-P13-it", audio_id: "audio-Av1-P13-it", reto_id: "PZ-02" },
        // Parada 14: Vista de la Catedral, Cimborrio (Reto 16)
        { padreid: "padre-P14", tipo: "parada", nombre: "Vista de la Catedral, Cimborrio", parada_id: "P-14", numero_mapa: 5, texto_id: "txt-Av1-P14-it", audio_id: "audio-Av1-P14-it", reto_id: "R16-Av1-it" },
        // Tramo 7: Museo arqueológico La Almoína → Palacio Arzobispal
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Museo arqueológico La Almoína → Palacio Arzobispal", tramo_id: "TR-7", numero_mapa: "6→8", texto_id: "txt-Av1-TR7-it", audio_id: "audio-Av1-TR7-it" },
        // Parada 15: Palacio Arzobispal y Puerta Románica (Reto 17)
        { padreid: "padre-P15", tipo: "parada", nombre: "Palacio Arzobispal y Puerta Románica de la Catedral", parada_id: "P-15", numero_mapa: 8, texto_id: "txt-Av1-P15-it", audio_id: "audio-Av1-P15-it", reto_id: "R17-Av1-it" },
        // Parada 16: Puerta Románica de la Catedral (sin reto)
        { padreid: "padre-P16", tipo: "parada", nombre: "Puerta Románica de la Catedral", parada_id: "P-16", numero_mapa: 5, texto_id: "txt-Av1-P16-it", audio_id: "audio-Av1-P16-it" },
        // Tramo 8: Puerta Románica de la Catedral → Plaza del Ayuntamiento
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Puerta Románica de la Catedral → Plaza del Ayuntamiento", tramo_id: "TR-8", numero_mapa: "8→9", texto_id: "txt-Av1-TR8-it", audio_id: "audio-Av1-TR8-it" },
        // Parada 17: Plaza del Ayuntamiento (sin reto)
        { padreid: "padre-P17", tipo: "parada", nombre: "Plaza del Ayuntamiento", parada_id: "P-17", numero_mapa: 9, texto_id: "txt-Av1-P17-it", audio_id: "audio-Av1-P17-it" },
        // Tramo 9: Plaza del Ayuntamiento → Edificio del Ayuntamiento
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Plaza del Ayuntamiento → Edificio del Ayuntamiento", tramo_id: "TR-9", numero_mapa: "9→10", texto_id: "txt-Av1-TR9-it", audio_id: "audio-Av1-TR9-it" },
        // Parada 18: Edificio del Ayuntamiento (Reto 18)
        { padreid: "padre-P18", tipo: "parada", nombre: "Edificio del Ayuntamiento", parada_id: "P-18", numero_mapa: 10, texto_id: "txt-Av1-P18-it", audio_id: "audio-Av1-P18-it", reto_id: "R18-Av1-it" },
        // Parada 19: Edificio del Ayuntamiento (segunda parte, sin reto)
        { padreid: "padre-P19", tipo: "parada", nombre: "Edificio del Ayuntamiento", parada_id: "P-19", numero_mapa: 10, texto_id: "txt-Av1-P19-it", audio_id: "audio-Av1-P19-it" },
        // Tramo 10: Edificio del Ayuntamiento → Estación del Norte
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Edificio del Ayuntamiento → Estación del Norte", tramo_id: "TR-10", numero_mapa: "10→11", texto_id: "txt-Av1-TR10-it", audio_id: "audio-Av1-TR10-it" },
        // Parada 20: Estación del Norte (Reto 19)
        { padreid: "padre-P20", tipo: "parada", nombre: "Estación del Norte", parada_id: "P-20", numero_mapa: 11, texto_id: "txt-Av1-P20-it", audio_id: "audio-Av1-P20-it", reto_id: "R19-Av1-it" },
        // Tramo 11: Estación del Norte → Plaza de Toros
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Estación del Norte → Plaza de Toros de València", tramo_id: "TR-11", numero_mapa: "11→12", texto_id: "txt-Av1-TR11-it", audio_id: "audio-Av1-TR11-it" },
        // Parada 21: Plaza de Toros (Reto 20 Puzzle PZ-03)
        { padreid: "padre-P21", tipo: "parada", nombre: "Plaza de Toros", parada_id: "P-21", numero_mapa: 12, texto_id: "txt-Av1-P21-it", audio_id: "audio-Av1-P21-it", reto_id: "PZ-03" },
        // Tramo 12: Plaza de Toros → Casa estilo Árabe
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Plaza de Toros → Casa estilo Árabe", tramo_id: "TR-12", numero_mapa: "12→13", texto_id: "txt-Av1-TR12-it", audio_id: "audio-Av1-TR12-it" },
        // Parada 22: Casa estilo Árabe (mitad Aventura) (Reto 21)
        { padreid: "padre-P22", tipo: "parada", nombre: "Casa estilo Árabe", parada_id: "P-22", numero_mapa: 13, texto_id: "txt-Av1-P22-it", audio_id: "audio-Av1-P22-it", reto_id: "R21-Av1-it" },
        // Tramo 13: Casa estilo Árabe → Palacio de Comunicaciones (Correos)
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Casa estilo Árabe → Palacio de Comunicaciones (Correos)", tramo_id: "TR-13", numero_mapa: "13→14", texto_id: "txt-Av1-TR13-it", audio_id: "audio-Av1-TR13-it" },
        // Parada 23: Palacio de Comunicaciones (Correos) (Reto 22)
        { padreid: "padre-P23", tipo: "parada", nombre: "Palacio de Comunicaciones: Correos", parada_id: "P-23", numero_mapa: 14, texto_id: "txt-Av1-P23-it", audio_id: "audio-Av1-P23-it", reto_id: "R22-Av1-it" },
        // Parada 24: Edificio Suay - La Equitativa (Reto 23)
        { padreid: "padre-P24", tipo: "parada", nombre: "Edificio Suay - La Equitativa", parada_id: "P-24", numero_mapa: null, texto_id: "txt-Av1-P24-it", audio_id: "audio-Av1-P24-it", reto_id: "R23-Av1-it" },
        // Tramo 14: Palacio de Comunicaciones (Correos) → Banco de Valencia
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Palacio de Comunicaciones → Banco de València", tramo_id: "TR-14", numero_mapa: "14→15", texto_id: "txt-Av1-TR14-it", audio_id: "audio-Av1-TR14-it" },
        // Parada 25: Banco de Valencia (Reto 24)
        { padreid: "padre-P25", tipo: "parada", nombre: "Banco de Valencia", parada_id: "P-25", numero_mapa: 15, texto_id: "txt-Av1-P25-it", audio_id: "audio-Av1-P25-it", reto_id: "R24-Av1-it" },
        // Tramo 15: Banco de Valencia → Palacio del Marqués de Dos Aguas
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Banco de València → Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)", tramo_id: "TR-15", numero_mapa: "15→16", texto_id: "txt-Av1-TR15-it", audio_id: "audio-Av1-TR15-it" },
        // Parada 26: Palacio del Marqués de Dos Aguas (sin reto)
        { padreid: "padre-P26", tipo: "parada", nombre: "Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)", parada_id: "P-26", numero_mapa: 16, texto_id: "txt-Av1-P26-it", audio_id: "audio-Av1-P26-it" },
        // Tramo 16: Palacio del Marqués de Dos Aguas → Mercado Central
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Palacio del Marqués → Mercado Central", tramo_id: "TR-16", numero_mapa: "16→17", texto_id: "txt-Av1-TR16-it", audio_id: "audio-Av1-TR16-it" },
        // Parada 27: Mercado central (Reto 25)
        { padreid: "padre-P27", tipo: "parada", nombre: "Mercado central", parada_id: "P-27", numero_mapa: 17, texto_id: "txt-Av1-P27-it", audio_id: "audio-Av1-P27-it", reto_id: "R25-Av1-it" },
        // Tramo 17: Mercado Central → Iglesia de los Santos Juanes
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Mercado Central → Iglesia de los Santos Juanes (San Juan del Mercado)", tramo_id: "TR-17", numero_mapa: "17→18", texto_id: "txt-Av1-TR17-it", audio_id: "audio-Av1-TR17-it" },
        // Parada 28: Iglesia de los Santos Juanes 1 (Reto 26)
        { padreid: "padre-P28", tipo: "parada", nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)", parada_id: "P-28", numero_mapa: 18, texto_id: "txt-Av1-P28-it", audio_id: "audio-Av1-P28-it", reto_id: "R26-Av1-it" },
        // Parada 29: Iglesia de los Santos Juanes 2 (Reto 27)
        { padreid: "padre-P29", tipo: "parada", nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)", parada_id: "P-29", numero_mapa: 18, texto_id: "txt-Av1-P29-it", audio_id: "audio-Av1-P29-it", reto_id: "R27-Av1-it" },
        // Tramo 18: Iglesia Santos Juanes → Lonja de Valencia
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Iglesia Santos Juanes → Lonja de València (Mercado de la Seda)", tramo_id: "TR-18", numero_mapa: "18→19", texto_id: "txt-Av1-TR18-it", audio_id: "audio-Av1-TR18-it" },
        // Parada 30: Lonja historia (Reto 28 Puzzle PZ-04)
        { padreid: "padre-P30", tipo: "parada", nombre: "Lonja Historia", parada_id: "P-30", numero_mapa: 19, texto_id: "txt-Av1-P30-it", audio_id: "audio-Av1-P30-it", reto_id: "PZ-04" },
        // Parada 31: Lonja Puerta de Los Pecados 1 (Reto 29)
        { padreid: "padre-P31", tipo: "parada", nombre: "Lonja Puerta de Los Pecados", parada_id: "P-31", numero_mapa: 19, texto_id: "txt-Av1-P31-it", audio_id: "audio-Av1-P31-it", reto_id: "R29-Av1-it" },
        // Parada 32: Lonja Puerta de Los Pecados 2 (Reto 30)
        { padreid: "padre-P32", tipo: "parada", nombre: "Lonja Puerta de Los Pecados 2", parada_id: "P-32", numero_mapa: 19, texto_id: "txt-Av1-P32-it", audio_id: "audio-Av1-P32-it", reto_id: "R30-Av1-it" },
        // Parada 33: Lonja Gárgolas 1 (Reto 31)
        { padreid: "padre-P33", tipo: "parada", nombre: "Lonja (Gárgolas 1)", parada_id: "P-33", numero_mapa: 19, texto_id: "txt-Av1-P33-it", audio_id: "audio-Av1-P33-it", reto_id: "R31-Av1-it" },
        // Parada 34: Lonja Gárgolas 2 (Reto 32)
        { padreid: "padre-P34", tipo: "parada", nombre: "Lonja (Gárgolas 2)", parada_id: "P-34", numero_mapa: 19, texto_id: "txt-Av1-P34-it", audio_id: "audio-Av1-P34-it", reto_id: "R32-Av1-it" },
        // Parada 35: Lonja Fornicador (Reto 33)
        { padreid: "padre-P35", tipo: "parada", nombre: "Lonja (tallado ventana)", parada_id: "P-35", numero_mapa: 19, texto_id: "txt-Av1-P35-it", audio_id: "audio-Av1-P35-it", reto_id: "R33-Av1-it" },
        // Tramo 19: Rodeando la Lonja
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Rodeando la Lonja", tramo_id: "TR-19", numero_mapa: "19→19", texto_id: "txt-Av1-TR19-it", audio_id: "audio-Av1-TR19-it" },
        // Parada 36: Lonja Gárgola Torre (sin reto)
        { padreid: "padre-P36", tipo: "parada", nombre: "Lonja (Gárgola Torre)", parada_id: "P-36", numero_mapa: 19, texto_id: "txt-Av1-P36-it", audio_id: "audio-Av1-P36-it" },
        // Tramo 20: Lonja Patio de los naranjos → Lonja entrada visitantes
        { padreid: "padre-TR20", tipo: "tramo", nombre: "Lonja Patio de los naranjos → Lonja entrada visitantes", tramo_id: "TR-20", numero_mapa: "19→19", texto_id: "txt-Av1-TR20-it", audio_id: "audio-Av1-TR20-it" },
        // Tramo 21: Lonja entrada visitantes → Plaza Doctor López Collado
        { padreid: "padre-TR21", tipo: "tramo", nombre: "Lonja entrada visitantes → Plaza Doctor López Collado", tramo_id: "TR-21", numero_mapa: "19→20", texto_id: "txt-Av1-TR21-it", audio_id: "audio-Av1-TR21-it" },
        // Parada 37: Plaza Doctor López Collado (sin reto)
        { padreid: "padre-P37", tipo: "parada", nombre: "Plaza Doctor López Collado", parada_id: "P-37", numero_mapa: 20, texto_id: "txt-Av1-P37-it", audio_id: "audio-Av1-P37-it" },
        // Tramo 22: Plaza del Doctor López Collado → Plaza del Negrito
        { padreid: "padre-TR22", tipo: "tramo", nombre: "Plaza del Doctor Collado → Plaza del Negrito (Fuente del Negrito)", tramo_id: "TR-22", numero_mapa: "20→21", texto_id: "txt-Av1-TR22-it", audio_id: "audio-Av1-TR22-it" },
        // Parada 38: Fuente del Negrito (Reto 34)
        { padreid: "padre-P38", tipo: "parada", nombre: "Fuente del Negrito", parada_id: "P-38", numero_mapa: 21, texto_id: "txt-Av1-P38-it", audio_id: "audio-Av1-P38-it", reto_id: "R34-Av1-it" },
        // Tramo 23: Plaza del Negrito → Calle Caballeros
        { padreid: "padre-TR23", tipo: "tramo", nombre: "Plaza del Negrito → Calle Caballeros", tramo_id: "TR-23", numero_mapa: "21→22", texto_id: "txt-Av1-TR23-it", audio_id: "audio-Av1-TR23-it" },
        // Parada 39: Palau de la Generalitat (sin reto)
        { padreid: "padre-P39", tipo: "parada", nombre: "Palau de la Generalitat", parada_id: "P-39", numero_mapa: 23, texto_id: "txt-Av1-P39-it", audio_id: "audio-Av1-P39-it" },
        // Tramo 24: Palacio de la Generalitat → Calle de los Serranos (FINAL)
        { padreid: "padre-TR24", tipo: "tramo", nombre: "Palacio de la Generalitat → Calle de los Serranos (FINAL)", tramo_id: "TR-24", numero_mapa: "23→1", texto_id: "txt-Av1-TR24-it", audio_id: "audio-Av1-TR24-it" },
        // Parada 40 - FINAL: Torres de Serranos (Reto 35 Puzzle PZ-05)
        { padreid: "padre-P40", tipo: "parada", nombre: "Torres de Serranos Final", parada_id: "P-40", numero_mapa: 1, texto_id: "txt-Av1-P40-it", audio_id: "audio-Av1-P40-it", reto_id: "PZ-05" }
      ]
    },
    nl: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
         {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av1-nl" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-nl", audio_id: "audio-intro-nl", reto_id: "R2-Av1-nl" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av1-P0-nl", audio_id: "audio-Av1-P0-nl", reto_id: "R3-Av1-nl" },
        // Tramo 1: Torres de Serranos → Plaza de la crida (Puente de Serranos)
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Plaza de la crida (Puente de Serranos)", tramo_id: "TR-1", numero_mapa: "1→1", texto_id: "txt-Av1-TR1-nl", audio_id: "audio-Av1-TR1-nl" },
        // Parada 1: Plaza de la crída (Puente de Serranos) (Reto 4)
        { padreid: "padre-P1", tipo: "parada", nombre: "Plaza de la crída (Puente de Serranos)", parada_id: "P-1", numero_mapa: 1, texto_id: "txt-Av1-P1-nl", audio_id: "audio-Av1-P1-nl", reto_id: "R4-Av1-nl" },
        // Tramo 2: Plaza de la crída → Calle Muro de Santa Ana
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Plaza de la crída → Calle Muro de Santa Ana", tramo_id: "TR-2", numero_mapa: "1→-", texto_id: "txt-Av1-TR2-nl", audio_id: "audio-Av1-TR2-nl" },
        // Parada 2: Calle Muro de Santa Ana (Reto 5)
        { padreid: "padre-P2", tipo: "parada", nombre: "Calle Muro de Santa Ana", parada_id: "P-2", numero_mapa: null, texto_id: "txt-Av1-P2-nl", audio_id: "audio-Av1-P2-nl", reto_id: "R5-Av1-nl" },
        // Tramo 3: Calle Muro de Santa Ana → Palacio de los Borgia
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Calle Muro de Santa Ana → Palacio de los Borgia", tramo_id: "TR-3", numero_mapa: "-→2", texto_id: "txt-Av1-TR3-nl", audio_id: "audio-Av1-TR3-nl" },
        // Parada 3: Iglesia de San Lorenzo (Reto 6)
        { padreid: "padre-P3", tipo: "parada", nombre: "Iglesia de San Lorenzo", parada_id: "P-3", numero_mapa: null, texto_id: "txt-Av1-P3-nl", audio_id: "audio-Av1-P3-nl", reto_id: "R6-Av1-nl" },
        // Tramo 4: Iglesia de San Lorenzo → Plaza de la Virgen
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Iglesia de San Lorenzo → Plaza de la Virgen", tramo_id: "TR-4", numero_mapa: "-→3", texto_id: "txt-Av1-TR4-nl", audio_id: "audio-Av1-TR4-nl" },
        // Parada 4: Plaza de la Virgen (Reto 7)
        { padreid: "padre-P4", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-4", numero_mapa: 3, texto_id: "txt-Av1-P4-nl", audio_id: "audio-Av1-P4-nl", reto_id: "R7-Av1-nl" },
        // Parada 5: Plaza de la Virgen (Reto 8)
        { padreid: "padre-P5", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-5", numero_mapa: 3, texto_id: "txt-Av1-P5-nl", audio_id: "audio-Av1-P5-nl", reto_id: "R8-Av1-nl" },
        // Parada 6: Plaza de la Virgen (Reto 9 Puzzle PZ-01)
        { padreid: "padre-P6", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-6", numero_mapa: 3, texto_id: "txt-Av1-P6-nl", audio_id: "audio-Av1-P6-nl", reto_id: "PZ-01" },
        // Tramo 5: Plaza de la Virgen → Plaza Décimo Junio Bruto (Plaza de la Almoína)
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Plaza de la Virgen → Plaza Décimo Junio Bruto (Plaza de la Almoína)", tramo_id: "TR-5", numero_mapa: "3→4", texto_id: "txt-Av1-TR5-nl", audio_id: "audio-Av1-TR5-nl" },
        // Parada 7: Panel cerámico muro Catedral (Reto 10)
        { padreid: "padre-P7", tipo: "parada", nombre: "Panel cerámico muro Catedral", parada_id: "P-7", numero_mapa: 5, texto_id: "txt-Av1-P7-nl", audio_id: "audio-Av1-P7-nl", reto_id: "R10-Av1-nl" },
        // Parada 8: Capilla exterior catedral (Reto 11)
        { padreid: "padre-P8", tipo: "parada", nombre: "Capilla exterior catedral", parada_id: "P-8", numero_mapa: 5, texto_id: "txt-Av1-P8-nl", audio_id: "audio-Av1-P8-nl", reto_id: "R11-Av1-nl" },
        // Parada 9: Capilla exterior catedral (Reto 12)
        { padreid: "padre-P9", tipo: "parada", nombre: "Capilla exterior catedral", parada_id: "P-9", numero_mapa: 5, texto_id: "txt-Av1-P9-nl", audio_id: "audio-Av1-P9-nl", reto_id: "R12-Av1-nl" },
        // Parada 10: Arco Novo Catedral y Puerta Negra Basílica (sin reto)
        { padreid: "padre-P10", tipo: "parada", nombre: "Arco Novo Catedral y Puerta Negra Basílica", parada_id: "P-10", numero_mapa: "5,9", texto_id: "txt-Av1-P10-nl", audio_id: "audio-Av1-P10-nl" },
        // Parada 11: Casa del Punt de Gantxo (Reto 13)
        { padreid: "padre-P11", tipo: "parada", nombre: "Casa del Punt de Gantxo", parada_id: "P-11", numero_mapa: null, texto_id: "txt-Av1-P11-nl", audio_id: "audio-Av1-P11-nl", reto_id: "R13-Av1-nl" },
        // Tramo 6: Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico", tramo_id: "TR-6", numero_mapa: "-→6", texto_id: "txt-Av1-TR6-nl", audio_id: "audio-Av1-TR6-nl" },
        // Parada 12: Museo arqueológico La Almoína (Reto 14)
        { padreid: "padre-P12", tipo: "parada", nombre: "Museo arqueológico La Almoína", parada_id: "P-12", numero_mapa: 6, texto_id: "txt-Av1-P12-nl", audio_id: "audio-Av1-P12-nl", reto_id: "R14-Av1-nl" },
        // Parada 13: Museo arqueológico La Almoína (Reto 15 Puzzle PZ-02)
        { padreid: "padre-P13", tipo: "parada", nombre: "Museo arqueológico La Almoína", parada_id: "P-13", numero_mapa: 6, texto_id: "txt-Av1-P13-nl", audio_id: "audio-Av1-P13-nl", reto_id: "PZ-02" },
        // Parada 14: Vista de la Catedral, Cimborrio (Reto 16)
        { padreid: "padre-P14", tipo: "parada", nombre: "Vista de la Catedral, Cimborrio", parada_id: "P-14", numero_mapa: 5, texto_id: "txt-Av1-P14-nl", audio_id: "audio-Av1-P14-nl", reto_id: "R16-Av1-nl" },
        // Tramo 7: Museo arqueológico La Almoína → Palacio Arzobispal
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Museo arqueológico La Almoína → Palacio Arzobispal", tramo_id: "TR-7", numero_mapa: "6→8", texto_id: "txt-Av1-TR7-nl", audio_id: "audio-Av1-TR7-nl" },
        // Parada 15: Palacio Arzobispal y Puerta Románica (Reto 17)
        { padreid: "padre-P15", tipo: "parada", nombre: "Palacio Arzobispal y Puerta Románica de la Catedral", parada_id: "P-15", numero_mapa: 8, texto_id: "txt-Av1-P15-nl", audio_id: "audio-Av1-P15-nl", reto_id: "R17-Av1-nl" },
        // Parada 16: Puerta Románica de la Catedral (sin reto)
        { padreid: "padre-P16", tipo: "parada", nombre: "Puerta Románica de la Catedral", parada_id: "P-16", numero_mapa: 5, texto_id: "txt-Av1-P16-nl", audio_id: "audio-Av1-P16-nl" },
        // Tramo 8: Puerta Románica de la Catedral → Plaza del Ayuntamiento
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Puerta Románica de la Catedral → Plaza del Ayuntamiento", tramo_id: "TR-8", numero_mapa: "8→9", texto_id: "txt-Av1-TR8-nl", audio_id: "audio-Av1-TR8-nl" },
        // Parada 17: Plaza del Ayuntamiento (sin reto)
        { padreid: "padre-P17", tipo: "parada", nombre: "Plaza del Ayuntamiento", parada_id: "P-17", numero_mapa: 9, texto_id: "txt-Av1-P17-nl", audio_id: "audio-Av1-P17-nl" },
        // Tramo 9: Plaza del Ayuntamiento → Edificio del Ayuntamiento
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Plaza del Ayuntamiento → Edificio del Ayuntamiento", tramo_id: "TR-9", numero_mapa: "9→10", texto_id: "txt-Av1-TR9-nl", audio_id: "audio-Av1-TR9-nl" },
        // Parada 18: Edificio del Ayuntamiento (Reto 18)
        { padreid: "padre-P18", tipo: "parada", nombre: "Edificio del Ayuntamiento", parada_id: "P-18", numero_mapa: 10, texto_id: "txt-Av1-P18-nl", audio_id: "audio-Av1-P18-nl", reto_id: "R18-Av1-nl" },
        // Parada 19: Edificio del Ayuntamiento (segunda parte, sin reto)
        { padreid: "padre-P19", tipo: "parada", nombre: "Edificio del Ayuntamiento", parada_id: "P-19", numero_mapa: 10, texto_id: "txt-Av1-P19-nl", audio_id: "audio-Av1-P19-nl" },
        // Tramo 10: Edificio del Ayuntamiento → Estación del Norte
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Edificio del Ayuntamiento → Estación del Norte", tramo_id: "TR-10", numero_mapa: "10→11", texto_id: "txt-Av1-TR10-nl", audio_id: "audio-Av1-TR10-nl" },
        // Parada 20: Estación del Norte (Reto 19)
        { padreid: "padre-P20", tipo: "parada", nombre: "Estación del Norte", parada_id: "P-20", numero_mapa: 11, texto_id: "txt-Av1-P20-nl", audio_id: "audio-Av1-P20-nl", reto_id: "R19-Av1-nl" },
        // Tramo 11: Estación del Norte → Plaza de Toros
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Estación del Norte → Plaza de Toros de València", tramo_id: "TR-11", numero_mapa: "11→12", texto_id: "txt-Av1-TR11-nl", audio_id: "audio-Av1-TR11-nl" },
        // Parada 21: Plaza de Toros (Reto 20 Puzzle PZ-03)
        { padreid: "padre-P21", tipo: "parada", nombre: "Plaza de Toros", parada_id: "P-21", numero_mapa: 12, texto_id: "txt-Av1-P21-nl", audio_id: "audio-Av1-P21-nl", reto_id: "PZ-03" },
        // Tramo 12: Plaza de Toros → Casa estilo Árabe
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Plaza de Toros → Casa estilo Árabe", tramo_id: "TR-12", numero_mapa: "12→13", texto_id: "txt-Av1-TR12-nl", audio_id: "audio-Av1-TR12-nl" },
        // Parada 22: Casa estilo Árabe (mitad Aventura) (Reto 21)
        { padreid: "padre-P22", tipo: "parada", nombre: "Casa estilo Árabe", parada_id: "P-22", numero_mapa: 13, texto_id: "txt-Av1-P22-nl", audio_id: "audio-Av1-P22-nl", reto_id: "R21-Av1-nl" },
        // Tramo 13: Casa estilo Árabe → Palacio de Comunicaciones (Correos)
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Casa estilo Árabe → Palacio de Comunicaciones (Correos)", tramo_id: "TR-13", numero_mapa: "13→14", texto_id: "txt-Av1-TR13-nl", audio_id: "audio-Av1-TR13-nl" },
        // Parada 23: Palacio de Comunicaciones (Correos) (Reto 22)
        { padreid: "padre-P23", tipo: "parada", nombre: "Palacio de Comunicaciones: Correos", parada_id: "P-23", numero_mapa: 14, texto_id: "txt-Av1-P23-nl", audio_id: "audio-Av1-P23-nl", reto_id: "R22-Av1-nl" },
        // Parada 24: Edificio Suay - La Equitativa (Reto 23)
        { padreid: "padre-P24", tipo: "parada", nombre: "Edificio Suay - La Equitativa", parada_id: "P-24", numero_mapa: null, texto_id: "txt-Av1-P24-nl", audio_id: "audio-Av1-P24-nl", reto_id: "R23-Av1-nl" },
        // Tramo 14: Palacio de Comunicaciones (Correos) → Banco de Valencia
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Palacio de Comunicaciones → Banco de València", tramo_id: "TR-14", numero_mapa: "14→15", texto_id: "txt-Av1-TR14-nl", audio_id: "audio-Av1-TR14-nl" },
        // Parada 25: Banco de Valencia (Reto 24)
        { padreid: "padre-P25", tipo: "parada", nombre: "Banco de Valencia", parada_id: "P-25", numero_mapa: 15, texto_id: "txt-Av1-P25-nl", audio_id: "audio-Av1-P25-nl", reto_id: "R24-Av1-nl" },
        // Tramo 15: Banco de Valencia → Palacio del Marqués de Dos Aguas
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Banco de València → Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)", tramo_id: "TR-15", numero_mapa: "15→16", texto_id: "txt-Av1-TR15-nl", audio_id: "audio-Av1-TR15-nl" },
        // Parada 26: Palacio del Marqués de Dos Aguas (sin reto)
        { padreid: "padre-P26", tipo: "parada", nombre: "Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)", parada_id: "P-26", numero_mapa: 16, texto_id: "txt-Av1-P26-nl", audio_id: "audio-Av1-P26-nl" },
        // Tramo 16: Palacio del Marqués de Dos Aguas → Mercado Central
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Palacio del Marqués → Mercado Central", tramo_id: "TR-16", numero_mapa: "16→17", texto_id: "txt-Av1-TR16-nl", audio_id: "audio-Av1-TR16-nl" },
        // Parada 27: Mercado central (Reto 25)
        { padreid: "padre-P27", tipo: "parada", nombre: "Mercado central", parada_id: "P-27", numero_mapa: 17, texto_id: "txt-Av1-P27-nl", audio_id: "audio-Av1-P27-nl", reto_id: "R25-Av1-nl" },
        // Tramo 17: Mercado Central → Iglesia de los Santos Juanes
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Mercado Central → Iglesia de los Santos Juanes (San Juan del Mercado)", tramo_id: "TR-17", numero_mapa: "17→18", texto_id: "txt-Av1-TR17-nl", audio_id: "audio-Av1-TR17-nl" },
        // Parada 28: Iglesia de los Santos Juanes 1 (Reto 26)
        { padreid: "padre-P28", tipo: "parada", nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)", parada_id: "P-28", numero_mapa: 18, texto_id: "txt-Av1-P28-nl", audio_id: "audio-Av1-P28-nl", reto_id: "R26-Av1-nl" },
        // Parada 29: Iglesia de los Santos Juanes 2 (Reto 27)
        { padreid: "padre-P29", tipo: "parada", nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)", parada_id: "P-29", numero_mapa: 18, texto_id: "txt-Av1-P29-nl", audio_id: "audio-Av1-P29-nl", reto_id: "R27-Av1-nl" },
        // Tramo 18: Iglesia Santos Juanes → Lonja de Valencia
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Iglesia Santos Juanes → Lonja de València (Mercado de la Seda)", tramo_id: "TR-18", numero_mapa: "18→19", texto_id: "txt-Av1-TR18-nl", audio_id: "audio-Av1-TR18-nl" },
        // Parada 30: Lonja historia (Reto 28 Puzzle PZ-04)
        { padreid: "padre-P30", tipo: "parada", nombre: "Lonja Historia", parada_id: "P-30", numero_mapa: 19, texto_id: "txt-Av1-P30-nl", audio_id: "audio-Av1-P30-nl", reto_id: "PZ-04" },
        // Parada 31: Lonja Puerta de Los Pecados 1 (Reto 29)
        { padreid: "padre-P31", tipo: "parada", nombre: "Lonja Puerta de Los Pecados", parada_id: "P-31", numero_mapa: 19, texto_id: "txt-Av1-P31-nl", audio_id: "audio-Av1-P31-nl", reto_id: "R29-Av1-nl" },
        // Parada 32: Lonja Puerta de Los Pecados 2 (Reto 30)
        { padreid: "padre-P32", tipo: "parada", nombre: "Lonja Puerta de Los Pecados 2", parada_id: "P-32", numero_mapa: 19, texto_id: "txt-Av1-P32-nl", audio_id: "audio-Av1-P32-nl", reto_id: "R30-Av1-nl" },
        // Parada 33: Lonja Gárgolas 1 (Reto 31)
        { padreid: "padre-P33", tipo: "parada", nombre: "Lonja (Gárgolas 1)", parada_id: "P-33", numero_mapa: 19, texto_id: "txt-Av1-P33-nl", audio_id: "audio-Av1-P33-nl", reto_id: "R31-Av1-nl" },
        // Parada 34: Lonja Gárgolas 2 (Reto 32)
        { padreid: "padre-P34", tipo: "parada", nombre: "Lonja (Gárgolas 2)", parada_id: "P-34", numero_mapa: 19, texto_id: "txt-Av1-P34-nl", audio_id: "audio-Av1-P34-nl", reto_id: "R32-Av1-nl" },
        // Parada 35: Lonja Fornicador (Reto 33)
        { padreid: "padre-P35", tipo: "parada", nombre: "Lonja (tallado ventana)", parada_id: "P-35", numero_mapa: 19, texto_id: "txt-Av1-P35-nl", audio_id: "audio-Av1-P35-nl", reto_id: "R33-Av1-nl" },
        // Tramo 19: Rodeando la Lonja
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Rodeando la Lonja", tramo_id: "TR-19", numero_mapa: "19→19", texto_id: "txt-Av1-TR19-nl", audio_id: "audio-Av1-TR19-nl" },
        // Parada 36: Lonja Gárgola Torre (sin reto)
        { padreid: "padre-P36", tipo: "parada", nombre: "Lonja (Gárgola Torre)", parada_id: "P-36", numero_mapa: 19, texto_id: "txt-Av1-P36-nl", audio_id: "audio-Av1-P36-nl" },
        // Tramo 20: Lonja Patio de los naranjos → Lonja entrada visitantes
        { padreid: "padre-TR20", tipo: "tramo", nombre: "Lonja Patio de los naranjos → Lonja entrada visitantes", tramo_id: "TR-20", numero_mapa: "19→19", texto_id: "txt-Av1-TR20-nl", audio_id: "audio-Av1-TR20-nl" },
        // Tramo 21: Lonja entrada visitantes → Plaza Doctor López Collado
        { padreid: "padre-TR21", tipo: "tramo", nombre: "Lonja entrada visitantes → Plaza Doctor López Collado", tramo_id: "TR-21", numero_mapa: "19→20", texto_id: "txt-Av1-TR21-nl", audio_id: "audio-Av1-TR21-nl" },
        // Parada 37: Plaza Doctor López Collado (sin reto)
        { padreid: "padre-P37", tipo: "parada", nombre: "Plaza Doctor López Collado", parada_id: "P-37", numero_mapa: 20, texto_id: "txt-Av1-P37-nl", audio_id: "audio-Av1-P37-nl" },
        // Tramo 22: Plaza del Doctor López Collado → Plaza del Negrito
        { padreid: "padre-TR22", tipo: "tramo", nombre: "Plaza del Doctor Collado → Plaza del Negrito (Fuente del Negrito)", tramo_id: "TR-22", numero_mapa: "20→21", texto_id: "txt-Av1-TR22-nl", audio_id: "audio-Av1-TR22-nl" },
        // Parada 38: Fuente del Negrito (Reto 34)
        { padreid: "padre-P38", tipo: "parada", nombre: "Fuente del Negrito", parada_id: "P-38", numero_mapa: 21, texto_id: "txt-Av1-P38-nl", audio_id: "audio-Av1-P38-nl", reto_id: "R34-Av1-nl" },
        // Tramo 23: Plaza del Negrito → Calle Caballeros
        { padreid: "padre-TR23", tipo: "tramo", nombre: "Plaza del Negrito → Calle Caballeros", tramo_id: "TR-23", numero_mapa: "21→22", texto_id: "txt-Av1-TR23-nl", audio_id: "audio-Av1-TR23-nl" },
        // Parada 39: Palau de la Generalitat (sin reto)
        { padreid: "padre-P39", tipo: "parada", nombre: "Palau de la Generalitat", parada_id: "P-39", numero_mapa: 23, texto_id: "txt-Av1-P39-nl", audio_id: "audio-Av1-P39-nl" },
        // Tramo 24: Palacio de la Generalitat → Calle de los Serranos (FINAL)
        { padreid: "padre-TR24", tipo: "tramo", nombre: "Palacio de la Generalitat → Calle de los Serranos (FINAL)", tramo_id: "TR-24", numero_mapa: "23→1", texto_id: "txt-Av1-TR24-nl", audio_id: "audio-Av1-TR24-nl" },
        // Parada 40 - FINAL: Torres de Serranos (Reto 35 Puzzle PZ-05)
        { padreid: "padre-P40", tipo: "parada", nombre: "Torres de Serranos Final", parada_id: "P-40", numero_mapa: 1, texto_id: "txt-Av1-P40-nl", audio_id: "audio-Av1-P40-nl", reto_id: "PZ-05" }
      ]
    },
    ja: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
         {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av1-ja" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-ja", audio_id: "audio-intro-ja", reto_id: "R2-Av1-ja" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av1-P0-ja", audio_id: "audio-Av1-P0-ja", reto_id: "R3-Av1-ja" },
        // Tramo 1: Torres de Serranos → Plaza de la crida (Puente de Serranos)
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Plaza de la crida (Puente de Serranos)", tramo_id: "TR-1", numero_mapa: "1→1", texto_id: "txt-Av1-TR1-ja", audio_id: "audio-Av1-TR1-ja" },
        // Parada 1: Plaza de la crída (Puente de Serranos) (Reto 4)
        { padreid: "padre-P1", tipo: "parada", nombre: "Plaza de la crída (Puente de Serranos)", parada_id: "P-1", numero_mapa: 1, texto_id: "txt-Av1-P1-ja", audio_id: "audio-Av1-P1-ja", reto_id: "R4-Av1-ja" },
        // Tramo 2: Plaza de la crída → Calle Muro de Santa Ana
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Plaza de la crída → Calle Muro de Santa Ana", tramo_id: "TR-2", numero_mapa: "1→-", texto_id: "txt-Av1-TR2-ja", audio_id: "audio-Av1-TR2-ja" },
        // Parada 2: Calle Muro de Santa Ana (Reto 5)
        { padreid: "padre-P2", tipo: "parada", nombre: "Calle Muro de Santa Ana", parada_id: "P-2", numero_mapa: null, texto_id: "txt-Av1-P2-ja", audio_id: "audio-Av1-P2-ja", reto_id: "R5-Av1-ja" },
        // Tramo 3: Calle Muro de Santa Ana → Palacio de los Borgia
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Calle Muro de Santa Ana → Palacio de los Borgia", tramo_id: "TR-3", numero_mapa: "-→2", texto_id: "txt-Av1-TR3-ja", audio_id: "audio-Av1-TR3-ja" },
        // Parada 3: Iglesia de San Lorenzo (Reto 6)
        { padreid: "padre-P3", tipo: "parada", nombre: "Iglesia de San Lorenzo", parada_id: "P-3", numero_mapa: null, texto_id: "txt-Av1-P3-ja", audio_id: "audio-Av1-P3-ja", reto_id: "R6-Av1-ja" },
        // Tramo 4: Iglesia de San Lorenzo → Plaza de la Virgen
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Iglesia de San Lorenzo → Plaza de la Virgen", tramo_id: "TR-4", numero_mapa: "-→3", texto_id: "txt-Av1-TR4-ja", audio_id: "audio-Av1-TR4-ja" },
        // Parada 4: Plaza de la Virgen (Reto 7)
        { padreid: "padre-P4", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-4", numero_mapa: 3, texto_id: "txt-Av1-P4-ja", audio_id: "audio-Av1-P4-ja", reto_id: "R7-Av1-ja" },
        // Parada 5: Plaza de la Virgen (Reto 8)
        { padreid: "padre-P5", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-5", numero_mapa: 3, texto_id: "txt-Av1-P5-ja", audio_id: "audio-Av1-P5-ja", reto_id: "R8-Av1-ja" },
        // Parada 6: Plaza de la Virgen (Reto 9 Puzzle PZ-01)
        { padreid: "padre-P6", tipo: "parada", nombre: "Plaza de la Virgen", parada_id: "P-6", numero_mapa: 3, texto_id: "txt-Av1-P6-ja", audio_id: "audio-Av1-P6-ja", reto_id: "PZ-01" },
        // Tramo 5: Plaza de la Virgen → Plaza Décimo Junio Bruto (Plaza de la Almoína)
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Plaza de la Virgen → Plaza Décimo Junio Bruto (Plaza de la Almoína)", tramo_id: "TR-5", numero_mapa: "3→4", texto_id: "txt-Av1-TR5-ja", audio_id: "audio-Av1-TR5-ja" },
        // Parada 7: Panel cerámico muro Catedral (Reto 10)
        { padreid: "padre-P7", tipo: "parada", nombre: "Panel cerámico muro Catedral", parada_id: "P-7", numero_mapa: 5, texto_id: "txt-Av1-P7-ja", audio_id: "audio-Av1-P7-ja", reto_id: "R10-Av1-ja" },
        // Parada 8: Capilla exterior catedral (Reto 11)
        { padreid: "padre-P8", tipo: "parada", nombre: "Capilla exterior catedral", parada_id: "P-8", numero_mapa: 5, texto_id: "txt-Av1-P8-ja", audio_id: "audio-Av1-P8-ja", reto_id: "R11-Av1-ja" },
        // Parada 9: Capilla exterior catedral (Reto 12)
        { padreid: "padre-P9", tipo: "parada", nombre: "Capilla exterior catedral", parada_id: "P-9", numero_mapa: 5, texto_id: "txt-Av1-P9-ja", audio_id: "audio-Av1-P9-ja", reto_id: "R12-Av1-ja" },
        // Parada 10: Arco Novo Catedral y Puerta Negra Basílica (sin reto)
        { padreid: "padre-P10", tipo: "parada", nombre: "Arco Novo Catedral y Puerta Negra Basílica", parada_id: "P-10", numero_mapa: "5,9", texto_id: "txt-Av1-P10-ja", audio_id: "audio-Av1-P10-ja" },
        // Parada 11: Casa del Punt de Gantxo (Reto 13)
        { padreid: "padre-P11", tipo: "parada", nombre: "Casa del Punt de Gantxo", parada_id: "P-11", numero_mapa: null, texto_id: "txt-Av1-P11-ja", audio_id: "audio-Av1-P11-ja", reto_id: "R13-Av1-ja" },
        // Tramo 6: Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico", tramo_id: "TR-6", numero_mapa: "-→6", texto_id: "txt-Av1-TR6-ja", audio_id: "audio-Av1-TR6-ja" },
        // Parada 12: Museo arqueológico La Almoína (Reto 14)
        { padreid: "padre-P12", tipo: "parada", nombre: "Museo arqueológico La Almoína", parada_id: "P-12", numero_mapa: 6, texto_id: "txt-Av1-P12-ja", audio_id: "audio-Av1-P12-ja", reto_id: "R14-Av1-ja" },
        // Parada 13: Museo arqueológico La Almoína (Reto 15 Puzzle PZ-02)
        { padreid: "padre-P13", tipo: "parada", nombre: "Museo arqueológico La Almoína", parada_id: "P-13", numero_mapa: 6, texto_id: "txt-Av1-P13-ja", audio_id: "audio-Av1-P13-ja", reto_id: "PZ-02" },
        // Parada 14: Vista de la Catedral, Cimborrio (Reto 16)
        { padreid: "padre-P14", tipo: "parada", nombre: "Vista de la Catedral, Cimborrio", parada_id: "P-14", numero_mapa: 5, texto_id: "txt-Av1-P14-ja", audio_id: "audio-Av1-P14-ja", reto_id: "R16-Av1-ja" },
        // Tramo 7: Museo arqueológico La Almoína → Palacio Arzobispal
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Museo arqueológico La Almoína → Palacio Arzobispal", tramo_id: "TR-7", numero_mapa: "6→8", texto_id: "txt-Av1-TR7-ja", audio_id: "audio-Av1-TR7-ja" },
        // Parada 15: Palacio Arzobispal y Puerta Románica (Reto 17)
        { padreid: "padre-P15", tipo: "parada", nombre: "Palacio Arzobispal y Puerta Románica de la Catedral", parada_id: "P-15", numero_mapa: 8, texto_id: "txt-Av1-P15-ja", audio_id: "audio-Av1-P15-ja", reto_id: "R17-Av1-ja" },
        // Parada 16: Puerta Románica de la Catedral (sin reto)
        { padreid: "padre-P16", tipo: "parada", nombre: "Puerta Románica de la Catedral", parada_id: "P-16", numero_mapa: 5, texto_id: "txt-Av1-P16-ja", audio_id: "audio-Av1-P16-ja" },
        // Tramo 8: Puerta Románica de la Catedral → Plaza del Ayuntamiento
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Puerta Románica de la Catedral → Plaza del Ayuntamiento", tramo_id: "TR-8", numero_mapa: "8→9", texto_id: "txt-Av1-TR8-ja", audio_id: "audio-Av1-TR8-ja" },
        // Parada 17: Plaza del Ayuntamiento (sin reto)
        { padreid: "padre-P17", tipo: "parada", nombre: "Plaza del Ayuntamiento", parada_id: "P-17", numero_mapa: 9, texto_id: "txt-Av1-P17-ja", audio_id: "audio-Av1-P17-ja" },
        // Tramo 9: Plaza del Ayuntamiento → Edificio del Ayuntamiento
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Plaza del Ayuntamiento → Edificio del Ayuntamiento", tramo_id: "TR-9", numero_mapa: "9→10", texto_id: "txt-Av1-TR9-ja", audio_id: "audio-Av1-TR9-ja" },
        // Parada 18: Edificio del Ayuntamiento (Reto 18)
        { padreid: "padre-P18", tipo: "parada", nombre: "Edificio del Ayuntamiento", parada_id: "P-18", numero_mapa: 10, texto_id: "txt-Av1-P18-ja", audio_id: "audio-Av1-P18-ja", reto_id: "R18-Av1-ja" },
        // Parada 19: Edificio del Ayuntamiento (segunda parte, sin reto)
        { padreid: "padre-P19", tipo: "parada", nombre: "Edificio del Ayuntamiento", parada_id: "P-19", numero_mapa: 10, texto_id: "txt-Av1-P19-ja", audio_id: "audio-Av1-P19-ja" },
        // Tramo 10: Edificio del Ayuntamiento → Estación del Norte
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Edificio del Ayuntamiento → Estación del Norte", tramo_id: "TR-10", numero_mapa: "10→11", texto_id: "txt-Av1-TR10-ja", audio_id: "audio-Av1-TR10-ja" },
        // Parada 20: Estación del Norte (Reto 19)
        { padreid: "padre-P20", tipo: "parada", nombre: "Estación del Norte", parada_id: "P-20", numero_mapa: 11, texto_id: "txt-Av1-P20-ja", audio_id: "audio-Av1-P20-ja", reto_id: "R19-Av1-ja" },
        // Tramo 11: Estación del Norte → Plaza de Toros
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Estación del Norte → Plaza de Toros de València", tramo_id: "TR-11", numero_mapa: "11→12", texto_id: "txt-Av1-TR11-ja", audio_id: "audio-Av1-TR11-ja" },
        // Parada 21: Plaza de Toros (Reto 20 Puzzle PZ-03)
        { padreid: "padre-P21", tipo: "parada", nombre: "Plaza de Toros", parada_id: "P-21", numero_mapa: 12, texto_id: "txt-Av1-P21-ja", audio_id: "audio-Av1-P21-ja", reto_id: "PZ-03" },
        // Tramo 12: Plaza de Toros → Casa estilo Árabe
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Plaza de Toros → Casa estilo Árabe", tramo_id: "TR-12", numero_mapa: "12→13", texto_id: "txt-Av1-TR12-ja", audio_id: "audio-Av1-TR12-ja" },
        // Parada 22: Casa estilo Árabe (mitad Aventura) (Reto 21)
        { padreid: "padre-P22", tipo: "parada", nombre: "Casa estilo Árabe", parada_id: "P-22", numero_mapa: 13, texto_id: "txt-Av1-P22-ja", audio_id: "audio-Av1-P22-ja", reto_id: "R21-Av1-ja" },
        // Tramo 13: Casa estilo Árabe → Palacio de Comunicaciones (Correos)
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Casa estilo Árabe → Palacio de Comunicaciones (Correos)", tramo_id: "TR-13", numero_mapa: "13→14", texto_id: "txt-Av1-TR13-ja", audio_id: "audio-Av1-TR13-ja" },
        // Parada 23: Palacio de Comunicaciones (Correos) (Reto 22)
        { padreid: "padre-P23", tipo: "parada", nombre: "Palacio de Comunicaciones: Correos", parada_id: "P-23", numero_mapa: 14, texto_id: "txt-Av1-P23-ja", audio_id: "audio-Av1-P23-ja", reto_id: "R22-Av1-ja" },
        // Parada 24: Edificio Suay - La Equitativa (Reto 23)
        { padreid: "padre-P24", tipo: "parada", nombre: "Edificio Suay - La Equitativa", parada_id: "P-24", numero_mapa: null, texto_id: "txt-Av1-P24-ja", audio_id: "audio-Av1-P24-ja", reto_id: "R23-Av1-ja" },
        // Tramo 14: Palacio de Comunicaciones (Correos) → Banco de Valencia
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Palacio de Comunicaciones → Banco de València", tramo_id: "TR-14", numero_mapa: "14→15", texto_id: "txt-Av1-TR14-ja", audio_id: "audio-Av1-TR14-ja" },
        // Parada 25: Banco de Valencia (Reto 24)
        { padreid: "padre-P25", tipo: "parada", nombre: "Banco de Valencia", parada_id: "P-25", numero_mapa: 15, texto_id: "txt-Av1-P25-ja", audio_id: "audio-Av1-P25-ja", reto_id: "R24-Av1-ja" },
        // Tramo 15: Banco de Valencia → Palacio del Marqués de Dos Aguas
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Banco de València → Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)", tramo_id: "TR-15", numero_mapa: "15→16", texto_id: "txt-Av1-TR15-ja", audio_id: "audio-Av1-TR15-ja" },
        // Parada 26: Palacio del Marqués de Dos Aguas (sin reto)
        { padreid: "padre-P26", tipo: "parada", nombre: "Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)", parada_id: "P-26", numero_mapa: 16, texto_id: "txt-Av1-P26-ja", audio_id: "audio-Av1-P26-ja" },
        // Tramo 16: Palacio del Marqués de Dos Aguas → Mercado Central
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Palacio del Marqués → Mercado Central", tramo_id: "TR-16", numero_mapa: "16→17", texto_id: "txt-Av1-TR16-ja", audio_id: "audio-Av1-TR16-ja" },
        // Parada 27: Mercado central (Reto 25)
        { padreid: "padre-P27", tipo: "parada", nombre: "Mercado central", parada_id: "P-27", numero_mapa: 17, texto_id: "txt-Av1-P27-ja", audio_id: "audio-Av1-P27-ja", reto_id: "R25-Av1-ja" },
        // Tramo 17: Mercado Central → Iglesia de los Santos Juanes
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Mercado Central → Iglesia de los Santos Juanes (San Juan del Mercado)", tramo_id: "TR-17", numero_mapa: "17→18", texto_id: "txt-Av1-TR17-ja", audio_id: "audio-Av1-TR17-ja" },
        // Parada 28: Iglesia de los Santos Juanes 1 (Reto 26)
        { padreid: "padre-P28", tipo: "parada", nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)", parada_id: "P-28", numero_mapa: 18, texto_id: "txt-Av1-P28-ja", audio_id: "audio-Av1-P28-ja", reto_id: "R26-Av1-ja" },
        // Parada 29: Iglesia de los Santos Juanes 2 (Reto 27)
        { padreid: "padre-P29", tipo: "parada", nombre: "Iglesia de los Santos Juanes (San Juan del Mercado)", parada_id: "P-29", numero_mapa: 18, texto_id: "txt-Av1-P29-ja", audio_id: "audio-Av1-P29-ja", reto_id: "R27-Av1-ja" },
        // Tramo 18: Iglesia Santos Juanes → Lonja de Valencia
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Iglesia Santos Juanes → Lonja de València (Mercado de la Seda)", tramo_id: "TR-18", numero_mapa: "18→19", texto_id: "txt-Av1-TR18-ja", audio_id: "audio-Av1-TR18-ja" },
        // Parada 30: Lonja historia (Reto 28 Puzzle PZ-04)
        { padreid: "padre-P30", tipo: "parada", nombre: "Lonja Historia", parada_id: "P-30", numero_mapa: 19, texto_id: "txt-Av1-P30-ja", audio_id: "audio-Av1-P30-ja", reto_id: "PZ-04" },
        // Parada 31: Lonja Puerta de Los Pecados 1 (Reto 29)
        { padreid: "padre-P31", tipo: "parada", nombre: "Lonja Puerta de Los Pecados", parada_id: "P-31", numero_mapa: 19, texto_id: "txt-Av1-P31-ja", audio_id: "audio-Av1-P31-ja", reto_id: "R29-Av1-ja" },
        // Parada 32: Lonja Puerta de Los Pecados 2 (Reto 30)
        { padreid: "padre-P32", tipo: "parada", nombre: "Lonja Puerta de Los Pecados 2", parada_id: "P-32", numero_mapa: 19, texto_id: "txt-Av1-P32-ja", audio_id: "audio-Av1-P32-ja", reto_id: "R30-Av1-ja" },
        // Parada 33: Lonja Gárgolas 1 (Reto 31)
        { padreid: "padre-P33", tipo: "parada", nombre: "Lonja (Gárgolas 1)", parada_id: "P-33", numero_mapa: 19, texto_id: "txt-Av1-P33-ja", audio_id: "audio-Av1-P33-ja", reto_id: "R31-Av1-ja" },
        // Parada 34: Lonja Gárgolas 2 (Reto 32)
        { padreid: "padre-P34", tipo: "parada", nombre: "Lonja (Gárgolas 2)", parada_id: "P-34", numero_mapa: 19, texto_id: "txt-Av1-P34-ja", audio_id: "audio-Av1-P34-ja", reto_id: "R32-Av1-ja" },
        // Parada 35: Lonja Fornicador (Reto 33)
        { padreid: "padre-P35", tipo: "parada", nombre: "Lonja (tallado ventana)", parada_id: "P-35", numero_mapa: 19, texto_id: "txt-Av1-P35-ja", audio_id: "audio-Av1-P35-ja", reto_id: "R33-Av1-ja" },
        // Tramo 19: Rodeando la Lonja
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Rodeando la Lonja", tramo_id: "TR-19", numero_mapa: "19→19", texto_id: "txt-Av1-TR19-ja", audio_id: "audio-Av1-TR19-ja" },
        // Parada 36: Lonja Gárgola Torre (sin reto)
        { padreid: "padre-P36", tipo: "parada", nombre: "Lonja (Gárgola Torre)", parada_id: "P-36", numero_mapa: 19, texto_id: "txt-Av1-P36-ja", audio_id: "audio-Av1-P36-ja" },
        // Tramo 20: Lonja Patio de los naranjos → Lonja entrada visitantes
        { padreid: "padre-TR20", tipo: "tramo", nombre: "Lonja Patio de los naranjos → Lonja entrada visitantes", tramo_id: "TR-20", numero_mapa: "19→19", texto_id: "txt-Av1-TR20-ja", audio_id: "audio-Av1-TR20-ja" },
        // Tramo 21: Lonja entrada visitantes → Plaza Doctor López Collado
        { padreid: "padre-TR21", tipo: "tramo", nombre: "Lonja entrada visitantes → Plaza Doctor López Collado", tramo_id: "TR-21", numero_mapa: "19→20", texto_id: "txt-Av1-TR21-ja", audio_id: "audio-Av1-TR21-ja" },
        // Parada 37: Plaza Doctor López Collado (sin reto)
        { padreid: "padre-P37", tipo: "parada", nombre: "Plaza Doctor López Collado", parada_id: "P-37", numero_mapa: 20, texto_id: "txt-Av1-P37-ja", audio_id: "audio-Av1-P37-ja" },
        // Tramo 22: Plaza del Doctor López Collado → Plaza del Negrito
        { padreid: "padre-TR22", tipo: "tramo", nombre: "Plaza del Doctor Collado → Plaza del Negrito (Fuente del Negrito)", tramo_id: "TR-22", numero_mapa: "20→21", texto_id: "txt-Av1-TR22-ja", audio_id: "audio-Av1-TR22-ja" },
        // Parada 38: Fuente del Negrito (Reto 34)
        { padreid: "padre-P38", tipo: "parada", nombre: "Fuente del Negrito", parada_id: "P-38", numero_mapa: 21, texto_id: "txt-Av1-P38-ja", audio_id: "audio-Av1-P38-ja", reto_id: "R34-Av1-ja" },
        // Tramo 23: Plaza del Negrito → Calle Caballeros
        { padreid: "padre-TR23", tipo: "tramo", nombre: "Plaza del Negrito → Calle Caballeros", tramo_id: "TR-23", numero_mapa: "21→22", texto_id: "txt-Av1-TR23-ja", audio_id: "audio-Av1-TR23-ja" },
        // Parada 39: Palau de la Generalitat (sin reto)
        { padreid: "padre-P39", tipo: "parada", nombre: "Palau de la Generalitat", parada_id: "P-39", numero_mapa: 23, texto_id: "txt-Av1-P39-ja", audio_id: "audio-Av1-P39-ja" },
        // Tramo 24: Palacio de la Generalitat → Calle de los Serranos (FINAL)
        { padreid: "padre-TR24", tipo: "tramo", nombre: "Palacio de la Generalitat → Calle de los Serranos (FINAL)", tramo_id: "TR-24", numero_mapa: "23→1", texto_id: "txt-Av1-TR24-ja", audio_id: "audio-Av1-TR24-ja" },
        // Parada 40 - FINAL: Torres de Serranos (Reto 35 Puzzle PZ-05)
        { padreid: "padre-P40", tipo: "parada", nombre: "Torres de Serranos Final", parada_id: "P-40", numero_mapa: 1, texto_id: "txt-Av1-P40-ja", audio_id: "audio-Av1-P40-ja", reto_id: "PZ-05" }
      ]
    }
  },

  Aventura2: {
    es: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
        {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av2-es" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-es", audio_id: "audio-intro-es", reto_id: "R2-Av2-es" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av2-P0-es", audio_id: "audio-Av2-P0-es", reto_id: "R3-Av2-es" },
        // Parada 1 - Torres de Serranos (Historia de la bandera) (Reto 4 - Reto de la Bandera)
        { padreid: "padre-P1", tipo: "parada", nombre: "Torres de Serranos (Historia de la bandera)", parada_id: "P-1", numero_mapa: 1, texto_id: "txt-Av2-P1-es", audio_id: "audio-Av2-P1-es", reto_id: "R4-Av2-es" },
        // Parada 2 - Torres de Serranos (Historia de la bandera) (sin reto)
        { padreid: "padre-P2", tipo: "parada", nombre: "Torres de Serranos (Historia de la bandera)", parada_id: "P-2", numero_mapa: 1, texto_id: "txt-Av2-P2-es", audio_id: "audio-Av2-P2-es" },
        // Tramo 1: Torres de Serranos → Refugio Guerra Civil
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Refugio Guerra Civil", tramo_id: "TR-1", numero_mapa: "1→2", texto_id: "txt-Av2-TR1-es", audio_id: "audio-Av2-TR1-es" },
        // Parada 3 - Refugio Guerra Civil (sin reto)
        { padreid: "padre-P3", tipo: "parada", nombre: "Refugio Guerra Civil", parada_id: "P-3", numero_mapa: 2, texto_id: "txt-Av2-P3-es", audio_id: "audio-Av2-P3-es" },
        // Tramo 2: Refugio Guerra Civil → Palau de la Generalitat
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Refugio Guerra Civil → Palau de la Generalitat", tramo_id: "TR-2", numero_mapa: "2→3", texto_id: "txt-Av2-TR2-es", audio_id: "audio-Av2-TR2-es" },
        // Parada 4 - Palau de la Generalitat (sin reto)
        { padreid: "padre-P4", tipo: "parada", nombre: "Palau de la Generalitat", parada_id: "P-4", numero_mapa: 3, texto_id: "txt-Av2-P4-es", audio_id: "audio-Av2-P4-es" },
        // Tramo 3: Palau de la Generalitat → Calle Caballeros
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Palau de la Generalitat → Calle Caballeros", tramo_id: "TR-3", numero_mapa: "3→4", texto_id: "txt-Av2-TR3-es", audio_id: "audio-Av2-TR3-es" },
        // Tramo 4: Calle Caballeros → Iglesia de San Nicolás
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Calle Caballeros → Iglesia de San Nicolás", tramo_id: "TR-4", numero_mapa: "4→5", texto_id: "txt-Av2-TR4-es", audio_id: "audio-Av2-TR4-es" },
        // Parada 5 - Iglesia de San Nicolás FRONT (Reto 5 Puzzle PZ-06)
        { padreid: "padre-P5", tipo: "parada", nombre: "Iglesia de San Nicolás FRONT", parada_id: "P-5", numero_mapa: 5, texto_id: "txt-Av2-P5-es", audio_id: "audio-Av2-P5-es", reto_id: "PZ-06" },
        // Tramo 5: Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK", tramo_id: "TR-5", numero_mapa: "5→6", texto_id: "txt-Av2-TR5-es", audio_id: "audio-Av2-TR5-es" },
        // Parada 6 - Iglesia de San Nicolás BACK (Reto 6)
        { padreid: "padre-P6", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-6", numero_mapa: 6, texto_id: "txt-Av2-P6-es", audio_id: "audio-Av2-P6-es", reto_id: "R6-Av2-es" },
        // Parada 7 - Iglesia de San Nicolás BACK (Reto 7)
        { padreid: "padre-P7", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-7", numero_mapa: 6, texto_id: "txt-Av2-P7-es", audio_id: "audio-Av2-P7-es", reto_id: "R7-Av2-es" },
        // Parada 8 - Iglesia de San Nicolás BACK (Reto 8)
        { padreid: "padre-P8", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-8", numero_mapa: 6, texto_id: "txt-Av2-P8-es", audio_id: "audio-Av2-P8-es", reto_id: "R8-Av2-es" },
        // Tramo 6: Iglesia de San Nicolás BACK → Plaza del Negrito
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Iglesia de San Nicolás BACK → Plaza del Negrito", tramo_id: "TR-6", numero_mapa: "6→7", texto_id: "txt-Av2-TR6-es", audio_id: "audio-Av2-TR6-es" },
        // Parada 9 - Plaza del Negrito (Reto 9)
        { padreid: "padre-P9", tipo: "parada", nombre: "Plaza del Negrito", parada_id: "P-9", numero_mapa: 7, texto_id: "txt-Av2-P9-es", audio_id: "audio-Av2-P9-es", reto_id: "R9-Av2-es" },
        // Tramo 7: Plaza del Negrito → Calle Caballeros → Plaza del Tossal
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Plaza del Negrito → Calle Caballeros → Plaza del Tossal", tramo_id: "TR-7", numero_mapa: "7→4→8", texto_id: "txt-Av2-TR7-es", audio_id: "audio-Av2-TR7-es" },
        // Parada 10 - Plaza del Tossal (Reto 10)
        { padreid: "padre-P10", tipo: "parada", nombre: "Plaza del Tossal", parada_id: "P-10", numero_mapa: 8, texto_id: "txt-Av2-P10-es", audio_id: "audio-Av2-P10-es", reto_id: "R10-Av2-es" },
        // Parada 11 - Plaza del Tossal (sin reto)
        { padreid: "padre-P11", tipo: "parada", nombre: "Plaza del Tossal", parada_id: "P-11", numero_mapa: 8, texto_id: "txt-Av2-P11-es", audio_id: "audio-Av2-P11-es" },
        // Tramo 8: Plaza del Tossal → Portal de la Valldigna
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Plaza del Tossal → Portal de la Valldigna", tramo_id: "TR-8", numero_mapa: "8→9", texto_id: "txt-Av2-TR8-es", audio_id: "audio-Av2-TR8-es" },
        // Parada 12 - Portal de la Valldigna (sin reto)
        { padreid: "padre-P12", tipo: "parada", nombre: "Portal de la Valldigna", parada_id: "P-12", numero_mapa: 9, texto_id: "txt-Av2-P12-es", audio_id: "audio-Av2-P12-es" },
        // Tramo 9: Portal de la Valldigna → Torre del Ángel (Torre árabe)
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Portal de la Valldigna → Torre del Ángel (Torre árabe)", tramo_id: "TR-9", numero_mapa: "9→10", texto_id: "txt-Av2-TR9-es", audio_id: "audio-Av2-TR9-es" },
        // Parada 13 - Torre del Ángel (Torre árabe) (Reto 11)
        { padreid: "padre-P13", tipo: "parada", nombre: "Torre del Ángel (Torre árabe)", parada_id: "P-13", numero_mapa: 10, texto_id: "txt-Av2-P13-es", audio_id: "audio-Av2-P13-es", reto_id: "R11-Av2-es" },
        // Tramo 10: Torre del Ángel (Torre árabe) → Plaza de la Virgen
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Torre del Ángel (Torre árabe) → Plaza de la Virgen", tramo_id: "TR-10", numero_mapa: "10→11", texto_id: "txt-Av2-TR10-es", audio_id: "audio-Av2-TR10-es" },
        // Parada 14 - Plaza de la Virgen - Introducción (Reto 12 Puzzle PZ-01)
        { padreid: "padre-P14", tipo: "parada", nombre: "Plaza de la Virgen - Introducción", parada_id: "P-14", numero_mapa: 11, texto_id: "txt-Av2-P14-es", audio_id: "audio-Av2-P14-es", reto_id: "PZ-01" },
        // Parada 15 - Plaza de la Virgen - Fuente Neptuno (Reto 13)
        { padreid: "padre-P15", tipo: "parada", nombre: "Plaza de la Virgen - Fuente Neptuno", parada_id: "P-15", numero_mapa: 11, texto_id: "txt-Av2-P15-es", audio_id: "audio-Av2-P15-es", reto_id: "R13-Av2-es" },
        // Parada 16 - Plaza de la Virgen - Ofrenda (Reto 14)
        { padreid: "padre-P16", tipo: "parada", nombre: "Plaza de la Virgen - Ofrenda", parada_id: "P-16", numero_mapa: 11, texto_id: "txt-Av2-P16-es", audio_id: "audio-Av2-P16-es", reto_id: "R14-Av2-es" },
        // Parada 17 - Plaza de la Virgen - Basílica (sin reto)
        { padreid: "padre-P17", tipo: "parada", nombre: "Plaza de la Virgen - Basílica", parada_id: "P-17", numero_mapa: 11, texto_id: "txt-Av2-P17-es", audio_id: "audio-Av2-P17-es" },
        // Parada 18 - Plaza de la Virgen - Cimborrio Catedral de Valencia (Reto 15)
        { padreid: "padre-P18", tipo: "parada", nombre: "Plaza de la Virgen - Cimborrio Catedral de Valencia", parada_id: "P-18", numero_mapa: 11, texto_id: "txt-Av2-P18-es", audio_id: "audio-Av2-P18-es", reto_id: "R15-Av2-es" },
        // Parada 19 - Plaza de la Virgen - Historia de la Catedral de Valencia (sin reto)
        { padreid: "padre-P19", tipo: "parada", nombre: "Plaza de la Virgen - Historia de la Catedral de Valencia", parada_id: "P-19", numero_mapa: 11, texto_id: "txt-Av2-P19-es", audio_id: "audio-Av2-P19-es" },
        // Tramo 11: Plaza de la Virgen → Puerta Gótica de la Catedral de Valencia
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Plaza de la Virgen → Puerta Gótica de la Catedral de Valencia", tramo_id: "TR-11", numero_mapa: "11→-", texto_id: "txt-Av2-TR11-es", audio_id: "audio-Av2-TR11-es" },
        // Tramo 12: Puerta Gótica Catedral → Torre del Miguelete y Puerta de los Hierros (Barroca)
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Puerta Gótica de la Catedral de Valencia → Torre del Miguelete y Puerta de los Hierros (Barroca)", tramo_id: "TR-12", numero_mapa: "-→12→13", texto_id: "txt-Av2-TR12-es", audio_id: "audio-Av2-TR12-es" },
        // Parada 20 - Torre del Miguelete (Reto 16)
        { padreid: "padre-P20", tipo: "parada", nombre: "Torre del Miguelete", parada_id: "P-20", numero_mapa: 12, texto_id: "txt-Av2-P20-es", audio_id: "audio-Av2-P20-es", reto_id: "R16-Av2-es" },
        // Parada 21 - Torre del Miguelete 2 (Reto 17)
        { padreid: "padre-P21", tipo: "parada", nombre: "Torre del Miguelete 2", parada_id: "P-21", numero_mapa: 12, texto_id: "txt-Av2-P21-es", audio_id: "audio-Av2-P21-es", reto_id: "R17-Av2-es" },
        // Parada 22 - Puerta de los Hierros (Barroca) de la Catedral de Valencia (Reto 18)
        { padreid: "padre-P22", tipo: "parada", nombre: "Puerta de los Hierros (Barroca) de la Catedral de Valencia", parada_id: "P-22", numero_mapa: 13, texto_id: "txt-Av2-P22-es", audio_id: "audio-Av2-P22-es", reto_id: "R18-Av2-es" },
        // Tramo 13: Puerta de los Hierros (Barroca) → Torre Barroca de Santa Catalina
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Puerta de los Hierros (Barroca) → Torre Barroca de Santa Catalina", tramo_id: "TR-13", numero_mapa: "13→14", texto_id: "txt-Av2-TR13-es", audio_id: "audio-Av2-TR13-es" },
        // Parada 23 - Torre Barroca de Santa Catalina (Reto 19)
        { padreid: "padre-P23", tipo: "parada", nombre: "Torre Barroca de Santa Catalina", parada_id: "P-23", numero_mapa: 14, texto_id: "txt-Av2-P23-es", audio_id: "audio-Av2-P23-es", reto_id: "R19-Av2-es" },
        // Parada 24 - Torre Barroca de Santa Catalina 2 (Reto 20)
        { padreid: "padre-P24", tipo: "parada", nombre: "Torre Barroca de Santa Catalina 2", parada_id: "P-24", numero_mapa: 14, texto_id: "txt-Av2-P24-es", audio_id: "audio-Av2-P24-es", reto_id: "R20-Av2-es" },
        // Tramo 14: Torre Barroca de la Iglesia de Santa Catalina → Plaza Lope de Vega
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Torre Barroca de la Iglesia de Santa Catalina → Plaza Lope de Vega", tramo_id: "TR-14", numero_mapa: "14→15", texto_id: "txt-Av2-TR14-es", audio_id: "audio-Av2-TR14-es" },
        // Parada 25 - Plaza Lope de Vega - Iglesia de Santa Catalina (sin reto)
        { padreid: "padre-P25", tipo: "parada", nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina", parada_id: "P-25", numero_mapa: 15, texto_id: "txt-Av2-P25-es", audio_id: "audio-Av2-P25-es" },
        // Parada 26 - Plaza Lope de Vega - Iglesia de Santa Catalina 2 (Reto 21)
        { padreid: "padre-P26", tipo: "parada", nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina 2", parada_id: "P-26", numero_mapa: 15, texto_id: "txt-Av2-P26-es", audio_id: "audio-Av2-P26-es", reto_id: "R21-Av2-es" },
        // Parada 27 - Plaza Lope de Vega - Edificio estrecho (Reto 22)
        { padreid: "padre-P27", tipo: "parada", nombre: "Plaza Lope de Vega - Edificio estrecho", parada_id: "P-27", numero_mapa: 15, texto_id: "txt-Av2-P27-es", audio_id: "audio-Av2-P27-es", reto_id: "R22-Av2-es" },
        // Parada 28 - Plaza Redonda (Reto 23 Puzzle PZ-07)
        { padreid: "padre-P28", tipo: "parada", nombre: "Plaza Redonda", parada_id: "P-28", numero_mapa: 16, texto_id: "txt-Av2-P28-es", audio_id: "audio-Av2-P28-es", reto_id: "PZ-07" },
        // Tramo 16: Plaza Redonda → Plaza Milagro del Mocaoret
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Plaza Redonda → Plaza Milagro del Mocaoret", tramo_id: "TR-16", numero_mapa: "16→17", texto_id: "txt-Av2-TR16-es", audio_id: "audio-Av2-TR16-es" },
        // Tramo 15: Plaza Lope de Vega → Plaza Redonda
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Plaza Lope de Vega → Plaza Redonda", tramo_id: "TR-15", numero_mapa: "15→16", texto_id: "txt-Av2-TR15-es", audio_id: "audio-Av2-TR15-es" },
        // Parada 29 - Plaza Milagro del Mocaoret (sin reto)
        { padreid: "padre-P29", tipo: "parada", nombre: "Plaza Milagro del Mocaoret", parada_id: "P-29", numero_mapa: 17, texto_id: "txt-Av2-P29-es", audio_id: "audio-Av2-P29-es" },
        // Tramo 17: Plaza Milagro del Mocaoret → Tapinería
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Plaza Milagro del Mocaoret → Tapinería", tramo_id: "TR-17", numero_mapa: "17→-", texto_id: "txt-Av2-TR17-es", audio_id: "audio-Av2-TR17-es" },
        // Tramo 18: Tapinería → Palau de la Generalitat
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Tapinería → Palau de la Generalitat", tramo_id: "TR-18", numero_mapa: "-→3", texto_id: "txt-Av2-TR18-es", audio_id: "audio-Av2-TR18-es" },
        // Tramo 19: Palau de la Generalitat → Torres de Serranos - Final
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Palau de la Generalitat → Torres de Serranos - Final", tramo_id: "TR-19", numero_mapa: "3→1", texto_id: "txt-Av2-TR19-es", audio_id: "audio-Av2-TR19-es" },
        // Parada 30 - FINAL: Torres de Serranos - Final (Reto 24 Puzzle PZ-05)
        { padreid: "padre-P30", tipo: "parada", nombre: "Torres de Serranos - Final", parada_id: "P-30", numero_mapa: 1, texto_id: "txt-Av2-P30-es", audio_id: "audio-Av2-P30-es", reto_id: "PZ-05" }
      ]
    },
    en: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
         {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av2-en" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-en", audio_id: "audio-intro-en", reto_id: "R2-Av2-en" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av2-P0-en", audio_id: "audio-Av2-P0-en", reto_id: "R3-Av2-en" },
        // Parada 1 - Torres de Serranos (Historia de la bandera) (Reto 4 - Reto de la Bandera)
        { padreid: "padre-P1", tipo: "parada", nombre: "Torres de Serranos (Historia de la bandera)", parada_id: "P-1", numero_mapa: 1, texto_id: "txt-Av2-P1-en", audio_id: "audio-Av2-P1-en", reto_id: "R4-Av2-en" },
        // Parada 2 - Torres de Serranos (Historia de la bandera) (sin reto)
        { padreid: "padre-P2", tipo: "parada", nombre: "Torres de Serranos (Historia de la bandera)", parada_id: "P-2", numero_mapa: 1, texto_id: "txt-Av2-P2-en", audio_id: "audio-Av2-P2-en" },
        // Tramo 1: Torres de Serranos → Refugio Guerra Civil
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Refugio Guerra Civil", tramo_id: "TR-1", numero_mapa: "1→2", texto_id: "txt-Av2-TR1-en", audio_id: "audio-Av2-TR1-en" },
        // Parada 3 - Refugio Guerra Civil (sin reto)
        { padreid: "padre-P3", tipo: "parada", nombre: "Refugio Guerra Civil", parada_id: "P-3", numero_mapa: 2, texto_id: "txt-Av2-P3-en", audio_id: "audio-Av2-P3-en" },
        // Tramo 2: Refugio Guerra Civil → Palau de la Generalitat
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Refugio Guerra Civil → Palau de la Generalitat", tramo_id: "TR-2", numero_mapa: "2→3", texto_id: "txt-Av2-TR2-en", audio_id: "audio-Av2-TR2-en" },
        // Parada 4 - Palau de la Generalitat (sin reto)
        { padreid: "padre-P4", tipo: "parada", nombre: "Palau de la Generalitat", parada_id: "P-4", numero_mapa: 3, texto_id: "txt-Av2-P4-en", audio_id: "audio-Av2-P4-en" },
        // Tramo 3: Palau de la Generalitat → Calle Caballeros
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Palau de la Generalitat → Calle Caballeros", tramo_id: "TR-3", numero_mapa: "3→4", texto_id: "txt-Av2-TR3-en", audio_id: "audio-Av2-TR3-en" },
        // Tramo 4: Calle Caballeros → Iglesia de San Nicolás
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Calle Caballeros → Iglesia de San Nicolás", tramo_id: "TR-4", numero_mapa: "4→5", texto_id: "txt-Av2-TR4-en", audio_id: "audio-Av2-TR4-en" },
        // Parada 5 - Iglesia de San Nicolás FRONT (Reto 5 Puzzle PZ-06)
        { padreid: "padre-P5", tipo: "parada", nombre: "Iglesia de San Nicolás FRONT", parada_id: "P-5", numero_mapa: 5, texto_id: "txt-Av2-P5-en", audio_id: "audio-Av2-P5-en", reto_id: "PZ-06" },
        // Tramo 5: Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK", tramo_id: "TR-5", numero_mapa: "5→6", texto_id: "txt-Av2-TR5-en", audio_id: "audio-Av2-TR5-en" },
        // Parada 6 - Iglesia de San Nicolás BACK (Reto 6)
        { padreid: "padre-P6", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-6", numero_mapa: 6, texto_id: "txt-Av2-P6-en", audio_id: "audio-Av2-P6-en", reto_id: "R6-Av2-en" },
        // Parada 7 - Iglesia de San Nicolás BACK (Reto 7)
        { padreid: "padre-P7", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-7", numero_mapa: 6, texto_id: "txt-Av2-P7-en", audio_id: "audio-Av2-P7-en", reto_id: "R7-Av2-en" },
        // Parada 8 - Iglesia de San Nicolás BACK (Reto 8)
        { padreid: "padre-P8", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-8", numero_mapa: 6, texto_id: "txt-Av2-P8-en", audio_id: "audio-Av2-P8-en", reto_id: "R8-Av2-en" },
        // Tramo 6: Iglesia de San Nicolás BACK → Plaza del Negrito
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Iglesia de San Nicolás BACK → Plaza del Negrito", tramo_id: "TR-6", numero_mapa: "6→7", texto_id: "txt-Av2-TR6-en", audio_id: "audio-Av2-TR6-en" },
        // Parada 9 - Plaza del Negrito (Reto 9)
        { padreid: "padre-P9", tipo: "parada", nombre: "Plaza del Negrito", parada_id: "P-9", numero_mapa: 7, texto_id: "txt-Av2-P9-en", audio_id: "audio-Av2-P9-en", reto_id: "R9-Av2-en" },
        // Tramo 7: Plaza del Negrito → Calle Caballeros → Plaza del Tossal
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Plaza del Negrito → Calle Caballeros → Plaza del Tossal", tramo_id: "TR-7", numero_mapa: "7→4→8", texto_id: "txt-Av2-TR7-en", audio_id: "audio-Av2-TR7-en" },
        // Parada 10 - Plaza del Tossal (Reto 10)
        { padreid: "padre-P10", tipo: "parada", nombre: "Plaza del Tossal", parada_id: "P-10", numero_mapa: 8, texto_id: "txt-Av2-P10-en", audio_id: "audio-Av2-P10-en", reto_id: "R10-Av2-en" },
        // Parada 11 - Plaza del Tossal (sin reto)
        { padreid: "padre-P11", tipo: "parada", nombre: "Plaza del Tossal", parada_id: "P-11", numero_mapa: 8, texto_id: "txt-Av2-P11-en", audio_id: "audio-Av2-P11-en" },
        // Tramo 8: Plaza del Tossal → Portal de la Valldigna
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Plaza del Tossal → Portal de la Valldigna", tramo_id: "TR-8", numero_mapa: "8→9", texto_id: "txt-Av2-TR8-en", audio_id: "audio-Av2-TR8-en" },
        // Parada 12 - Portal de la Valldigna (sin reto)
        { padreid: "padre-P12", tipo: "parada", nombre: "Portal de la Valldigna", parada_id: "P-12", numero_mapa: 9, texto_id: "txt-Av2-P12-en", audio_id: "audio-Av2-P12-en" },
        // Tramo 9: Portal de la Valldigna → Torre del Ángel (Torre árabe)
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Portal de la Valldigna → Torre del Ángel (Torre árabe)", tramo_id: "TR-9", numero_mapa: "9→10", texto_id: "txt-Av2-TR9-en", audio_id: "audio-Av2-TR9-en" },
        // Parada 13 - Torre del Ángel (Torre árabe) (Reto 11)
        { padreid: "padre-P13", tipo: "parada", nombre: "Torre del Ángel (Torre árabe)", parada_id: "P-13", numero_mapa: 10, texto_id: "txt-Av2-P13-en", audio_id: "audio-Av2-P13-en", reto_id: "R11-Av2-en" },
        // Tramo 10: Torre del Ángel (Torre árabe) → Plaza de la Virgen
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Torre del Ángel (Torre árabe) → Plaza de la Virgen", tramo_id: "TR-10", numero_mapa: "10→11", texto_id: "txt-Av2-TR10-en", audio_id: "audio-Av2-TR10-en" },
        // Parada 14 - Plaza de la Virgen - Introducción (Reto 12 Puzzle PZ-01)
        { padreid: "padre-P14", tipo: "parada", nombre: "Plaza de la Virgen - Introducción", parada_id: "P-14", numero_mapa: 11, texto_id: "txt-Av2-P14-en", audio_id: "audio-Av2-P14-en", reto_id: "PZ-01" },
        // Parada 15 - Plaza de la Virgen - Fuente Neptuno (Reto 13)
        { padreid: "padre-P15", tipo: "parada", nombre: "Plaza de la Virgen - Fuente Neptuno", parada_id: "P-15", numero_mapa: 11, texto_id: "txt-Av2-P15-en", audio_id: "audio-Av2-P15-en", reto_id: "R13-Av2-en" },
        // Parada 16 - Plaza de la Virgen - Ofrenda (Reto 14)
        { padreid: "padre-P16", tipo: "parada", nombre: "Plaza de la Virgen - Ofrenda", parada_id: "P-16", numero_mapa: 11, texto_id: "txt-Av2-P16-en", audio_id: "audio-Av2-P16-en", reto_id: "R14-Av2-en" },
        // Parada 17 - Plaza de la Virgen - Basílica (sin reto)
        { padreid: "padre-P17", tipo: "parada", nombre: "Plaza de la Virgen - Basílica", parada_id: "P-17", numero_mapa: 11, texto_id: "txt-Av2-P17-en", audio_id: "audio-Av2-P17-en" },
        // Parada 18 - Plaza de la Virgen - Cimborrio Catedral de Valencia (Reto 15)
        { padreid: "padre-P18", tipo: "parada", nombre: "Plaza de la Virgen - Cimborrio Catedral de Valencia", parada_id: "P-18", numero_mapa: 11, texto_id: "txt-Av2-P18-en", audio_id: "audio-Av2-P18-en", reto_id: "R15-Av2-en" },
        // Parada 19 - Plaza de la Virgen - Historia de la Catedral de Valencia (sin reto)
        { padreid: "padre-P19", tipo: "parada", nombre: "Plaza de la Virgen - Historia de la Catedral de Valencia", parada_id: "P-19", numero_mapa: 11, texto_id: "txt-Av2-P19-en", audio_id: "audio-Av2-P19-en" },
        // Tramo 11: Plaza de la Virgen → Puerta Gótica de la Catedral de Valencia
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Plaza de la Virgen → Puerta Gótica de la Catedral de Valencia", tramo_id: "TR-11", numero_mapa: "11→-", texto_id: "txt-Av2-TR11-en", audio_id: "audio-Av2-TR11-en" },
        // Tramo 12: Puerta Gótica Catedral → Torre del Miguelete y Puerta de los Hierros (Barroca)
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Puerta Gótica de la Catedral de Valencia → Torre del Miguelete y Puerta de los Hierros (Barroca)", tramo_id: "TR-12", numero_mapa: "-→12→13", texto_id: "txt-Av2-TR12-en", audio_id: "audio-Av2-TR12-en" },
        // Parada 20 - Torre del Miguelete (Reto 16)
        { padreid: "padre-P20", tipo: "parada", nombre: "Torre del Miguelete", parada_id: "P-20", numero_mapa: 12, texto_id: "txt-Av2-P20-en", audio_id: "audio-Av2-P20-en", reto_id: "R16-Av2-en" },
        // Parada 21 - Torre del Miguelete 2 (Reto 17)
        { padreid: "padre-P21", tipo: "parada", nombre: "Torre del Miguelete 2", parada_id: "P-21", numero_mapa: 12, texto_id: "txt-Av2-P21-en", audio_id: "audio-Av2-P21-en", reto_id: "R17-Av2-en" },
        // Parada 22 - Puerta de los Hierros (Barroca) de la Catedral de Valencia (Reto 18)
        { padreid: "padre-P22", tipo: "parada", nombre: "Puerta de los Hierros (Barroca) de la Catedral de Valencia", parada_id: "P-22", numero_mapa: 13, texto_id: "txt-Av2-P22-en", audio_id: "audio-Av2-P22-en", reto_id: "R18-Av2-en" },
        // Tramo 13: Puerta de los Hierros (Barroca) → Torre Barroca de Santa Catalina
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Puerta de los Hierros (Barroca) → Torre Barroca de Santa Catalina", tramo_id: "TR-13", numero_mapa: "13→14", texto_id: "txt-Av2-TR13-en", audio_id: "audio-Av2-TR13-en" },
        // Parada 23 - Torre Barroca de Santa Catalina (Reto 19)
        { padreid: "padre-P23", tipo: "parada", nombre: "Torre Barroca de Santa Catalina", parada_id: "P-23", numero_mapa: 14, texto_id: "txt-Av2-P23-en", audio_id: "audio-Av2-P23-en", reto_id: "R19-Av2-en" },
        // Parada 24 - Torre Barroca de Santa Catalina 2 (Reto 20)
        { padreid: "padre-P24", tipo: "parada", nombre: "Torre Barroca de Santa Catalina 2", parada_id: "P-24", numero_mapa: 14, texto_id: "txt-Av2-P24-en", audio_id: "audio-Av2-P24-en", reto_id: "R20-Av2-en" },
        // Tramo 14: Torre Barroca de la Iglesia de Santa Catalina → Plaza Lope de Vega
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Torre Barroca de la Iglesia de Santa Catalina → Plaza Lope de Vega", tramo_id: "TR-14", numero_mapa: "14→15", texto_id: "txt-Av2-TR14-en", audio_id: "audio-Av2-TR14-en" },
        // Parada 25 - Plaza Lope de Vega - Iglesia de Santa Catalina (sin reto)
        { padreid: "padre-P25", tipo: "parada", nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina", parada_id: "P-25", numero_mapa: 15, texto_id: "txt-Av2-P25-en", audio_id: "audio-Av2-P25-en" },
        // Parada 26 - Plaza Lope de Vega - Iglesia de Santa Catalina 2 (Reto 21)
        { padreid: "padre-P26", tipo: "parada", nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina 2", parada_id: "P-26", numero_mapa: 15, texto_id: "txt-Av2-P26-en", audio_id: "audio-Av2-P26-en", reto_id: "R21-Av2-en" },
        // Parada 27 - Plaza Lope de Vega - Edificio estrecho (Reto 22)
        { padreid: "padre-P27", tipo: "parada", nombre: "Plaza Lope de Vega - Edificio estrecho", parada_id: "P-27", numero_mapa: 15, texto_id: "txt-Av2-P27-en", audio_id: "audio-Av2-P27-en", reto_id: "R22-Av2-en" },
        // Parada 28 - Plaza Redonda (Reto 23 Puzzle PZ-07)
        { padreid: "padre-P28", tipo: "parada", nombre: "Plaza Redonda", parada_id: "P-28", numero_mapa: 16, texto_id: "txt-Av2-P28-en", audio_id: "audio-Av2-P28-en", reto_id: "PZ-07" },
        // Tramo 16: Plaza Redonda → Plaza Milagro del Mocaoret
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Plaza Redonda → Plaza Milagro del Mocaoret", tramo_id: "TR-16", numero_mapa: "16→17", texto_id: "txt-Av2-TR16-en", audio_id: "audio-Av2-TR16-en" },
        // Tramo 15: Plaza Lope de Vega → Plaza Redonda
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Plaza Lope de Vega → Plaza Redonda", tramo_id: "TR-15", numero_mapa: "15→16", texto_id: "txt-Av2-TR15-en", audio_id: "audio-Av2-TR15-en" },
        // Parada 29 - Plaza Milagro del Mocaoret (sin reto)
        { padreid: "padre-P29", tipo: "parada", nombre: "Plaza Milagro del Mocaoret", parada_id: "P-29", numero_mapa: 17, texto_id: "txt-Av2-P29-en", audio_id: "audio-Av2-P29-en" },
        // Tramo 17: Plaza Milagro del Mocaoret → Tapinería
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Plaza Milagro del Mocaoret → Tapinería", tramo_id: "TR-17", numero_mapa: "17→-", texto_id: "txt-Av2-TR17-en", audio_id: "audio-Av2-TR17-en" },
        // Tramo 18: Tapinería → Palau de la Generalitat
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Tapinería → Palau de la Generalitat", tramo_id: "TR-18", numero_mapa: "-→3", texto_id: "txt-Av2-TR18-en", audio_id: "audio-Av2-TR18-en" },
        // Tramo 19: Palau de la Generalitat → Torres de Serranos - Final
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Palau de la Generalitat → Torres de Serranos - Final", tramo_id: "TR-19", numero_mapa: "3→1", texto_id: "txt-Av2-TR19-en", audio_id: "audio-Av2-TR19-en" },
        // Parada 30 - FINAL: Torres de Serranos - Final (Reto 24 Puzzle PZ-05)
        { padreid: "padre-P30", tipo: "parada", nombre: "Torres de Serranos - Final", parada_id: "P-30", numero_mapa: 1, texto_id: "txt-Av2-P30-en", audio_id: "audio-Av2-P30-en", reto_id: "PZ-05" }
      ]
    },
    fr: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
         {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av2-fr" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-fr", audio_id: "audio-intro-fr", reto_id: "R2-Av2-fr" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av2-P0-fr", audio_id: "audio-Av2-P0-fr", reto_id: "R3-Av2-fr" },
        // Parada 1 - Torres de Serranos (Historia de la bandera) (Reto 4 - Reto de la Bandera)
        { padreid: "padre-P1", tipo: "parada", nombre: "Torres de Serranos (Historia de la bandera)", parada_id: "P-1", numero_mapa: 1, texto_id: "txt-Av2-P1-fr", audio_id: "audio-Av2-P1-fr", reto_id: "R4-Av2-fr" },
        // Parada 2 - Torres de Serranos (Historia de la bandera) (sin reto)
        { padreid: "padre-P2", tipo: "parada", nombre: "Torres de Serranos (Historia de la bandera)", parada_id: "P-2", numero_mapa: 1, texto_id: "txt-Av2-P2-fr", audio_id: "audio-Av2-P2-fr" },
        // Tramo 1: Torres de Serranos → Refugio Guerra Civil
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Refugio Guerra Civil", tramo_id: "TR-1", numero_mapa: "1→2", texto_id: "txt-Av2-TR1-fr", audio_id: "audio-Av2-TR1-fr" },
        // Parada 3 - Refugio Guerra Civil (sin reto)
        { padreid: "padre-P3", tipo: "parada", nombre: "Refugio Guerra Civil", parada_id: "P-3", numero_mapa: 2, texto_id: "txt-Av2-P3-fr", audio_id: "audio-Av2-P3-fr" },
        // Tramo 2: Refugio Guerra Civil → Palau de la Generalitat
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Refugio Guerra Civil → Palau de la Generalitat", tramo_id: "TR-2", numero_mapa: "2→3", texto_id: "txt-Av2-TR2-fr", audio_id: "audio-Av2-TR2-fr" },
        // Parada 4 - Palau de la Generalitat (sin reto)
        { padreid: "padre-P4", tipo: "parada", nombre: "Palau de la Generalitat", parada_id: "P-4", numero_mapa: 3, texto_id: "txt-Av2-P4-fr", audio_id: "audio-Av2-P4-fr" },
        // Tramo 3: Palau de la Generalitat → Calle Caballeros
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Palau de la Generalitat → Calle Caballeros", tramo_id: "TR-3", numero_mapa: "3→4", texto_id: "txt-Av2-TR3-fr", audio_id: "audio-Av2-TR3-fr" },
        // Tramo 4: Calle Caballeros → Iglesia de San Nicolás
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Calle Caballeros → Iglesia de San Nicolás", tramo_id: "TR-4", numero_mapa: "4→5", texto_id: "txt-Av2-TR4-fr", audio_id: "audio-Av2-TR4-fr" },
        // Parada 5 - Iglesia de San Nicolás FRONT (Reto 5 Puzzle PZ-06)
        { padreid: "padre-P5", tipo: "parada", nombre: "Iglesia de San Nicolás FRONT", parada_id: "P-5", numero_mapa: 5, texto_id: "txt-Av2-P5-fr", audio_id: "audio-Av2-P5-fr", reto_id: "PZ-06" },
        // Tramo 5: Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK", tramo_id: "TR-5", numero_mapa: "5→6", texto_id: "txt-Av2-TR5-fr", audio_id: "audio-Av2-TR5-fr" },
        // Parada 6 - Iglesia de San Nicolás BACK (Reto 6)
        { padreid: "padre-P6", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-6", numero_mapa: 6, texto_id: "txt-Av2-P6-fr", audio_id: "audio-Av2-P6-fr", reto_id: "R6-Av2-fr" },
        // Parada 7 - Iglesia de San Nicolás BACK (Reto 7)
        { padreid: "padre-P7", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-7", numero_mapa: 6, texto_id: "txt-Av2-P7-fr", audio_id: "audio-Av2-P7-fr", reto_id: "R7-Av2-fr" },
        // Parada 8 - Iglesia de San Nicolás BACK (Reto 8)
        { padreid: "padre-P8", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-8", numero_mapa: 6, texto_id: "txt-Av2-P8-fr", audio_id: "audio-Av2-P8-fr", reto_id: "R8-Av2-fr" },
        // Tramo 6: Iglesia de San Nicolás BACK → Plaza del Negrito
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Iglesia de San Nicolás BACK → Plaza del Negrito", tramo_id: "TR-6", numero_mapa: "6→7", texto_id: "txt-Av2-TR6-fr", audio_id: "audio-Av2-TR6-fr" },
        // Parada 9 - Plaza del Negrito (Reto 9)
        { padreid: "padre-P9", tipo: "parada", nombre: "Plaza del Negrito", parada_id: "P-9", numero_mapa: 7, texto_id: "txt-Av2-P9-fr", audio_id: "audio-Av2-P9-fr", reto_id: "R9-Av2-fr" },
        // Tramo 7: Plaza del Negrito → Calle Caballeros → Plaza del Tossal
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Plaza del Negrito → Calle Caballeros → Plaza del Tossal", tramo_id: "TR-7", numero_mapa: "7→4→8", texto_id: "txt-Av2-TR7-fr", audio_id: "audio-Av2-TR7-fr" },
        // Parada 10 - Plaza del Tossal (Reto 10)
        { padreid: "padre-P10", tipo: "parada", nombre: "Plaza del Tossal", parada_id: "P-10", numero_mapa: 8, texto_id: "txt-Av2-P10-fr", audio_id: "audio-Av2-P10-fr", reto_id: "R10-Av2-fr" },
        // Parada 11 - Plaza del Tossal (sin reto)
        { padreid: "padre-P11", tipo: "parada", nombre: "Plaza del Tossal", parada_id: "P-11", numero_mapa: 8, texto_id: "txt-Av2-P11-fr", audio_id: "audio-Av2-P11-fr" },
        // Tramo 8: Plaza del Tossal → Portal de la Valldigna
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Plaza del Tossal → Portal de la Valldigna", tramo_id: "TR-8", numero_mapa: "8→9", texto_id: "txt-Av2-TR8-fr", audio_id: "audio-Av2-TR8-fr" },
        // Parada 12 - Portal de la Valldigna (sin reto)
        { padreid: "padre-P12", tipo: "parada", nombre: "Portal de la Valldigna", parada_id: "P-12", numero_mapa: 9, texto_id: "txt-Av2-P12-fr", audio_id: "audio-Av2-P12-fr" },
        // Tramo 9: Portal de la Valldigna → Torre del Ángel (Torre árabe)
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Portal de la Valldigna → Torre del Ángel (Torre árabe)", tramo_id: "TR-9", numero_mapa: "9→10", texto_id: "txt-Av2-TR9-fr", audio_id: "audio-Av2-TR9-fr" },
        // Parada 13 - Torre del Ángel (Torre árabe) (Reto 11)
        { padreid: "padre-P13", tipo: "parada", nombre: "Torre del Ángel (Torre árabe)", parada_id: "P-13", numero_mapa: 10, texto_id: "txt-Av2-P13-fr", audio_id: "audio-Av2-P13-fr", reto_id: "R11-Av2-fr" },
        // Tramo 10: Torre del Ángel (Torre árabe) → Plaza de la Virgen
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Torre del Ángel (Torre árabe) → Plaza de la Virgen", tramo_id: "TR-10", numero_mapa: "10→11", texto_id: "txt-Av2-TR10-fr", audio_id: "audio-Av2-TR10-fr" },
        // Parada 14 - Plaza de la Virgen - Introducción (Reto 12 Puzzle PZ-01)
        { padreid: "padre-P14", tipo: "parada", nombre: "Plaza de la Virgen - Introducción", parada_id: "P-14", numero_mapa: 11, texto_id: "txt-Av2-P14-fr", audio_id: "audio-Av2-P14-fr", reto_id: "PZ-01" },
        // Parada 15 - Plaza de la Virgen - Fuente Neptuno (Reto 13)
        { padreid: "padre-P15", tipo: "parada", nombre: "Plaza de la Virgen - Fuente Neptuno", parada_id: "P-15", numero_mapa: 11, texto_id: "txt-Av2-P15-fr", audio_id: "audio-Av2-P15-fr", reto_id: "R13-Av2-fr" },
        // Parada 16 - Plaza de la Virgen - Ofrenda (Reto 14)
        { padreid: "padre-P16", tipo: "parada", nombre: "Plaza de la Virgen - Ofrenda", parada_id: "P-16", numero_mapa: 11, texto_id: "txt-Av2-P16-fr", audio_id: "audio-Av2-P16-fr", reto_id: "R14-Av2-fr" },
        // Parada 17 - Plaza de la Virgen - Basílica (sin reto)
        { padreid: "padre-P17", tipo: "parada", nombre: "Plaza de la Virgen - Basílica", parada_id: "P-17", numero_mapa: 11, texto_id: "txt-Av2-P17-fr", audio_id: "audio-Av2-P17-fr" },
        // Parada 18 - Plaza de la Virgen - Cimborrio Catedral de Valencia (Reto 15)
        { padreid: "padre-P18", tipo: "parada", nombre: "Plaza de la Virgen - Cimborrio Catedral de Valencia", parada_id: "P-18", numero_mapa: 11, texto_id: "txt-Av2-P18-fr", audio_id: "audio-Av2-P18-fr", reto_id: "R15-Av2-fr" },
        // Parada 19 - Plaza de la Virgen - Historia de la Catedral de Valencia (sin reto)
        { padreid: "padre-P19", tipo: "parada", nombre: "Plaza de la Virgen - Historia de la Catedral de Valencia", parada_id: "P-19", numero_mapa: 11, texto_id: "txt-Av2-P19-fr", audio_id: "audio-Av2-P19-fr" },
        // Tramo 11: Plaza de la Virgen → Puerta Gótica de la Catedral de Valencia
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Plaza de la Virgen → Puerta Gótica de la Catedral de Valencia", tramo_id: "TR-11", numero_mapa: "11→-", texto_id: "txt-Av2-TR11-fr", audio_id: "audio-Av2-TR11-fr" },
        // Tramo 12: Puerta Gótica Catedral → Torre del Miguelete y Puerta de los Hierros (Barroca)
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Puerta Gótica de la Catedral de Valencia → Torre del Miguelete y Puerta de los Hierros (Barroca)", tramo_id: "TR-12", numero_mapa: "-→12→13", texto_id: "txt-Av2-TR12-fr", audio_id: "audio-Av2-TR12-fr" },
        // Parada 20 - Torre del Miguelete (Reto 16)
        { padreid: "padre-P20", tipo: "parada", nombre: "Torre del Miguelete", parada_id: "P-20", numero_mapa: 12, texto_id: "txt-Av2-P20-fr", audio_id: "audio-Av2-P20-fr", reto_id: "R16-Av2-fr" },
        // Parada 21 - Torre del Miguelete 2 (Reto 17)
        { padreid: "padre-P21", tipo: "parada", nombre: "Torre del Miguelete 2", parada_id: "P-21", numero_mapa: 12, texto_id: "txt-Av2-P21-fr", audio_id: "audio-Av2-P21-fr", reto_id: "R17-Av2-fr" },
        // Parada 22 - Puerta de los Hierros (Barroca) de la Catedral de Valencia (Reto 18)
        { padreid: "padre-P22", tipo: "parada", nombre: "Puerta de los Hierros (Barroca) de la Catedral de Valencia", parada_id: "P-22", numero_mapa: 13, texto_id: "txt-Av2-P22-fr", audio_id: "audio-Av2-P22-fr", reto_id: "R18-Av2-fr" },
        // Tramo 13: Puerta de los Hierros (Barroca) → Torre Barroca de Santa Catalina
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Puerta de los Hierros (Barroca) → Torre Barroca de Santa Catalina", tramo_id: "TR-13", numero_mapa: "13→14", texto_id: "txt-Av2-TR13-fr", audio_id: "audio-Av2-TR13-fr" },
        // Parada 23 - Torre Barroca de Santa Catalina (Reto 19)
        { padreid: "padre-P23", tipo: "parada", nombre: "Torre Barroca de Santa Catalina", parada_id: "P-23", numero_mapa: 14, texto_id: "txt-Av2-P23-fr", audio_id: "audio-Av2-P23-fr", reto_id: "R19-Av2-fr" },
        // Parada 24 - Torre Barroca de Santa Catalina 2 (Reto 20)
        { padreid: "padre-P24", tipo: "parada", nombre: "Torre Barroca de Santa Catalina 2", parada_id: "P-24", numero_mapa: 14, texto_id: "txt-Av2-P24-fr", audio_id: "audio-Av2-P24-fr", reto_id: "R20-Av2-fr" },
        // Tramo 14: Torre Barroca de la Iglesia de Santa Catalina → Plaza Lope de Vega
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Torre Barroca de la Iglesia de Santa Catalina → Plaza Lope de Vega", tramo_id: "TR-14", numero_mapa: "14→15", texto_id: "txt-Av2-TR14-fr", audio_id: "audio-Av2-TR14-fr" },
        // Parada 25 - Plaza Lope de Vega - Iglesia de Santa Catalina (sin reto)
        { padreid: "padre-P25", tipo: "parada", nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina", parada_id: "P-25", numero_mapa: 15, texto_id: "txt-Av2-P25-fr", audio_id: "audio-Av2-P25-fr" },
        // Parada 26 - Plaza Lope de Vega - Iglesia de Santa Catalina 2 (Reto 21)
        { padreid: "padre-P26", tipo: "parada", nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina 2", parada_id: "P-26", numero_mapa: 15, texto_id: "txt-Av2-P26-fr", audio_id: "audio-Av2-P26-fr", reto_id: "R21-Av2-fr" },
        // Parada 27 - Plaza Lope de Vega - Edificio estrecho (Reto 22)
        { padreid: "padre-P27", tipo: "parada", nombre: "Plaza Lope de Vega - Edificio estrecho", parada_id: "P-27", numero_mapa: 15, texto_id: "txt-Av2-P27-fr", audio_id: "audio-Av2-P27-fr", reto_id: "R22-Av2-fr" },
        // Parada 28 - Plaza Redonda (Reto 23 Puzzle PZ-07)
        { padreid: "padre-P28", tipo: "parada", nombre: "Plaza Redonda", parada_id: "P-28", numero_mapa: 16, texto_id: "txt-Av2-P28-fr", audio_id: "audio-Av2-P28-fr", reto_id: "PZ-07" },
        // Tramo 16: Plaza Redonda → Plaza Milagro del Mocaoret
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Plaza Redonda → Plaza Milagro del Mocaoret", tramo_id: "TR-16", numero_mapa: "16→17", texto_id: "txt-Av2-TR16-fr", audio_id: "audio-Av2-TR16-fr" },
        // Tramo 15: Plaza Lope de Vega → Plaza Redonda
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Plaza Lope de Vega → Plaza Redonda", tramo_id: "TR-15", numero_mapa: "15→16", texto_id: "txt-Av2-TR15-fr", audio_id: "audio-Av2-TR15-fr" },
        // Parada 29 - Plaza Milagro del Mocaoret (sin reto)
        { padreid: "padre-P29", tipo: "parada", nombre: "Plaza Milagro del Mocaoret", parada_id: "P-29", numero_mapa: 17, texto_id: "txt-Av2-P29-fr", audio_id: "audio-Av2-P29-fr" },
        // Tramo 17: Plaza Milagro del Mocaoret → Tapinería
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Plaza Milagro del Mocaoret → Tapinería", tramo_id: "TR-17", numero_mapa: "17→-", texto_id: "txt-Av2-TR17-fr", audio_id: "audio-Av2-TR17-fr" },
        // Tramo 18: Tapinería → Palau de la Generalitat
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Tapinería → Palau de la Generalitat", tramo_id: "TR-18", numero_mapa: "-→3", texto_id: "txt-Av2-TR18-fr", audio_id: "audio-Av2-TR18-fr" },
        // Tramo 19: Palau de la Generalitat → Torres de Serranos - Final
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Palau de la Generalitat → Torres de Serranos - Final", tramo_id: "TR-19", numero_mapa: "3→1", texto_id: "txt-Av2-TR19-fr", audio_id: "audio-Av2-TR19-fr" },
        // Parada 30 - FINAL: Torres de Serranos - Final (Reto 24 Puzzle PZ-05)
        { padreid: "padre-P30", tipo: "parada", nombre: "Torres de Serranos - Final", parada_id: "P-30", numero_mapa: 1, texto_id: "txt-Av2-P30-fr", audio_id: "audio-Av2-P30-fr", reto_id: "PZ-05" }
      ]
    },
    it: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
         {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av2-it" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-it", audio_id: "audio-intro-it", reto_id: "R2-Av2-it" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av2-P0-it", audio_id: "audio-Av2-P0-it", reto_id: "R3-Av2-it" },
        // Parada 1 - Torres de Serranos (Historia de la bandera) (Reto 4 - Reto de la Bandera)
        { padreid: "padre-P1", tipo: "parada", nombre: "Torres de Serranos (Historia de la bandera)", parada_id: "P-1", numero_mapa: 1, texto_id: "txt-Av2-P1-it", audio_id: "audio-Av2-P1-it", reto_id: "R4-Av2-it" },
        // Parada 2 - Torres de Serranos (Historia de la bandera) (sin reto)
        { padreid: "padre-P2", tipo: "parada", nombre: "Torres de Serranos (Historia de la bandera)", parada_id: "P-2", numero_mapa: 1, texto_id: "txt-Av2-P2-it", audio_id: "audio-Av2-P2-it" },
        // Tramo 1: Torres de Serranos → Refugio Guerra Civil
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Refugio Guerra Civil", tramo_id: "TR-1", numero_mapa: "1→2", texto_id: "txt-Av2-TR1-it", audio_id: "audio-Av2-TR1-it" },
        // Parada 3 - Refugio Guerra Civil (sin reto)
        { padreid: "padre-P3", tipo: "parada", nombre: "Refugio Guerra Civil", parada_id: "P-3", numero_mapa: 2, texto_id: "txt-Av2-P3-it", audio_id: "audio-Av2-P3-it" },
        // Tramo 2: Refugio Guerra Civil → Palau de la Generalitat
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Refugio Guerra Civil → Palau de la Generalitat", tramo_id: "TR-2", numero_mapa: "2→3", texto_id: "txt-Av2-TR2-it", audio_id: "audio-Av2-TR2-it" },
        // Parada 4 - Palau de la Generalitat (sin reto)
        { padreid: "padre-P4", tipo: "parada", nombre: "Palau de la Generalitat", parada_id: "P-4", numero_mapa: 3, texto_id: "txt-Av2-P4-it", audio_id: "audio-Av2-P4-it" },
        // Tramo 3: Palau de la Generalitat → Calle Caballeros
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Palau de la Generalitat → Calle Caballeros", tramo_id: "TR-3", numero_mapa: "3→4", texto_id: "txt-Av2-TR3-it", audio_id: "audio-Av2-TR3-it" },
        // Tramo 4: Calle Caballeros → Iglesia de San Nicolás
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Calle Caballeros → Iglesia de San Nicolás", tramo_id: "TR-4", numero_mapa: "4→5", texto_id: "txt-Av2-TR4-it", audio_id: "audio-Av2-TR4-it" },
        // Parada 5 - Iglesia de San Nicolás FRONT (Reto 5 Puzzle PZ-06)
        { padreid: "padre-P5", tipo: "parada", nombre: "Iglesia de San Nicolás FRONT", parada_id: "P-5", numero_mapa: 5, texto_id: "txt-Av2-P5-it", audio_id: "audio-Av2-P5-it", reto_id: "PZ-06" },
        // Tramo 5: Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK", tramo_id: "TR-5", numero_mapa: "5→6", texto_id: "txt-Av2-TR5-it", audio_id: "audio-Av2-TR5-it" },
        // Parada 6 - Iglesia de San Nicolás BACK (Reto 6)
        { padreid: "padre-P6", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-6", numero_mapa: 6, texto_id: "txt-Av2-P6-it", audio_id: "audio-Av2-P6-it", reto_id: "R6-Av2-it" },
        // Parada 7 - Iglesia de San Nicolás BACK (Reto 7)
        { padreid: "padre-P7", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-7", numero_mapa: 6, texto_id: "txt-Av2-P7-it", audio_id: "audio-Av2-P7-it", reto_id: "R7-Av2-it" },
        // Parada 8 - Iglesia de San Nicolás BACK (Reto 8)
        { padreid: "padre-P8", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-8", numero_mapa: 6, texto_id: "txt-Av2-P8-it", audio_id: "audio-Av2-P8-it", reto_id: "R8-Av2-it" },
        // Tramo 6: Iglesia de San Nicolás BACK → Plaza del Negrito
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Iglesia de San Nicolás BACK → Plaza del Negrito", tramo_id: "TR-6", numero_mapa: "6→7", texto_id: "txt-Av2-TR6-it", audio_id: "audio-Av2-TR6-it" },
        // Parada 9 - Plaza del Negrito (Reto 9)
        { padreid: "padre-P9", tipo: "parada", nombre: "Plaza del Negrito", parada_id: "P-9", numero_mapa: 7, texto_id: "txt-Av2-P9-it", audio_id: "audio-Av2-P9-it", reto_id: "R9-Av2-it" },
        // Tramo 7: Plaza del Negrito → Calle Caballeros → Plaza del Tossal
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Plaza del Negrito → Calle Caballeros → Plaza del Tossal", tramo_id: "TR-7", numero_mapa: "7→4→8", texto_id: "txt-Av2-TR7-it", audio_id: "audio-Av2-TR7-it" },
        // Parada 10 - Plaza del Tossal (Reto 10)
        { padreid: "padre-P10", tipo: "parada", nombre: "Plaza del Tossal", parada_id: "P-10", numero_mapa: 8, texto_id: "txt-Av2-P10-it", audio_id: "audio-Av2-P10-it", reto_id: "R10-Av2-it" },
        // Parada 11 - Plaza del Tossal (sin reto)
        { padreid: "padre-P11", tipo: "parada", nombre: "Plaza del Tossal", parada_id: "P-11", numero_mapa: 8, texto_id: "txt-Av2-P11-it", audio_id: "audio-Av2-P11-it" },
        // Tramo 8: Plaza del Tossal → Portal de la Valldigna
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Plaza del Tossal → Portal de la Valldigna", tramo_id: "TR-8", numero_mapa: "8→9", texto_id: "txt-Av2-TR8-it", audio_id: "audio-Av2-TR8-it" },
        // Parada 12 - Portal de la Valldigna (sin reto)
        { padreid: "padre-P12", tipo: "parada", nombre: "Portal de la Valldigna", parada_id: "P-12", numero_mapa: 9, texto_id: "txt-Av2-P12-it", audio_id: "audio-Av2-P12-it" },
        // Tramo 9: Portal de la Valldigna → Torre del Ángel (Torre árabe)
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Portal de la Valldigna → Torre del Ángel (Torre árabe)", tramo_id: "TR-9", numero_mapa: "9→10", texto_id: "txt-Av2-TR9-it", audio_id: "audio-Av2-TR9-it" },
        // Parada 13 - Torre del Ángel (Torre árabe) (Reto 11)
        { padreid: "padre-P13", tipo: "parada", nombre: "Torre del Ángel (Torre árabe)", parada_id: "P-13", numero_mapa: 10, texto_id: "txt-Av2-P13-it", audio_id: "audio-Av2-P13-it", reto_id: "R11-Av2-it" },
        // Tramo 10: Torre del Ángel (Torre árabe) → Plaza de la Virgen
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Torre del Ángel (Torre árabe) → Plaza de la Virgen", tramo_id: "TR-10", numero_mapa: "10→11", texto_id: "txt-Av2-TR10-it", audio_id: "audio-Av2-TR10-it" },
        // Parada 14 - Plaza de la Virgen - Introducción (Reto 12 Puzzle PZ-01)
        { padreid: "padre-P14", tipo: "parada", nombre: "Plaza de la Virgen - Introducción", parada_id: "P-14", numero_mapa: 11, texto_id: "txt-Av2-P14-it", audio_id: "audio-Av2-P14-it", reto_id: "PZ-01" },
        // Parada 15 - Plaza de la Virgen - Fuente Neptuno (Reto 13)
        { padreid: "padre-P15", tipo: "parada", nombre: "Plaza de la Virgen - Fuente Neptuno", parada_id: "P-15", numero_mapa: 11, texto_id: "txt-Av2-P15-it", audio_id: "audio-Av2-P15-it", reto_id: "R13-Av2-it" },
        // Parada 16 - Plaza de la Virgen - Ofrenda (Reto 14)
        { padreid: "padre-P16", tipo: "parada", nombre: "Plaza de la Virgen - Ofrenda", parada_id: "P-16", numero_mapa: 11, texto_id: "txt-Av2-P16-it", audio_id: "audio-Av2-P16-it", reto_id: "R14-Av2-it" },
        // Parada 17 - Plaza de la Virgen - Basílica (sin reto)
        { padreid: "padre-P17", tipo: "parada", nombre: "Plaza de la Virgen - Basílica", parada_id: "P-17", numero_mapa: 11, texto_id: "txt-Av2-P17-it", audio_id: "audio-Av2-P17-it" },
        // Parada 18 - Plaza de la Virgen - Cimborrio Catedral de Valencia (Reto 15)
        { padreid: "padre-P18", tipo: "parada", nombre: "Plaza de la Virgen - Cimborrio Catedral de Valencia", parada_id: "P-18", numero_mapa: 11, texto_id: "txt-Av2-P18-it", audio_id: "audio-Av2-P18-it", reto_id: "R15-Av2-it" },
        // Parada 19 - Plaza de la Virgen - Historia de la Catedral de Valencia (sin reto)
        { padreid: "padre-P19", tipo: "parada", nombre: "Plaza de la Virgen - Historia de la Catedral de Valencia", parada_id: "P-19", numero_mapa: 11, texto_id: "txt-Av2-P19-it", audio_id: "audio-Av2-P19-it" },
        // Tramo 11: Plaza de la Virgen → Puerta Gótica de la Catedral de Valencia
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Plaza de la Virgen → Puerta Gótica de la Catedral de Valencia", tramo_id: "TR-11", numero_mapa: "11→-", texto_id: "txt-Av2-TR11-it", audio_id: "audio-Av2-TR11-it" },
        // Tramo 12: Puerta Gótica Catedral → Torre del Miguelete y Puerta de los Hierros (Barroca)
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Puerta Gótica de la Catedral de Valencia → Torre del Miguelete y Puerta de los Hierros (Barroca)", tramo_id: "TR-12", numero_mapa: "-→12→13", texto_id: "txt-Av2-TR12-it", audio_id: "audio-Av2-TR12-it" },
        // Parada 20 - Torre del Miguelete (Reto 16)
        { padreid: "padre-P20", tipo: "parada", nombre: "Torre del Miguelete", parada_id: "P-20", numero_mapa: 12, texto_id: "txt-Av2-P20-it", audio_id: "audio-Av2-P20-it", reto_id: "R16-Av2-it" },
        // Parada 21 - Torre del Miguelete 2 (Reto 17)
        { padreid: "padre-P21", tipo: "parada", nombre: "Torre del Miguelete 2", parada_id: "P-21", numero_mapa: 12, texto_id: "txt-Av2-P21-it", audio_id: "audio-Av2-P21-it", reto_id: "R17-Av2-it" },
        // Parada 22 - Puerta de los Hierros (Barroca) de la Catedral de Valencia (Reto 18)
        { padreid: "padre-P22", tipo: "parada", nombre: "Puerta de los Hierros (Barroca) de la Catedral de Valencia", parada_id: "P-22", numero_mapa: 13, texto_id: "txt-Av2-P22-it", audio_id: "audio-Av2-P22-it", reto_id: "R18-Av2-it" },
        // Tramo 13: Puerta de los Hierros (Barroca) → Torre Barroca de Santa Catalina
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Puerta de los Hierros (Barroca) → Torre Barroca de Santa Catalina", tramo_id: "TR-13", numero_mapa: "13→14", texto_id: "txt-Av2-TR13-it", audio_id: "audio-Av2-TR13-it" },
        // Parada 23 - Torre Barroca de Santa Catalina (Reto 19)
        { padreid: "padre-P23", tipo: "parada", nombre: "Torre Barroca de Santa Catalina", parada_id: "P-23", numero_mapa: 14, texto_id: "txt-Av2-P23-it", audio_id: "audio-Av2-P23-it", reto_id: "R19-Av2-it" },
        // Parada 24 - Torre Barroca de Santa Catalina 2 (Reto 20)
        { padreid: "padre-P24", tipo: "parada", nombre: "Torre Barroca de Santa Catalina 2", parada_id: "P-24", numero_mapa: 14, texto_id: "txt-Av2-P24-it", audio_id: "audio-Av2-P24-it", reto_id: "R20-Av2-it" },
        // Tramo 14: Torre Barroca de la Iglesia de Santa Catalina → Plaza Lope de Vega
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Torre Barroca de la Iglesia de Santa Catalina → Plaza Lope de Vega", tramo_id: "TR-14", numero_mapa: "14→15", texto_id: "txt-Av2-TR14-it", audio_id: "audio-Av2-TR14-it" },
        // Parada 25 - Plaza Lope de Vega - Iglesia de Santa Catalina (sin reto)
        { padreid: "padre-P25", tipo: "parada", nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina", parada_id: "P-25", numero_mapa: 15, texto_id: "txt-Av2-P25-it", audio_id: "audio-Av2-P25-it" },
        // Parada 26 - Plaza Lope de Vega - Iglesia de Santa Catalina 2 (Reto 21)
        { padreid: "padre-P26", tipo: "parada", nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina 2", parada_id: "P-26", numero_mapa: 15, texto_id: "txt-Av2-P26-it", audio_id: "audio-Av2-P26-it", reto_id: "R21-Av2-it" },
        // Parada 27 - Plaza Lope de Vega - Edificio estrecho (Reto 22)
        { padreid: "padre-P27", tipo: "parada", nombre: "Plaza Lope de Vega - Edificio estrecho", parada_id: "P-27", numero_mapa: 15, texto_id: "txt-Av2-P27-it", audio_id: "audio-Av2-P27-it", reto_id: "R22-Av2-it" },
        // Parada 28 - Plaza Redonda (Reto 23 Puzzle PZ-07)
        { padreid: "padre-P28", tipo: "parada", nombre: "Plaza Redonda", parada_id: "P-28", numero_mapa: 16, texto_id: "txt-Av2-P28-it", audio_id: "audio-Av2-P28-it", reto_id: "PZ-07" },
        // Tramo 16: Plaza Redonda → Plaza Milagro del Mocaoret
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Plaza Redonda → Plaza Milagro del Mocaoret", tramo_id: "TR-16", numero_mapa: "16→17", texto_id: "txt-Av2-TR16-it", audio_id: "audio-Av2-TR16-it" },
        // Tramo 15: Plaza Lope de Vega → Plaza Redonda
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Plaza Lope de Vega → Plaza Redonda", tramo_id: "TR-15", numero_mapa: "15→16", texto_id: "txt-Av2-TR15-it", audio_id: "audio-Av2-TR15-it" },
        // Parada 29 - Plaza Milagro del Mocaoret (sin reto)
        { padreid: "padre-P29", tipo: "parada", nombre: "Plaza Milagro del Mocaoret", parada_id: "P-29", numero_mapa: 17, texto_id: "txt-Av2-P29-it", audio_id: "audio-Av2-P29-it" },
        // Tramo 17: Plaza Milagro del Mocaoret → Tapinería
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Plaza Milagro del Mocaoret → Tapinería", tramo_id: "TR-17", numero_mapa: "17→-", texto_id: "txt-Av2-TR17-it", audio_id: "audio-Av2-TR17-it" },
        // Tramo 18: Tapinería → Palau de la Generalitat
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Tapinería → Palau de la Generalitat", tramo_id: "TR-18", numero_mapa: "-→3", texto_id: "txt-Av2-TR18-it", audio_id: "audio-Av2-TR18-it" },
        // Tramo 19: Palau de la Generalitat → Torres de Serranos - Final
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Palau de la Generalitat → Torres de Serranos - Final", tramo_id: "TR-19", numero_mapa: "3→1", texto_id: "txt-Av2-TR19-it", audio_id: "audio-Av2-TR19-it" },
        // Parada 30 - FINAL: Torres de Serranos - Final (Reto 24 Puzzle PZ-05)
        { padreid: "padre-P30", tipo: "parada", nombre: "Torres de Serranos - Final", parada_id: "P-30", numero_mapa: 1, texto_id: "txt-Av2-P30-it", audio_id: "audio-Av2-P30-it", reto_id: "PZ-05" }
      ]
    },
    nl: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
         {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av2-nl" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-nl", audio_id: "audio-intro-nl", reto_id: "R2-Av2-nl" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av2-P0-nl", audio_id: "audio-Av2-P0-nl", reto_id: "R3-Av2-nl" },
        // Parada 1 - Torres de Serranos (Historia de la bandera) (Reto 4 - Reto de la Bandera)
        { padreid: "padre-P1", tipo: "parada", nombre: "Torres de Serranos (Historia de la bandera)", parada_id: "P-1", numero_mapa: 1, texto_id: "txt-Av2-P1-nl", audio_id: "audio-Av2-P1-nl", reto_id: "R4-Av2-nl" },
        // Parada 2 - Torres de Serranos (Historia de la bandera) (sin reto)
        { padreid: "padre-P2", tipo: "parada", nombre: "Torres de Serranos (Historia de la bandera)", parada_id: "P-2", numero_mapa: 1, texto_id: "txt-Av2-P2-nl", audio_id: "audio-Av2-P2-nl" },
        // Tramo 1: Torres de Serranos → Refugio Guerra Civil
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Refugio Guerra Civil", tramo_id: "TR-1", numero_mapa: "1→2", texto_id: "txt-Av2-TR1-nl", audio_id: "audio-Av2-TR1-nl" },
        // Parada 3 - Refugio Guerra Civil (sin reto)
        { padreid: "padre-P3", tipo: "parada", nombre: "Refugio Guerra Civil", parada_id: "P-3", numero_mapa: 2, texto_id: "txt-Av2-P3-nl", audio_id: "audio-Av2-P3-nl" },
        // Tramo 2: Refugio Guerra Civil → Palau de la Generalitat
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Refugio Guerra Civil → Palau de la Generalitat", tramo_id: "TR-2", numero_mapa: "2→3", texto_id: "txt-Av2-TR2-nl", audio_id: "audio-Av2-TR2-nl" },
        // Parada 4 - Palau de la Generalitat (sin reto)
        { padreid: "padre-P4", tipo: "parada", nombre: "Palau de la Generalitat", parada_id: "P-4", numero_mapa: 3, texto_id: "txt-Av2-P4-nl", audio_id: "audio-Av2-P4-nl" },
        // Tramo 3: Palau de la Generalitat → Calle Caballeros
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Palau de la Generalitat → Calle Caballeros", tramo_id: "TR-3", numero_mapa: "3→4", texto_id: "txt-Av2-TR3-nl", audio_id: "audio-Av2-TR3-nl" },
        // Tramo 4: Calle Caballeros → Iglesia de San Nicolás
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Calle Caballeros → Iglesia de San Nicolás", tramo_id: "TR-4", numero_mapa: "4→5", texto_id: "txt-Av2-TR4-nl", audio_id: "audio-Av2-TR4-nl" },
        // Parada 5 - Iglesia de San Nicolás FRONT (Reto 5 Puzzle PZ-06)
        { padreid: "padre-P5", tipo: "parada", nombre: "Iglesia de San Nicolás FRONT", parada_id: "P-5", numero_mapa: 5, texto_id: "txt-Av2-P5-nl", audio_id: "audio-Av2-P5-nl", reto_id: "PZ-06" },
        // Tramo 5: Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK", tramo_id: "TR-5", numero_mapa: "5→6", texto_id: "txt-Av2-TR5-nl", audio_id: "audio-Av2-TR5-nl" },
        // Parada 6 - Iglesia de San Nicolás BACK (Reto 6)
        { padreid: "padre-P6", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-6", numero_mapa: 6, texto_id: "txt-Av2-P6-nl", audio_id: "audio-Av2-P6-nl", reto_id: "R6-Av2-nl" },
        // Parada 7 - Iglesia de San Nicolás BACK (Reto 7)
        { padreid: "padre-P7", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-7", numero_mapa: 6, texto_id: "txt-Av2-P7-nl", audio_id: "audio-Av2-P7-nl", reto_id: "R7-Av2-nl" },
        // Parada 8 - Iglesia de San Nicolás BACK (Reto 8)
        { padreid: "padre-P8", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-8", numero_mapa: 6, texto_id: "txt-Av2-P8-nl", audio_id: "audio-Av2-P8-nl", reto_id: "R8-Av2-nl" },
        // Tramo 6: Iglesia de San Nicolás BACK → Plaza del Negrito
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Iglesia de San Nicolás BACK → Plaza del Negrito", tramo_id: "TR-6", numero_mapa: "6→7", texto_id: "txt-Av2-TR6-nl", audio_id: "audio-Av2-TR6-nl" },
        // Parada 9 - Plaza del Negrito (Reto 9)
        { padreid: "padre-P9", tipo: "parada", nombre: "Plaza del Negrito", parada_id: "P-9", numero_mapa: 7, texto_id: "txt-Av2-P9-nl", audio_id: "audio-Av2-P9-nl", reto_id: "R9-Av2-nl" },
        // Tramo 7: Plaza del Negrito → Calle Caballeros → Plaza del Tossal
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Plaza del Negrito → Calle Caballeros → Plaza del Tossal", tramo_id: "TR-7", numero_mapa: "7→4→8", texto_id: "txt-Av2-TR7-nl", audio_id: "audio-Av2-TR7-nl" },
        // Parada 10 - Plaza del Tossal (Reto 10)
        { padreid: "padre-P10", tipo: "parada", nombre: "Plaza del Tossal", parada_id: "P-10", numero_mapa: 8, texto_id: "txt-Av2-P10-nl", audio_id: "audio-Av2-P10-nl", reto_id: "R10-Av2-nl" },
        // Parada 11 - Plaza del Tossal (sin reto)
        { padreid: "padre-P11", tipo: "parada", nombre: "Plaza del Tossal", parada_id: "P-11", numero_mapa: 8, texto_id: "txt-Av2-P11-nl", audio_id: "audio-Av2-P11-nl" },
        // Tramo 8: Plaza del Tossal → Portal de la Valldigna
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Plaza del Tossal → Portal de la Valldigna", tramo_id: "TR-8", numero_mapa: "8→9", texto_id: "txt-Av2-TR8-nl", audio_id: "audio-Av2-TR8-nl" },
        // Parada 12 - Portal de la Valldigna (sin reto)
        { padreid: "padre-P12", tipo: "parada", nombre: "Portal de la Valldigna", parada_id: "P-12", numero_mapa: 9, texto_id: "txt-Av2-P12-nl", audio_id: "audio-Av2-P12-nl" },
        // Tramo 9: Portal de la Valldigna → Torre del Ángel (Torre árabe)
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Portal de la Valldigna → Torre del Ángel (Torre árabe)", tramo_id: "TR-9", numero_mapa: "9→10", texto_id: "txt-Av2-TR9-nl", audio_id: "audio-Av2-TR9-nl" },
        // Parada 13 - Torre del Ángel (Torre árabe) (Reto 11)
        { padreid: "padre-P13", tipo: "parada", nombre: "Torre del Ángel (Torre árabe)", parada_id: "P-13", numero_mapa: 10, texto_id: "txt-Av2-P13-nl", audio_id: "audio-Av2-P13-nl", reto_id: "R11-Av2-nl" },
        // Tramo 10: Torre del Ángel (Torre árabe) → Plaza de la Virgen
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Torre del Ángel (Torre árabe) → Plaza de la Virgen", tramo_id: "TR-10", numero_mapa: "10→11", texto_id: "txt-Av2-TR10-nl", audio_id: "audio-Av2-TR10-nl" },
        // Parada 14 - Plaza de la Virgen - Introducción (Reto 12 Puzzle PZ-01)
        { padreid: "padre-P14", tipo: "parada", nombre: "Plaza de la Virgen - Introducción", parada_id: "P-14", numero_mapa: 11, texto_id: "txt-Av2-P14-nl", audio_id: "audio-Av2-P14-nl", reto_id: "PZ-01" },
        // Parada 15 - Plaza de la Virgen - Fuente Neptuno (Reto 13)
        { padreid: "padre-P15", tipo: "parada", nombre: "Plaza de la Virgen - Fuente Neptuno", parada_id: "P-15", numero_mapa: 11, texto_id: "txt-Av2-P15-nl", audio_id: "audio-Av2-P15-nl", reto_id: "R13-Av2-nl" },
        // Parada 16 - Plaza de la Virgen - Ofrenda (Reto 14)
        { padreid: "padre-P16", tipo: "parada", nombre: "Plaza de la Virgen - Ofrenda", parada_id: "P-16", numero_mapa: 11, texto_id: "txt-Av2-P16-nl", audio_id: "audio-Av2-P16-nl", reto_id: "R14-Av2-nl" },
        // Parada 17 - Plaza de la Virgen - Basílica (sin reto)
        { padreid: "padre-P17", tipo: "parada", nombre: "Plaza de la Virgen - Basílica", parada_id: "P-17", numero_mapa: 11, texto_id: "txt-Av2-P17-nl", audio_id: "audio-Av2-P17-nl" },
        // Parada 18 - Plaza de la Virgen - Cimborrio Catedral de Valencia (Reto 15)
        { padreid: "padre-P18", tipo: "parada", nombre: "Plaza de la Virgen - Cimborrio Catedral de Valencia", parada_id: "P-18", numero_mapa: 11, texto_id: "txt-Av2-P18-nl", audio_id: "audio-Av2-P18-nl", reto_id: "R15-Av2-nl" },
        // Parada 19 - Plaza de la Virgen - Historia de la Catedral de Valencia (sin reto)
        { padreid: "padre-P19", tipo: "parada", nombre: "Plaza de la Virgen - Historia de la Catedral de Valencia", parada_id: "P-19", numero_mapa: 11, texto_id: "txt-Av2-P19-nl", audio_id: "audio-Av2-P19-nl" },
        // Tramo 11: Plaza de la Virgen → Puerta Gótica de la Catedral de Valencia
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Plaza de la Virgen → Puerta Gótica de la Catedral de Valencia", tramo_id: "TR-11", numero_mapa: "11→-", texto_id: "txt-Av2-TR11-nl", audio_id: "audio-Av2-TR11-nl" },
        // Tramo 12: Puerta Gótica Catedral → Torre del Miguelete y Puerta de los Hierros (Barroca)
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Puerta Gótica de la Catedral de Valencia → Torre del Miguelete y Puerta de los Hierros (Barroca)", tramo_id: "TR-12", numero_mapa: "-→12→13", texto_id: "txt-Av2-TR12-nl", audio_id: "audio-Av2-TR12-nl" },
        // Parada 20 - Torre del Miguelete (Reto 16)
        { padreid: "padre-P20", tipo: "parada", nombre: "Torre del Miguelete", parada_id: "P-20", numero_mapa: 12, texto_id: "txt-Av2-P20-nl", audio_id: "audio-Av2-P20-nl", reto_id: "R16-Av2-nl" },
        // Parada 21 - Torre del Miguelete 2 (Reto 17)
        { padreid: "padre-P21", tipo: "parada", nombre: "Torre del Miguelete 2", parada_id: "P-21", numero_mapa: 12, texto_id: "txt-Av2-P21-nl", audio_id: "audio-Av2-P21-nl", reto_id: "R17-Av2-nl" },
        // Parada 22 - Puerta de los Hierros (Barroca) de la Catedral de Valencia (Reto 18)
        { padreid: "padre-P22", tipo: "parada", nombre: "Puerta de los Hierros (Barroca) de la Catedral de Valencia", parada_id: "P-22", numero_mapa: 13, texto_id: "txt-Av2-P22-nl", audio_id: "audio-Av2-P22-nl", reto_id: "R18-Av2-nl" },
        // Tramo 13: Puerta de los Hierros (Barroca) → Torre Barroca de Santa Catalina
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Puerta de los Hierros (Barroca) → Torre Barroca de Santa Catalina", tramo_id: "TR-13", numero_mapa: "13→14", texto_id: "txt-Av2-TR13-nl", audio_id: "audio-Av2-TR13-nl" },
        // Parada 23 - Torre Barroca de Santa Catalina (Reto 19)
        { padreid: "padre-P23", tipo: "parada", nombre: "Torre Barroca de Santa Catalina", parada_id: "P-23", numero_mapa: 14, texto_id: "txt-Av2-P23-nl", audio_id: "audio-Av2-P23-nl", reto_id: "R19-Av2-nl" },
        // Parada 24 - Torre Barroca de Santa Catalina 2 (Reto 20)
        { padreid: "padre-P24", tipo: "parada", nombre: "Torre Barroca de Santa Catalina 2", parada_id: "P-24", numero_mapa: 14, texto_id: "txt-Av2-P24-nl", audio_id: "audio-Av2-P24-nl", reto_id: "R20-Av2-nl" },
        // Tramo 14: Torre Barroca de la Iglesia de Santa Catalina → Plaza Lope de Vega
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Torre Barroca de la Iglesia de Santa Catalina → Plaza Lope de Vega", tramo_id: "TR-14", numero_mapa: "14→15", texto_id: "txt-Av2-TR14-nl", audio_id: "audio-Av2-TR14-nl" },
        // Parada 25 - Plaza Lope de Vega - Iglesia de Santa Catalina (sin reto)
        { padreid: "padre-P25", tipo: "parada", nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina", parada_id: "P-25", numero_mapa: 15, texto_id: "txt-Av2-P25-nl", audio_id: "audio-Av2-P25-nl" },
        // Parada 26 - Plaza Lope de Vega - Iglesia de Santa Catalina 2 (Reto 21)
        { padreid: "padre-P26", tipo: "parada", nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina 2", parada_id: "P-26", numero_mapa: 15, texto_id: "txt-Av2-P26-nl", audio_id: "audio-Av2-P26-nl", reto_id: "R21-Av2-nl" },
        // Parada 27 - Plaza Lope de Vega - Edificio estrecho (Reto 22)
        { padreid: "padre-P27", tipo: "parada", nombre: "Plaza Lope de Vega - Edificio estrecho", parada_id: "P-27", numero_mapa: 15, texto_id: "txt-Av2-P27-nl", audio_id: "audio-Av2-P27-nl", reto_id: "R22-Av2-nl" },
        // Parada 28 - Plaza Redonda (Reto 23 Puzzle PZ-07)
        { padreid: "padre-P28", tipo: "parada", nombre: "Plaza Redonda", parada_id: "P-28", numero_mapa: 16, texto_id: "txt-Av2-P28-nl", audio_id: "audio-Av2-P28-nl", reto_id: "PZ-07" },
        // Tramo 16: Plaza Redonda → Plaza Milagro del Mocaoret
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Plaza Redonda → Plaza Milagro del Mocaoret", tramo_id: "TR-16", numero_mapa: "16→17", texto_id: "txt-Av2-TR16-nl", audio_id: "audio-Av2-TR16-nl" },
        // Tramo 15: Plaza Lope de Vega → Plaza Redonda
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Plaza Lope de Vega → Plaza Redonda", tramo_id: "TR-15", numero_mapa: "15→16", texto_id: "txt-Av2-TR15-nl", audio_id: "audio-Av2-TR15-nl" },
        // Parada 29 - Plaza Milagro del Mocaoret (sin reto)
        { padreid: "padre-P29", tipo: "parada", nombre: "Plaza Milagro del Mocaoret", parada_id: "P-29", numero_mapa: 17, texto_id: "txt-Av2-P29-nl", audio_id: "audio-Av2-P29-nl" },
        // Tramo 17: Plaza Milagro del Mocaoret → Tapinería
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Plaza Milagro del Mocaoret → Tapinería", tramo_id: "TR-17", numero_mapa: "17→-", texto_id: "txt-Av2-TR17-nl", audio_id: "audio-Av2-TR17-nl" },
        // Tramo 18: Tapinería → Palau de la Generalitat
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Tapinería → Palau de la Generalitat", tramo_id: "TR-18", numero_mapa: "-→3", texto_id: "txt-Av2-TR18-nl", audio_id: "audio-Av2-TR18-nl" },
        // Tramo 19: Palau de la Generalitat → Torres de Serranos - Final
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Palau de la Generalitat → Torres de Serranos - Final", tramo_id: "TR-19", numero_mapa: "3→1", texto_id: "txt-Av2-TR19-nl", audio_id: "audio-Av2-TR19-nl" },
        // Parada 30 - FINAL: Torres de Serranos - Final (Reto 24 Puzzle PZ-05)
        { padreid: "padre-P30", tipo: "parada", nombre: "Torres de Serranos - Final", parada_id: "P-30", numero_mapa: 1, texto_id: "txt-Av2-P30-nl", audio_id: "audio-Av2-P30-nl", reto_id: "PZ-05" }
      ]
    },
    ja: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
         {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av2-ja" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-ja", audio_id: "audio-intro-ja", reto_id: "R2-Av2-ja" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av2-P0-ja", audio_id: "audio-Av2-P0-ja", reto_id: "R3-Av2-ja" },
        // Parada 1 - Torres de Serranos (Historia de la bandera) (Reto 4 - Reto de la Bandera)
        { padreid: "padre-P1", tipo: "parada", nombre: "Torres de Serranos (Historia de la bandera)", parada_id: "P-1", numero_mapa: 1, texto_id: "txt-Av2-P1-ja", audio_id: "audio-Av2-P1-ja", reto_id: "R4-Av2-ja" },
        // Parada 2 - Torres de Serranos (Historia de la bandera) (sin reto)
        { padreid: "padre-P2", tipo: "parada", nombre: "Torres de Serranos (Historia de la bandera)", parada_id: "P-2", numero_mapa: 1, texto_id: "txt-Av2-P2-ja", audio_id: "audio-Av2-P2-ja" },
        // Tramo 1: Torres de Serranos → Refugio Guerra Civil
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Refugio Guerra Civil", tramo_id: "TR-1", numero_mapa: "1→2", texto_id: "txt-Av2-TR1-ja", audio_id: "audio-Av2-TR1-ja" },
        // Parada 3 - Refugio Guerra Civil (sin reto)
        { padreid: "padre-P3", tipo: "parada", nombre: "Refugio Guerra Civil", parada_id: "P-3", numero_mapa: 2, texto_id: "txt-Av2-P3-ja", audio_id: "audio-Av2-P3-ja" },
        // Tramo 2: Refugio Guerra Civil → Palau de la Generalitat
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Refugio Guerra Civil → Palau de la Generalitat", tramo_id: "TR-2", numero_mapa: "2→3", texto_id: "txt-Av2-TR2-ja", audio_id: "audio-Av2-TR2-ja" },
        // Parada 4 - Palau de la Generalitat (sin reto)
        { padreid: "padre-P4", tipo: "parada", nombre: "Palau de la Generalitat", parada_id: "P-4", numero_mapa: 3, texto_id: "txt-Av2-P4-ja", audio_id: "audio-Av2-P4-ja" },
        // Tramo 3: Palau de la Generalitat → Calle Caballeros
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Palau de la Generalitat → Calle Caballeros", tramo_id: "TR-3", numero_mapa: "3→4", texto_id: "txt-Av2-TR3-ja", audio_id: "audio-Av2-TR3-ja" },
        // Tramo 4: Calle Caballeros → Iglesia de San Nicolás
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Calle Caballeros → Iglesia de San Nicolás", tramo_id: "TR-4", numero_mapa: "4→5", texto_id: "txt-Av2-TR4-ja", audio_id: "audio-Av2-TR4-ja" },
        // Parada 5 - Iglesia de San Nicolás FRONT (Reto 5 Puzzle PZ-06)
        { padreid: "padre-P5", tipo: "parada", nombre: "Iglesia de San Nicolás FRONT", parada_id: "P-5", numero_mapa: 5, texto_id: "txt-Av2-P5-ja", audio_id: "audio-Av2-P5-ja", reto_id: "PZ-06" },
        // Tramo 5: Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Iglesia de San Nicolás FRONT → Iglesia de San Nicolás BACK", tramo_id: "TR-5", numero_mapa: "5→6", texto_id: "txt-Av2-TR5-ja", audio_id: "audio-Av2-TR5-ja" },
        // Parada 6 - Iglesia de San Nicolás BACK (Reto 6)
        { padreid: "padre-P6", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-6", numero_mapa: 6, texto_id: "txt-Av2-P6-ja", audio_id: "audio-Av2-P6-ja", reto_id: "R6-Av2-ja" },
        // Parada 7 - Iglesia de San Nicolás BACK (Reto 7)
        { padreid: "padre-P7", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-7", numero_mapa: 6, texto_id: "txt-Av2-P7-ja", audio_id: "audio-Av2-P7-ja", reto_id: "R7-Av2-ja" },
        // Parada 8 - Iglesia de San Nicolás BACK (Reto 8)
        { padreid: "padre-P8", tipo: "parada", nombre: "Iglesia de San Nicolás BACK", parada_id: "P-8", numero_mapa: 6, texto_id: "txt-Av2-P8-ja", audio_id: "audio-Av2-P8-ja", reto_id: "R8-Av2-ja" },
        // Tramo 6: Iglesia de San Nicolás BACK → Plaza del Negrito
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Iglesia de San Nicolás BACK → Plaza del Negrito", tramo_id: "TR-6", numero_mapa: "6→7", texto_id: "txt-Av2-TR6-ja", audio_id: "audio-Av2-TR6-ja" },
        // Parada 9 - Plaza del Negrito (Reto 9)
        { padreid: "padre-P9", tipo: "parada", nombre: "Plaza del Negrito", parada_id: "P-9", numero_mapa: 7, texto_id: "txt-Av2-P9-ja", audio_id: "audio-Av2-P9-ja", reto_id: "R9-Av2-ja" },
        // Tramo 7: Plaza del Negrito → Calle Caballeros → Plaza del Tossal
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Plaza del Negrito → Calle Caballeros → Plaza del Tossal", tramo_id: "TR-7", numero_mapa: "7→4→8", texto_id: "txt-Av2-TR7-ja", audio_id: "audio-Av2-TR7-ja" },
        // Parada 10 - Plaza del Tossal (Reto 10)
        { padreid: "padre-P10", tipo: "parada", nombre: "Plaza del Tossal", parada_id: "P-10", numero_mapa: 8, texto_id: "txt-Av2-P10-ja", audio_id: "audio-Av2-P10-ja", reto_id: "R10-Av2-ja" },
        // Parada 11 - Plaza del Tossal (sin reto)
        { padreid: "padre-P11", tipo: "parada", nombre: "Plaza del Tossal", parada_id: "P-11", numero_mapa: 8, texto_id: "txt-Av2-P11-ja", audio_id: "audio-Av2-P11-ja" },
        // Tramo 8: Plaza del Tossal → Portal de la Valldigna
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Plaza del Tossal → Portal de la Valldigna", tramo_id: "TR-8", numero_mapa: "8→9", texto_id: "txt-Av2-TR8-ja", audio_id: "audio-Av2-TR8-ja" },
        // Parada 12 - Portal de la Valldigna (sin reto)
        { padreid: "padre-P12", tipo: "parada", nombre: "Portal de la Valldigna", parada_id: "P-12", numero_mapa: 9, texto_id: "txt-Av2-P12-ja", audio_id: "audio-Av2-P12-ja" },
        // Tramo 9: Portal de la Valldigna → Torre del Ángel (Torre árabe)
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Portal de la Valldigna → Torre del Ángel (Torre árabe)", tramo_id: "TR-9", numero_mapa: "9→10", texto_id: "txt-Av2-TR9-ja", audio_id: "audio-Av2-TR9-ja" },
        // Parada 13 - Torre del Ángel (Torre árabe) (Reto 11)
        { padreid: "padre-P13", tipo: "parada", nombre: "Torre del Ángel (Torre árabe)", parada_id: "P-13", numero_mapa: 10, texto_id: "txt-Av2-P13-ja", audio_id: "audio-Av2-P13-ja", reto_id: "R11-Av2-ja" },
        // Tramo 10: Torre del Ángel (Torre árabe) → Plaza de la Virgen
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Torre del Ángel (Torre árabe) → Plaza de la Virgen", tramo_id: "TR-10", numero_mapa: "10→11", texto_id: "txt-Av2-TR10-ja", audio_id: "audio-Av2-TR10-ja" },
        // Parada 14 - Plaza de la Virgen - Introducción (Reto 12 Puzzle PZ-01)
        { padreid: "padre-P14", tipo: "parada", nombre: "Plaza de la Virgen - Introducción", parada_id: "P-14", numero_mapa: 11, texto_id: "txt-Av2-P14-ja", audio_id: "audio-Av2-P14-ja", reto_id: "PZ-01" },
        // Parada 15 - Plaza de la Virgen - Fuente Neptuno (Reto 13)
        { padreid: "padre-P15", tipo: "parada", nombre: "Plaza de la Virgen - Fuente Neptuno", parada_id: "P-15", numero_mapa: 11, texto_id: "txt-Av2-P15-ja", audio_id: "audio-Av2-P15-ja", reto_id: "R13-Av2-ja" },
        // Parada 16 - Plaza de la Virgen - Ofrenda (Reto 14)
        { padreid: "padre-P16", tipo: "parada", nombre: "Plaza de la Virgen - Ofrenda", parada_id: "P-16", numero_mapa: 11, texto_id: "txt-Av2-P16-ja", audio_id: "audio-Av2-P16-ja", reto_id: "R14-Av2-ja" },
        // Parada 17 - Plaza de la Virgen - Basílica (sin reto)
        { padreid: "padre-P17", tipo: "parada", nombre: "Plaza de la Virgen - Basílica", parada_id: "P-17", numero_mapa: 11, texto_id: "txt-Av2-P17-ja", audio_id: "audio-Av2-P17-ja" },
        // Parada 18 - Plaza de la Virgen - Cimborrio Catedral de Valencia (Reto 15)
        { padreid: "padre-P18", tipo: "parada", nombre: "Plaza de la Virgen - Cimborrio Catedral de Valencia", parada_id: "P-18", numero_mapa: 11, texto_id: "txt-Av2-P18-ja", audio_id: "audio-Av2-P18-ja", reto_id: "R15-Av2-ja" },
        // Parada 19 - Plaza de la Virgen - Historia de la Catedral de Valencia (sin reto)
        { padreid: "padre-P19", tipo: "parada", nombre: "Plaza de la Virgen - Historia de la Catedral de Valencia", parada_id: "P-19", numero_mapa: 11, texto_id: "txt-Av2-P19-ja", audio_id: "audio-Av2-P19-ja" },
        // Tramo 11: Plaza de la Virgen → Puerta Gótica de la Catedral de Valencia
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Plaza de la Virgen → Puerta Gótica de la Catedral de Valencia", tramo_id: "TR-11", numero_mapa: "11→-", texto_id: "txt-Av2-TR11-ja", audio_id: "audio-Av2-TR11-ja" },
        // Tramo 12: Puerta Gótica Catedral → Torre del Miguelete y Puerta de los Hierros (Barroca)
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Puerta Gótica de la Catedral de Valencia → Torre del Miguelete y Puerta de los Hierros (Barroca)", tramo_id: "TR-12", numero_mapa: "-→12→13", texto_id: "txt-Av2-TR12-ja", audio_id: "audio-Av2-TR12-ja" },
        // Parada 20 - Torre del Miguelete (Reto 16)
        { padreid: "padre-P20", tipo: "parada", nombre: "Torre del Miguelete", parada_id: "P-20", numero_mapa: 12, texto_id: "txt-Av2-P20-ja", audio_id: "audio-Av2-P20-ja", reto_id: "R16-Av2-ja" },
        // Parada 21 - Torre del Miguelete 2 (Reto 17)
        { padreid: "padre-P21", tipo: "parada", nombre: "Torre del Miguelete 2", parada_id: "P-21", numero_mapa: 12, texto_id: "txt-Av2-P21-ja", audio_id: "audio-Av2-P21-ja", reto_id: "R17-Av2-ja" },
        // Parada 22 - Puerta de los Hierros (Barroca) de la Catedral de Valencia (Reto 18)
        { padreid: "padre-P22", tipo: "parada", nombre: "Puerta de los Hierros (Barroca) de la Catedral de Valencia", parada_id: "P-22", numero_mapa: 13, texto_id: "txt-Av2-P22-ja", audio_id: "audio-Av2-P22-ja", reto_id: "R18-Av2-ja" },
        // Tramo 13: Puerta de los Hierros (Barroca) → Torre Barroca de Santa Catalina
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Puerta de los Hierros (Barroca) → Torre Barroca de Santa Catalina", tramo_id: "TR-13", numero_mapa: "13→14", texto_id: "txt-Av2-TR13-ja", audio_id: "audio-Av2-TR13-ja" },
        // Parada 23 - Torre Barroca de Santa Catalina (Reto 19)
        { padreid: "padre-P23", tipo: "parada", nombre: "Torre Barroca de Santa Catalina", parada_id: "P-23", numero_mapa: 14, texto_id: "txt-Av2-P23-ja", audio_id: "audio-Av2-P23-ja", reto_id: "R19-Av2-ja" },
        // Parada 24 - Torre Barroca de Santa Catalina 2 (Reto 20)
        { padreid: "padre-P24", tipo: "parada", nombre: "Torre Barroca de Santa Catalina 2", parada_id: "P-24", numero_mapa: 14, texto_id: "txt-Av2-P24-ja", audio_id: "audio-Av2-P24-ja", reto_id: "R20-Av2-ja" },
        // Tramo 14: Torre Barroca de la Iglesia de Santa Catalina → Plaza Lope de Vega
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Torre Barroca de la Iglesia de Santa Catalina → Plaza Lope de Vega", tramo_id: "TR-14", numero_mapa: "14→15", texto_id: "txt-Av2-TR14-ja", audio_id: "audio-Av2-TR14-ja" },
        // Parada 25 - Plaza Lope de Vega - Iglesia de Santa Catalina (sin reto)
        { padreid: "padre-P25", tipo: "parada", nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina", parada_id: "P-25", numero_mapa: 15, texto_id: "txt-Av2-P25-ja", audio_id: "audio-Av2-P25-ja" },
        // Parada 26 - Plaza Lope de Vega - Iglesia de Santa Catalina 2 (Reto 21)
        { padreid: "padre-P26", tipo: "parada", nombre: "Plaza Lope de Vega - Iglesia de Santa Catalina 2", parada_id: "P-26", numero_mapa: 15, texto_id: "txt-Av2-P26-ja", audio_id: "audio-Av2-P26-ja", reto_id: "R21-Av2-ja" },
        // Parada 27 - Plaza Lope de Vega - Edificio estrecho (Reto 22)
        { padreid: "padre-P27", tipo: "parada", nombre: "Plaza Lope de Vega - Edificio estrecho", parada_id: "P-27", numero_mapa: 15, texto_id: "txt-Av2-P27-ja", audio_id: "audio-Av2-P27-ja", reto_id: "R22-Av2-ja" },
        // Parada 28 - Plaza Redonda (Reto 23 Puzzle PZ-07)
        { padreid: "padre-P28", tipo: "parada", nombre: "Plaza Redonda", parada_id: "P-28", numero_mapa: 16, texto_id: "txt-Av2-P28-ja", audio_id: "audio-Av2-P28-ja", reto_id: "PZ-07" },
        // Tramo 16: Plaza Redonda → Plaza Milagro del Mocaoret
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Plaza Redonda → Plaza Milagro del Mocaoret", tramo_id: "TR-16", numero_mapa: "16→17", texto_id: "txt-Av2-TR16-ja", audio_id: "audio-Av2-TR16-ja" },
        // Tramo 15: Plaza Lope de Vega → Plaza Redonda
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Plaza Lope de Vega → Plaza Redonda", tramo_id: "TR-15", numero_mapa: "15→16", texto_id: "txt-Av2-TR15-ja", audio_id: "audio-Av2-TR15-ja" },
        // Parada 29 - Plaza Milagro del Mocaoret (sin reto)
        { padreid: "padre-P29", tipo: "parada", nombre: "Plaza Milagro del Mocaoret", parada_id: "P-29", numero_mapa: 17, texto_id: "txt-Av2-P29-ja", audio_id: "audio-Av2-P29-ja" },
        // Tramo 17: Plaza Milagro del Mocaoret → Tapinería
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Plaza Milagro del Mocaoret → Tapinería", tramo_id: "TR-17", numero_mapa: "17→-", texto_id: "txt-Av2-TR17-ja", audio_id: "audio-Av2-TR17-ja" },
        // Tramo 18: Tapinería → Palau de la Generalitat
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Tapinería → Palau de la Generalitat", tramo_id: "TR-18", numero_mapa: "-→3", texto_id: "txt-Av2-TR18-ja", audio_id: "audio-Av2-TR18-ja" },
        // Tramo 19: Palau de la Generalitat → Torres de Serranos - Final
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Palau de la Generalitat → Torres de Serranos - Final", tramo_id: "TR-19", numero_mapa: "3→1", texto_id: "txt-Av2-TR19-ja", audio_id: "audio-Av2-TR19-ja" },
        // Parada 30 - FINAL: Torres de Serranos - Final (Reto 24 Puzzle PZ-05)
        { padreid: "padre-P30", tipo: "parada", nombre: "Torres de Serranos - Final", parada_id: "P-30", numero_mapa: 1, texto_id: "txt-Av2-P30-ja", audio_id: "audio-Av2-P30-ja", reto_id: "PZ-05" }
      ]
    }
  },
  Aventura3: {
    es: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
        {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av3-es" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-es", audio_id: "audio-intro-es", reto_id: "R2-Av3-es" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av3-P0-es", audio_id: "audio-Av3-P0-es", reto_id: "R3-Av3-es" },
        // Tramo 1: Torres de Serranos → Plaza de la Crída (Torres de Serranos Front)
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Plaza de la Crída (Torres de Serranos Front)", tramo_id: "TR-1", numero_mapa: "1→2", texto_id: "txt-Av3-TR1-es", audio_id: "audio-Av3-TR1-es" },
        // Parada 1: Plaza de la Crída (Torres de Serranos Front) (Reto 4)
        { padreid: "padre-P1", tipo: "parada", nombre: "Plaza de la Crída (Torres de Serranos Front)", parada_id: "P-1", numero_mapa: 2, texto_id: "txt-Av3-P1-es", audio_id: "audio-Av3-P1-es", reto_id: "R4-Av3-es" },
        // Tramo 2: Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos", tramo_id: "TR-2", numero_mapa: "1→2", texto_id: "txt-Av3-TR2-es", audio_id: "audio-Av3-TR2-es" },
        // Parada 2: Centro Puente Serranos 1 (Reto 5)
        { padreid: "padre-P2", tipo: "parada", nombre: "Centro Puente Serranos", parada_id: "P-2", numero_mapa: null, texto_id: "txt-Av3-P2-es", audio_id: "audio-Av3-P2-es", reto_id: "R5-Av3-es" },
        // Parada 3: Centro Puente Serranos 2
        { padreid: "padre-P3", tipo: "parada", nombre: "Centro Puente Serranos 2", parada_id: "P-3", numero_mapa: null, texto_id: "txt-Av3-P3-es", audio_id: "audio-Av3-P3-es" },
        // Tramo 3: Centro Puente de Serranos 2 → Ruinas del Jardín del Turia
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Centro Puente de Serranos 2 → Ruinas del Jardín del Turia", tramo_id: "TR-3", numero_mapa: "-→6", texto_id: "txt-Av3-TR3-es", audio_id: "audio-Av3-TR3-es" },
        // Parada 4: Ruinas del Jardín del Turia
        { padreid: "padre-P4", tipo: "parada", nombre: "Ruinas del Jardín del Turia", parada_id: "P-4", numero_mapa: 6, texto_id: "txt-Av3-P4-es", audio_id: "audio-Av3-P4-es" },
        // Tramo 4: Ruinas del Jardín del Turia → Jardines del Real (Viveros)
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Ruinas del Jardín del Turia → Jardines del Real (Viveros)", tramo_id: "TR-4", numero_mapa: "6→7", texto_id: "txt-Av3-TR4-es", audio_id: "audio-Av3-TR4-es" },
        // Parada 5: Jardines del Real (Viveros) (Reto6puzzle PZ-08)
        { padreid: "padre-P5", tipo: "parada", nombre: "Jardines del Real (Viveros)", parada_id: "P-5", numero_mapa: 7, texto_id: "txt-Av3-P5-es", audio_id: "audio-Av3-P5-es", reto_id: "PZ-08" },
        // Tramo 5: Jardines del Real (Viveros) → Puente de la Exposición
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Jardines del Real (Viveros) → Puente de la Exposición", tramo_id: "TR-5", numero_mapa: "7→9", texto_id: "txt-Av3-TR5-es", audio_id: "audio-Av3-TR5-es" },
        // Parada 6: Puente de la Exposición (Reto 7)
        { padreid: "padre-P6", tipo: "parada", nombre: "Puente de la Exposición", parada_id: "P-6", numero_mapa: 9, texto_id: "txt-Av3-P6-es", audio_id: "audio-Av3-P6-es", reto_id: "R7-Av3-es" },
        // Tramo 6: Puente de la Exposición → Puente de las Flores
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Puente de la Exposición → Puente de las Flores", tramo_id: "TR-6", numero_mapa: "9→10", texto_id: "txt-Av3-TR6-es", audio_id: "audio-Av3-TR6-es" },
        // Parada 7: Puente de las Flores
        { padreid: "padre-P7", tipo: "parada", nombre: "Puente de las Flores", parada_id: "P-7", numero_mapa: 10, texto_id: "txt-Av3-P7-es", audio_id: "audio-Av3-P7-es" },
        // Tramo 7: Puente de las Flores → Puente de Aragón (parte superior)
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Puente de las Flores → Puente de Aragón (parte superior)", tramo_id: "TR-7", numero_mapa: "10→12", texto_id: "txt-Av3-TR7-es", audio_id: "audio-Av3-TR7-es" },
        // Parada 8: Puente de Aragón 1 (Reto 8)
        { padreid: "padre-P8", tipo: "parada", nombre: "Puente de Aragón", parada_id: "P-8", numero_mapa: 12, texto_id: "txt-Av3-P8-es", audio_id: "audio-Av3-P8-es", reto_id: "R8-Av3-es" },
        // Parada 9: Puente de Aragón 2
        { padreid: "padre-P9", tipo: "parada", nombre: "Puente de Aragón 2", parada_id: "P-9", numero_mapa: 12, texto_id: "txt-Av3-P9-es", audio_id: "audio-Av3-P9-es" },
        // Tramo 8: Puente de Aragón (parte superior) → Puente de la Mar (Parte Superior)
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Puente de Aragón (parte superior) → Puente de la Mar (Parte Superior)", tramo_id: "TR-8", numero_mapa: "12→11", texto_id: "txt-Av3-TR8-es", audio_id: "audio-Av3-TR8-es" },
        // Parada 10: Puente de la Mar (Parte Superior) (Reto 9)
        { padreid: "padre-P10", tipo: "parada", nombre: "Puente de la Mar (Parte Superior)", parada_id: "P-10", numero_mapa: 11, texto_id: "txt-Av3-P10-es", audio_id: "audio-Av3-P10-es", reto_id: "R9-Av3-es" },
        // Tramo 9: Puente de la Mar (Parte Superior) → Palau de la música
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Puente de la Mar (Parte Superior) → Palau de la música", tramo_id: "TR-9", numero_mapa: "11→13", texto_id: "txt-Av3-TR9-es", audio_id: "audio-Av3-TR9-es" },
        // Parada 11: Palau de la Música (Reto 10)
        { padreid: "padre-P11", tipo: "parada", nombre: "Palau de la Música", parada_id: "P-11", numero_mapa: 13, texto_id: "txt-Av3-P11-es", audio_id: "audio-Av3-P11-es", reto_id: "R10-Av3-es" },
        // Tramo 10: Palau de la música → Gulliver
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Palau de la música → Gulliver", tramo_id: "TR-10", numero_mapa: "13→15", texto_id: "txt-Av3-TR10-es", audio_id: "audio-Av3-TR10-es" },
        // Parada 12: Gulliver (Reto 11)
        { padreid: "padre-P12", tipo: "parada", nombre: "Gulliver", parada_id: "P-12", numero_mapa: 15, texto_id: "txt-Av3-P12-es", audio_id: "audio-Av3-P12-es", reto_id: "R11-Av3-es" },
        // Tramo 11: Gulliver → Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Gulliver → Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias", tramo_id: "TR-11", numero_mapa: "15→17", texto_id: "txt-Av3-TR11-es", audio_id: "audio-Av3-TR11-es" },
        // Parada 13: Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias
        { padreid: "padre-P13", tipo: "parada", nombre: "Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias", parada_id: "P-13", numero_mapa: 17, texto_id: "txt-Av3-P13-es", audio_id: "audio-Av3-P13-es" },
        // Tramo 12: Pistas de Patinaje → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Pistas de Patinaje → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe", tramo_id: "TR-12", numero_mapa: "17→-", texto_id: "txt-Av3-TR12-es", audio_id: "audio-Av3-TR12-es" },
        // Parada 14: Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía
        { padreid: "padre-P14", tipo: "parada", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía", parada_id: "P-14", numero_mapa: 18, texto_id: "txt-Av3-P14-es", audio_id: "audio-Av3-P14-es" },
        // Parada 15: Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe
        { padreid: "padre-P15", tipo: "parada", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe", parada_id: "P-15", numero_mapa: 20, texto_id: "txt-Av3-P15-es", audio_id: "audio-Av3-P15-es" },
        // Tramo 13: Mirador de la Ciudad de las Artes y de las Ciencias → Puente l’Assut de l’Or
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe → Puente l’Assut de l’Or", tramo_id: "TR-13", numero_mapa: "20→21", texto_id: "txt-Av3-TR13-es", audio_id: "audio-Av3-TR13-es" },
        // Parada 16: Puente l’Assut de l’Or (Reto12puzzle PZ-09)
        { padreid: "padre-P16", tipo: "parada", nombre: "Puente l’Assut de l’Or", parada_id: "P-16", numero_mapa: 21, texto_id: "txt-Av3-P16-es", audio_id: "audio-Av3-P16-es", reto_id: "PZ-09" },
        // Tramo 14: Puente l’Assut de l’Or → Ágora y Oceanogràfic
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Puente l’Assut de l’Or → Ágora y Oceanogràfic", tramo_id: "TR-14", numero_mapa: "21→22/23", texto_id: "txt-Av3-TR14-es", audio_id: "audio-Av3-TR14-es" },
        // Parada 17: Ágora y Oceanogràfic
        { padreid: "padre-P17", tipo: "parada", nombre: "Ágora y Oceanogràfic", parada_id: "P-17", numero_mapa: "22/23", texto_id: "txt-Av3-P17-es", audio_id: "audio-Av3-P17-es" },
        // Tramo 15: Ágora y Oceanogràfic → Umbracle
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Ágora y Oceanogràfic → Umbracle", tramo_id: "TR-15", numero_mapa: "22/23→24", texto_id: "txt-Av3-TR15-es", audio_id: "audio-Av3-TR15-es" },
        // Parada 18: Umbracle (Reto 13)
        { padreid: "padre-P18", tipo: "parada", nombre: "Umbracle", parada_id: "P-18", numero_mapa: "24", texto_id: "txt-Av3-P18-es", audio_id: "audio-Av3-P18-es", reto_id: "R13-Av3-es" },
        // Tramo 16: Umbracle → Hemisféric
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Umbracle → Hemisféric", tramo_id: "TR-16", numero_mapa: "24→25", texto_id: "txt-Av3-TR16-es", audio_id: "audio-Av3-TR16-es" },
        // Parada 19: Hemisféric (Reto 14)
        { padreid: "padre-P19", tipo: "parada", nombre: "Hemisféric", parada_id: "P-19", numero_mapa: "25", texto_id: "txt-Av3-P19-es", audio_id: "audio-Av3-P19-es", reto_id: "R14-Av3-es" },
        // Tramo 17: Ciudad de las Artes y las Ciencias → Puente de la Mar
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Ciudad de las Artes y las Ciencias → Puente de la Mar", tramo_id: "TR-17", numero_mapa: "25→11", texto_id: "txt-Av3-TR17-es", audio_id: "audio-Av3-TR17-es" },
        // Parada 20: Puente de la Mar (Reto 15)
        { padreid: "padre-P20", tipo: "parada", nombre: "Puente de la Mar", parada_id: "P-20", numero_mapa: "25", texto_id: "txt-Av3-P20-es", audio_id: "audio-Av3-P20-es", reto_id: "R15-Av3-es" },
        // Tramo 18: Puente de la Mar → Puerta de la Mar
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Puente de la Mar → Puerta de la Mar", tramo_id: "TR-18", numero_mapa: "11→26", texto_id: "txt-Av3-TR18-es", audio_id: "audio-Av3-TR18-es" },
        // Parada 21: Puerta de la Mar (Reto 16)
        { padreid: "padre-P21", tipo: "parada", nombre: "Puerta de la Mar", parada_id: "P-21", numero_mapa: "26", texto_id: "txt-Av3-P21-es", audio_id: "audio-Av3-P21-es", reto_id: "R16-Av3-es" },
        // Tramo 19: Puerta de la Mar → Palacio de Justicia
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Puerta de la Mar → Palacio de Justicia", tramo_id: "TR-19", numero_mapa: "26→27", texto_id: "txt-Av3-TR19-es", audio_id: "audio-Av3-TR19-es" },
        // Parada 22: Palacio de Justicia
        { padreid: "padre-P22", tipo: "parada", nombre: "Palacio de Justicia", parada_id: "P-22", numero_mapa: "26", texto_id: "txt-Av3-P22-es", audio_id: "audio-Av3-P22-es" },
        // Tramo 20: Palacio de Justicia → Fundación Bancaja 1
        { padreid: "padre-TR20", tipo: "tramo", nombre: "Palacio de Justicia → Fundación Bancaja 1", tramo_id: "TR-20", numero_mapa: "27→28", texto_id: "txt-Av3-TR20-es", audio_id: "audio-Av3-TR20-es" },
        // Parada 23: Fundación Bancaja 1 (Reto 17)
        { padreid: "padre-P23", tipo: "parada", nombre: "Fundación Bancaja 1", parada_id: "P-23", numero_mapa: "28", texto_id: "txt-Av3-P23-es", audio_id: "audio-Av3-P23-es", reto_id: "R17-Av3-es" },
        // Tramo 21: Fundación Bancaja 1 → Fundación Bancaja 2
        { padreid: "padre-TR21", tipo: "tramo", nombre: "Fundación Bancaja 1 → Fundación Bancaja 2", tramo_id: "TR-21", numero_mapa: "28→28", texto_id: "txt-Av3-TR21-es", audio_id: "audio-Av3-TR21-es" },
        // Parada 24: Fundación Bancaja 2
        { padreid: "padre-P24", tipo: "parada", nombre: "Fundación Bancaja 2", parada_id: "P-24", numero_mapa: "28", texto_id: "txt-Av3-P24-es", audio_id: "audio-Av3-P24-es" },
        // Tramo 22: Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente
        { padreid: "padre-TR22", tipo: "tramo", nombre: "Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente", tramo_id: "TR-22", numero_mapa: "28→29", texto_id: "txt-Av3-TR22-es", audio_id: "audio-Av3-TR22-es" },
        // Parada 25: Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente (Reto 18)
        { padreid: "padre-P25", tipo: "parada", nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente", parada_id: "P-25", numero_mapa: "29", texto_id: "txt-Av3-P25-es", audio_id: "audio-Av3-P25-es", reto_id: "R18-Av3-es" },
        // Parada 26: Iglesia Santo Tomás Apostol y San Felipe Neri
        { padreid: "padre-P26", tipo: "parada", nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri", parada_id: "P-26", numero_mapa: "29", texto_id: "txt-Av3-P26-es", audio_id: "audio-Av3-P26-es" },
        // Tramo 23: Iglesia Santo Tomás Apostol y San Felipe Neri → Iglesia San Juan del Hospital
        { padreid: "padre-TR23", tipo: "tramo", nombre: "Iglesia San Vicente Ferrer y San Felipe Neri → Iglesia San Juan del Hospital", tramo_id: "TR-23", numero_mapa: "29→30", texto_id: "txt-Av3-TR23-es", audio_id: "audio-Av3-TR23-es" },
        // Parada 27: Iglesia San Juan del Hospital
        { padreid: "padre-P27", tipo: "parada", nombre: "Iglesia San Juan del Hospital", parada_id: "P-27", numero_mapa: "30", texto_id: "txt-Av3-P27-es", audio_id: "audio-Av3-P27-es" },
        // Tramo 24: Iglesia San Juan del Hospital → Palacio Arzobispal
        { padreid: "padre-TR24", tipo: "tramo", nombre: "Iglesia San Juan del Hospital → Palacio Arzobispal", tramo_id: "TR-24", numero_mapa: "30→31", texto_id: "txt-Av3-TR24-es", audio_id: "audio-Av3-TR24-es" },
        // Parada 28: Palacio Arzobispal
        { padreid: "padre-P28", tipo: "parada", nombre: "Palacio Arzobispal", parada_id: "P-28", numero_mapa: "31", texto_id: "txt-Av3-P28-es", audio_id: "audio-Av3-P28-es" },
        // Tramo 25: Palacio Arzobispal → Catedral de Valencia (Puerta Románica)
        { padreid: "padre-TR25", tipo: "tramo", nombre: "Palacio Arzobispal → Catedral de Valencia (Puerta Románica)", tramo_id: "TR-25", numero_mapa: "31→32", texto_id: "txt-Av3-TR25-es", audio_id: "audio-Av3-TR25-es" },
        // Parada 29: Catedral de Valencia (Puerta Románica) (Reto 19)
        { padreid: "padre-P29", tipo: "parada", nombre: "Catedral de Valencia (Puerta Románica)", parada_id: "P-29", numero_mapa: "32", texto_id: "txt-Av3-P29-es", audio_id: "audio-Av3-P29-es", reto_id: "R19-Av3-es" },
        // Tramo 26: Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína)
        { padreid: "padre-TR26", tipo: "tramo", nombre: "Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína)", tramo_id: "TR-26", numero_mapa: "32→33", texto_id: "txt-Av3-TR26-es", audio_id: "audio-Av3-TR26-es" },
        // Parada 30: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 1, Panel cerámico (reto 20)
        { padreid: "padre-P30", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 1, Panel cerámico", parada_id: "P-30", numero_mapa: "33", texto_id: "txt-Av3-P30-es", audio_id: "audio-Av3-P30-es", reto_id: "R20-Av3-es" },
        // Parada 31: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 2, Capilla exterior (reto 21)
        { padreid: "padre-P31", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 2, Capilla exterior", parada_id: "P-31", numero_mapa: "33", texto_id: "txt-Av3-P31-es", audio_id: "audio-Av3-P31-es", reto_id: "R21-Av3-es" },
        // Parada 32: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 3, Capilla exterior (reto 22)
        { padreid: "padre-P32", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 3, Capilla exterior", parada_id: "P-32", numero_mapa: "33", texto_id: "txt-Av3-P32-es", audio_id: "audio-Av3-P32-es", reto_id: "R22-Av3-es" },
        // Parada 33: Plaza Décimo Junio Bruto (Plaza de la Almoína) Basílica de Valencia
        { padreid: "padre-P33", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Basílica de Valencia", parada_id: "P-33", numero_mapa: "33/34", texto_id: "txt-Av3-P33-es", audio_id: "audio-Av3-P33-es" },
        // Parada 34: Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de gantxo (Reto 23)
        { padreid: "padre-P34", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de gantxo", parada_id: "P-34", numero_mapa: "33", texto_id: "txt-Av3-P34-es", audio_id: "audio-Av3-P34-es", reto_id: "R23-Av3-es" },
        // Tramo 27: Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico
        { padreid: "padre-TR27", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) → Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", tramo_id: "TR-27", numero_mapa: "33→33", texto_id: "txt-Av3-TR27-es", audio_id: "audio-Av3-TR27-es" },
        // Parada 35: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico (Reto 24)
        { padreid: "padre-P35", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", parada_id: "P-35", numero_mapa: "33", texto_id: "txt-Av3-P35-es", audio_id: "audio-Av3-P35-es", reto_id: "R24-Av3-es" },
        // Parada 36: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico 2 (Reto25puzzle PZ-02)
        { padreid: "padre-P36", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", parada_id: "P-36", numero_mapa: "33", texto_id: "txt-Av3-P36-es", audio_id: "audio-Av3-P36-es", reto_id: "PZ-02" },
        // Tramo 28: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen
        { padreid: "padre-TR28", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen", tramo_id: "TR-28", numero_mapa: "33→35", texto_id: "txt-Av3-TR28-es", audio_id: "audio-Av3-TR28-es" },
        // Parada 37: Plaza de la Virgen (Fuente de Neptuno) (Reto 26)
        { padreid: "padre-P37", tipo: "parada", nombre: "Plaza de la Virgen (Fuente de Neptuno)", parada_id: "P-37", numero_mapa: "35", texto_id: "txt-Av3-P37-es", audio_id: "audio-Av3-P37-es", reto_id: "R26-Av3-es" },
        // Parada 38: Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia) (Reto 27)
        { padreid: "padre-P38", tipo: "parada", nombre: "Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia)", parada_id: "P-38", numero_mapa: "35", texto_id: "txt-Av3-P38-es", audio_id: "audio-Av3-P38-es", reto_id: "R27-Av3-es" },
        // Tramo 29: Plaza de la Virgen → Torres de Serranos
        { padreid: "padre-TR29", tipo: "tramo", nombre: "Plaza de la Virgen → Torres de Serranos", tramo_id: "TR-29", numero_mapa: "35→1", texto_id: "txt-Av3-TR29-es", audio_id: "audio-Av3-TR29-es" },
        // Parada 39 - FINAL: Torres de Serranos Final (Reto28Puzzle PZ-05)
        { padreid: "padre-P39", tipo: "parada", nombre: "Torres de Serranos Final", parada_id: "P-39", numero_mapa: 1, texto_id: "txt-Av3-P39-es", audio_id: "audio-Av3-P39-es", reto_id: "PZ-05" },
      ]
    },
    en: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
        {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av3-en" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-en", audio_id: "audio-intro-en", reto_id: "R2-Av3-en" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av3-P0-en", audio_id: "audio-Av3-P0-en", reto_id: "R3-Av3-en" },
        // Tramo 1: Torres de Serranos → Plaza de la Crída (Torres de Serranos Front)
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Plaza de la Crída (Torres de Serranos Front)", tramo_id: "TR-1", numero_mapa: "1→2", texto_id: "txt-Av3-TR1-en", audio_id: "audio-Av3-TR1-en" },
        // Parada 1: Plaza de la Crída (Torres de Serranos Front) (Reto 4)
        { padreid: "padre-P1", tipo: "parada", nombre: "Plaza de la Crída (Torres de Serranos Front)", parada_id: "P-1", numero_mapa: 2, texto_id: "txt-Av3-P1-en", audio_id: "audio-Av3-P1-en", reto_id: "R4-Av3-en" },
        // Tramo 2: Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos", tramo_id: "TR-2", numero_mapa: "1→2", texto_id: "txt-Av3-TR2-en", audio_id: "audio-Av3-TR2-en" },
        // Parada 2: Centro Puente Serranos 1 (Reto 5)
        { padreid: "padre-P2", tipo: "parada", nombre: "Centro Puente Serranos", parada_id: "P-2", numero_mapa: null, texto_id: "txt-Av3-P2-en", audio_id: "audio-Av3-P2-en", reto_id: "R5-Av3-en" },
        // Parada 3: Centro Puente Serranos 2
        { padreid: "padre-P3", tipo: "parada", nombre: "Centro Puente Serranos 2", parada_id: "P-3", numero_mapa: null, texto_id: "txt-Av3-P3-en", audio_id: "audio-Av3-P3-en" },
        // Tramo 3: Centro Puente de Serranos 2 → Ruinas del Jardín del Turia
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Centro Puente de Serranos 2 → Ruinas del Jardín del Turia", tramo_id: "TR-3", numero_mapa: "-→6", texto_id: "txt-Av3-TR3-en", audio_id: "audio-Av3-TR3-en" },
        // Parada 4: Ruinas del Jardín del Turia
        { padreid: "padre-P4", tipo: "parada", nombre: "Ruinas del Jardín del Turia", parada_id: "P-4", numero_mapa: 6, texto_id: "txt-Av3-P4-en", audio_id: "audio-Av3-P4-en" },
        // Tramo 4: Ruinas del Jardín del Turia → Jardines del Real (Viveros)
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Ruinas del Jardín del Turia → Jardines del Real (Viveros)", tramo_id: "TR-4", numero_mapa: "6→7", texto_id: "txt-Av3-TR4-en", audio_id: "audio-Av3-TR4-en" },
        // Parada 5: Jardines del Real (Viveros) (Reto6puzzle PZ-08)
        { padreid: "padre-P5", tipo: "parada", nombre: "Jardines del Real (Viveros)", parada_id: "P-5", numero_mapa: 7, texto_id: "txt-Av3-P5-en", audio_id: "audio-Av3-P5-en", reto_id: "PZ-08" },
        // Tramo 5: Jardines del Real (Viveros) → Puente de la Exposición
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Jardines del Real (Viveros) → Puente de la Exposición", tramo_id: "TR-5", numero_mapa: "7→9", texto_id: "txt-Av3-TR5-en", audio_id: "audio-Av3-TR5-en" },
        // Parada 6: Puente de la Exposición (Reto 7)
        { padreid: "padre-P6", tipo: "parada", nombre: "Puente de la Exposición", parada_id: "P-6", numero_mapa: 9, texto_id: "txt-Av3-P6-en", audio_id: "audio-Av3-P6-en", reto_id: "R7-Av3-en" },
        // Tramo 6: Puente de la Exposición → Puente de las Flores
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Puente de la Exposición → Puente de las Flores", tramo_id: "TR-6", numero_mapa: "9→10", texto_id: "txt-Av3-TR6-en", audio_id: "audio-Av3-TR6-en" },
        // Parada 7: Puente de las Flores
        { padreid: "padre-P7", tipo: "parada", nombre: "Puente de las Flores", parada_id: "P-7", numero_mapa: 10, texto_id: "txt-Av3-P7-en", audio_id: "audio-Av3-P7-en" },
        // Tramo 7: Puente de las Flores → Puente de Aragón (parte superior)
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Puente de las Flores → Puente de Aragón (parte superior)", tramo_id: "TR-7", numero_mapa: "10→12", texto_id: "txt-Av3-TR7-en", audio_id: "audio-Av3-TR7-en" },
        // Parada 8: Puente de Aragón 1 (Reto 8)
        { padreid: "padre-P8", tipo: "parada", nombre: "Puente de Aragón", parada_id: "P-8", numero_mapa: 12, texto_id: "txt-Av3-P8-en", audio_id: "audio-Av3-P8-en", reto_id: "R8-Av3-en" },
        // Parada 9: Puente de Aragón 2
        { padreid: "padre-P9", tipo: "parada", nombre: "Puente de Aragón 2", parada_id: "P-9", numero_mapa: 12, texto_id: "txt-Av3-P9-en", audio_id: "audio-Av3-P9-en" },
        // Tramo 8: Puente de Aragón (parte superior) → Puente de la Mar (Parte Superior)
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Puente de Aragón (parte superior) → Puente de la Mar (Parte Superior)", tramo_id: "TR-8", numero_mapa: "12→11", texto_id: "txt-Av3-TR8-en", audio_id: "audio-Av3-TR8-en" },
        // Parada 10: Puente de la Mar (Parte Superior) (Reto 9)
        { padreid: "padre-P10", tipo: "parada", nombre: "Puente de la Mar (Parte Superior)", parada_id: "P-10", numero_mapa: 11, texto_id: "txt-Av3-P10-en", audio_id: "audio-Av3-P10-en", reto_id: "R9-Av3-en" },
        // Tramo 9: Puente de la Mar (Parte Superior) → Palau de la música
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Puente de la Mar (Parte Superior) → Palau de la música", tramo_id: "TR-9", numero_mapa: "11→13", texto_id: "txt-Av3-TR9-en", audio_id: "audio-Av3-TR9-en" },
        // Parada 11: Palau de la Música (Reto 10)
        { padreid: "padre-P11", tipo: "parada", nombre: "Palau de la Música", parada_id: "P-11", numero_mapa: 13, texto_id: "txt-Av3-P11-en", audio_id: "audio-Av3-P11-en", reto_id: "R10-Av3-en" },
        // Tramo 10: Palau de la música → Gulliver
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Palau de la música → Gulliver", tramo_id: "TR-10", numero_mapa: "13→15", texto_id: "txt-Av3-TR10-en", audio_id: "audio-Av3-TR10-en" },
        // Parada 12: Gulliver (Reto 11)
        { padreid: "padre-P12", tipo: "parada", nombre: "Gulliver", parada_id: "P-12", numero_mapa: 15, texto_id: "txt-Av3-P12-en", audio_id: "audio-Av3-P12-en", reto_id: "R11-Av3-en" },
        // Tramo 11: Gulliver → Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Gulliver → Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias", tramo_id: "TR-11", numero_mapa: "15→17", texto_id: "txt-Av3-TR11-en", audio_id: "audio-Av3-TR11-en" },
        // Parada 13: Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias
        { padreid: "padre-P13", tipo: "parada", nombre: "Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias", parada_id: "P-13", numero_mapa: 17, texto_id: "txt-Av3-P13-en", audio_id: "audio-Av3-P13-en" },
        // Tramo 12: Pistas de Patinaje → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Pistas de Patinaje → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe", tramo_id: "TR-12", numero_mapa: "17→-", texto_id: "txt-Av3-TR12-en", audio_id: "audio-Av3-TR12-en" },
        // Parada 14: Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía
        { padreid: "padre-P14", tipo: "parada", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía", parada_id: "P-14", numero_mapa: 18, texto_id: "txt-Av3-P14-en", audio_id: "audio-Av3-P14-en" },
        // Parada 15: Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe
        { padreid: "padre-P15", tipo: "parada", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe", parada_id: "P-15", numero_mapa: 20, texto_id: "txt-Av3-P15-en", audio_id: "audio-Av3-P15-en" },
        // Tramo 13: Mirador de la Ciudad de las Artes y de las Ciencias → Puente l’Assut de l’Or
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe → Puente l’Assut de l’Or", tramo_id: "TR-13", numero_mapa: "20→21", texto_id: "txt-Av3-TR13-en", audio_id: "audio-Av3-TR13-en" },
        // Parada 16: Puente l’Assut de l’Or (Reto12puzzle PZ-09)
        { padreid: "padre-P16", tipo: "parada", nombre: "Puente l’Assut de l’Or", parada_id: "P-16", numero_mapa: 21, texto_id: "txt-Av3-P16-en", audio_id: "audio-Av3-P16-en", reto_id: "PZ-09" },
        // Tramo 14: Puente l’Assut de l’Or → Ágora y Oceanogràfic
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Puente l’Assut de l’Or → Ágora y Oceanogràfic", tramo_id: "TR-14", numero_mapa: "21→22/23", texto_id: "txt-Av3-TR14-en", audio_id: "audio-Av3-TR14-en" },
        // Parada 17: Ágora y Oceanogràfic
        { padreid: "padre-P17", tipo: "parada", nombre: "Ágora y Oceanogràfic", parada_id: "P-17", numero_mapa: "22/23", texto_id: "txt-Av3-P17-en", audio_id: "audio-Av3-P17-en" },
        // Tramo 15: Ágora y Oceanogràfic → Umbracle
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Ágora y Oceanogràfic → Umbracle", tramo_id: "TR-15", numero_mapa: "22/23→24", texto_id: "txt-Av3-TR15-en", audio_id: "audio-Av3-TR15-en" },
        // Parada 18: Umbracle (Reto 13)
        { padreid: "padre-P18", tipo: "parada", nombre: "Umbracle", parada_id: "P-18", numero_mapa: "24", texto_id: "txt-Av3-P18-en", audio_id: "audio-Av3-P18-en", reto_id: "R13-Av3-en" },
        // Tramo 16: Umbracle → Hemisféric
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Umbracle → Hemisféric", tramo_id: "TR-16", numero_mapa: "24→25", texto_id: "txt-Av3-TR16-en", audio_id: "audio-Av3-TR16-en" },
        // Parada 19: Hemisféric (Reto 14)
        { padreid: "padre-P19", tipo: "parada", nombre: "Hemisféric", parada_id: "P-19", numero_mapa: "25", texto_id: "txt-Av3-P19-en", audio_id: "audio-Av3-P19-en", reto_id: "R14-Av3-en" },
        // Tramo 17: Ciudad de las Artes y las Ciencias → Puente de la Mar
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Ciudad de las Artes y las Ciencias → Puente de la Mar", tramo_id: "TR-17", numero_mapa: "25→11", texto_id: "txt-Av3-TR17-en", audio_id: "audio-Av3-TR17-en" },
        // Parada 20: Puente de la Mar (Reto 15)
        { padreid: "padre-P20", tipo: "parada", nombre: "Puente de la Mar", parada_id: "P-20", numero_mapa: "25", texto_id: "txt-Av3-P20-en", audio_id: "audio-Av3-P20-en", reto_id: "R15-Av3-en" },
        // Tramo 18: Puente de la Mar → Puerta de la Mar
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Puente de la Mar → Puerta de la Mar", tramo_id: "TR-18", numero_mapa: "11→26", texto_id: "txt-Av3-TR18-en", audio_id: "audio-Av3-TR18-en" },
        // Parada 21: Puerta de la Mar (Reto 16)
        { padreid: "padre-P21", tipo: "parada", nombre: "Puerta de la Mar", parada_id: "P-21", numero_mapa: "26", texto_id: "txt-Av3-P21-en", audio_id: "audio-Av3-P21-en", reto_id: "R16-Av3-en" },
        // Tramo 19: Puerta de la Mar → Palacio de Justicia
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Puerta de la Mar → Palacio de Justicia", tramo_id: "TR-19", numero_mapa: "26→27", texto_id: "txt-Av3-TR19-en", audio_id: "audio-Av3-TR19-en" },
        // Parada 22: Palacio de Justicia
        { padreid: "padre-P22", tipo: "parada", nombre: "Palacio de Justicia", parada_id: "P-22", numero_mapa: "26", texto_id: "txt-Av3-P22-en", audio_id: "audio-Av3-P22-en" },
        // Tramo 20: Palacio de Justicia → Fundación Bancaja 1
        { padreid: "padre-TR20", tipo: "tramo", nombre: "Palacio de Justicia → Fundación Bancaja 1", tramo_id: "TR-20", numero_mapa: "27→28", texto_id: "txt-Av3-TR20-en", audio_id: "audio-Av3-TR20-en" },
        // Parada 23: Fundación Bancaja 1 (Reto 17)
        { padreid: "padre-P23", tipo: "parada", nombre: "Fundación Bancaja 1", parada_id: "P-23", numero_mapa: "28", texto_id: "txt-Av3-P23-en", audio_id: "audio-Av3-P23-en", reto_id: "R17-Av3-en" },
        // Tramo 21: Fundación Bancaja 1 → Fundación Bancaja 2
        { padreid: "padre-TR21", tipo: "tramo", nombre: "Fundación Bancaja 1 → Fundación Bancaja 2", tramo_id: "TR-21", numero_mapa: "28→28", texto_id: "txt-Av3-TR21-en", audio_id: "audio-Av3-TR21-en" },
        // Parada 24: Fundación Bancaja 2
        { padreid: "padre-P24", tipo: "parada", nombre: "Fundación Bancaja 2", parada_id: "P-24", numero_mapa: "28", texto_id: "txt-Av3-P24-en", audio_id: "audio-Av3-P24-en" },
        // Tramo 22: Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente
        { padreid: "padre-TR22", tipo: "tramo", nombre: "Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente", tramo_id: "TR-22", numero_mapa: "28→29", texto_id: "txt-Av3-TR22-en", audio_id: "audio-Av3-TR22-en" },
        // Parada 25: Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente (Reto 18)
        { padreid: "padre-P25", tipo: "parada", nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente", parada_id: "P-25", numero_mapa: "29", texto_id: "txt-Av3-P25-en", audio_id: "audio-Av3-P25-en", reto_id: "R18-Av3-en" },
        // Parada 26: Iglesia Santo Tomás Apostol y San Felipe Neri
        { padreid: "padre-P26", tipo: "parada", nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri", parada_id: "P-26", numero_mapa: "29", texto_id: "txt-Av3-P26-en", audio_id: "audio-Av3-P26-en" },
        // Tramo 23: Iglesia Santo Tomás Apostol y San Felipe Neri → Iglesia San Juan del Hospital
        { padreid: "padre-TR23", tipo: "tramo", nombre: "Iglesia San Vicente Ferrer y San Felipe Neri → Iglesia San Juan del Hospital", tramo_id: "TR-23", numero_mapa: "29→30", texto_id: "txt-Av3-TR23-en", audio_id: "audio-Av3-TR23-en" },
        // Parada 27: Iglesia San Juan del Hospital
        { padreid: "padre-P27", tipo: "parada", nombre: "Iglesia San Juan del Hospital", parada_id: "P-27", numero_mapa: "30", texto_id: "txt-Av3-P27-en", audio_id: "audio-Av3-P27-en" },
        // Tramo 24: Iglesia San Juan del Hospital → Palacio Arzobispal
        { padreid: "padre-TR24", tipo: "tramo", nombre: "Iglesia San Juan del Hospital → Palacio Arzobispal", tramo_id: "TR-24", numero_mapa: "30→31", texto_id: "txt-Av3-TR24-en", audio_id: "audio-Av3-TR24-en" },
        // Parada 28: Palacio Arzobispal
        { padreid: "padre-P28", tipo: "parada", nombre: "Palacio Arzobispal", parada_id: "P-28", numero_mapa: "31", texto_id: "txt-Av3-P28-en", audio_id: "audio-Av3-P28-en" },
        // Tramo 25: Palacio Arzobispal → Catedral de Valencia (Puerta Románica)
        { padreid: "padre-TR25", tipo: "tramo", nombre: "Palacio Arzobispal → Catedral de Valencia (Puerta Románica)", tramo_id: "TR-25", numero_mapa: "31→32", texto_id: "txt-Av3-TR25-en", audio_id: "audio-Av3-TR25-en" },
        // Parada 29: Catedral de Valencia (Puerta Románica) (Reto 19)
        { padreid: "padre-P29", tipo: "parada", nombre: "Catedral de Valencia (Puerta Románica)", parada_id: "P-29", numero_mapa: "32", texto_id: "txt-Av3-P29-en", audio_id: "audio-Av3-P29-en", reto_id: "R19-Av3-en" },
        // Tramo 26: Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína)
        { padreid: "padre-TR26", tipo: "tramo", nombre: "Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína)", tramo_id: "TR-26", numero_mapa: "32→33", texto_id: "txt-Av3-TR26-en", audio_id: "audio-Av3-TR26-en" },
        // Parada 30: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 1, Panel cerámico (reto 20)
        { padreid: "padre-P30", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 1, Panel cerámico", parada_id: "P-30", numero_mapa: "33", texto_id: "txt-Av3-P30-en", audio_id: "audio-Av3-P30-en", reto_id: "R20-Av3-en" },
        // Parada 31: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 2, Capilla exterior (reto 21)
        { padreid: "padre-P31", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 2, Capilla exterior", parada_id: "P-31", numero_mapa: "33", texto_id: "txt-Av3-P31-en", audio_id: "audio-Av3-P31-en", reto_id: "R21-Av3-en" },
        // Parada 32: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 3, Capilla exterior (reto 22)
        { padreid: "padre-P32", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 3, Capilla exterior", parada_id: "P-32", numero_mapa: "33", texto_id: "txt-Av3-P32-en", audio_id: "audio-Av3-P32-en", reto_id: "R22-Av3-en" },
        // Parada 33: Plaza Décimo Junio Bruto (Plaza de la Almoína) Basílica de Valencia
        { padreid: "padre-P33", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Basílica de Valencia", parada_id: "P-33", numero_mapa: "33/34", texto_id: "txt-Av3-P33-en", audio_id: "audio-Av3-P33-en" },
        // Parada 34: Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de gantxo (Reto 23)
        { padreid: "padre-P34", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de gantxo", parada_id: "P-34", numero_mapa: "33", texto_id: "txt-Av3-P34-en", audio_id: "audio-Av3-P34-en", reto_id: "R23-Av3-en" },
        // Tramo 27: Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico
        { padreid: "padre-TR27", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) → Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", tramo_id: "TR-27", numero_mapa: "33→33", texto_id: "txt-Av3-TR27-en", audio_id: "audio-Av3-TR27-en" },
        // Parada 35: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico (Reto 24)
        { padreid: "padre-P35", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", parada_id: "P-35", numero_mapa: "33", texto_id: "txt-Av3-P35-en", audio_id: "audio-Av3-P35-en", reto_id: "R24-Av3-en" },
        // Parada 36: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico 2 (Reto25puzzle PZ-02)
        { padreid: "padre-P36", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", parada_id: "P-36", numero_mapa: "33", texto_id: "txt-Av3-P36-en", audio_id: "audio-Av3-P36-en", reto_id: "PZ-02" },
        // Tramo 28: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen
        { padreid: "padre-TR28", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen", tramo_id: "TR-28", numero_mapa: "33→35", texto_id: "txt-Av3-TR28-en", audio_id: "audio-Av3-TR28-en" },
        // Parada 37: Plaza de la Virgen (Fuente de Neptuno) (Reto 26)
        { padreid: "padre-P37", tipo: "parada", nombre: "Plaza de la Virgen (Fuente de Neptuno)", parada_id: "P-37", numero_mapa: "35", texto_id: "txt-Av3-P37-en", audio_id: "audio-Av3-P37-en", reto_id: "R26-Av3-en" },
        // Parada 38: Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia) (Reto 27)
        { padreid: "padre-P38", tipo: "parada", nombre: "Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia)", parada_id: "P-38", numero_mapa: "35", texto_id: "txt-Av3-P38-en", audio_id: "audio-Av3-P38-en", reto_id: "R27-Av3-en" },
        // Tramo 29: Plaza de la Virgen → Torres de Serranos
        { padreid: "padre-TR29", tipo: "tramo", nombre: "Plaza de la Virgen → Torres de Serranos", tramo_id: "TR-29", numero_mapa: "35→1", texto_id: "txt-Av3-TR29-en", audio_id: "audio-Av3-TR29-en" },
        // Parada 39 - FINAL: Torres de Serranos Final (Reto28Puzzle PZ-05)
        { padreid: "padre-P39", tipo: "parada", nombre: "Torres de Serranos Final", parada_id: "P-39", numero_mapa: 1, texto_id: "txt-Av3-P39-en", audio_id: "audio-Av3-P39-en", reto_id: "PZ-05" },
      ]
    },
    fr: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
        {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av3-fr" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-fr", audio_id: "audio-intro-fr", reto_id: "R2-Av3-fr" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av3-P0-fr", audio_id: "audio-Av3-P0-fr", reto_id: "R3-Av3-fr" },
        // Tramo 1: Torres de Serranos → Plaza de la Crída (Torres de Serranos Front)
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Plaza de la Crída (Torres de Serranos Front)", tramo_id: "TR-1", numero_mapa: "1→2", texto_id: "txt-Av3-TR1-fr", audio_id: "audio-Av3-TR1-fr" },
        // Parada 1: Plaza de la Crída (Torres de Serranos Front) (Reto 4)
        { padreid: "padre-P1", tipo: "parada", nombre: "Plaza de la Crída (Torres de Serranos Front)", parada_id: "P-1", numero_mapa: 2, texto_id: "txt-Av3-P1-fr", audio_id: "audio-Av3-P1-fr", reto_id: "R4-Av3-fr" },
        // Tramo 2: Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos", tramo_id: "TR-2", numero_mapa: "1→2", texto_id: "txt-Av3-TR2-fr", audio_id: "audio-Av3-TR2-fr" },
        // Parada 2: Centro Puente Serranos 1 (Reto 5)
        { padreid: "padre-P2", tipo: "parada", nombre: "Centro Puente Serranos", parada_id: "P-2", numero_mapa: null, texto_id: "txt-Av3-P2-fr", audio_id: "audio-Av3-P2-fr", reto_id: "R5-Av3-fr" },
        // Parada 3: Centro Puente Serranos 2
        { padreid: "padre-P3", tipo: "parada", nombre: "Centro Puente Serranos 2", parada_id: "P-3", numero_mapa: null, texto_id: "txt-Av3-P3-fr", audio_id: "audio-Av3-P3-fr" },
        // Tramo 3: Centro Puente de Serranos 2 → Ruinas del Jardín del Turia
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Centro Puente de Serranos 2 → Ruinas del Jardín del Turia", tramo_id: "TR-3", numero_mapa: "-→6", texto_id: "txt-Av3-TR3-fr", audio_id: "audio-Av3-TR3-fr" },
        // Parada 4: Ruinas del Jardín del Turia
        { padreid: "padre-P4", tipo: "parada", nombre: "Ruinas del Jardín del Turia", parada_id: "P-4", numero_mapa: 6, texto_id: "txt-Av3-P4-fr", audio_id: "audio-Av3-P4-fr" },
        // Tramo 4: Ruinas del Jardín del Turia → Jardines del Real (Viveros)
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Ruinas del Jardín del Turia → Jardines del Real (Viveros)", tramo_id: "TR-4", numero_mapa: "6→7", texto_id: "txt-Av3-TR4-fr", audio_id: "audio-Av3-TR4-fr" },
        // Parada 5: Jardines del Real (Viveros) (Reto6puzzle PZ-08)
        { padreid: "padre-P5", tipo: "parada", nombre: "Jardines del Real (Viveros)", parada_id: "P-5", numero_mapa: 7, texto_id: "txt-Av3-P5-fr", audio_id: "audio-Av3-P5-fr", reto_id: "PZ-08" },
        // Tramo 5: Jardines del Real (Viveros) → Puente de la Exposición
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Jardines del Real (Viveros) → Puente de la Exposición", tramo_id: "TR-5", numero_mapa: "7→9", texto_id: "txt-Av3-TR5-fr", audio_id: "audio-Av3-TR5-fr" },
        // Parada 6: Puente de la Exposición (Reto 7)
        { padreid: "padre-P6", tipo: "parada", nombre: "Puente de la Exposición", parada_id: "P-6", numero_mapa: 9, texto_id: "txt-Av3-P6-fr", audio_id: "audio-Av3-P6-fr", reto_id: "R7-Av3-fr" },
        // Tramo 6: Puente de la Exposición → Puente de las Flores
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Puente de la Exposición → Puente de las Flores", tramo_id: "TR-6", numero_mapa: "9→10", texto_id: "txt-Av3-TR6-fr", audio_id: "audio-Av3-TR6-fr" },
        // Parada 7: Puente de las Flores
        { padreid: "padre-P7", tipo: "parada", nombre: "Puente de las Flores", parada_id: "P-7", numero_mapa: 10, texto_id: "txt-Av3-P7-fr", audio_id: "audio-Av3-P7-fr" },
        // Tramo 7: Puente de las Flores → Puente de Aragón (parte superior)
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Puente de las Flores → Puente de Aragón (parte superior)", tramo_id: "TR-7", numero_mapa: "10→12", texto_id: "txt-Av3-TR7-fr", audio_id: "audio-Av3-TR7-fr" },
        // Parada 8: Puente de Aragón 1 (Reto 8)
        { padreid: "padre-P8", tipo: "parada", nombre: "Puente de Aragón", parada_id: "P-8", numero_mapa: 12, texto_id: "txt-Av3-P8-fr", audio_id: "audio-Av3-P8-fr", reto_id: "R8-Av3-fr" },
        // Parada 9: Puente de Aragón 2
        { padreid: "padre-P9", tipo: "parada", nombre: "Puente de Aragón 2", parada_id: "P-9", numero_mapa: 12, texto_id: "txt-Av3-P9-fr", audio_id: "audio-Av3-P9-fr" },
        // Tramo 8: Puente de Aragón (parte superior) → Puente de la Mar (Parte Superior)
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Puente de Aragón (parte superior) → Puente de la Mar (Parte Superior)", tramo_id: "TR-8", numero_mapa: "12→11", texto_id: "txt-Av3-TR8-fr", audio_id: "audio-Av3-TR8-fr" },
        // Parada 10: Puente de la Mar (Parte Superior) (Reto 9)
        { padreid: "padre-P10", tipo: "parada", nombre: "Puente de la Mar (Parte Superior)", parada_id: "P-10", numero_mapa: 11, texto_id: "txt-Av3-P10-fr", audio_id: "audio-Av3-P10-fr", reto_id: "R9-Av3-fr" },
        // Tramo 9: Puente de la Mar (Parte Superior) → Palau de la música
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Puente de la Mar (Parte Superior) → Palau de la música", tramo_id: "TR-9", numero_mapa: "11→13", texto_id: "txt-Av3-TR9-fr", audio_id: "audio-Av3-TR9-fr" },
        // Parada 11: Palau de la Música (Reto 10)
        { padreid: "padre-P11", tipo: "parada", nombre: "Palau de la Música", parada_id: "P-11", numero_mapa: 13, texto_id: "txt-Av3-P11-fr", audio_id: "audio-Av3-P11-fr", reto_id: "R10-Av3-fr" },
        // Tramo 10: Palau de la música → Gulliver
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Palau de la música → Gulliver", tramo_id: "TR-10", numero_mapa: "13→15", texto_id: "txt-Av3-TR10-fr", audio_id: "audio-Av3-TR10-fr" },
        // Parada 12: Gulliver (Reto 11)
        { padreid: "padre-P12", tipo: "parada", nombre: "Gulliver", parada_id: "P-12", numero_mapa: 15, texto_id: "txt-Av3-P12-fr", audio_id: "audio-Av3-P12-fr", reto_id: "R11-Av3-fr" },
        // Tramo 11: Gulliver → Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Gulliver → Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias", tramo_id: "TR-11", numero_mapa: "15→17", texto_id: "txt-Av3-TR11-fr", audio_id: "audio-Av3-TR11-fr" },
        // Parada 13: Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias
        { padreid: "padre-P13", tipo: "parada", nombre: "Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias", parada_id: "P-13", numero_mapa: 17, texto_id: "txt-Av3-P13-fr", audio_id: "audio-Av3-P13-fr" },
        // Tramo 12: Pistas de Patinaje → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Pistas de Patinaje → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe", tramo_id: "TR-12", numero_mapa: "17→-", texto_id: "txt-Av3-TR12-fr", audio_id: "audio-Av3-TR12-fr" },
        // Parada 14: Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía
        { padreid: "padre-P14", tipo: "parada", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía", parada_id: "P-14", numero_mapa: 18, texto_id: "txt-Av3-P14-fr", audio_id: "audio-Av3-P14-fr" },
        // Parada 15: Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe
        { padreid: "padre-P15", tipo: "parada", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe", parada_id: "P-15", numero_mapa: 20, texto_id: "txt-Av3-P15-fr", audio_id: "audio-Av3-P15-fr" },
        // Tramo 13: Mirador de la Ciudad de las Artes y de las Ciencias → Puente l’Assut de l’Or
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe → Puente l’Assut de l’Or", tramo_id: "TR-13", numero_mapa: "20→21", texto_id: "txt-Av3-TR13-fr", audio_id: "audio-Av3-TR13-fr" },
        // Parada 16: Puente l’Assut de l’Or (Reto12puzzle PZ-09)
        { padreid: "padre-P16", tipo: "parada", nombre: "Puente l’Assut de l’Or", parada_id: "P-16", numero_mapa: 21, texto_id: "txt-Av3-P16-fr", audio_id: "audio-Av3-P16-fr", reto_id: "PZ-09" },
        // Tramo 14: Puente l’Assut de l’Or → Ágora y Oceanogràfic
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Puente l’Assut de l’Or → Ágora y Oceanogràfic", tramo_id: "TR-14", numero_mapa: "21→22/23", texto_id: "txt-Av3-TR14-fr", audio_id: "audio-Av3-TR14-fr" },
        // Parada 17: Ágora y Oceanogràfic
        { padreid: "padre-P17", tipo: "parada", nombre: "Ágora y Oceanogràfic", parada_id: "P-17", numero_mapa: "22/23", texto_id: "txt-Av3-P17-fr", audio_id: "audio-Av3-P17-fr" },
        // Tramo 15: Ágora y Oceanogràfic → Umbracle
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Ágora y Oceanogràfic → Umbracle", tramo_id: "TR-15", numero_mapa: "22/23→24", texto_id: "txt-Av3-TR15-fr", audio_id: "audio-Av3-TR15-fr" },
        // Parada 18: Umbracle (Reto 13)
        { padreid: "padre-P18", tipo: "parada", nombre: "Umbracle", parada_id: "P-18", numero_mapa: "24", texto_id: "txt-Av3-P18-fr", audio_id: "audio-Av3-P18-fr", reto_id: "R13-Av3-fr" },
        // Tramo 16: Umbracle → Hemisféric
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Umbracle → Hemisféric", tramo_id: "TR-16", numero_mapa: "24→25", texto_id: "txt-Av3-TR16-fr", audio_id: "audio-Av3-TR16-fr" },
        // Parada 19: Hemisféric (Reto 14)
        { padreid: "padre-P19", tipo: "parada", nombre: "Hemisféric", parada_id: "P-19", numero_mapa: "25", texto_id: "txt-Av3-P19-fr", audio_id: "audio-Av3-P19-fr", reto_id: "R14-Av3-fr" },
        // Tramo 17: Ciudad de las Artes y las Ciencias → Puente de la Mar
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Ciudad de las Artes y las Ciencias → Puente de la Mar", tramo_id: "TR-17", numero_mapa: "25→11", texto_id: "txt-Av3-TR17-fr", audio_id: "audio-Av3-TR17-fr" },
        // Parada 20: Puente de la Mar (Reto 15)
        { padreid: "padre-P20", tipo: "parada", nombre: "Puente de la Mar", parada_id: "P-20", numero_mapa: "25", texto_id: "txt-Av3-P20-fr", audio_id: "audio-Av3-P20-fr", reto_id: "R15-Av3-fr" },
        // Tramo 18: Puente de la Mar → Puerta de la Mar
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Puente de la Mar → Puerta de la Mar", tramo_id: "TR-18", numero_mapa: "11→26", texto_id: "txt-Av3-TR18-fr", audio_id: "audio-Av3-TR18-fr" },
        // Parada 21: Puerta de la Mar (Reto 16)
        { padreid: "padre-P21", tipo: "parada", nombre: "Puerta de la Mar", parada_id: "P-21", numero_mapa: "26", texto_id: "txt-Av3-P21-fr", audio_id: "audio-Av3-P21-fr", reto_id: "R16-Av3-fr" },
        // Tramo 19: Puerta de la Mar → Palacio de Justicia
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Puerta de la Mar → Palacio de Justicia", tramo_id: "TR-19", numero_mapa: "26→27", texto_id: "txt-Av3-TR19-fr", audio_id: "audio-Av3-TR19-fr" },
        // Parada 22: Palacio de Justicia
        { padreid: "padre-P22", tipo: "parada", nombre: "Palacio de Justicia", parada_id: "P-22", numero_mapa: "26", texto_id: "txt-Av3-P22-fr", audio_id: "audio-Av3-P22-fr" },
        // Tramo 20: Palacio de Justicia → Fundación Bancaja 1
        { padreid: "padre-TR20", tipo: "tramo", nombre: "Palacio de Justicia → Fundación Bancaja 1", tramo_id: "TR-20", numero_mapa: "27→28", texto_id: "txt-Av3-TR20-fr", audio_id: "audio-Av3-TR20-fr" },
        // Parada 23: Fundación Bancaja 1 (Reto 17)
        { padreid: "padre-P23", tipo: "parada", nombre: "Fundación Bancaja 1", parada_id: "P-23", numero_mapa: "28", texto_id: "txt-Av3-P23-fr", audio_id: "audio-Av3-P23-fr", reto_id: "R17-Av3-fr" },
        // Tramo 21: Fundación Bancaja 1 → Fundación Bancaja 2
        { padreid: "padre-TR21", tipo: "tramo", nombre: "Fundación Bancaja 1 → Fundación Bancaja 2", tramo_id: "TR-21", numero_mapa: "28→28", texto_id: "txt-Av3-TR21-fr", audio_id: "audio-Av3-TR21-fr" },
        // Parada 24: Fundación Bancaja 2
        { padreid: "padre-P24", tipo: "parada", nombre: "Fundación Bancaja 2", parada_id: "P-24", numero_mapa: "28", texto_id: "txt-Av3-P24-fr", audio_id: "audio-Av3-P24-fr" },
        // Tramo 22: Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente
        { padreid: "padre-TR22", tipo: "tramo", nombre: "Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente", tramo_id: "TR-22", numero_mapa: "28→29", texto_id: "txt-Av3-TR22-fr", audio_id: "audio-Av3-TR22-fr" },
        // Parada 25: Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente (Reto 18)
        { padreid: "padre-P25", tipo: "parada", nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente", parada_id: "P-25", numero_mapa: "29", texto_id: "txt-Av3-P25-fr", audio_id: "audio-Av3-P25-fr", reto_id: "R18-Av3-fr" },
        // Parada 26: Iglesia Santo Tomás Apostol y San Felipe Neri
        { padreid: "padre-P26", tipo: "parada", nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri", parada_id: "P-26", numero_mapa: "29", texto_id: "txt-Av3-P26-fr", audio_id: "audio-Av3-P26-fr" },
        // Tramo 23: Iglesia Santo Tomás Apostol y San Felipe Neri → Iglesia San Juan del Hospital
        { padreid: "padre-TR23", tipo: "tramo", nombre: "Iglesia San Vicente Ferrer y San Felipe Neri → Iglesia San Juan del Hospital", tramo_id: "TR-23", numero_mapa: "29→30", texto_id: "txt-Av3-TR23-fr", audio_id: "audio-Av3-TR23-fr" },
        // Parada 27: Iglesia San Juan del Hospital
        { padreid: "padre-P27", tipo: "parada", nombre: "Iglesia San Juan del Hospital", parada_id: "P-27", numero_mapa: "30", texto_id: "txt-Av3-P27-fr", audio_id: "audio-Av3-P27-fr" },
        // Tramo 24: Iglesia San Juan del Hospital → Palacio Arzobispal
        { padreid: "padre-TR24", tipo: "tramo", nombre: "Iglesia San Juan del Hospital → Palacio Arzobispal", tramo_id: "TR-24", numero_mapa: "30→31", texto_id: "txt-Av3-TR24-fr", audio_id: "audio-Av3-TR24-fr" },
        // Parada 28: Palacio Arzobispal
        { padreid: "padre-P28", tipo: "parada", nombre: "Palacio Arzobispal", parada_id: "P-28", numero_mapa: "31", texto_id: "txt-Av3-P28-fr", audio_id: "audio-Av3-P28-fr" },
        // Tramo 25: Palacio Arzobispal → Catedral de Valencia (Puerta Románica)
        { padreid: "padre-TR25", tipo: "tramo", nombre: "Palacio Arzobispal → Catedral de Valencia (Puerta Románica)", tramo_id: "TR-25", numero_mapa: "31→32", texto_id: "txt-Av3-TR25-fr", audio_id: "audio-Av3-TR25-fr" },
        // Parada 29: Catedral de Valencia (Puerta Románica) (Reto 19)
        { padreid: "padre-P29", tipo: "parada", nombre: "Catedral de Valencia (Puerta Románica)", parada_id: "P-29", numero_mapa: "32", texto_id: "txt-Av3-P29-fr", audio_id: "audio-Av3-P29-fr", reto_id: "R19-Av3-fr" },
        // Tramo 26: Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína)
        { padreid: "padre-TR26", tipo: "tramo", nombre: "Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína)", tramo_id: "TR-26", numero_mapa: "32→33", texto_id: "txt-Av3-TR26-fr", audio_id: "audio-Av3-TR26-fr" },
        // Parada 30: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 1, Panel cerámico (reto 20)
        { padreid: "padre-P30", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 1, Panel cerámico", parada_id: "P-30", numero_mapa: "33", texto_id: "txt-Av3-P30-fr", audio_id: "audio-Av3-P30-fr", reto_id: "R20-Av3-fr" },
        // Parada 31: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 2, Capilla exterior (reto 21)
        { padreid: "padre-P31", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 2, Capilla exterior", parada_id: "P-31", numero_mapa: "33", texto_id: "txt-Av3-P31-fr", audio_id: "audio-Av3-P31-fr", reto_id: "R21-Av3-fr" },
        // Parada 32: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 3, Capilla exterior (reto 22)
        { padreid: "padre-P32", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 3, Capilla exterior", parada_id: "P-32", numero_mapa: "33", texto_id: "txt-Av3-P32-fr", audio_id: "audio-Av3-P32-fr", reto_id: "R22-Av3-fr" },
        // Parada 33: Plaza Décimo Junio Bruto (Plaza de la Almoína) Basílica de Valencia
        { padreid: "padre-P33", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Basílica de Valencia", parada_id: "P-33", numero_mapa: "33/34", texto_id: "txt-Av3-P33-fr", audio_id: "audio-Av3-P33-fr" },
        // Parada 34: Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de gantxo (Reto 23)
        { padreid: "padre-P34", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de gantxo", parada_id: "P-34", numero_mapa: "33", texto_id: "txt-Av3-P34-fr", audio_id: "audio-Av3-P34-fr", reto_id: "R23-Av3-fr" },
        // Tramo 27: Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico
        { padreid: "padre-TR27", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) → Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", tramo_id: "TR-27", numero_mapa: "33→33", texto_id: "txt-Av3-TR27-fr", audio_id: "audio-Av3-TR27-fr" },
        // Parada 35: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico (Reto 24)
        { padreid: "padre-P35", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", parada_id: "P-35", numero_mapa: "33", texto_id: "txt-Av3-P35-fr", audio_id: "audio-Av3-P35-fr", reto_id: "R24-Av3-fr" },
        // Parada 36: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico 2 (Reto25puzzle PZ-02)
        { padreid: "padre-P36", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", parada_id: "P-36", numero_mapa: "33", texto_id: "txt-Av3-P36-fr", audio_id: "audio-Av3-P36-fr", reto_id: "PZ-02" },
        // Tramo 28: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen
        { padreid: "padre-TR28", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen", tramo_id: "TR-28", numero_mapa: "33→35", texto_id: "txt-Av3-TR28-fr", audio_id: "audio-Av3-TR28-fr" },
        // Parada 37: Plaza de la Virgen (Fuente de Neptuno) (Reto 26)
        { padreid: "padre-P37", tipo: "parada", nombre: "Plaza de la Virgen (Fuente de Neptuno)", parada_id: "P-37", numero_mapa: "35", texto_id: "txt-Av3-P37-fr", audio_id: "audio-Av3-P37-fr", reto_id: "R26-Av3-fr" },
        // Parada 38: Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia) (Reto 27)
        { padreid: "padre-P38", tipo: "parada", nombre: "Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia)", parada_id: "P-38", numero_mapa: "35", texto_id: "txt-Av3-P38-fr", audio_id: "audio-Av3-P38-fr", reto_id: "R27-Av3-fr" },
        // Tramo 29: Plaza de la Virgen → Torres de Serranos
        { padreid: "padre-TR29", tipo: "tramo", nombre: "Plaza de la Virgen → Torres de Serranos", tramo_id: "TR-29", numero_mapa: "35→1", texto_id: "txt-Av3-TR29-fr", audio_id: "audio-Av3-TR29-fr" },
        // Parada 39 - FINAL: Torres de Serranos Final (Reto28Puzzle PZ-05)
        { padreid: "padre-P39", tipo: "parada", nombre: "Torres de Serranos Final", parada_id: "P-39", numero_mapa: 1, texto_id: "txt-Av3-P39-fr", audio_id: "audio-Av3-P39-fr", reto_id: "PZ-05" },
      ]
    },
    it: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
        {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av3-it" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-it", audio_id: "audio-intro-it", reto_id: "R2-Av3-it" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av3-P0-it", audio_id: "audio-Av3-P0-it", reto_id: "R3-Av3-it" },
        // Tramo 1: Torres de Serranos → Plaza de la Crída (Torres de Serranos Front)
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Plaza de la Crída (Torres de Serranos Front)", tramo_id: "TR-1", numero_mapa: "1→2", texto_id: "txt-Av3-TR1-it", audio_id: "audio-Av3-TR1-it" },
        // Parada 1: Plaza de la Crída (Torres de Serranos Front) (Reto 4)
        { padreid: "padre-P1", tipo: "parada", nombre: "Plaza de la Crída (Torres de Serranos Front)", parada_id: "P-1", numero_mapa: 2, texto_id: "txt-Av3-P1-it", audio_id: "audio-Av3-P1-it", reto_id: "R4-Av3-it" },
        // Tramo 2: Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos", tramo_id: "TR-2", numero_mapa: "1→2", texto_id: "txt-Av3-TR2-it", audio_id: "audio-Av3-TR2-it" },
        // Parada 2: Centro Puente Serranos 1 (Reto 5)
        { padreid: "padre-P2", tipo: "parada", nombre: "Centro Puente Serranos", parada_id: "P-2", numero_mapa: null, texto_id: "txt-Av3-P2-it", audio_id: "audio-Av3-P2-it", reto_id: "R5-Av3-it" },
        // Parada 3: Centro Puente Serranos 2
        { padreid: "padre-P3", tipo: "parada", nombre: "Centro Puente Serranos 2", parada_id: "P-3", numero_mapa: null, texto_id: "txt-Av3-P3-it", audio_id: "audio-Av3-P3-it" },
        // Tramo 3: Centro Puente de Serranos 2 → Ruinas del Jardín del Turia
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Centro Puente de Serranos 2 → Ruinas del Jardín del Turia", tramo_id: "TR-3", numero_mapa: "-→6", texto_id: "txt-Av3-TR3-it", audio_id: "audio-Av3-TR3-it" },
        // Parada 4: Ruinas del Jardín del Turia
        { padreid: "padre-P4", tipo: "parada", nombre: "Ruinas del Jardín del Turia", parada_id: "P-4", numero_mapa: 6, texto_id: "txt-Av3-P4-it", audio_id: "audio-Av3-P4-it" },
        // Tramo 4: Ruinas del Jardín del Turia → Jardines del Real (Viveros)
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Ruinas del Jardín del Turia → Jardines del Real (Viveros)", tramo_id: "TR-4", numero_mapa: "6→7", texto_id: "txt-Av3-TR4-it", audio_id: "audio-Av3-TR4-it" },
        // Parada 5: Jardines del Real (Viveros) (Reto6puzzle PZ-08)
        { padreid: "padre-P5", tipo: "parada", nombre: "Jardines del Real (Viveros)", parada_id: "P-5", numero_mapa: 7, texto_id: "txt-Av3-P5-it", audio_id: "audio-Av3-P5-it", reto_id: "PZ-08" },
        // Tramo 5: Jardines del Real (Viveros) → Puente de la Exposición
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Jardines del Real (Viveros) → Puente de la Exposición", tramo_id: "TR-5", numero_mapa: "7→9", texto_id: "txt-Av3-TR5-it", audio_id: "audio-Av3-TR5-it" },
        // Parada 6: Puente de la Exposición (Reto 7)
        { padreid: "padre-P6", tipo: "parada", nombre: "Puente de la Exposición", parada_id: "P-6", numero_mapa: 9, texto_id: "txt-Av3-P6-it", audio_id: "audio-Av3-P6-it", reto_id: "R7-Av3-it" },
        // Tramo 6: Puente de la Exposición → Puente de las Flores
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Puente de la Exposición → Puente de las Flores", tramo_id: "TR-6", numero_mapa: "9→10", texto_id: "txt-Av3-TR6-it", audio_id: "audio-Av3-TR6-it" },
        // Parada 7: Puente de las Flores
        { padreid: "padre-P7", tipo: "parada", nombre: "Puente de las Flores", parada_id: "P-7", numero_mapa: 10, texto_id: "txt-Av3-P7-it", audio_id: "audio-Av3-P7-it" },
        // Tramo 7: Puente de las Flores → Puente de Aragón (parte superior)
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Puente de las Flores → Puente de Aragón (parte superior)", tramo_id: "TR-7", numero_mapa: "10→12", texto_id: "txt-Av3-TR7-it", audio_id: "audio-Av3-TR7-it" },
        // Parada 8: Puente de Aragón 1 (Reto 8)
        { padreid: "padre-P8", tipo: "parada", nombre: "Puente de Aragón", parada_id: "P-8", numero_mapa: 12, texto_id: "txt-Av3-P8-it", audio_id: "audio-Av3-P8-it", reto_id: "R8-Av3-it" },
        // Parada 9: Puente de Aragón 2
        { padreid: "padre-P9", tipo: "parada", nombre: "Puente de Aragón 2", parada_id: "P-9", numero_mapa: 12, texto_id: "txt-Av3-P9-it", audio_id: "audio-Av3-P9-it" },
        // Tramo 8: Puente de Aragón (parte superior) → Puente de la Mar (Parte Superior)
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Puente de Aragón (parte superior) → Puente de la Mar (Parte Superior)", tramo_id: "TR-8", numero_mapa: "12→11", texto_id: "txt-Av3-TR8-it", audio_id: "audio-Av3-TR8-it" },
        // Parada 10: Puente de la Mar (Parte Superior) (Reto 9)
        { padreid: "padre-P10", tipo: "parada", nombre: "Puente de la Mar (Parte Superior)", parada_id: "P-10", numero_mapa: 11, texto_id: "txt-Av3-P10-it", audio_id: "audio-Av3-P10-it", reto_id: "R9-Av3-it" },
        // Tramo 9: Puente de la Mar (Parte Superior) → Palau de la música
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Puente de la Mar (Parte Superior) → Palau de la música", tramo_id: "TR-9", numero_mapa: "11→13", texto_id: "txt-Av3-TR9-it", audio_id: "audio-Av3-TR9-it" },
        // Parada 11: Palau de la Música (Reto 10)
        { padreid: "padre-P11", tipo: "parada", nombre: "Palau de la Música", parada_id: "P-11", numero_mapa: 13, texto_id: "txt-Av3-P11-it", audio_id: "audio-Av3-P11-it", reto_id: "R10-Av3-it" },
        // Tramo 10: Palau de la música → Gulliver
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Palau de la música → Gulliver", tramo_id: "TR-10", numero_mapa: "13→15", texto_id: "txt-Av3-TR10-it", audio_id: "audio-Av3-TR10-it" },
        // Parada 12: Gulliver (Reto 11)
        { padreid: "padre-P12", tipo: "parada", nombre: "Gulliver", parada_id: "P-12", numero_mapa: 15, texto_id: "txt-Av3-P12-it", audio_id: "audio-Av3-P12-it", reto_id: "R11-Av3-it" },
        // Tramo 11: Gulliver → Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Gulliver → Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias", tramo_id: "TR-11", numero_mapa: "15→17", texto_id: "txt-Av3-TR11-it", audio_id: "audio-Av3-TR11-it" },
        // Parada 13: Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias
        { padreid: "padre-P13", tipo: "parada", nombre: "Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias", parada_id: "P-13", numero_mapa: 17, texto_id: "txt-Av3-P13-it", audio_id: "audio-Av3-P13-it" },
        // Tramo 12: Pistas de Patinaje → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Pistas de Patinaje → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe", tramo_id: "TR-12", numero_mapa: "17→-", texto_id: "txt-Av3-TR12-it", audio_id: "audio-Av3-TR12-it" },
        // Parada 14: Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía
        { padreid: "padre-P14", tipo: "parada", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía", parada_id: "P-14", numero_mapa: 18, texto_id: "txt-Av3-P14-it", audio_id: "audio-Av3-P14-it" },
        // Parada 15: Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe
        { padreid: "padre-P15", tipo: "parada", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe", parada_id: "P-15", numero_mapa: 20, texto_id: "txt-Av3-P15-it", audio_id: "audio-Av3-P15-it" },
        // Tramo 13: Mirador de la Ciudad de las Artes y de las Ciencias → Puente l’Assut de l’Or
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe → Puente l’Assut de l’Or", tramo_id: "TR-13", numero_mapa: "20→21", texto_id: "txt-Av3-TR13-it", audio_id: "audio-Av3-TR13-it" },
        // Parada 16: Puente l’Assut de l’Or (Reto12puzzle PZ-09)
        { padreid: "padre-P16", tipo: "parada", nombre: "Puente l’Assut de l’Or", parada_id: "P-16", numero_mapa: 21, texto_id: "txt-Av3-P16-it", audio_id: "audio-Av3-P16-it", reto_id: "PZ-09" },
        // Tramo 14: Puente l’Assut de l’Or → Ágora y Oceanogràfic
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Puente l’Assut de l’Or → Ágora y Oceanogràfic", tramo_id: "TR-14", numero_mapa: "21→22/23", texto_id: "txt-Av3-TR14-it", audio_id: "audio-Av3-TR14-it" },
        // Parada 17: Ágora y Oceanogràfic
        { padreid: "padre-P17", tipo: "parada", nombre: "Ágora y Oceanogràfic", parada_id: "P-17", numero_mapa: "22/23", texto_id: "txt-Av3-P17-it", audio_id: "audio-Av3-P17-it" },
        // Tramo 15: Ágora y Oceanogràfic → Umbracle
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Ágora y Oceanogràfic → Umbracle", tramo_id: "TR-15", numero_mapa: "22/23→24", texto_id: "txt-Av3-TR15-it", audio_id: "audio-Av3-TR15-it" },
        // Parada 18: Umbracle (Reto 13)
        { padreid: "padre-P18", tipo: "parada", nombre: "Umbracle", parada_id: "P-18", numero_mapa: "24", texto_id: "txt-Av3-P18-it", audio_id: "audio-Av3-P18-it", reto_id: "R13-Av3-it" },
        // Tramo 16: Umbracle → Hemisféric
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Umbracle → Hemisféric", tramo_id: "TR-16", numero_mapa: "24→25", texto_id: "txt-Av3-TR16-it", audio_id: "audio-Av3-TR16-it" },
        // Parada 19: Hemisféric (Reto 14)
        { padreid: "padre-P19", tipo: "parada", nombre: "Hemisféric", parada_id: "P-19", numero_mapa: "25", texto_id: "txt-Av3-P19-it", audio_id: "audio-Av3-P19-it", reto_id: "R14-Av3-it" },
        // Tramo 17: Ciudad de las Artes y las Ciencias → Puente de la Mar
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Ciudad de las Artes y las Ciencias → Puente de la Mar", tramo_id: "TR-17", numero_mapa: "25→11", texto_id: "txt-Av3-TR17-it", audio_id: "audio-Av3-TR17-it" },
        // Parada 20: Puente de la Mar (Reto 15)
        { padreid: "padre-P20", tipo: "parada", nombre: "Puente de la Mar", parada_id: "P-20", numero_mapa: "25", texto_id: "txt-Av3-P20-it", audio_id: "audio-Av3-P20-it", reto_id: "R15-Av3-it" },
        // Tramo 18: Puente de la Mar → Puerta de la Mar
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Puente de la Mar → Puerta de la Mar", tramo_id: "TR-18", numero_mapa: "11→26", texto_id: "txt-Av3-TR18-it", audio_id: "audio-Av3-TR18-it" },
        // Parada 21: Puerta de la Mar (Reto 16)
        { padreid: "padre-P21", tipo: "parada", nombre: "Puerta de la Mar", parada_id: "P-21", numero_mapa: "26", texto_id: "txt-Av3-P21-it", audio_id: "audio-Av3-P21-it", reto_id: "R16-Av3-it" },
        // Tramo 19: Puerta de la Mar → Palacio de Justicia
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Puerta de la Mar → Palacio de Justicia", tramo_id: "TR-19", numero_mapa: "26→27", texto_id: "txt-Av3-TR19-it", audio_id: "audio-Av3-TR19-it" },
        // Parada 22: Palacio de Justicia
        { padreid: "padre-P22", tipo: "parada", nombre: "Palacio de Justicia", parada_id: "P-22", numero_mapa: "26", texto_id: "txt-Av3-P22-it", audio_id: "audio-Av3-P22-it" },
        // Tramo 20: Palacio de Justicia → Fundación Bancaja 1
        { padreid: "padre-TR20", tipo: "tramo", nombre: "Palacio de Justicia → Fundación Bancaja 1", tramo_id: "TR-20", numero_mapa: "27→28", texto_id: "txt-Av3-TR20-it", audio_id: "audio-Av3-TR20-it" },
        // Parada 23: Fundación Bancaja 1 (Reto 17)
        { padreid: "padre-P23", tipo: "parada", nombre: "Fundación Bancaja 1", parada_id: "P-23", numero_mapa: "28", texto_id: "txt-Av3-P23-it", audio_id: "audio-Av3-P23-it", reto_id: "R17-Av3-it" },
        // Tramo 21: Fundación Bancaja 1 → Fundación Bancaja 2
        { padreid: "padre-TR21", tipo: "tramo", nombre: "Fundación Bancaja 1 → Fundación Bancaja 2", tramo_id: "TR-21", numero_mapa: "28→28", texto_id: "txt-Av3-TR21-it", audio_id: "audio-Av3-TR21-it" },
        // Parada 24: Fundación Bancaja 2
        { padreid: "padre-P24", tipo: "parada", nombre: "Fundación Bancaja 2", parada_id: "P-24", numero_mapa: "28", texto_id: "txt-Av3-P24-it", audio_id: "audio-Av3-P24-it" },
        // Tramo 22: Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente
        { padreid: "padre-TR22", tipo: "tramo", nombre: "Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente", tramo_id: "TR-22", numero_mapa: "28→29", texto_id: "txt-Av3-TR22-it", audio_id: "audio-Av3-TR22-it" },
        // Parada 25: Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente (Reto 18)
        { padreid: "padre-P25", tipo: "parada", nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente", parada_id: "P-25", numero_mapa: "29", texto_id: "txt-Av3-P25-it", audio_id: "audio-Av3-P25-it", reto_id: "R18-Av3-it" },
        // Parada 26: Iglesia Santo Tomás Apostol y San Felipe Neri
        { padreid: "padre-P26", tipo: "parada", nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri", parada_id: "P-26", numero_mapa: "29", texto_id: "txt-Av3-P26-it", audio_id: "audio-Av3-P26-it" },
        // Tramo 23: Iglesia Santo Tomás Apostol y San Felipe Neri → Iglesia San Juan del Hospital
        { padreid: "padre-TR23", tipo: "tramo", nombre: "Iglesia San Vicente Ferrer y San Felipe Neri → Iglesia San Juan del Hospital", tramo_id: "TR-23", numero_mapa: "29→30", texto_id: "txt-Av3-TR23-it", audio_id: "audio-Av3-TR23-it" },
        // Parada 27: Iglesia San Juan del Hospital
        { padreid: "padre-P27", tipo: "parada", nombre: "Iglesia San Juan del Hospital", parada_id: "P-27", numero_mapa: "30", texto_id: "txt-Av3-P27-it", audio_id: "audio-Av3-P27-it" },
        // Tramo 24: Iglesia San Juan del Hospital → Palacio Arzobispal
        { padreid: "padre-TR24", tipo: "tramo", nombre: "Iglesia San Juan del Hospital → Palacio Arzobispal", tramo_id: "TR-24", numero_mapa: "30→31", texto_id: "txt-Av3-TR24-it", audio_id: "audio-Av3-TR24-it" },
        // Parada 28: Palacio Arzobispal
        { padreid: "padre-P28", tipo: "parada", nombre: "Palacio Arzobispal", parada_id: "P-28", numero_mapa: "31", texto_id: "txt-Av3-P28-it", audio_id: "audio-Av3-P28-it" },
        // Tramo 25: Palacio Arzobispal → Catedral de Valencia (Puerta Románica)
        { padreid: "padre-TR25", tipo: "tramo", nombre: "Palacio Arzobispal → Catedral de Valencia (Puerta Románica)", tramo_id: "TR-25", numero_mapa: "31→32", texto_id: "txt-Av3-TR25-it", audio_id: "audio-Av3-TR25-it" },
        // Parada 29: Catedral de Valencia (Puerta Románica) (Reto 19)
        { padreid: "padre-P29", tipo: "parada", nombre: "Catedral de Valencia (Puerta Románica)", parada_id: "P-29", numero_mapa: "32", texto_id: "txt-Av3-P29-it", audio_id: "audio-Av3-P29-it", reto_id: "R19-Av3-it" },
        // Tramo 26: Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína)
        { padreid: "padre-TR26", tipo: "tramo", nombre: "Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína)", tramo_id: "TR-26", numero_mapa: "32→33", texto_id: "txt-Av3-TR26-it", audio_id: "audio-Av3-TR26-it" },
        // Parada 30: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 1, Panel cerámico (reto 20)
        { padreid: "padre-P30", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 1, Panel cerámico", parada_id: "P-30", numero_mapa: "33", texto_id: "txt-Av3-P30-it", audio_id: "audio-Av3-P30-it", reto_id: "R20-Av3-it" },
        // Parada 31: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 2, Capilla exterior (reto 21)
        { padreid: "padre-P31", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 2, Capilla exterior", parada_id: "P-31", numero_mapa: "33", texto_id: "txt-Av3-P31-it", audio_id: "audio-Av3-P31-it", reto_id: "R21-Av3-it" },
        // Parada 32: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 3, Capilla exterior (reto 22)
        { padreid: "padre-P32", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 3, Capilla exterior", parada_id: "P-32", numero_mapa: "33", texto_id: "txt-Av3-P32-it", audio_id: "audio-Av3-P32-it", reto_id: "R22-Av3-it" },
        // Parada 33: Plaza Décimo Junio Bruto (Plaza de la Almoína) Basílica de Valencia
        { padreid: "padre-P33", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Basílica de Valencia", parada_id: "P-33", numero_mapa: "33/34", texto_id: "txt-Av3-P33-it", audio_id: "audio-Av3-P33-it" },
        // Parada 34: Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de gantxo (Reto 23)
        { padreid: "padre-P34", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de gantxo", parada_id: "P-34", numero_mapa: "33", texto_id: "txt-Av3-P34-it", audio_id: "audio-Av3-P34-it", reto_id: "R23-Av3-it" },
        // Tramo 27: Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico
        { padreid: "padre-TR27", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) → Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", tramo_id: "TR-27", numero_mapa: "33→33", texto_id: "txt-Av3-TR27-it", audio_id: "audio-Av3-TR27-it" },
        // Parada 35: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico (Reto 24)
        { padreid: "padre-P35", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", parada_id: "P-35", numero_mapa: "33", texto_id: "txt-Av3-P35-it", audio_id: "audio-Av3-P35-it", reto_id: "R24-Av3-it" },
        // Parada 36: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico 2 (Reto25puzzle PZ-02)
        { padreid: "padre-P36", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", parada_id: "P-36", numero_mapa: "33", texto_id: "txt-Av3-P36-it", audio_id: "audio-Av3-P36-it", reto_id: "PZ-02" },
        // Tramo 28: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen
        { padreid: "padre-TR28", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen", tramo_id: "TR-28", numero_mapa: "33→35", texto_id: "txt-Av3-TR28-it", audio_id: "audio-Av3-TR28-it" },
        // Parada 37: Plaza de la Virgen (Fuente de Neptuno) (Reto 26)
        { padreid: "padre-P37", tipo: "parada", nombre: "Plaza de la Virgen (Fuente de Neptuno)", parada_id: "P-37", numero_mapa: "35", texto_id: "txt-Av3-P37-it", audio_id: "audio-Av3-P37-it", reto_id: "R26-Av3-it" },
        // Parada 38: Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia) (Reto 27)
        { padreid: "padre-P38", tipo: "parada", nombre: "Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia)", parada_id: "P-38", numero_mapa: "35", texto_id: "txt-Av3-P38-it", audio_id: "audio-Av3-P38-it", reto_id: "R27-Av3-it" },
        // Tramo 29: Plaza de la Virgen → Torres de Serranos
        { padreid: "padre-TR29", tipo: "tramo", nombre: "Plaza de la Virgen → Torres de Serranos", tramo_id: "TR-29", numero_mapa: "35→1", texto_id: "txt-Av3-TR29-it", audio_id: "audio-Av3-TR29-it" },
        // Parada 39 - FINAL: Torres de Serranos Final (Reto28Puzzle PZ-05)
        { padreid: "padre-P39", tipo: "parada", nombre: "Torres de Serranos Final", parada_id: "P-39", numero_mapa: 1, texto_id: "txt-Av3-P39-it", audio_id: "audio-Av3-P39-it", reto_id: "PZ-05" },
      ]
    },
    nl: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
        {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av3-nl" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-nl", audio_id: "audio-intro-nl", reto_id: "R2-Av3-nl" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av3-P0-nl", audio_id: "audio-Av3-P0-nl", reto_id: "R3-Av3-nl" },
        // Tramo 1: Torres de Serranos → Plaza de la Crída (Torres de Serranos Front)
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Plaza de la Crída (Torres de Serranos Front)", tramo_id: "TR-1", numero_mapa: "1→2", texto_id: "txt-Av3-TR1-nl", audio_id: "audio-Av3-TR1-nl" },
        // Parada 1: Plaza de la Crída (Torres de Serranos Front) (Reto 4)
        { padreid: "padre-P1", tipo: "parada", nombre: "Plaza de la Crída (Torres de Serranos Front)", parada_id: "P-1", numero_mapa: 2, texto_id: "txt-Av3-P1-nl", audio_id: "audio-Av3-P1-nl", reto_id: "R4-Av3-nl" },
        // Tramo 2: Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos", tramo_id: "TR-2", numero_mapa: "1→2", texto_id: "txt-Av3-TR2-nl", audio_id: "audio-Av3-TR2-nl" },
        // Parada 2: Centro Puente Serranos 1 (Reto 5)
        { padreid: "padre-P2", tipo: "parada", nombre: "Centro Puente Serranos", parada_id: "P-2", numero_mapa: null, texto_id: "txt-Av3-P2-nl", audio_id: "audio-Av3-P2-nl", reto_id: "R5-Av3-nl" },
        // Parada 3: Centro Puente Serranos 2
        { padreid: "padre-P3", tipo: "parada", nombre: "Centro Puente Serranos 2", parada_id: "P-3", numero_mapa: null, texto_id: "txt-Av3-P3-nl", audio_id: "audio-Av3-P3-nl" },
        // Tramo 3: Centro Puente de Serranos 2 → Ruinas del Jardín del Turia
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Centro Puente de Serranos 2 → Ruinas del Jardín del Turia", tramo_id: "TR-3", numero_mapa: "-→6", texto_id: "txt-Av3-TR3-nl", audio_id: "audio-Av3-TR3-nl" },
        // Parada 4: Ruinas del Jardín del Turia
        { padreid: "padre-P4", tipo: "parada", nombre: "Ruinas del Jardín del Turia", parada_id: "P-4", numero_mapa: 6, texto_id: "txt-Av3-P4-nl", audio_id: "audio-Av3-P4-nl" },
        // Tramo 4: Ruinas del Jardín del Turia → Jardines del Real (Viveros)
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Ruinas del Jardín del Turia → Jardines del Real (Viveros)", tramo_id: "TR-4", numero_mapa: "6→7", texto_id: "txt-Av3-TR4-nl", audio_id: "audio-Av3-TR4-nl" },
        // Parada 5: Jardines del Real (Viveros) (Reto6puzzle PZ-08)
        { padreid: "padre-P5", tipo: "parada", nombre: "Jardines del Real (Viveros)", parada_id: "P-5", numero_mapa: 7, texto_id: "txt-Av3-P5-nl", audio_id: "audio-Av3-P5-nl", reto_id: "PZ-08" },
        // Tramo 5: Jardines del Real (Viveros) → Puente de la Exposición
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Jardines del Real (Viveros) → Puente de la Exposición", tramo_id: "TR-5", numero_mapa: "7→9", texto_id: "txt-Av3-TR5-nl", audio_id: "audio-Av3-TR5-nl" },
        // Parada 6: Puente de la Exposición (Reto 7)
        { padreid: "padre-P6", tipo: "parada", nombre: "Puente de la Exposición", parada_id: "P-6", numero_mapa: 9, texto_id: "txt-Av3-P6-nl", audio_id: "audio-Av3-P6-nl", reto_id: "R7-Av3-nl" },
        // Tramo 6: Puente de la Exposición → Puente de las Flores
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Puente de la Exposición → Puente de las Flores", tramo_id: "TR-6", numero_mapa: "9→10", texto_id: "txt-Av3-TR6-nl", audio_id: "audio-Av3-TR6-nl" },
        // Parada 7: Puente de las Flores
        { padreid: "padre-P7", tipo: "parada", nombre: "Puente de las Flores", parada_id: "P-7", numero_mapa: 10, texto_id: "txt-Av3-P7-nl", audio_id: "audio-Av3-P7-nl" },
        // Tramo 7: Puente de las Flores → Puente de Aragón (parte superior)
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Puente de las Flores → Puente de Aragón (parte superior)", tramo_id: "TR-7", numero_mapa: "10→12", texto_id: "txt-Av3-TR7-nl", audio_id: "audio-Av3-TR7-nl" },
        // Parada 8: Puente de Aragón 1 (Reto 8)
        { padreid: "padre-P8", tipo: "parada", nombre: "Puente de Aragón", parada_id: "P-8", numero_mapa: 12, texto_id: "txt-Av3-P8-nl", audio_id: "audio-Av3-P8-nl", reto_id: "R8-Av3-nl" },
        // Parada 9: Puente de Aragón 2
        { padreid: "padre-P9", tipo: "parada", nombre: "Puente de Aragón 2", parada_id: "P-9", numero_mapa: 12, texto_id: "txt-Av3-P9-nl", audio_id: "audio-Av3-P9-nl" },
        // Tramo 8: Puente de Aragón (parte superior) → Puente de la Mar (Parte Superior)
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Puente de Aragón (parte superior) → Puente de la Mar (Parte Superior)", tramo_id: "TR-8", numero_mapa: "12→11", texto_id: "txt-Av3-TR8-nl", audio_id: "audio-Av3-TR8-nl" },
        // Parada 10: Puente de la Mar (Parte Superior) (Reto 9)
        { padreid: "padre-P10", tipo: "parada", nombre: "Puente de la Mar (Parte Superior)", parada_id: "P-10", numero_mapa: 11, texto_id: "txt-Av3-P10-nl", audio_id: "audio-Av3-P10-nl", reto_id: "R9-Av3-nl" },
        // Tramo 9: Puente de la Mar (Parte Superior) → Palau de la música
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Puente de la Mar (Parte Superior) → Palau de la música", tramo_id: "TR-9", numero_mapa: "11→13", texto_id: "txt-Av3-TR9-nl", audio_id: "audio-Av3-TR9-nl" },
        // Parada 11: Palau de la Música (Reto 10)
        { padreid: "padre-P11", tipo: "parada", nombre: "Palau de la Música", parada_id: "P-11", numero_mapa: 13, texto_id: "txt-Av3-P11-nl", audio_id: "audio-Av3-P11-nl", reto_id: "R10-Av3-nl" },
        // Tramo 10: Palau de la música → Gulliver
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Palau de la música → Gulliver", tramo_id: "TR-10", numero_mapa: "13→15", texto_id: "txt-Av3-TR10-nl", audio_id: "audio-Av3-TR10-nl" },
        // Parada 12: Gulliver (Reto 11)
        { padreid: "padre-P12", tipo: "parada", nombre: "Gulliver", parada_id: "P-12", numero_mapa: 15, texto_id: "txt-Av3-P12-nl", audio_id: "audio-Av3-P12-nl", reto_id: "R11-Av3-nl" },
        // Tramo 11: Gulliver → Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Gulliver → Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias", tramo_id: "TR-11", numero_mapa: "15→17", texto_id: "txt-Av3-TR11-nl", audio_id: "audio-Av3-TR11-nl" },
        // Parada 13: Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias
        { padreid: "padre-P13", tipo: "parada", nombre: "Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias", parada_id: "P-13", numero_mapa: 17, texto_id: "txt-Av3-P13-nl", audio_id: "audio-Av3-P13-nl" },
        // Tramo 12: Pistas de Patinaje → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Pistas de Patinaje → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe", tramo_id: "TR-12", numero_mapa: "17→-", texto_id: "txt-Av3-TR12-nl", audio_id: "audio-Av3-TR12-nl" },
        // Parada 14: Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía
        { padreid: "padre-P14", tipo: "parada", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía", parada_id: "P-14", numero_mapa: 18, texto_id: "txt-Av3-P14-nl", audio_id: "audio-Av3-P14-nl" },
        // Parada 15: Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe
        { padreid: "padre-P15", tipo: "parada", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe", parada_id: "P-15", numero_mapa: 20, texto_id: "txt-Av3-P15-nl", audio_id: "audio-Av3-P15-nl" },
        // Tramo 13: Mirador de la Ciudad de las Artes y de las Ciencias → Puente l’Assut de l’Or
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe → Puente l’Assut de l’Or", tramo_id: "TR-13", numero_mapa: "20→21", texto_id: "txt-Av3-TR13-nl", audio_id: "audio-Av3-TR13-nl" },
        // Parada 16: Puente l’Assut de l’Or (Reto12puzzle PZ-09)
        { padreid: "padre-P16", tipo: "parada", nombre: "Puente l’Assut de l’Or", parada_id: "P-16", numero_mapa: 21, texto_id: "txt-Av3-P16-nl", audio_id: "audio-Av3-P16-nl", reto_id: "PZ-09" },
        // Tramo 14: Puente l’Assut de l’Or → Ágora y Oceanogràfic
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Puente l’Assut de l’Or → Ágora y Oceanogràfic", tramo_id: "TR-14", numero_mapa: "21→22/23", texto_id: "txt-Av3-TR14-nl", audio_id: "audio-Av3-TR14-nl" },
        // Parada 17: Ágora y Oceanogràfic
        { padreid: "padre-P17", tipo: "parada", nombre: "Ágora y Oceanogràfic", parada_id: "P-17", numero_mapa: "22/23", texto_id: "txt-Av3-P17-nl", audio_id: "audio-Av3-P17-nl" },
        // Tramo 15: Ágora y Oceanogràfic → Umbracle
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Ágora y Oceanogràfic → Umbracle", tramo_id: "TR-15", numero_mapa: "22/23→24", texto_id: "txt-Av3-TR15-nl", audio_id: "audio-Av3-TR15-nl" },
        // Parada 18: Umbracle (Reto 13)
        { padreid: "padre-P18", tipo: "parada", nombre: "Umbracle", parada_id: "P-18", numero_mapa: "24", texto_id: "txt-Av3-P18-nl", audio_id: "audio-Av3-P18-nl", reto_id: "R13-Av3-nl" },
        // Tramo 16: Umbracle → Hemisféric
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Umbracle → Hemisféric", tramo_id: "TR-16", numero_mapa: "24→25", texto_id: "txt-Av3-TR16-nl", audio_id: "audio-Av3-TR16-nl" },
        // Parada 19: Hemisféric (Reto 14)
        { padreid: "padre-P19", tipo: "parada", nombre: "Hemisféric", parada_id: "P-19", numero_mapa: "25", texto_id: "txt-Av3-P19-nl", audio_id: "audio-Av3-P19-nl", reto_id: "R14-Av3-nl" },
        // Tramo 17: Ciudad de las Artes y las Ciencias → Puente de la Mar
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Ciudad de las Artes y las Ciencias → Puente de la Mar", tramo_id: "TR-17", numero_mapa: "25→11", texto_id: "txt-Av3-TR17-nl", audio_id: "audio-Av3-TR17-nl" },
        // Parada 20: Puente de la Mar (Reto 15)
        { padreid: "padre-P20", tipo: "parada", nombre: "Puente de la Mar", parada_id: "P-20", numero_mapa: "25", texto_id: "txt-Av3-P20-nl", audio_id: "audio-Av3-P20-nl", reto_id: "R15-Av3-nl" },
        // Tramo 18: Puente de la Mar → Puerta de la Mar
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Puente de la Mar → Puerta de la Mar", tramo_id: "TR-18", numero_mapa: "11→26", texto_id: "txt-Av3-TR18-nl", audio_id: "audio-Av3-TR18-nl" },
        // Parada 21: Puerta de la Mar (Reto 16)
        { padreid: "padre-P21", tipo: "parada", nombre: "Puerta de la Mar", parada_id: "P-21", numero_mapa: "26", texto_id: "txt-Av3-P21-nl", audio_id: "audio-Av3-P21-nl", reto_id: "R16-Av3-nl" },
        // Tramo 19: Puerta de la Mar → Palacio de Justicia
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Puerta de la Mar → Palacio de Justicia", tramo_id: "TR-19", numero_mapa: "26→27", texto_id: "txt-Av3-TR19-nl", audio_id: "audio-Av3-TR19-nl" },
        // Parada 22: Palacio de Justicia
        { padreid: "padre-P22", tipo: "parada", nombre: "Palacio de Justicia", parada_id: "P-22", numero_mapa: "26", texto_id: "txt-Av3-P22-nl", audio_id: "audio-Av3-P22-nl" },
        // Tramo 20: Palacio de Justicia → Fundación Bancaja 1
        { padreid: "padre-TR20", tipo: "tramo", nombre: "Palacio de Justicia → Fundación Bancaja 1", tramo_id: "TR-20", numero_mapa: "27→28", texto_id: "txt-Av3-TR20-nl", audio_id: "audio-Av3-TR20-nl" },
        // Parada 23: Fundación Bancaja 1 (Reto 17)
        { padreid: "padre-P23", tipo: "parada", nombre: "Fundación Bancaja 1", parada_id: "P-23", numero_mapa: "28", texto_id: "txt-Av3-P23-nl", audio_id: "audio-Av3-P23-nl", reto_id: "R17-Av3-nl" },
        // Tramo 21: Fundación Bancaja 1 → Fundación Bancaja 2
        { padreid: "padre-TR21", tipo: "tramo", nombre: "Fundación Bancaja 1 → Fundación Bancaja 2", tramo_id: "TR-21", numero_mapa: "28→28", texto_id: "txt-Av3-TR21-nl", audio_id: "audio-Av3-TR21-nl" },
        // Parada 24: Fundación Bancaja 2
        { padreid: "padre-P24", tipo: "parada", nombre: "Fundación Bancaja 2", parada_id: "P-24", numero_mapa: "28", texto_id: "txt-Av3-P24-nl", audio_id: "audio-Av3-P24-nl" },
        // Tramo 22: Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente
        { padreid: "padre-TR22", tipo: "tramo", nombre: "Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente", tramo_id: "TR-22", numero_mapa: "28→29", texto_id: "txt-Av3-TR22-nl", audio_id: "audio-Av3-TR22-nl" },
        // Parada 25: Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente (Reto 18)
        { padreid: "padre-P25", tipo: "parada", nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente", parada_id: "P-25", numero_mapa: "29", texto_id: "txt-Av3-P25-nl", audio_id: "audio-Av3-P25-nl", reto_id: "R18-Av3-nl" },
        // Parada 26: Iglesia Santo Tomás Apostol y San Felipe Neri
        { padreid: "padre-P26", tipo: "parada", nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri", parada_id: "P-26", numero_mapa: "29", texto_id: "txt-Av3-P26-nl", audio_id: "audio-Av3-P26-nl" },
        // Tramo 23: Iglesia Santo Tomás Apostol y San Felipe Neri → Iglesia San Juan del Hospital
        { padreid: "padre-TR23", tipo: "tramo", nombre: "Iglesia San Vicente Ferrer y San Felipe Neri → Iglesia San Juan del Hospital", tramo_id: "TR-23", numero_mapa: "29→30", texto_id: "txt-Av3-TR23-nl", audio_id: "audio-Av3-TR23-nl" },
        // Parada 27: Iglesia San Juan del Hospital
        { padreid: "padre-P27", tipo: "parada", nombre: "Iglesia San Juan del Hospital", parada_id: "P-27", numero_mapa: "30", texto_id: "txt-Av3-P27-nl", audio_id: "audio-Av3-P27-nl" },
        // Tramo 24: Iglesia San Juan del Hospital → Palacio Arzobispal
        { padreid: "padre-TR24", tipo: "tramo", nombre: "Iglesia San Juan del Hospital → Palacio Arzobispal", tramo_id: "TR-24", numero_mapa: "30→31", texto_id: "txt-Av3-TR24-nl", audio_id: "audio-Av3-TR24-nl" },
        // Parada 28: Palacio Arzobispal
        { padreid: "padre-P28", tipo: "parada", nombre: "Palacio Arzobispal", parada_id: "P-28", numero_mapa: "31", texto_id: "txt-Av3-P28-nl", audio_id: "audio-Av3-P28-nl" },
        // Tramo 25: Palacio Arzobispal → Catedral de Valencia (Puerta Románica)
        { padreid: "padre-TR25", tipo: "tramo", nombre: "Palacio Arzobispal → Catedral de Valencia (Puerta Románica)", tramo_id: "TR-25", numero_mapa: "31→32", texto_id: "txt-Av3-TR25-nl", audio_id: "audio-Av3-TR25-nl" },
        // Parada 29: Catedral de Valencia (Puerta Románica) (Reto 19)
        { padreid: "padre-P29", tipo: "parada", nombre: "Catedral de Valencia (Puerta Románica)", parada_id: "P-29", numero_mapa: "32", texto_id: "txt-Av3-P29-nl", audio_id: "audio-Av3-P29-nl", reto_id: "R19-Av3-nl" },
        // Tramo 26: Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína)
        { padreid: "padre-TR26", tipo: "tramo", nombre: "Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína)", tramo_id: "TR-26", numero_mapa: "32→33", texto_id: "txt-Av3-TR26-nl", audio_id: "audio-Av3-TR26-nl" },
        // Parada 30: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 1, Panel cerámico (reto 20)
        { padreid: "padre-P30", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 1, Panel cerámico", parada_id: "P-30", numero_mapa: "33", texto_id: "txt-Av3-P30-nl", audio_id: "audio-Av3-P30-nl", reto_id: "R20-Av3-nl" },
        // Parada 31: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 2, Capilla exterior (reto 21)
        { padreid: "padre-P31", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 2, Capilla exterior", parada_id: "P-31", numero_mapa: "33", texto_id: "txt-Av3-P31-nl", audio_id: "audio-Av3-P31-nl", reto_id: "R21-Av3-nl" },
        // Parada 32: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 3, Capilla exterior (reto 22)
        { padreid: "padre-P32", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 3, Capilla exterior", parada_id: "P-32", numero_mapa: "33", texto_id: "txt-Av3-P32-nl", audio_id: "audio-Av3-P32-nl", reto_id: "R22-Av3-nl" },
        // Parada 33: Plaza Décimo Junio Bruto (Plaza de la Almoína) Basílica de Valencia
        { padreid: "padre-P33", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Basílica de Valencia", parada_id: "P-33", numero_mapa: "33/34", texto_id: "txt-Av3-P33-nl", audio_id: "audio-Av3-P33-nl" },
        // Parada 34: Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de gantxo (Reto 23)
        { padreid: "padre-P34", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de gantxo", parada_id: "P-34", numero_mapa: "33", texto_id: "txt-Av3-P34-nl", audio_id: "audio-Av3-P34-nl", reto_id: "R23-Av3-nl" },
        // Tramo 27: Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico
        { padreid: "padre-TR27", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) → Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", tramo_id: "TR-27", numero_mapa: "33→33", texto_id: "txt-Av3-TR27-nl", audio_id: "audio-Av3-TR27-nl" },
        // Parada 35: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico (Reto 24)
        { padreid: "padre-P35", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", parada_id: "P-35", numero_mapa: "33", texto_id: "txt-Av3-P35-nl", audio_id: "audio-Av3-P35-nl", reto_id: "R24-Av3-nl" },
        // Parada 36: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico 2 (Reto25puzzle PZ-02)
        { padreid: "padre-P36", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", parada_id: "P-36", numero_mapa: "33", texto_id: "txt-Av3-P36-nl", audio_id: "audio-Av3-P36-nl", reto_id: "PZ-02" },
        // Tramo 28: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen
        { padreid: "padre-TR28", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen", tramo_id: "TR-28", numero_mapa: "33→35", texto_id: "txt-Av3-TR28-nl", audio_id: "audio-Av3-TR28-nl" },
        // Parada 37: Plaza de la Virgen (Fuente de Neptuno) (Reto 26)
        { padreid: "padre-P37", tipo: "parada", nombre: "Plaza de la Virgen (Fuente de Neptuno)", parada_id: "P-37", numero_mapa: "35", texto_id: "txt-Av3-P37-nl", audio_id: "audio-Av3-P37-nl", reto_id: "R26-Av3-nl" },
        // Parada 38: Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia) (Reto 27)
        { padreid: "padre-P38", tipo: "parada", nombre: "Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia)", parada_id: "P-38", numero_mapa: "35", texto_id: "txt-Av3-P38-nl", audio_id: "audio-Av3-P38-nl", reto_id: "R27-Av3-nl" },
        // Tramo 29: Plaza de la Virgen → Torres de Serranos
        { padreid: "padre-TR29", tipo: "tramo", nombre: "Plaza de la Virgen → Torres de Serranos", tramo_id: "TR-29", numero_mapa: "35→1", texto_id: "txt-Av3-TR29-nl", audio_id: "audio-Av3-TR29-nl" },
        // Parada 39 - FINAL: Torres de Serranos Final (Reto28Puzzle PZ-05)
        { padreid: "padre-P39", tipo: "parada", nombre: "Torres de Serranos Final", parada_id: "P-39", numero_mapa: 1, texto_id: "txt-Av3-P39-nl", audio_id: "audio-Av3-P39-nl", reto_id: "PZ-05" },
      ]
    },
    ja: {
      elementosIDpadre: [
        //puzzle para principio
        {padreid: "padre-pre-intro1", tipo: "pre-intro1", nombre: "pre-intro1", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "PZ-intro" },
        // Reto para principio
        {padreid: "padre-pre-intro2", tipo: "pre-intro1", nombre: "pre-intro2", parada_id: "null", numero_mapa: null, texto_id: "null", audio_id: "null", reto_id: "R1-Av3-ja" },
        // INTRO (Reto 2)
        { padreid: "padre-intro", tipo: "intro", nombre: "Intro", parada_id: "intro", numero_mapa: null, texto_id: "txt-intro-ja", audio_id: "audio-intro-ja", reto_id: "R2-Av3-ja" },
        // Parada 0 - Torres de Serranos (start) (Reto 3)
        { padreid: "padre-P0", tipo: "inicio", nombre: "Torres de Serranos (start)", parada_id: "P-0", numero_mapa: 1, texto_id: "txt-Av3-P0-ja", audio_id: "audio-Av3-P0-ja", reto_id: "R3-Av3-ja" },
        // Tramo 1: Torres de Serranos → Plaza de la Crída (Torres de Serranos Front)
        { padreid: "padre-TR1", tipo: "tramo", nombre: "Torres de Serranos → Plaza de la Crída (Torres de Serranos Front)", tramo_id: "TR-1", numero_mapa: "1→2", texto_id: "txt-Av3-TR1-ja", audio_id: "audio-Av3-TR1-ja" },
        // Parada 1: Plaza de la Crída (Torres de Serranos Front) (Reto 4)
        { padreid: "padre-P1", tipo: "parada", nombre: "Plaza de la Crída (Torres de Serranos Front)", parada_id: "P-1", numero_mapa: 2, texto_id: "txt-Av3-P1-ja", audio_id: "audio-Av3-P1-ja", reto_id: "R4-Av3-ja" },
        // Tramo 2: Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos
        { padreid: "padre-TR2", tipo: "tramo", nombre: "Plaza de la Crída (Torres de Serranos Front) → Centro Puente de Serranos", tramo_id: "TR-2", numero_mapa: "1→2", texto_id: "txt-Av3-TR2-ja", audio_id: "audio-Av3-TR2-ja" },
        // Parada 2: Centro Puente Serranos 1 (Reto 5)
        { padreid: "padre-P2", tipo: "parada", nombre: "Centro Puente Serranos", parada_id: "P-2", numero_mapa: null, texto_id: "txt-Av3-P2-ja", audio_id: "audio-Av3-P2-ja", reto_id: "R5-Av3-ja" },
        // Parada 3: Centro Puente Serranos 2
        { padreid: "padre-P3", tipo: "parada", nombre: "Centro Puente Serranos 2", parada_id: "P-3", numero_mapa: null, texto_id: "txt-Av3-P3-ja", audio_id: "audio-Av3-P3-ja" },
        // Tramo 3: Centro Puente de Serranos 2 → Ruinas del Jardín del Turia
        { padreid: "padre-TR3", tipo: "tramo", nombre: "Centro Puente de Serranos 2 → Ruinas del Jardín del Turia", tramo_id: "TR-3", numero_mapa: "-→6", texto_id: "txt-Av3-TR3-ja", audio_id: "audio-Av3-TR3-ja" },
        // Parada 4: Ruinas del Jardín del Turia
        { padreid: "padre-P4", tipo: "parada", nombre: "Ruinas del Jardín del Turia", parada_id: "P-4", numero_mapa: 6, texto_id: "txt-Av3-P4-ja", audio_id: "audio-Av3-P4-ja" },
        // Tramo 4: Ruinas del Jardín del Turia → Jardines del Real (Viveros)
        { padreid: "padre-TR4", tipo: "tramo", nombre: "Ruinas del Jardín del Turia → Jardines del Real (Viveros)", tramo_id: "TR-4", numero_mapa: "6→7", texto_id: "txt-Av3-TR4-ja", audio_id: "audio-Av3-TR4-ja" },
        // Parada 5: Jardines del Real (Viveros) (Reto6puzzle PZ-08)
        { padreid: "padre-P5", tipo: "parada", nombre: "Jardines del Real (Viveros)", parada_id: "P-5", numero_mapa: 7, texto_id: "txt-Av3-P5-ja", audio_id: "audio-Av3-P5-ja", reto_id: "PZ-08" },
        // Tramo 5: Jardines del Real (Viveros) → Puente de la Exposición
        { padreid: "padre-TR5", tipo: "tramo", nombre: "Jardines del Real (Viveros) → Puente de la Exposición", tramo_id: "TR-5", numero_mapa: "7→9", texto_id: "txt-Av3-TR5-ja", audio_id: "audio-Av3-TR5-ja" },
        // Parada 6: Puente de la Exposición (Reto 7)
        { padreid: "padre-P6", tipo: "parada", nombre: "Puente de la Exposición", parada_id: "P-6", numero_mapa: 9, texto_id: "txt-Av3-P6-ja", audio_id: "audio-Av3-P6-ja", reto_id: "R7-Av3-ja" },
        // Tramo 6: Puente de la Exposición → Puente de las Flores
        { padreid: "padre-TR6", tipo: "tramo", nombre: "Puente de la Exposición → Puente de las Flores", tramo_id: "TR-6", numero_mapa: "9→10", texto_id: "txt-Av3-TR6-ja", audio_id: "audio-Av3-TR6-ja" },
        // Parada 7: Puente de las Flores
        { padreid: "padre-P7", tipo: "parada", nombre: "Puente de las Flores", parada_id: "P-7", numero_mapa: 10, texto_id: "txt-Av3-P7-ja", audio_id: "audio-Av3-P7-ja" },
        // Tramo 7: Puente de las Flores → Puente de Aragón (parte superior)
        { padreid: "padre-TR7", tipo: "tramo", nombre: "Puente de las Flores → Puente de Aragón (parte superior)", tramo_id: "TR-7", numero_mapa: "10→12", texto_id: "txt-Av3-TR7-ja", audio_id: "audio-Av3-TR7-ja" },
        // Parada 8: Puente de Aragón 1 (Reto 8)
        { padreid: "padre-P8", tipo: "parada", nombre: "Puente de Aragón", parada_id: "P-8", numero_mapa: 12, texto_id: "txt-Av3-P8-ja", audio_id: "audio-Av3-P8-ja", reto_id: "R8-Av3-ja" },
        // Parada 9: Puente de Aragón 2
        { padreid: "padre-P9", tipo: "parada", nombre: "Puente de Aragón 2", parada_id: "P-9", numero_mapa: 12, texto_id: "txt-Av3-P9-ja", audio_id: "audio-Av3-P9-ja" },
        // Tramo 8: Puente de Aragón (parte superior) → Puente de la Mar (Parte Superior)
        { padreid: "padre-TR8", tipo: "tramo", nombre: "Puente de Aragón (parte superior) → Puente de la Mar (Parte Superior)", tramo_id: "TR-8", numero_mapa: "12→11", texto_id: "txt-Av3-TR8-ja", audio_id: "audio-Av3-TR8-ja" },
        // Parada 10: Puente de la Mar (Parte Superior) (Reto 9)
        { padreid: "padre-P10", tipo: "parada", nombre: "Puente de la Mar (Parte Superior)", parada_id: "P-10", numero_mapa: 11, texto_id: "txt-Av3-P10-ja", audio_id: "audio-Av3-P10-ja", reto_id: "R9-Av3-ja" },
        // Tramo 9: Puente de la Mar (Parte Superior) → Palau de la música
        { padreid: "padre-TR9", tipo: "tramo", nombre: "Puente de la Mar (Parte Superior) → Palau de la música", tramo_id: "TR-9", numero_mapa: "11→13", texto_id: "txt-Av3-TR9-ja", audio_id: "audio-Av3-TR9-ja" },
        // Parada 11: Palau de la Música (Reto 10)
        { padreid: "padre-P11", tipo: "parada", nombre: "Palau de la Música", parada_id: "P-11", numero_mapa: 13, texto_id: "txt-Av3-P11-ja", audio_id: "audio-Av3-P11-ja", reto_id: "R10-Av3-ja" },
        // Tramo 10: Palau de la música → Gulliver
        { padreid: "padre-TR10", tipo: "tramo", nombre: "Palau de la música → Gulliver", tramo_id: "TR-10", numero_mapa: "13→15", texto_id: "txt-Av3-TR10-ja", audio_id: "audio-Av3-TR10-ja" },
        // Parada 12: Gulliver (Reto 11)
        { padreid: "padre-P12", tipo: "parada", nombre: "Gulliver", parada_id: "P-12", numero_mapa: 15, texto_id: "txt-Av3-P12-ja", audio_id: "audio-Av3-P12-ja", reto_id: "R11-Av3-ja" },
        // Tramo 11: Gulliver → Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias
        { padreid: "padre-TR11", tipo: "tramo", nombre: "Gulliver → Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias", tramo_id: "TR-11", numero_mapa: "15→17", texto_id: "txt-Av3-TR11-ja", audio_id: "audio-Av3-TR11-ja" },
        // Parada 13: Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias
        { padreid: "padre-P13", tipo: "parada", nombre: "Pistas de Patinaje: Introducción a la Ciudad de las Artes y las Ciencias", parada_id: "P-13", numero_mapa: 17, texto_id: "txt-Av3-P13-ja", audio_id: "audio-Av3-P13-ja" },
        // Tramo 12: Pistas de Patinaje → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe
        { padreid: "padre-TR12", tipo: "tramo", nombre: "Pistas de Patinaje → Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe", tramo_id: "TR-12", numero_mapa: "17→-", texto_id: "txt-Av3-TR12-ja", audio_id: "audio-Av3-TR12-ja" },
        // Parada 14: Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía
        { padreid: "padre-P14", tipo: "parada", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía", parada_id: "P-14", numero_mapa: 18, texto_id: "txt-Av3-P14-ja", audio_id: "audio-Av3-P14-ja" },
        // Parada 15: Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe
        { padreid: "padre-P15", tipo: "parada", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Museo Principe Felipe", parada_id: "P-15", numero_mapa: 20, texto_id: "txt-Av3-P15-ja", audio_id: "audio-Av3-P15-ja" },
        // Tramo 13: Mirador de la Ciudad de las Artes y de las Ciencias → Puente l’Assut de l’Or
        { padreid: "padre-TR13", tipo: "tramo", nombre: "Mirador de la Ciudad de las Artes y de las Ciencias: Opera Reina Sofía y Museo Principe Felipe → Puente l’Assut de l’Or", tramo_id: "TR-13", numero_mapa: "20→21", texto_id: "txt-Av3-TR13-ja", audio_id: "audio-Av3-TR13-ja" },
        // Parada 16: Puente l’Assut de l’Or (Reto12puzzle PZ-09)
        { padreid: "padre-P16", tipo: "parada", nombre: "Puente l’Assut de l’Or", parada_id: "P-16", numero_mapa: 21, texto_id: "txt-Av3-P16-ja", audio_id: "audio-Av3-P16-ja", reto_id: "PZ-09" },
        // Tramo 14: Puente l’Assut de l’Or → Ágora y Oceanogràfic
        { padreid: "padre-TR14", tipo: "tramo", nombre: "Puente l’Assut de l’Or → Ágora y Oceanogràfic", tramo_id: "TR-14", numero_mapa: "21→22/23", texto_id: "txt-Av3-TR14-ja", audio_id: "audio-Av3-TR14-ja" },
        // Parada 17: Ágora y Oceanogràfic
        { padreid: "padre-P17", tipo: "parada", nombre: "Ágora y Oceanogràfic", parada_id: "P-17", numero_mapa: "22/23", texto_id: "txt-Av3-P17-ja", audio_id: "audio-Av3-P17-ja" },
        // Tramo 15: Ágora y Oceanogràfic → Umbracle
        { padreid: "padre-TR15", tipo: "tramo", nombre: "Ágora y Oceanogràfic → Umbracle", tramo_id: "TR-15", numero_mapa: "22/23→24", texto_id: "txt-Av3-TR15-ja", audio_id: "audio-Av3-TR15-ja" },
        // Parada 18: Umbracle (Reto 13)
        { padreid: "padre-P18", tipo: "parada", nombre: "Umbracle", parada_id: "P-18", numero_mapa: "24", texto_id: "txt-Av3-P18-ja", audio_id: "audio-Av3-P18-ja", reto_id: "R13-Av3-ja" },
        // Tramo 16: Umbracle → Hemisféric
        { padreid: "padre-TR16", tipo: "tramo", nombre: "Umbracle → Hemisféric", tramo_id: "TR-16", numero_mapa: "24→25", texto_id: "txt-Av3-TR16-ja", audio_id: "audio-Av3-TR16-ja" },
        // Parada 19: Hemisféric (Reto 14)
        { padreid: "padre-P19", tipo: "parada", nombre: "Hemisféric", parada_id: "P-19", numero_mapa: "25", texto_id: "txt-Av3-P19-ja", audio_id: "audio-Av3-P19-ja", reto_id: "R14-Av3-ja" },
        // Tramo 17: Ciudad de las Artes y las Ciencias → Puente de la Mar
        { padreid: "padre-TR17", tipo: "tramo", nombre: "Ciudad de las Artes y las Ciencias → Puente de la Mar", tramo_id: "TR-17", numero_mapa: "25→11", texto_id: "txt-Av3-TR17-ja", audio_id: "audio-Av3-TR17-ja" },
        // Parada 20: Puente de la Mar (Reto 15)
        { padreid: "padre-P20", tipo: "parada", nombre: "Puente de la Mar", parada_id: "P-20", numero_mapa: "25", texto_id: "txt-Av3-P20-ja", audio_id: "audio-Av3-P20-ja", reto_id: "R15-Av3-ja" },
        // Tramo 18: Puente de la Mar → Puerta de la Mar
        { padreid: "padre-TR18", tipo: "tramo", nombre: "Puente de la Mar → Puerta de la Mar", tramo_id: "TR-18", numero_mapa: "11→26", texto_id: "txt-Av3-TR18-ja", audio_id: "audio-Av3-TR18-ja" },
        // Parada 21: Puerta de la Mar (Reto 16)
        { padreid: "padre-P21", tipo: "parada", nombre: "Puerta de la Mar", parada_id: "P-21", numero_mapa: "26", texto_id: "txt-Av3-P21-ja", audio_id: "audio-Av3-P21-ja", reto_id: "R16-Av3-ja" },
        // Tramo 19: Puerta de la Mar → Palacio de Justicia
        { padreid: "padre-TR19", tipo: "tramo", nombre: "Puerta de la Mar → Palacio de Justicia", tramo_id: "TR-19", numero_mapa: "26→27", texto_id: "txt-Av3-TR19-ja", audio_id: "audio-Av3-TR19-ja" },
        // Parada 22: Palacio de Justicia
        { padreid: "padre-P22", tipo: "parada", nombre: "Palacio de Justicia", parada_id: "P-22", numero_mapa: "26", texto_id: "txt-Av3-P22-ja", audio_id: "audio-Av3-P22-ja" },
        // Tramo 20: Palacio de Justicia → Fundación Bancaja 1
        { padreid: "padre-TR20", tipo: "tramo", nombre: "Palacio de Justicia → Fundación Bancaja 1", tramo_id: "TR-20", numero_mapa: "27→28", texto_id: "txt-Av3-TR20-ja", audio_id: "audio-Av3-TR20-ja" },
        // Parada 23: Fundación Bancaja 1 (Reto 17)
        { padreid: "padre-P23", tipo: "parada", nombre: "Fundación Bancaja 1", parada_id: "P-23", numero_mapa: "28", texto_id: "txt-Av3-P23-ja", audio_id: "audio-Av3-P23-ja", reto_id: "R17-Av3-ja" },
        // Tramo 21: Fundación Bancaja 1 → Fundación Bancaja 2
        { padreid: "padre-TR21", tipo: "tramo", nombre: "Fundación Bancaja 1 → Fundación Bancaja 2", tramo_id: "TR-21", numero_mapa: "28→28", texto_id: "txt-Av3-TR21-ja", audio_id: "audio-Av3-TR21-ja" },
        // Parada 24: Fundación Bancaja 2
        { padreid: "padre-P24", tipo: "parada", nombre: "Fundación Bancaja 2", parada_id: "P-24", numero_mapa: "28", texto_id: "txt-Av3-P24-ja", audio_id: "audio-Av3-P24-ja" },
        // Tramo 22: Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente
        { padreid: "padre-TR22", tipo: "tramo", nombre: "Fundación Bancaja 2 → Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente", tramo_id: "TR-22", numero_mapa: "28→29", texto_id: "txt-Av3-TR22-ja", audio_id: "audio-Av3-TR22-ja" },
        // Parada 25: Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente (Reto 18)
        { padreid: "padre-P25", tipo: "parada", nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri, Fuente", parada_id: "P-25", numero_mapa: "29", texto_id: "txt-Av3-P25-ja", audio_id: "audio-Av3-P25-ja", reto_id: "R18-Av3-ja" },
        // Parada 26: Iglesia Santo Tomás Apostol y San Felipe Neri
        { padreid: "padre-P26", tipo: "parada", nombre: "Iglesia Santo Tomás Apostol y San Felipe Neri", parada_id: "P-26", numero_mapa: "29", texto_id: "txt-Av3-P26-ja", audio_id: "audio-Av3-P26-ja" },
        // Tramo 23: Iglesia Santo Tomás Apostol y San Felipe Neri → Iglesia San Juan del Hospital
        { padreid: "padre-TR23", tipo: "tramo", nombre: "Iglesia San Vicente Ferrer y San Felipe Neri → Iglesia San Juan del Hospital", tramo_id: "TR-23", numero_mapa: "29→30", texto_id: "txt-Av3-TR23-ja", audio_id: "audio-Av3-TR23-ja" },
        // Parada 27: Iglesia San Juan del Hospital
        { padreid: "padre-P27", tipo: "parada", nombre: "Iglesia San Juan del Hospital", parada_id: "P-27", numero_mapa: "30", texto_id: "txt-Av3-P27-ja", audio_id: "audio-Av3-P27-ja" },
        // Tramo 24: Iglesia San Juan del Hospital → Palacio Arzobispal
        { padreid: "padre-TR24", tipo: "tramo", nombre: "Iglesia San Juan del Hospital → Palacio Arzobispal", tramo_id: "TR-24", numero_mapa: "30→31", texto_id: "txt-Av3-TR24-ja", audio_id: "audio-Av3-TR24-ja" },
        // Parada 28: Palacio Arzobispal
        { padreid: "padre-P28", tipo: "parada", nombre: "Palacio Arzobispal", parada_id: "P-28", numero_mapa: "31", texto_id: "txt-Av3-P28-ja", audio_id: "audio-Av3-P28-ja" },
        // Tramo 25: Palacio Arzobispal → Catedral de Valencia (Puerta Románica)
        { padreid: "padre-TR25", tipo: "tramo", nombre: "Palacio Arzobispal → Catedral de Valencia (Puerta Románica)", tramo_id: "TR-25", numero_mapa: "31→32", texto_id: "txt-Av3-TR25-ja", audio_id: "audio-Av3-TR25-ja" },
        // Parada 29: Catedral de Valencia (Puerta Románica) (Reto 19)
        { padreid: "padre-P29", tipo: "parada", nombre: "Catedral de Valencia (Puerta Románica)", parada_id: "P-29", numero_mapa: "32", texto_id: "txt-Av3-P29-ja", audio_id: "audio-Av3-P29-ja", reto_id: "R19-Av3-ja" },
        // Tramo 26: Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína)
        { padreid: "padre-TR26", tipo: "tramo", nombre: "Catedral de Valencia (Puerta Románica) → Plaza Décimo Junio Bruto (Plaza de la Almoína)", tramo_id: "TR-26", numero_mapa: "32→33", texto_id: "txt-Av3-TR26-ja", audio_id: "audio-Av3-TR26-ja" },
        // Parada 30: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 1, Panel cerámico (reto 20)
        { padreid: "padre-P30", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 1, Panel cerámico", parada_id: "P-30", numero_mapa: "33", texto_id: "txt-Av3-P30-ja", audio_id: "audio-Av3-P30-ja", reto_id: "R20-Av3-ja" },
        // Parada 31: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 2, Capilla exterior (reto 21)
        { padreid: "padre-P31", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 2, Capilla exterior", parada_id: "P-31", numero_mapa: "33", texto_id: "txt-Av3-P31-ja", audio_id: "audio-Av3-P31-ja", reto_id: "R21-Av3-ja" },
        // Parada 32: Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 3, Capilla exterior (reto 22)
        { padreid: "padre-P32", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Muro Norte de la Catedral de Valencia 3, Capilla exterior", parada_id: "P-32", numero_mapa: "33", texto_id: "txt-Av3-P32-ja", audio_id: "audio-Av3-P32-ja", reto_id: "R22-Av3-ja" },
        // Parada 33: Plaza Décimo Junio Bruto (Plaza de la Almoína) Basílica de Valencia
        { padreid: "padre-P33", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Basílica de Valencia", parada_id: "P-33", numero_mapa: "33/34", texto_id: "txt-Av3-P33-ja", audio_id: "audio-Av3-P33-ja" },
        // Parada 34: Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de gantxo (Reto 23)
        { padreid: "padre-P34", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Modernismo, Casa del Punt de gantxo", parada_id: "P-34", numero_mapa: "33", texto_id: "txt-Av3-P34-ja", audio_id: "audio-Av3-P34-ja", reto_id: "R23-Av3-ja" },
        // Tramo 27: Plaza Décimo Junio Bruto (Plaza de la Almoína) → Museo Arqueológico
        { padreid: "padre-TR27", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) → Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", tramo_id: "TR-27", numero_mapa: "33→33", texto_id: "txt-Av3-TR27-ja", audio_id: "audio-Av3-TR27-ja" },
        // Parada 35: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico (Reto 24)
        { padreid: "padre-P35", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", parada_id: "P-35", numero_mapa: "33", texto_id: "txt-Av3-P35-ja", audio_id: "audio-Av3-P35-ja", reto_id: "R24-Av3-ja" },
        // Parada 36: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico 2 (Reto25puzzle PZ-02)
        { padreid: "padre-P36", tipo: "parada", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico", parada_id: "P-36", numero_mapa: "33", texto_id: "txt-Av3-P36-ja", audio_id: "audio-Av3-P36-ja", reto_id: "PZ-02" },
        // Tramo 28: Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen
        { padreid: "padre-TR28", tipo: "tramo", nombre: "Plaza Décimo Junio Bruto (Plaza de la Almoína) Museo Arqueológico → Plaza de la Virgen", tramo_id: "TR-28", numero_mapa: "33→35", texto_id: "txt-Av3-TR28-ja", audio_id: "audio-Av3-TR28-ja" },
        // Parada 37: Plaza de la Virgen (Fuente de Neptuno) (Reto 26)
        { padreid: "padre-P37", tipo: "parada", nombre: "Plaza de la Virgen (Fuente de Neptuno)", parada_id: "P-37", numero_mapa: "35", texto_id: "txt-Av3-P37-ja", audio_id: "audio-Av3-P37-ja", reto_id: "R26-Av3-ja" },
        // Parada 38: Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia) (Reto 27)
        { padreid: "padre-P38", tipo: "parada", nombre: "Plaza de la Virgen (Puerta Gótica de la Catedral de Valencia)", parada_id: "P-38", numero_mapa: "35", texto_id: "txt-Av3-P38-ja", audio_id: "audio-Av3-P38-ja", reto_id: "R27-Av3-ja" },
        // Tramo 29: Plaza de la Virgen → Torres de Serranos
        { padreid: "padre-TR29", tipo: "tramo", nombre: "Plaza de la Virgen → Torres de Serranos", tramo_id: "TR-29", numero_mapa: "35→1", texto_id: "txt-Av3-TR29-ja", audio_id: "audio-Av3-TR29-ja" },
        // Parada 39 - FINAL: Torres de Serranos Final (Reto28Puzzle PZ-05)
        { padreid: "padre-P39", tipo: "parada", nombre: "Torres de Serranos Final", parada_id: "P-39", numero_mapa: 1, texto_id: "txt-Av3-P39-ja", audio_id: "audio-Av3-P39-ja", reto_id: "PZ-05" },
      ]
    },
  },
  Aventura4: {
    es: {
      elementosIDpadre: []
    },
    en: {
      elementosIDpadre: []
    },
    fr: {
      elementosIDpadre: []
    },
    it: {
      elementosIDpadre: []
    },
    nl: {
      elementosIDpadre: []
    },
    ja: {
      elementosIDpadre: []
    }
  },
  Aventura5: {
    es: {
      elementosIDpadre: []
    },
    en: {
      elementosIDpadre: []
    },
    fr: {
      elementosIDpadre: []
    },
    it: {
      elementosIDpadre: []
    },
    nl: {
      elementosIDpadre: []
    },
    ja: {
      elementosIDpadre: []
    }
  },
  AventuraFallas: {
    es: {
      elementosIDpadre: []
    },
    en: {
      elementosIDpadre: []
    },
    fr: {
      elementosIDpadre: []
    },
    it: {
      elementosIDpadre: []
    },
    nl: {
      elementosIDpadre: []
    },
    ja: {
      elementosIDpadre: []
    }
  },
  Aventura34km: {
    es: {
      elementosIDpadre: []
    },
    en: {
      elementosIDpadre: []
    },
    fr: {
      elementosIDpadre: []
    },
    it: {
      elementosIDpadre: []
    },
    nl: {
      elementosIDpadre: []
    },
    ja: {
      elementosIDpadre: []
    }
  }
};

// Para uso en entornos CommonJS y navegador
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DATOS_PADRE };
} else {
    window.DATOS_PADRE = DATOS_PADRE;
}
