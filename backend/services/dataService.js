/**
 * DataService - Servicio centralizado de acceso a datos
 * 
 * Lee los datos de archivos JSON/JS y los proporciona a los controladores.
 * En producción, esto se conectaría a una base de datos.
 */

const path = require('path');
const fs = require('fs');
const { ApiError, ErrorCodes } = require('../utils/ApiError');

// Importar datos (en producción vendría de una BD)
// Por ahora usamos los mismos datos del frontend pero convertidos a JSON

class DataService {
    constructor() {
        this._cache = {
            indice: null,
            coordenadas: null,
            audios: null,
            retos: null,
            puzzles: null,
            lastLoad: null
        };
        this._dataPath = path.join(__dirname, '../data');
        this._loadData();
    }
    
    /**
     * Carga todos los datos en memoria
     */
    _loadData() {
        try {
            this._cache.indice = this._loadJsonFile('indice-aventuras.json');
            this._cache.coordenadas = this._loadJsonFile('coordenadas-aventuras.json');
            this._cache.audios = this._loadJsonFile('audios-aventuras.json');
            this._cache.retos = this._loadJsonFile('retos-aventuras.json');
            this._cache.puzzles = this._loadJsonFile('puzzles-aventuras.json');
            this._cache.lastLoad = new Date();
            console.log('[DataService] Datos cargados correctamente');
        } catch (error) {
            console.error('[DataService] Error cargando datos:', error.message);
            // En producción lanzaríamos el error, aquí usamos datos vacíos
            this._initializeEmptyData();
        }
    }
    
