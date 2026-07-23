#!/usr/bin/env node
/**
 * Genera docs/aventuras_ordenado/<Aventura>.md — un guión legible por aventura
 * que cruza coordenadas-aventuras.js (nombre/imágenes de cada parada y tramo),
 * textos-aventuras.js (qué números de párrafo lleva cada una) e
 * indice-aventuras.js (nombre/vehículo recomendado) con el texto real en
 * español de parrafos-textos/parrafos-texto-espanol.json.
 *
 * Uso: node tools/generar-guiones-aventuras.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DATOS_AVENTURAS } from '../js/coordenadas-aventuras.js';
import { TEXTOS_AVENTURAS } from '../js/textos-aventuras.js';
import { INDICE_AVENTURAS } from '../js/indice-aventuras.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'docs', 'aventuras_ordenado');
const PARRAFOS_ES_PATH = path.join(ROOT, 'js', 'parrafos-textos', 'parrafos-texto-espanol.json');

const PARRAFOS_ES = JSON.parse(fs.readFileSync(PARRAFOS_ES_PATH, 'utf8'));

const AVENTURAS = ['Aventura1', 'Aventura2', 'Aventura3', 'Aventura4', 'Aventura5', 'AventuraFallas', 'Aventura34km'];

function textoPlano(html) {
    if (!html) return '';
    return html
        .replace(/<\/p>\s*<p>/gi, ' ')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/\s+/g, ' ')
        .trim();
}

function extraerImagenes(entrada) {
    return Object.keys(entrada)
        .filter(k => /^imagen\d*$/.test(k))
        .sort((a, b) => {
            const na = a === 'imagen' ? 0 : Number(a.replace('imagen', ''));
            const nb = b === 'imagen' ? 0 : Number(b.replace('imagen', ''));
            return na - nb;
        })
        .map(k => entrada[k])
        .filter(v => v && String(v).trim());
}

function idATextId(id) {
    const m = /^(.+)-(P|TR)-(\d+)$/.exec(id);
    if (!m) return null;
    const [, prefijo, tipo2, num] = m;
    return { textId: `txt-${prefijo}-${tipo2}${num}`, tipo2, num };
}

function generarAventura(clave) {
    const meta = INDICE_AVENTURAS[clave];
    const coordEntradas = DATOS_AVENTURAS[clave]['coordenadas-hijo2.html'].coordenadas
        .filter(e => e.tipo === 'inicio' || e.tipo === 'parada' || e.tipo === 'tramo');
    const textosLista = TEXTOS_AVENTURAS[clave] || [];
    const textosPorId = new Map(textosLista.map(t => [t.id, t.parrafos || []]));

    const avisos = [];
    const bloques = [];

    for (const entrada of coordEntradas) {
        const info = idATextId(entrada.id);
        if (!info) { avisos.push(`ID no reconocido: ${entrada.id}`); continue; }
        const { textId, tipo2, num } = info;
        const etiqueta = tipo2 === 'P' ? `Parada ${num}` : `Tramo ${num}`;
        const parrafosNums = textosPorId.get(textId);
        if (parrafosNums === undefined) avisos.push(`Sin párrafos en textos-aventuras.js para ${entrada.id} (buscado como ${textId})`);

        const imagenes = extraerImagenes(entrada);

        const lineas = [];
        lineas.push(`## ${etiqueta} — ${entrada.nombre}`);
        lineas.push('');
        lineas.push(`**Imágenes:** ${imagenes.length ? imagenes.join(', ') : '(ninguna)'}`);
        lineas.push('');
        const nums = parrafosNums || [];
        lineas.push(`**Párrafos:** ${nums.length ? nums.join(', ') : '(ninguno)'}`);
        lineas.push('');
        for (const n of nums) {
            const key = String(n);
            const html = PARRAFOS_ES[key];
            if (html === undefined) {
                avisos.push(`Párrafo ${key} (${entrada.id}) no existe en parrafos-texto-espanol.json`);
                lineas.push(`- **${key}:** _[FALTA — no encontrado en parrafos-texto-espanol.json]_`);
            } else {
                lineas.push(`- **${key}:** ${textoPlano(html)}`);
            }
        }
        bloques.push(lineas.join('\n'));
    }

    const titulo = clave.replace(/^Aventura/, 'Aventura ');
    const cabecera = [
        `# ${titulo} — ${meta.vehiculo}`,
        '',
        `**Nombre:** ${meta.nombre}`,
        `**Vehículo recomendado:** ${meta.vehiculo}`,
        `**Distancia:** ${meta.distanciaKm} km`,
        '',
        '---',
        '',
        '',
    ].join('\n');

    const contenido = cabecera + bloques.join('\n\n---\n\n') + '\n';
    return { contenido, avisos };
}

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

let totalAvisos = 0;
for (const clave of AVENTURAS) {
    const { contenido, avisos } = generarAventura(clave);
    const nombreArchivo = clave.replace(/^Aventura/, 'Aventura') + '.md';
    fs.writeFileSync(path.join(OUT_DIR, nombreArchivo), contenido, 'utf8');
    console.log(`✅ ${nombreArchivo} generado`);
    if (avisos.length) {
        totalAvisos += avisos.length;
        console.log(`   ⚠️  ${avisos.length} aviso(s):`);
        avisos.forEach(a => console.log(`      - ${a}`));
    }
}
console.log(`\nTotal avisos: ${totalAvisos}`);
