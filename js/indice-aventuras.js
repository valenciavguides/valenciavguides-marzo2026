// js/indice-aventuras.js
// Metadatos estáticos de cada aventura (lo que no es computable desde los arrays).
// Los totales (totalParadas, totalTramos, totalRetos, totalMonumentos, totalAudios)
// se calculan dinámicamente en cargarAventurasDinamicamente() (En-busca-del-tesoro.html)
// importando los módulos fuente en tiempo de ejecución.

export const MAPEO_IDIOMAS = {
    es: { nombre: 'Español',    bandera: 'bandera_españa.png' },
    en: { nombre: 'English',    bandera: 'bandera_inglesa.png' },
    fr: { nombre: 'Français',   bandera: 'bandera_francia.png' },
    it: { nombre: 'Italiano',   bandera: 'bandera_italia.png' },
    nl: { nombre: 'Nederlands', bandera: 'bandera_paises_bajos.png' },
    ja: { nombre: '日本語',      bandera: 'bandera_japon.png' },
    de: { nombre: 'Deutsch',    bandera: 'bandera_alemania.png' },
    zh: { nombre: '中文',        bandera: 'bandera_china.png' },
    pl: { nombre: 'Polski',     bandera: 'bandera_polonia.png' },
    pt: { nombre: 'Português',  bandera: 'bandera_portugal.png' },
    ru: { nombre: 'Русский',    bandera: 'bandera_rusia.png' },
    uk: { nombre: 'Українська', bandera: 'bandera_ucrania.png' }
};

export const INDICE_AVENTURAS = {
    Aventura1: {
        id: 'Aventura1',
        nombre: 'València centro histórico 1',
        disponible: true,
        claveCoord: 'coordenadas-hijo2.html',
        tiempoEstimado: 216000, // segundos (60 horas)
        distanciaKm: 4,
        vehiculo: '👣',
        idiomas: {
            es: { disponible: true },
            en: { disponible: true },
            fr: { disponible: true },
            it: { disponible: true },
            nl: { disponible: true },
            ja: { disponible: true },
            de: { disponible: true },
            zh: { disponible: true },
            pl: { disponible: true },
            pt: { disponible: true },
            ru: { disponible: true },
            uk: { disponible: true }
        }
    },
    Aventura2: {
        id: 'Aventura2',
        nombre: 'València centro histórico 2',
        disponible: true,
        claveCoord: 'coordenadas-hijo2.html',
        tiempoEstimado: 216000, // segundos (60 horas)
        distanciaKm: 4,
        vehiculo: '👣',
        idiomas: {
            es: { disponible: true },
            en: { disponible: true },
            fr: { disponible: true },
            it: { disponible: true },
            nl: { disponible: true },
            ja: { disponible: true },
            de: { disponible: true },
            zh: { disponible: true },
            pl: { disponible: true },
            pt: { disponible: true },
            ru: { disponible: true },
            uk: { disponible: true }
        }
    },
    Aventura3: {
        id: 'Aventura3',
        nombre: 'Ciudad de las Artes y las Ciencias',
        disponible: true,
        claveCoord: 'coordenadas-hijo2.html',
        tiempoEstimado: 216000, // segundos (60 horas)
        distanciaKm: 10,
        vehiculo: '🚲🛴',
        idiomas: {
            es: { disponible: true },
            en: { disponible: true },
            fr: { disponible: true },
            it: { disponible: true },
            nl: { disponible: true },
            ja: { disponible: true },
            de: { disponible: true },
            zh: { disponible: true },
            pl: { disponible: true },
            pt: { disponible: true },
            ru: { disponible: true },
            uk: { disponible: true }
        }
    },
    Aventura4: {
        id: 'Aventura4',
        nombre: 'Parque de Cabecera y Viveros',
        disponible: true,
        claveCoord: 'coordenadas-hijo2.html',
        tiempoEstimado: 216000, // segundos (60 horas)
        distanciaKm: 10,
        vehiculo: '🚲🛴',
        idiomas: {
            es: { disponible: true },
            en: { disponible: true },
            fr: { disponible: true },
            it: { disponible: true },
            nl: { disponible: true },
            ja: { disponible: true },
            de: { disponible: true },
            zh: { disponible: true },
            pl: { disponible: true },
            pt: { disponible: true },
            ru: { disponible: true },
            uk: { disponible: true }
        }
    },
    Aventura5: {
        id: 'Aventura5',
        nombre: 'Murallas de València',
        disponible: true,
        claveCoord: 'coordenadas-hijo2.html',
        tiempoEstimado: 216000, // segundos (60 horas)
        distanciaKm: 6,
        vehiculo: '🚲🛴',
        idiomas: {
            es: { disponible: true },
            en: { disponible: true },
            fr: { disponible: true },
            it: { disponible: true },
            nl: { disponible: true },
            ja: { disponible: true },
            de: { disponible: true },
            zh: { disponible: true },
            pl: { disponible: true },
            pt: { disponible: true },
            ru: { disponible: true },
            uk: { disponible: true }
        }
    },
    AventuraFallas: {
        id: 'AventuraFallas',
        nombre: 'València en Fallas',
        disponible: true,
        claveCoord: 'coordenadas-hijo2.html',
        tiempoEstimado: 216000, // segundos (60 horas)
        distanciaKm: 4,
        vehiculo: '👣',
        idiomas: {
            es: { disponible: true },
            en: { disponible: true },
            fr: { disponible: true },
            it: { disponible: true },
            nl: { disponible: true },
            ja: { disponible: true },
            de: { disponible: true },
            zh: { disponible: true },
            pl: { disponible: true },
            pt: { disponible: true },
            ru: { disponible: true },
            uk: { disponible: true }
        }
    },
    Aventura34km: {
        id: 'Aventura34km',
        nombre: 'Aventura 34 kilómetros',
        disponible: true,
        claveCoord: 'coordenadas-hijo2.html',
        tiempoEstimado: 540000, // segundos (150 horas)
        distanciaKm: 34,
        vehiculo: '🚲🛴👣',
        idiomas: {
            es: { disponible: true },
            en: { disponible: true },
            fr: { disponible: true },
            it: { disponible: true },
            nl: { disponible: true },
            ja: { disponible: true },
            de: { disponible: true },
            zh: { disponible: true },
            pl: { disponible: true },
            pt: { disponible: true },
            ru: { disponible: true },
            uk: { disponible: true }
        }
    }
};
