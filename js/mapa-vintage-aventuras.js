// mapa-vintage-aventuras.js
// Estructura centralizada de mapas vintage para todas las aventuras
// Cada aventura mapea a su imagen de mapa vintage correspondiente

export const MAPAS_VINTAGE = {
    Aventura1: 'imagenes/imagenes-mapas-vintage/Av1_mapa.jpg',
    Aventura2: 'imagenes/imagenes-mapas-vintage/Av2_Mapa.jpg',
    Aventura3: 'imagenes/imagenes-mapas-vintage/Av3_Mapa.jpg',
    Aventura4: 'imagenes/imagenes-mapas-vintage/Av4_Mapa.jpg',
    Aventura5: 'imagenes/imagenes-mapas-vintage/Av5_Mapa.jpg',
    // AventuraFallas: 'imagenes/imagenes-mapas-vintage/AvFallas_Mapa.jpg', // TODO: añadir ruta cuando el mapa esté listo
    // Aventura34km: 'imagenes/imagenes-mapas-vintage/Av34km_Mapa.jpg',    // TODO: añadir ruta cuando el mapa esté listo
};

/**
 * Obtiene la URL del mapa vintage para una aventura dada
 * @param {string} aventura - Nombre de la aventura (ej: 'Aventura1')
 * @returns {string|null} URL de la imagen o null si no existe
 */
export function obtenerMapaVintage(aventura) {
    return MAPAS_VINTAGE[aventura] || null;
}
