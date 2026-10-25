// mapa-vintage-aventuras.js
// Estructura centralizada de mapas vintage para todas las aventuras
// Cada aventura mapea a su imagen de mapa vintage correspondiente
// Los originales, en imagenes/mapas-vintage/ (los que irán al backend; los usa la aventura). La demo gratis, que enseña
// el de cada aventura al elegirla (P7) y video-intro.html el de la Aventura 1, pide su copia pública, con el mismo
// nombre en publico/imagenes/mapas-vintage/; la hace tools/build-demo.js (guía, §22.0 n.º 13 y n.º 29).

export const MAPAS_VINTAGE = {
    Aventura1: 'imagenes/mapas-vintage/Av1_mapa.jpg',
    Aventura2: 'imagenes/mapas-vintage/Av2_Mapa.jpg',
    Aventura3: 'imagenes/mapas-vintage/Av3_Mapa.jpg',
    Aventura4: 'imagenes/mapas-vintage/Av4_Mapa.jpg',
    Aventura5: 'imagenes/mapas-vintage/Av5_Mapa.jpg',
    AventuraFallas: 'imagenes/mapas-vintage/AvFallas_Mapa.jpg',
    Aventura34km: 'imagenes/mapas-vintage/Av34km_Mapa.jpg',
};

