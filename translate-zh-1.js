import { readFileSync, writeFileSync } from 'fs';

const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-chino-simplificado.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";

const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);

let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) { /* archivo nuevo */ }

const batch = {
  "1": "<p>法雅节于2016年被联合国教科文组织列为人类非物质文化遗产。</p>",
  "2": "<p>请按地图指示绕行该纪念建筑。从其正面穿越道路，即可到达地图上标注为<mark>1</mark>号的<strong>Puente de Serranos</strong>。</p>",
  "2-B": "<p>抵达宫殿（Palau）后，请继续前行至历代君主和贵族进入瓦伦西亚王国时所经过的城门。在您的地图上对应编号<mark>1</mark>。</p>",
  "2-C": "<p>请沿开放道路返回城墙遗址，继续前行至历代君主和贵族进入瓦伦西亚王国时所经过的城门，在您的地图上对应编号<mark>1</mark>。</p>",
  "2-D": `<p>将这座建筑留在您的右手边，便能看到<strong>Calle de los Serranos</strong>，它将"La Seu"即<strong>Barrio de la Catedral</strong>（右侧）与著名的"El Carmen"街区（左侧）分隔开来。</p>\n<p>请继续前行至历代君主和贵族进入瓦伦西亚王国时所经过的城门，在您的地图上对应编号<mark>1</mark>。</p>`,
  "2-E": "<p>过桥后请向右转，继续前行至历代君主和贵族进入瓦伦西亚王国时所经过的城门，在您的地图上对应编号<mark>1</mark>。</p>",
  "2-F": "<p>您已到达<strong>Calle de los Serranos</strong>了吗？请向右转，继续前行至历代君主和贵族进入瓦伦西亚王国时所经过的<strong>Torres de Serranos</strong>。在您的地图上对应编号<mark>1</mark>。</p>",
  "2-G": "<p>快到了！请走到街道尽头，向左转，从那里已可望见城门。在您的地图上对应编号<mark>1</mark>。</p>",
  "3": "<p>请前往下一个景点，在您的地图上对应编号<mark>13</mark>。</p>",
  "3-B": "<p>在您的地图上对应编号<mark>13</mark>。</p>",
  "3-C": "<p>在您的地图上对应编号<mark>13</mark>。</p>",
  "3-D": `<p>沿此步行道前行几步，左侧有一座令人联想到古代穆斯林宫殿的建筑，在您的地图上对应编号<mark>13</mark>。</p>\n<p>请按暂停键，前往指示地点，到达建议地点后请再次按继续键。谢谢。</p>`,
  "3-E": `<p>以<strong>Estación del Norte</strong>为背，离开建筑，走上左侧的适行车道。</p>\n<p>这条为个人出行车辆设置的专用道沿瓦伦西亚古城墙遗址延伸。经过几条街道后，您将在右手边看到一片有廊柱和棕榈树的园林区。请遵守交通规则！</p>\n<p>请按暂停键，前往或查看指示地点，到达建议地点后请再次按继续键。</p>`,
  "4": `<p>馆藏约10,500件作品，展现20世纪基本艺术形式的各种表现形式。</p>\n<p>未来有一项扩建计划，拟以金属外皮完全包覆建筑，并在建筑后部增设一处画廊。</p>\n<p>若您在开放时间内到访，${LOGO}建议您按暂停键，进入博物馆欣赏展览。</p>\n<p>您可在认为合适的时候继续您的探险。只需按下相应按钮，继续<i>寻找宝藏</i>。</p>`,
  "5": `<p>请按地图指示绕行该纪念建筑。</p>\n<p>从其正面穿越道路，即可到达地图上标注为<mark>2</mark>号的<strong>Puente de Serranos</strong>。</p>`,
  "5-B": "<p>您此次探险的下一个目标在地图上对应编号<mark>2</mark>。</p>",
  "6": "<p>在您的地图上对应编号<mark>3</mark>。</p>",
  "6-B": "<p>在您的地图上对应编号<mark>3</mark>。</p>",
  "6-C": `<p>离开广场时，请走左侧的街道，沿其走到尽头。在那里，您将再次遇到本次探险中已认识的一处纪念建筑。</p>\n<p><strong>Palacio de la Generalitat</strong>，对应地图编号<mark>3</mark>。</p>`,
  "7": "<p>在您的地图上对应编号<mark>4</mark>。</p>",
  "7-B": "<p>在您的地图上分别对应编号<mark>4</mark>和<mark>6</mark>。</p>",
  "7-C": "<p>以地图上标注为<mark>4</mark>号的<strong>Puente del Real</strong>为参考，继续前行至下一座桥，即地图上对应编号<mark>5</mark>的<strong>Puente de la Exposición</strong>。请按暂停键，前往指示地点，到达建议地点后请再次按继续键。谢谢。</p>",
  "8": "<p>在您的地图上对应编号<mark>5</mark>。</p>",
  "8-B": "<p>在您的地图上对应编号<mark>5</mark>。</p>",
  "8-C": `<p>抬头仰望，可欣赏<strong>Catedral de Valencia</strong>的北立面。</p>\n<p>在您的地图上对应编号<mark>5</mark>。</p>`,
  "9": `<p>${LOGO}建议您按暂停键，按自己的节奏游览此区域。</p>`,
  "9-B": `<p>${LOGO}建议您按暂停键，按自己的节奏游览此区域。</p>`,
  "10": "<p>在您的地图上对应编号<mark>6</mark>。</p>",
  "10-B": "<p>在您的地图上对应编号<mark>6</mark>。</p>",
  "10-C": "<p>此次探险中您的下一个景点在地图上对应编号<mark>6</mark>。</p>",
  "11": "<p>请前往7号点，沿自行车道骑行至桥的中央。</p>",
  "11-B": "<p>在您的地图上对应编号<mark>7</mark>。</p>",
  "11-C": "<p>现在您离得更近了，可以解答下一个挑战题。</p>",
  "11-D": "<p>在您的地图上标注为编号<mark>7</mark>。</p>",
  "11-E": `<p>请展开地图，仔细观察您的路线。</p>\n<p>在本次探险中，${LOGO}建议您过眼前这座桥，然后寻找通向瓦伦西亚著名的<strong>Jardín del Turia</strong>的入口。</p>\n<p>在您的地图上对应编号<mark>7</mark>。</p>\n<p>该入口位于桥的对面偏左方向，沿古河道围墙走几步即到。</p>\n<p>下去之后，请沿地图路线前行，您的下一个目标对应编号<mark>9</mark>。</p>`,
  "12": "<p>在您的地图上对应编号<mark>8</mark>。</p>",
  "12-B": "<p>在您的地图上对应编号<mark>8</mark>。</p>",
  "12-C": "<p>您现在在<strong>Plaza del Tossal</strong>吗？是的？太好了！在您的地图上对应编号<mark>8</mark>。</p>",
  "12-D": `<p>以地图上标注为<mark>8</mark>号的<strong>Puente del Real</strong>为参考，继续前行至下一座桥，对应地图编号<mark>9</mark>，即<strong>Puente de la Exposición</strong>。</p>\n<p>请按暂停键，前往指示地点，到达建议地点后请再次按继续键，谢谢。</p>`,
  "13": "<p>在您的地图上对应编号<mark>9</mark>。</p>",
  "13-B": "<p>您已到达地图<mark>9</mark>号指示地点了吗？太好了！</p>",
  "13-C": "<p>在您的地图上对应编号<mark>9</mark>。</p>",
  "14": "<p>请前往地图<mark>10</mark>号地点。</p>",
  "14-B": "<p>在您的地图上对应编号<mark>10</mark>。</p>",
  "14-C": "<p>在您的地图上对应编号<mark>10</mark>。</p>",
};

const merged = { ...existing, ...batch };

const lines = esKeys
  .filter(k => merged[k] !== undefined)
  .map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';

writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
