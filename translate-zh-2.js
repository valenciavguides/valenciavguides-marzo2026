import { readFileSync, writeFileSync } from 'fs';

const ES_FILE = 'js/parrafos-textos/parrafos-texto-espanol.json';
const TARGET_FILE = 'js/parrafos-textos/parrafos-texto-chino-simplificado.json';
const LOGO = "<img src='imagenes/imagenes-aplicación/logo_alargado_3.png' alt='València be Guides' style='height:1.4em;vertical-align:baseline;position:relative;bottom:-0.2em;'>";

const rawEs = readFileSync(ES_FILE, 'utf8');
const esKeys = [...rawEs.matchAll(/^  "([^"]+)":/mg)].map(m => m[1]);

let existing = {};
try { existing = JSON.parse(readFileSync(TARGET_FILE, 'utf8')); } catch (e) { /* archivo nuevo */ }

const batch = {
  "15": "<p>在您的地图上对应编号<mark>11</mark>。</p>",
  "15-B": `<p>离开这片不规则街道后，请将注意力转向右手边。此次寻宝探险的下一个目标是著名的<strong>Plaza de la Virgen</strong>。</p>\n<p>在您的地图上对应编号<mark>11</mark>。</p>`,
  "15-C": `<p>以市政厅为正面，走上左侧路径，按地图指引走到大道尽头，然后向左并入。</p>\n<p>大道另一侧矗立着<strong>Estación del Norte</strong>，这是一座1917年落成的现代主义风格宏伟建筑，在您的地图上对应编号<mark>11</mark>。</p>\n<p>请按暂停键，前往指示地点，到达建议地点后请再次按继续键。</p>`,
  "15-D": "<p>在您的地图上对应编号<mark>11</mark>。</p>",
  "16": "<p>从地图第11号点可窥见瓦伦西亚最具标志性的景点之一。</p>",
  "17": `<p>地图编号<mark>12</mark>至<mark>19</mark>为构成<strong>Ciudad de las Artes y de las Ciencias</strong>的各纪念建筑，编号<mark>13</mark>和<mark>15</mark>对应该区域的两座桥梁。</p>`,
  "17-B": `<p>地图编号<mark>18</mark>至<mark>25</mark>为构成<strong>Ciudad de las Artes y de las Ciencias</strong>的各纪念建筑，编号<mark>19</mark>和<mark>21</mark>对应该区域的两座桥梁。</p>`,
  "18": "<p>在您的地图上分别对应编号<mark>15</mark>和<mark>18</mark>。</p>",
  "18-B": "<p>在您的地图上分别对应编号<mark>21</mark>和<mark>24</mark>。</p>",
  "19": "<p>在您的地图上对应编号<mark>12</mark>。</p>",
  "20": "<p>在您的地图上对应编号<mark>12</mark>。</p>",
  "20-B": `<p>请前往12号点，沿自行车道骑行至桥的中央。</p>\n<p>请记住到达桥顶时按暂停键；继续走到桥长的中点，然后再次按继续键。</p>`,
  "20-C": `<p>铁路车站正后方矗立着<strong>Plaza de Toros</strong>，在您的地图上对应编号<mark>12</mark>。</p>`,
  "21": "<p>在您的地图上对应编号<mark>14</mark>。</p>",
  "21-B": `<p>步道尽头，右手边出现一处建筑瑰宝，在您的地图上对应编号<mark>14</mark>。</p>\n<p>请按暂停键，前往或查看指示地点，到达建议地点后请再次按继续键。</p>`,
  "21-C": `<p>以大教堂巴洛克正门为背，面前是一片广场，可由此继续寻宝探险。</p>\n<p>请按地图路线穿越广场。</p>\n<p>穿越广场后，右手边出现您的下一个目标。右侧可见一座秀美的巴洛克塔楼。</p>\n<p>在您的地图上对应编号<mark>14</mark>。您能看到它吗？</p>`,
  "21-D": `<p>以大教堂巴洛克正门为背，面前是一片广场，可由此继续寻宝探险。</p>\n<p>请按地图路线穿越广场。</p>\n<p>穿越广场后，右手边出现您的下一个目标。右侧可见一座秀美的巴洛克塔楼。</p>\n<p>在您的地图上对应编号<mark>10</mark>。您能看到它吗？</p>\n<p>请不要暂停本语音导览，径直前往指示地点，谢谢。</p>`,
  "22": "<p>在您的地图上对应编号<mark>15</mark>。</p>",
  "22-B": "<p>在您的地图上对应编号<mark>15</mark>。</p>",
  "22-C": `<p>请将注意力集中在<strong>Bioparc</strong>建筑群，地图编号<mark>15</mark>。</p>`,
  "22-D": `<p>按地图指示，走到街道尽头向左转。我们著名的<strong>Mercado Central</strong>就在您的右侧，地图编号<mark>15</mark>。</p>\n<p>请按暂停键，前往指示地点，到达建议地点后请再次按继续键。</p>`,
  "22-E": "<p>请前往地图<mark>15</mark>号点。</p>",
  "23": `<p>若在开放时间内到访，${LOGO}建议您按暂停键，按自己的节奏参观此纪念建筑。</p>\n<p>请记住不必着急，当您感到时机合适时，只需按继续键，继续您的瓦伦西亚<i>寻宝</i>探险。</p>`,
  "23-B": `<p><strong>Palacio del Marqués de Dos Aguas</strong>在您的地图上对应编号<mark>16</mark>。</p>`,
  "23-C": "<p>在您的地图上对应编号<mark>16</mark>。</p>",
  "23-D": "<p>在您的地图上对应编号<mark>16</mark>。</p>",
  "24": `<p>若在开放时间内到访，${LOGO}建议您按暂停键，按自己的节奏参观此纪念建筑。</p>`,
  "24-B": `<p>请随时使用暂停键，准备好后继续解答我们的挑战，边游览城市边探索。</p>\n<p>按地图指示，您的探险将沿原城墙遗址向左继续，具体是前往瓦伦西亚的一处城门，在您的地图上对应编号<mark>17</mark>。</p>`,
  "24-C": `<p>以<strong>Lonja</strong>在左、<strong>Mercado Central</strong>在背，按地图指示前往本次探险的下一个景点，编号<mark>17</mark>。</p>\n<p>请按暂停键，前往指示地点，到达建议地点后请再次按继续键。</p>`,
  "24-D": "<p>在您的地图上对应编号<mark>17</mark>。</p>",
  "24-E": `<p>面对<strong>Iglesia de Santa Catalina</strong>的盲拱立面，这座神庙的第三处纪念入口建于1785年，就在转角处。这也是您此次探险的下一个方向。</p>\n<p>请务必注意！地图指示您绕行此纪念建筑，然后走上右侧第一条街道。</p>\n<p>这条短而窄的街道尽头，一楼高度处便是您的下一个景点。</p>\n<p>在您的地图上对应编号<mark>17</mark>。</p>\n<p>请按暂停键，查看指示地点，到达建议地点后请按继续键。</p>`,
  "24-F": "<p>在您的地图上对应编号<mark>17</mark>。</p>",
  "25": `<p>沿古河道行约50米，便是烟火表演的发射广场。</p>\n<p>若您曾在节庆期间来访，会发现瓦伦西亚人十分热爱烟火。</p>`,
  "26": `<p>若在开放时间内到访，${LOGO}建议您按暂停键，按自己的节奏参观这处历史建筑群。</p>\n<p>您可在认为合适的时候继续您的探险。</p>`,
  "26-B": `<p>若在开放时间内到访，${LOGO}建议您按暂停键，按自己的节奏参观这处历史建筑群。</p>\n<p>您可在认为合适的时候继续您的探险。</p>`,
  "27": "<p>在您的地图上对应编号<mark>18</mark>。</p>",
  "27-B": "<p>在您的地图上对应编号<mark>18</mark>。</p>",
  "27-C": "<p>您的探险将继续前往地图编号<mark>18</mark>的建筑。</p>",
  "27-D": `<p>按地图指示，您的探险将沿城墙遗址继续。</p>\n<p>前方不远处有3个连续景点等待您。</p>\n<p>在您的地图上依次对应编号<mark>18</mark>、<mark>19</mark>和<mark>20</mark>。</p>\n<p>请按暂停键，前往指示地点，到达建议地点后请再次按继续键。</p>`,
  "28": "<p>在您的地图上对应编号<mark>19</mark>。</p>",
  "28-B": "<p>在您的地图上对应编号<mark>19</mark>。</p>",
  "29": `<p>若在开放时间内到访，${LOGO}建议您按暂停键，按自己的节奏参观这处历史建筑群。</p>\n<p>您可在认为合适的时候继续您的探险。</p>`,
  "30": "<p>决定继续<i>寻找宝藏</i>后，请沿旧河道左侧前往地图<mark>6</mark>号点。</p>",
  "30-B": "<p>决定继续<i>寻找宝藏</i>后，请沿旧河道左侧前往地图<mark>11</mark>号点。</p>",
  "31": "<p>在您的地图上对应编号<mark>20</mark>。</p>",
  "32": "<p>在您的地图上对应编号<mark>21</mark>。</p>",
  "32-B": "<p>在您的地图上对应编号<mark>21</mark>。</p>",
  "32-C": `<p>请按宝藏地图前行，途中右手边出现城市首座公共饮用水喷泉。</p>\n<p>昵称<strong>Fuente del Negrito</strong>，在您的地图上对应编号<mark>21</mark>。这是本次探险的最后几站之一。</p>\n<p>请按暂停键，前往指示地点，到达建议地点后请再次按继续键。</p>`,
  "33": "<p>在您的地图上对应编号<mark>22</mark>。</p>",
  "33-B": `<p>请走到街道尽头，<strong>Calle Caballeros</strong>在地图上对应编号<mark>22</mark>。</p>\n<p>到达后向右转，可看到标志性的<strong>Palau de la Generalitat</strong>，在地图上对应编号<mark>23</mark>。</p>\n<p>请按暂停键，前往指示地点，到达建议地点后请再次按继续键。</p>`,
  "33-C": "<p>在您的地图上分别对应编号<mark>22</mark>和<mark>24</mark>。</p>",
  "34": "<p>在您的地图上对应编号<mark>23</mark>。</p>",
  "34-B": "<p>在您的地图上对应编号<mark>23</mark>。</p>",
  "35": "<p>在您的地图上对应编号<mark>24</mark>。</p>",
  "35-B": "<p>请走上通往这处景观台的楼梯或坡道，在您的地图上对应编号<mark>24</mark>。</p>",
  "36": "<p>在您的地图上标注为编号<mark>25</mark>。</p>",
  "37": "<p>在您的地图上对应编号<mark>26</mark>。</p>",
  "38": "<p>您已到达地图<mark>27</mark>号指示地点了吗？太好了！</p>",
  "39": `<p>在您的地图上对应编号<mark>27</mark>。</p>\n<p>请按暂停键，走近<strong>Palacio de Justicia</strong>，从整体欣赏其全貌。</p>`,
};

const merged = { ...existing, ...batch };

const lines = esKeys
  .filter(k => merged[k] !== undefined)
  .map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(merged[k])}`);
const json = '{\n' + lines.join(',\n') + '\n}';

writeFileSync(TARGET_FILE, json, 'utf8');
console.log('Total entradas:', lines.length);
