// js/indice-aventuras.js
// Metadatos estáticos de cada aventura (lo que no es computable desde los arrays).
// Los totales (totalParadas, totalTramos, totalRetos, totalMonumentos, totalAudios)
// se calculan dinámicamente en cargarAventurasDinamicamente() (En-busca-del-tesoro.html)
// importando los módulos fuente en tiempo de ejecución.

export const MAPEO_IDIOMAS = {
    es: { nombre: 'Español', bandera: 'Bandera España.jpeg' },
    en: { nombre: 'English', bandera: 'Bandera habla inglesa.jpeg' },
    fr: { nombre: 'Français', bandera: 'Bandera Francia.jpeg' },
    it: { nombre: 'Italiano', bandera: 'Bandera Italia.jpeg' },
    nl: { nombre: 'Nederlands', bandera: 'Bandera Paises bajos.jpeg' },
    ja: { nombre: '日本語', bandera: 'Bandera Japon.jpeg' }
};

export const INDICE_AVENTURAS = {
    Aventura1: {
        id: 'Aventura1',
        nombre: 'València centro histórico 1',
        disponible: true,
        claveCoord: 'coordenadas-hijo2.html',
        tiempoEstimado: 3600, // minutos
        distanciaKm: 4,
        vehiculo: '👣',
        idiomas: {
            es: { disponible: true },
            en: { disponible: true },
            fr: { disponible: true },
            it: { disponible: true },
            nl: { disponible: true },
            ja: { disponible: true }
        }
    },
    Aventura2: {
        id: 'Aventura2',
        nombre: 'València centro histórico 2',
        disponible: true,
        claveCoord: 'coordenadas-hijo2.html',
        tiempoEstimado: 3600,
        distanciaKm: 4,
        vehiculo: '👣',
        idiomas: {
            es: { disponible: true },
            en: { disponible: true },
            fr: { disponible: true },
            it: { disponible: true },
            nl: { disponible: true },
            ja: { disponible: true }
        }
    },
    Aventura3: {
        id: 'Aventura3',
        nombre: 'València Ciudad de las Artes y las Ciencias',
        disponible: true,
        claveCoord: 'coordenadas-hijo2.html',
        tiempoEstimado: 3600,
        distanciaKm: 10,
        vehiculo: '🚲🛴',
        idiomas: {
            es: { disponible: true },
            en: { disponible: true },
            fr: { disponible: true },
            it: { disponible: true },
            nl: { disponible: true },
            ja: { disponible: true }
        }
    },
    Aventura4: {
        id: 'Aventura4',
        nombre: 'València Parque de Cabecera y Viveros',
        disponible: false,
        claveCoord: 'coordenadas-hijo2.html',
        tiempoEstimado: 3600,
        distanciaKm: 10,
        vehiculo: '🚲🛴',
        idiomas: {
            es: { disponible: false },
            en: { disponible: false },
            fr: { disponible: false },
            it: { disponible: false },
            nl: { disponible: false },
            ja: { disponible: false }
        }
    },
    Aventura5: {
        id: 'Aventura5',
        nombre: 'València murallas',
        disponible: false,
        claveCoord: 'coordenadas-hijo2.html',
        tiempoEstimado: 3600,
        distanciaKm: 6,
        vehiculo: '🚲🛴',
        idiomas: {
            es: { disponible: false },
            en: { disponible: false },
            fr: { disponible: false },
            it: { disponible: false },
            nl: { disponible: false },
            ja: { disponible: false }
        }
    },
    AventuraFallas: {
        id: 'AventuraFallas',
        nombre: 'València en Fallas',
        disponible: false,
        claveCoord: 'coordenadas-hijo2.html',
        tiempoEstimado: 3600,
        distanciaKm: 4,
        vehiculo: '👣',
        idiomas: {
            es: { disponible: false },
            en: { disponible: false },
            fr: { disponible: false },
            it: { disponible: false },
            nl: { disponible: false },
            ja: { disponible: false }
        }
    },
    Aventura34km: {
        id: 'Aventura34km',
        nombre: 'València 34 kilómetros',
        disponible: false,
        claveCoord: 'coordenadas-hijo2.html',
        tiempoEstimado: 9000,
        distanciaKm: 34,
        vehiculo: '🚲🛴👣',
        idiomas: {
            es: { disponible: false },
            en: { disponible: false },
            fr: { disponible: false },
            it: { disponible: false },
            nl: { disponible: false },
            ja: { disponible: false }
        }
    }
};
