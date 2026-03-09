/**
 * aventuras-ID-padre.js
 * Módulo centralizado para el array de elementosIDpadre del padre
 * Estructura: DATOS_PADRE[aventura][idioma].elementosIDpadre = array de elementosIDpadre
 */

export const DATOS_PADRE = {
  Aventura1: {
    es: {
      elementosIDpadre: [
        { tipo: "inicio", padreid: "padre-P-0", parada_id: "P-0", audio_id: "audio-P-0", reto_id: "R-2", nombre: "Torres de Serranos (start)", imagen: "imagenes/imagenes-aventuras/00_torres_de_serranos_back.jpg" },
        { tipo: "tramo", padreid: "padre-TR-1", parada_id: "TR-1", audio_id: "audio-TR-1", reto_id: null, nombre: "Torres de Serranos → Plaza de la crida (Puente de Serranos)", imagen: "imagenes/imagenes-aventuras/01_torres_de_serranos_front.jpg" },
        { tipo: "parada", padreid: "padre-P-1", parada_id: "P-1", audio_id: "audio-P-1", reto_id: "R-3", nombre: "Plaza de la crida (Puente de Serranos)", imagen: "imagenes/imagenes-aventuras/01_torres_de_serranos_front.jpg" },
        { tipo: "tramo", padreid: "padre-TR-2", parada_id: "TR-2", audio_id: "audio-TR-2", reto_id: null, nombre: "Plaza de la crida → Calle Muro de Santa Ana", imagen: "imagenes/imagenes-aventuras/muro de Santa ana.jpg" },
        { tipo: "parada", padreid: "padre-P-2", parada_id: "P-2", audio_id: "audio-P-2", reto_id: "R-4", nombre: "Calle Muro de Santa Ana", imagen: "imagenes/imagenes-aventuras/muro de Santa ana.jpg" },
        { tipo: "tramo", padreid: "padre-TR-3", parada_id: "TR-3", audio_id: "audio-TR-3", reto_id: null, nombre: "Calle Muro de Santa Ana → Palacio de los Borgia", imagen: "imagenes/imagenes-aventuras/02_cortes_valencianas.jpg" },
        { tipo: "parada", padreid: "padre-P-3", parada_id: "P-3", audio_id: "audio-P-3", reto_id: "R-5", nombre: "Iglesia de San Lorenzo", imagen: "imagenes/imagenes-aventuras/03_iglesia_de_san_lorenzo.jpg" },
        { tipo: "tramo", padreid: "padre-TR-4", parada_id: "TR-4", audio_id: "audio-TR-4", reto_id: null, nombre: "Iglesia de San Lorenzo → Plaza de la Virgen", imagen: "imagenes/imagenes-aventuras/04_plaza_de_la_virgen.jpg" },
        { tipo: "parada", padreid: "padre-P-4", parada_id: "P-4", audio_id: "audio-P-4", reto_id: "R-6", nombre: "Plaza de la Virgen Reto 6", imagen: "imagenes/imagenes-aventuras/04_plaza_de_la_virgen.jpg" },
        { tipo: "parada", padreid: "padre-P-5", parada_id: "P-5", audio_id: "audio-P-5", reto_id: "R-7", nombre: "Plaza de la Virgen Reto 7", imagen: "imagenes/imagenes-aventuras/04_plaza_de_la_virgen.jpg" },
        { tipo: "tramo", padreid: "padre-TR-5", parada_id: "TR-5", audio_id: "audio-TR-5", reto_id: null, nombre: "Plaza de la Virgen → Plaza de la Almoína", imagen: "imagenes/imagenes-aventuras/05_plaza_de_la_almoina.jpg" },
        { tipo: "parada", padreid: "padre-P-6", parada_id: "P-6", audio_id: "audio-P-6", reto_id: "PZ-01", nombre: "Panel cerámico muro Catedral", imagen: "imagenes/imagenes-aventuras/06_panel_ceramico_muro_norte_catedral.jpg" },
        { tipo: "parada", padreid: "padre-P-7", parada_id: "P-7", audio_id: "audio-P-7", reto_id: "R-9", nombre: "Capilla exterior catedral Reto 10", imagen: "imagenes/imagenes-aventuras/07!!!_capilla_exterior_catedral.jpg" },
        { tipo: "parada", padreid: "padre-P-8", parada_id: "P-8", audio_id: "audio-P-8", reto_id: "R-10", nombre: "Capilla exterior catedral Reto 11", imagen: "imagenes/imagenes-aventuras/07!!!_capilla_exterior_catedral.jpg" },
        { tipo: "parada", padreid: "padre-P-9", parada_id: "P-9", audio_id: "audio-P-9", reto_id: "R-11", nombre: "Arco Novo Catedral y Puerta Negra Basílica", imagen: "imagenes/imagenes-aventuras/08_arco_novo_catedral.jpg" },
        { tipo: "parada", padreid: "padre-P-10", parada_id: "P-10", audio_id: "audio-P-10", reto_id: "R-12", nombre: "Casa del Punt de Gantxo", imagen: "imagenes/imagenes-aventuras/10_casa_del_punt_de_gantxo.jpg" },
        { tipo: "tramo", padreid: "padre-TR-6", parada_id: "TR-6", audio_id: "audio-TR-6", reto_id: null, nombre: "Plaza de la Almoína → Plaza Decimo Junio Bruto", imagen: "imagenes/imagenes-aventuras/05_plaza_de_la_almoina.jpg" },
        { tipo: "parada", padreid: "padre-P-11", parada_id: "P-11", audio_id: "audio-P-11", reto_id: "R-13", nombre: "Museo arqueológico La Almoína", imagen: "imagenes/imagenes-aventuras/27_museo_la_almoina.jpg" },
        { tipo: "parada", padreid: "padre-P-12", parada_id: "P-12", audio_id: "audio-P-12", reto_id: "R-14", nombre: "Museo arqueológico La Almoína", imagen: "imagenes/imagenes-aventuras/27_museo_la_almoina.jpg" },
        { tipo: "parada", padreid: "padre-P-13", parada_id: "P-13", audio_id: "audio-P-13", reto_id: "R-15", nombre: "Vista de la Catedral, Cimborrio", imagen: "imagenes/imagenes-aventuras/05_plaza_de_la_almoina.jpg" },
        { tipo: "tramo", padreid: "padre-TR-7", parada_id: "TR-7", audio_id: "audio-TR-7", reto_id: null, nombre: "Museo arqueológico La Almoína → Palacio Arzobispal", imagen: "imagenes/imagenes-aventuras/11_palacio_arzobispal.jpg" },
        { tipo: "parada", padreid: "padre-P-14", parada_id: "P-14", audio_id: "audio-P-14", reto_id: "R-16", nombre: "Palacio Arzobispal y Puerta Románica de la Catedral", imagen: "imagenes/imagenes-aventuras/12_puerta_romanica_catedral.jpg" },
        { tipo: "parada", padreid: "padre-P-15", parada_id: "P-15", audio_id: "audio-P-15", reto_id: "R-17", nombre: "Puerta Románica de la Catedral", imagen: "imagenes/imagenes-aventuras/12_puerta_romanica_catedral.jpg" },
        { tipo: "tramo", padreid: "padre-TR-8", parada_id: "TR-8", audio_id: "audio-TR-8", reto_id: null, nombre: "Puerta Románica de la Catedral → Plaza del Ayuntamiento", imagen: "imagenes/imagenes-aventuras/13_plaza_del_ayuntamiento.jpg" },
        { tipo: "parada", padreid: "padre-P-16", parada_id: "P-16", audio_id: "audio-P-16", reto_id: "PZ-02", nombre: "Plaza del Ayuntamiento", imagen: "imagenes/imagenes-aventuras/13_plaza_del_ayuntamiento.jpg" },
        { tipo: "tramo", padreid: "padre-TR-9", parada_id: "TR-9", audio_id: "audio-TR-9", reto_id: null, nombre: "Plaza del Ayuntamiento → Edificio del Ayuntamiento de València", imagen: "imagenes/imagenes-aventuras/14_ayuntamiento.jpg" },
        { tipo: "parada", padreid: "padre-P-17", parada_id: "P-17", audio_id: "audio-P-17", reto_id: "R-19", nombre: "Edificio del Ayuntamiento", imagen: "imagenes/imagenes-aventuras/14_ayuntamiento.jpg" },
        { tipo: "parada", padreid: "padre-P-18", parada_id: "P-18", audio_id: "audio-P-18", reto_id: "R-20", nombre: "Edificio del Ayuntamiento", imagen: "imagenes/imagenes-aventuras/14_ayuntamiento.jpg" },
        { tipo: "tramo", padreid: "padre-TR-10", parada_id: "TR-10", audio_id: "audio-TR-10", reto_id: null, nombre: "Edificio del Ayuntamiento → Estación del Norte", imagen: "imagenes/imagenes-aventuras/15_plaza_de_toros_y_estacion_del_norte.jpg" },
        { tipo: "parada", padreid: "padre-P-19", parada_id: "P-19", audio_id: "audio-P-19", reto_id: "R-21", nombre: "Estación del Norte", imagen: "imagenes/imagenes-aventuras/15_plaza_de_toros_y_estacion_del_norte.jpg" },
        { tipo: "tramo", padreid: "padre-TR-11", parada_id: "TR-11", audio_id: "audio-TR-11", reto_id: null, nombre: "Estación del Norte → Plaza de Toros de València", imagen: "imagenes/imagenes-aventuras/15_plaza_de_toros_y_estacion_del_norte.jpg" },
        { tipo: "tramo", padreid: "padre-TR-12", parada_id: "TR-12", audio_id: "audio-TR-12", reto_id: null, nombre: "Plaza de Toros → Casa estilo Árabe", imagen: "imagenes/imagenes-aventuras/16!!!!_casa_estilo_arabe.jpg" },
        { tipo: "parada", padreid: "padre-P-20", parada_id: "P-20", audio_id: "audio-P-20", reto_id: "R-22", nombre: "Casa estilo Árabe", imagen: "imagenes/imagenes-aventuras/16!!!!_casa_estilo_arabe.jpg" },
        { tipo: "parada", padreid: "padre-P-21", parada_id: "P-21", audio_id: "audio-P-21", reto_id: "R-23", nombre: "Casa estilo Árabe, mitad Aventura", imagen: "imagenes/imagenes-aventuras/16!!!!_casa_estilo_arabe.jpg" },
        { tipo: "tramo", padreid: "padre-TR-13", parada_id: "TR-13", audio_id: "audio-TR-13", reto_id: null, nombre: "Casa estilo Árabe → Palacio de Comunicaciones (Correos)", imagen: "imagenes/imagenes-aventuras/17_correos.jpg" },
        { tipo: "parada", padreid: "padre-P-22", parada_id: "P-22", audio_id: "audio-P-22", reto_id: "R-24", nombre: "Palacio de Comunicaciones: Correos", imagen: "imagenes/imagenes-aventuras/17_correos.jpg" },
        { tipo: "parada", padreid: "padre-P-23", parada_id: "P-23", audio_id: "audio-P-23", reto_id: "R-25", nombre: "Edificio Suay", imagen: "imagenes/imagenes-aventuras/18_edificio_suay.jpg" },
        { tipo: "tramo", padreid: "padre-TR-14", parada_id: "TR-14", audio_id: "audio-TR-14", reto_id: null, nombre: "Palacio de Comunicaciones → Banco de València", imagen: "imagenes/imagenes-aventuras/19_banco_de_valencia.jpg" },
        { tipo: "parada", padreid: "padre-P-24", parada_id: "P-24", audio_id: "audio-P-24", reto_id: "PZ-03", nombre: "Banco de Valencia", imagen: "imagenes/imagenes-aventuras/19_banco_de_valencia.jpg" },
        { tipo: "tramo", padreid: "padre-TR-15", parada_id: "TR-15", audio_id: "audio-TR-15", reto_id: null, nombre: "Banco de València → Palacio del Marqués de Dos Aguas", imagen: "imagenes/imagenes-aventuras/20!!!!_ marques_de_dos aguas.jpg" },
        { tipo: "parada", padreid: "padre-P-25", parada_id: "P-25", audio_id: "audio-P-25", reto_id: "R-27", nombre: "Palacio del Marqués de Dos Aguas (Museo Nacional de Cerámica)", imagen: "imagenes/imagenes-aventuras/20!!!!_ marques_de_dos aguas.jpg" },
        { tipo: "tramo", padreid: "padre-TR-16", parada_id: "TR-16", audio_id: "audio-TR-16", reto_id: null, nombre: "Palacio del Marqués → Mercado Central", imagen: "imagenes/imagenes-aventuras/21_mercado_central.jpg" },
        { tipo: "parada", padreid: "padre-P-26", parada_id: "P-26", audio_id: "audio-P-26", reto_id: "R-28", nombre: "Mercado central", imagen: "imagenes/imagenes-aventuras/21_mercado_central.jpg" },
        { tipo: "tramo", padreid: "padre-TR-17", parada_id: "TR-17", audio_id: "audio-TR-17", reto_id: null, nombre: "Mercado Central → Iglesia de los Santos Juanes", imagen: "imagenes/imagenes-aventuras/22_iglesia_san_juan_del_mercado.jpg" },
        { tipo: "parada", padreid: "padre-P-27", parada_id: "P-27", audio_id: "audio-P-27", reto_id: "R-29", nombre: "Iglesia de los Santos Juanes reto 24", imagen: "imagenes/imagenes-aventuras/22_iglesia_san_juan_del_mercado.jpg" },
        { tipo: "parada", padreid: "padre-P-28", parada_id: "P-28", audio_id: "audio-P-28", reto_id: "R-30", nombre: "Iglesia de los Santos Juanes reto 25", imagen: "imagenes/imagenes-aventuras/22_iglesia_san_juan_del_mercado.jpg" },
        { tipo: "tramo", padreid: "padre-TR-18", parada_id: "TR-18", audio_id: "audio-TR-18", reto_id: null, nombre: "Iglesia Santos Juanes → Lonja de València (Mercado de la Seda)", imagen: "imagenes/imagenes-aventuras/23_lonja.jpg" },
        { tipo: "parada", padreid: "padre-P-29", parada_id: "P-29", audio_id: "audio-P-29", reto_id: "R-31", nombre: "Lonja Puerta de Los Pecados barquero", imagen: "imagenes/imagenes-aventuras/23_lonja.jpg" },
        { tipo: "tramo", padreid: "padre-TR-19", parada_id: "TR-19", audio_id: "audio-TR-19", reto_id: null, nombre: "Lonja Gárgolas", imagen: "imagenes/imagenes-aventuras/23_lonja.jpg" },
        { tipo: "tramo", padreid: "padre-TR-20", parada_id: "TR-20", audio_id: "audio-TR-20", reto_id: null, nombre: "Lonja → Plaza del Doctor Collado", imagen: "imagenes/imagenes-aventuras/24_lonja2.jpg" },
        { tipo: "parada", padreid: "padre-P-30", parada_id: "P-30", audio_id: "audio-P-30", reto_id: "R-32", nombre: "Lonja Puerta de Los Pecados árbol muerto", imagen: "imagenes/imagenes-aventuras/23_lonja.jpg" },
        { tipo: "tramo", padreid: "padre-TR-21", parada_id: "TR-21", audio_id: "audio-TR-21", reto_id: null, nombre: "Plaza del Doctor Collado → Plaza del Negrito (Fuente del Negrito)", imagen: "imagenes/imagenes-aventuras/25_fuente_del_negrito.jpg" },
        { tipo: "parada", padreid: "padre-P-31", parada_id: "P-31", audio_id: "audio-P-31", reto_id: null, nombre: "Lonja Gárgolas ángel vasija", imagen: "imagenes/imagenes-aventuras/23_lonja.jpg" },
        { tipo: "parada", padreid: "padre-P-32", parada_id: "P-32", audio_id: "audio-P-32", reto_id: null, nombre: "Lonja Gárgolas barbudo y león", imagen: "imagenes/imagenes-aventuras/23_lonja.jpg" },
        { tipo: "parada", padreid: "padre-P-33", parada_id: "P-33", audio_id: "audio-P-33", reto_id: null, nombre: "Lonja Gárgolas fornicador ventana", imagen: "imagenes/imagenes-aventuras/23_lonja.jpg" },
        { tipo: "parada", padreid: "padre-P-34", parada_id: "P-34", audio_id: "audio-P-34", reto_id: null, nombre: "Fuente del Negrito", imagen: "imagenes/imagenes-aventuras/25_fuente_del_negrito.jpg" },
        { tipo: "parada", padreid: "padre-P-35", parada_id: "P-35", audio_id: "audio-P-35", reto_id: null, nombre: "Palau de la Generalitat", imagen: "imagenes/imagenes-aventuras/26_palau_de_la_generalitat.jpg" },
        { tipo: "tramo", padreid: "padre-TR-22", parada_id: "TR-22", audio_id: "audio-TR-22", reto_id: null, nombre: "Plaza del Negrito → Calle Caballeros", imagen: "imagenes/imagenes-aventuras/26_palau_de_la_generalitat.jpg" },
        { tipo: "tramo", padreid: "padre-TR-23", parada_id: "TR-23", audio_id: "audio-TR-23", reto_id: null, nombre: "Palacio de la Generalitat → Calle de los Serranos (FINAL)", imagen: "imagenes/imagenes-aventuras/00_torres_de_serranos_back.jpg" },
        { tipo: "parada", padreid: "padre-P-36", parada_id: "P-36", audio_id: "audio-P-36", reto_id: null, nombre: "Torres de Serranos Final", imagen: "imagenes/imagenes-aventuras/00_torres_de_serranos_back.jpg" }
      ]
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
  Aventura2: {
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
  Aventura3: {
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
