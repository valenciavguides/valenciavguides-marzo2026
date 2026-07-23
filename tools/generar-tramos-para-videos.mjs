#!/usr/bin/env node
/**
 * Genera docs/aventuras_ordenado/tramos-para-videos.md — un único documento con
 * todos los tramos de las 7 aventuras, deduplicados por recorrido físico real
 * (mismo inicio + waypoints + fin = el usuario ve exactamente lo mismo yendo de
 * A a B, así que un solo vídeo sirve para todos los tramos que comparten esa
 * clave, sin importar en cuántas aventuras aparezcan o cómo se llamen).
 *
 * Uso: node tools/generar-tramos-para-videos.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DATOS_AVENTURAS } from '../js/coordenadas-aventuras.js';
import { INDICE_AVENTURAS } from '../js/indice-aventuras.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_PATH = path.join(ROOT, 'docs', 'aventuras_ordenado', 'tramos-para-videos.md');

const AVENTURAS = ['Aventura1', 'Aventura2', 'Aventura3', 'Aventura4', 'Aventura5', 'AventuraFallas', 'Aventura34km'];

function fmt(n) { return Number(n).toFixed(6); }
function puntoStr(p) { return `${fmt(p.lat)},${fmt(p.lng)}`; }

function claveRecorrido(entrada) {
    const partes = [puntoStr(entrada.inicio), ...(entrada.waypoints || []).map(puntoStr), puntoStr(entrada.fin)];
    return partes.join('|');
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

// grupos: clave de recorrido -> { representante, apariciones: [{aventura, nombreAventura, id, nombre}] }
const grupos = new Map();
let totalTramos = 0;

for (const clave of AVENTURAS) {
    const nombreAventura = INDICE_AVENTURAS[clave]?.nombre || clave;
    const entradas = DATOS_AVENTURAS[clave]['coordenadas-hijo2.html'].coordenadas.filter(e => e.tipo === 'tramo');
    for (const entrada of entradas) {
        totalTramos++;
        const key = claveRecorrido(entrada);
        if (!grupos.has(key)) {
            grupos.set(key, { representante: entrada, apariciones: [] });
        }
        grupos.get(key).apariciones.push({ aventura: clave, nombreAventura, id: entrada.id, nombre: entrada.nombre });
    }
}

// Orden: los recorridos reutilizados en más sitios primero (prioridad de rodaje),
// y dentro de un mismo número de usos, por orden de primera aparición.
const gruposOrdenados = [...grupos.values()].sort((a, b) => b.apariciones.length - a.apariciones.length);

const lineas = [];
lineas.push('# Tramos para vídeo — recorridos físicos únicos de todas las aventuras');
lineas.push('');
lineas.push('Cada bloque es un recorrido real (inicio → waypoints → fin) que el usuario recorre a pie/bici entre dos puntos. Si el mismo recorrido exacto aparece en varias aventuras o varias veces, se lista una sola vez aquí — graba un único vídeo y sirve para todas las apariciones listadas.');
lineas.push('');
lineas.push(`**Total de tramos en las 7 aventuras:** ${totalTramos}`);
lineas.push(`**Recorridos físicos únicos a grabar:** ${grupos.size}`);
lineas.push('');
lineas.push('---');
lineas.push('');

let n = 0;
for (const { representante, apariciones } of gruposOrdenados) {
    n++;
    const imagenes = extraerImagenes(representante);
    lineas.push(`## ${n}. ${representante.nombre}`);
    lineas.push('');
    lineas.push(`**Usado en ${apariciones.length} sitio${apariciones.length > 1 ? 's' : ''}:** ${apariciones.map(a => `${a.nombreAventura} (${a.id})`).join(', ')}`);
    lineas.push('');
    lineas.push(`**Inicio:** ${fmt(representante.inicio.lat)}, ${fmt(representante.inicio.lng)}`);
    lineas.push(`**Fin:** ${fmt(representante.fin.lat)}, ${fmt(representante.fin.lng)}`);
    lineas.push(`**Waypoints intermedios:** ${(representante.waypoints || []).length}`);
    lineas.push('');
    lineas.push(`**Imágenes de referencia:** ${imagenes.length ? imagenes.join(', ') : '(ninguna)'}`);
    lineas.push('');
    lineas.push('---');
    lineas.push('');
}

fs.writeFileSync(OUT_PATH, lineas.join('\n'), 'utf8');
console.log(`✅ tramos-para-videos.md generado`);
console.log(`   Total tramos: ${totalTramos}`);
console.log(`   Recorridos únicos: ${grupos.size}`);
console.log(`   Duplicados eliminados: ${totalTramos - grupos.size}`);