    _loadJsonFile(filename) {
        const filePath = path.join(this._dataPath, filename);
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            // Eliminar BOM si existe
            if (content.charCodeAt(0) === 0xFEFF) {
                content = content.slice(1);
            }
            return JSON.parse(content);
        }
        console.warn(`[DataService] Archivo no encontrado: ${filename}`);
        return null;
    }
    
    _initializeEmptyData() {
        this._cache.indice = { INDICE_AVENTURAS: {}, MAPEO_IDIOMAS: {} };
        this._cache.coordenadas = { DATOS_AVENTURAS: {} };
        this._cache.audios = { AUDIOS_AVENTURAS: {} };
        this._cache.retos = { RETOS_AVENTURAS: {} };
        this._cache.puzzles = { PUZZLES_AVENTURAS: {} };
    }
    
    /**
     * Recarga los datos desde disco
     */
    reloadData() {
        this._loadData();
        return { reloaded: true, timestamp: this._cache.lastLoad };
    }
    
    // ========================================
    // ÍNDICE DE AVENTURAS
    // ========================================
    
    getIndiceAventuras() {
        return this._cache.indice?.INDICE_AVENTURAS || {};
    }
    
    getMapeoIdiomas() {
        return this._cache.indice?.MAPEO_IDIOMAS || {};
    }
    
    getAventura(aventuraId) {
        const indice = this.getIndiceAventuras();
        const aventura = indice[aventuraId];
        
        if (!aventura) {
            throw new ApiError(
                404,
                `Aventura '${aventuraId}' no encontrada`,
                ErrorCodes.AVENTURA_NO_ENCONTRADA,
                { aventuraId, aventurasDisponibles: Object.keys(indice) }
            );
        }
        
        return aventura;
    }
    
    getAventurasDisponibles() {
        const indice = this.getIndiceAventuras();
        return Object.values(indice).filter(a => a.disponible);
    }
    
    // ========================================
    // COORDENADAS
    // ========================================
    
    getCoordenadas(aventuraId) {
        const datos = this._cache.coordenadas?.DATOS_AVENTURAS || {};
        const coordenadas = datos[aventuraId];
        
        if (!coordenadas) {
            throw new ApiError(
                404,
                `Coordenadas no encontradas para aventura '${aventuraId}'`,
                ErrorCodes.COORDENADAS_NO_ENCONTRADAS,
                { aventuraId }
            );
        }
        
        // Extraer del formato nested
        const key = Object.keys(coordenadas)[0]; // "coordenadas-hijo2.html"
        return coordenadas[key]?.coordenadas || [];
    }
    
    getParada(aventuraId, paradaId) {
        const coordenadas = this.getCoordenadas(aventuraId);
        const parada = coordenadas.find(c => c.id === paradaId);
        
        if (!parada) {
            throw new ApiError(
                404,
                `Parada '${paradaId}' no encontrada en aventura '${aventuraId}'`,
                ErrorCodes.PARADA_NO_ENCONTRADA,
                { aventuraId, paradaId }
            );
        }
        
        return parada;
    }
    
    getTramo(aventuraId, tramoId) {
        const coordenadas = this.getCoordenadas(aventuraId);
        const tramo = coordenadas.find(c => c.id === tramoId && c.tipo === 'tramo');
        
        if (!tramo) {
            throw new ApiError(
                404,
                `Tramo '${tramoId}' no encontrado en aventura '${aventuraId}'`,
                ErrorCodes.TRAMO_NO_ENCONTRADO,
                { aventuraId, tramoId }
            );
        }
        
        return tramo;
    }
    
    // ========================================
    // AUDIOS
    // ========================================
    
    getAudios(aventuraId, idioma) {
        const datos = this._cache.audios?.AUDIOS_AVENTURAS || {};
        const aventuraAudios = datos[aventuraId];
        
        if (!aventuraAudios) {
            throw new ApiError(
                404,
                `Audios no encontrados para aventura '${aventuraId}'`,
                ErrorCodes.AUDIOS_NO_DISPONIBLES,
                { aventuraId }
            );
        }
        
        const audiosIdioma = aventuraAudios[idioma];
        
        if (!audiosIdioma) {
            throw new ApiError(
                404,
                `Audios en idioma '${idioma}' no disponibles para aventura '${aventuraId}'`,
                ErrorCodes.IDIOMA_NO_DISPONIBLE,
                { aventuraId, idioma, idiomasDisponibles: Object.keys(aventuraAudios) }
            );
        }
        
        return audiosIdioma;
    }
    
    getAudioParada(aventuraId, idioma, paradaId) {
        const audios = this.getAudios(aventuraId, idioma);
        // El ID del audio sigue formato "audio-P-X" o "audio-TR-X"
        const audioId = `audio-${paradaId}`;
        const audio = audios.find(a => a.id === audioId);
        
        if (!audio) {
            throw new ApiError(
                404,
                `Audio para parada '${paradaId}' no encontrado`,
                ErrorCodes.AUDIO_NO_ENCONTRADO,
                { aventuraId, idioma, paradaId }
            );
        }
        
        return audio;
    }
    
    // ========================================
    // RETOS
    // ========================================
    
    getRetos(aventuraId, idioma) {
        const datos = this._cache.retos?.RETOS_AVENTURAS || {};
        const aventuraRetos = datos[aventuraId];
        
        if (!aventuraRetos) {
            throw new ApiError(
                404,
                `Retos no encontrados para aventura '${aventuraId}'`,
                ErrorCodes.RETOS_NO_DISPONIBLES,
                { aventuraId }
            );
        }
        
        const retosIdioma = aventuraRetos[idioma];
        
        if (!retosIdioma) {
            throw new ApiError(
                404,
                `Retos en idioma '${idioma}' no disponibles para aventura '${aventuraId}'`,
                ErrorCodes.IDIOMA_NO_DISPONIBLE,
                { aventuraId, idioma, idiomasDisponibles: Object.keys(aventuraRetos) }
            );
        }
        
        return retosIdioma;
    }
    
    getReto(aventuraId, idioma, retoId) {
        const retos = this.getRetos(aventuraId, idioma);
        const reto = retos.find(r => r.id === retoId);
        
        if (!reto) {
            throw new ApiError(
                404,
                `Reto '${retoId}' no encontrado`,
                ErrorCodes.RETO_NO_ENCONTRADO,
                { aventuraId, idioma, retoId }
            );
        }
        
        // No devolver las respuestas correctas al frontend
        const retoSeguro = { ...reto };
        delete retoSeguro.correctas;
        
        return retoSeguro;
    }
    
    validarRespuestaReto(aventuraId, idioma, retoId, respuesta) {
        const retos = this.getRetos(aventuraId, idioma);
        const reto = retos.find(r => r.id === retoId);
        
        if (!reto) {
            throw new ApiError(
                404,
                `Reto '${retoId}' no encontrado`,
                ErrorCodes.RETO_NO_ENCONTRADO,
                { aventuraId, idioma, retoId }
            );
        }
        
        let esCorrecta = false;
        
        if (reto.tipo === 'puzzle') {
            // Los puzzles se validan de otra forma
            esCorrecta = respuesta === 'completado';
        } else if (reto.multiple) {
            // Respuesta múltiple: verificar que todas las correctas estén incluidas
            if (Array.isArray(respuesta)) {
                const respuestaNormalizada = respuesta.map(r => r.toLowerCase().trim());
                const correctasNormalizadas = reto.correctas.map(c => c.toLowerCase().trim());
                esCorrecta = correctasNormalizadas.every(c => respuestaNormalizada.includes(c)) &&
                             respuestaNormalizada.length === correctasNormalizadas.length;
            }
        } else {
            // Respuesta única
            const respuestaNormalizada = String(respuesta).toLowerCase().trim();
            esCorrecta = reto.correctas.some(c => 
                c.toLowerCase().trim() === respuestaNormalizada
            );
        }
        
        return {
            retoId,
            correcto: esCorrecta,
            // Solo mostrar respuesta correcta si falló (opcional, quitar en producción)
            ...(process.env.NODE_ENV !== 'production' && !esCorrecta && { 
                pista: 'Inténtalo de nuevo' 
            })
        };
    }
    
    // ========================================
    // PUZZLES
    // ========================================
    
    getPuzzles(aventuraId) {
        const datos = this._cache.puzzles?.PUZZLES_AVENTURAS || {};
        const puzzles = datos[aventuraId];
        
        if (!puzzles) {
            throw new ApiError(
                404,
                `Puzzles no encontrados para aventura '${aventuraId}'`,
                ErrorCodes.PUZZLES_NO_DISPONIBLES,
                { aventuraId }
            );
        }
        
        // Extraer del formato nested
        const key = Object.keys(puzzles)[0]; // "puzzle.html"
        return puzzles[key]?.puzzle_id || [];
    }
    
    getPuzzle(aventuraId, puzzleId) {
        const puzzles = this.getPuzzles(aventuraId);
        const puzzle = puzzles.find(p => p.id === puzzleId);
        
        if (!puzzle) {
            throw new ApiError(
                404,
                `Puzzle '${puzzleId}' no encontrado`,
                ErrorCodes.PUZZLE_NO_ENCONTRADO,
                { aventuraId, puzzleId }
            );
        }
        
        return puzzle;
    }
    
    // ========================================
    // DATOS COMBINADOS
    // ========================================
    
    getAventuraCompleta(aventuraId, idioma = 'es') {
        const aventura = this.getAventura(aventuraId);
        
        if (!aventura.disponible) {
            throw new ApiError(
                403,
                `Aventura '${aventuraId}' no está disponible actualmente`,
                ErrorCodes.AVENTURA_NO_DISPONIBLE,
                { aventuraId }
            );
        }
        
        return {
            info: aventura,
            coordenadas: this.getCoordenadas(aventuraId),
            audios: this.getAudios(aventuraId, idioma),
            retos: this.getRetos(aventuraId, idioma).map(r => {
                const retoSeguro = { ...r };
                delete retoSeguro.correctas;
                return retoSeguro;
            }),
            puzzles: this.getPuzzles(aventuraId)
        };
    }
}

// Singleton
const dataService = new DataService();

module.exports = dataService;
